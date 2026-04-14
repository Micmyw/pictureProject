import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TaskType =
  | "image_generation"
  | "background_removal"
  | "background_replacement";

export type RecentTask = {
  created_at: string;
  id: string;
  status: string;
  task_type: TaskType;
};

export function buildCreditChargeAmount(amount: number) {
  return Math.abs(amount) * -1;
}

export async function createTaskRecord(input: {
  userId: string;
  taskType: TaskType;
  providerKey: string;
  payload: Record<string, unknown>;
  creditsToCharge: number;
  promptId?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", input.userId)
    .single();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("ai_tasks")
    .insert({
      workspace_id: userRow.workspace_id,
      created_by: input.userId,
      prompt_id: input.promptId ?? null,
      task_type: input.taskType,
      provider_key: input.providerKey,
      input: input.payload,
      credits_to_charge: input.creditsToCharge
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listRecentTasksForUser(userId: string, limit = 10) {
  const supabase = await createSupabaseServerClient();
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("ai_tasks")
    .select("id, task_type, status, created_at")
    .eq("workspace_id", userRow.workspace_id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as RecentTask[];
}

export async function chargeCreditsForTask(input: {
  workspaceId: string;
  userId: string;
  taskId: string;
  amount: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("credits_ledger").insert({
    workspace_id: input.workspaceId,
    user_id: input.userId,
    task_id: input.taskId,
    entry_kind: "charge",
    amount: buildCreditChargeAmount(input.amount),
    note: "Successful AI task"
  });

  if (error) {
    throw error;
  }
}

import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreditLedgerEntry = {
  amount: number;
  created_at: string;
  entry_kind: string;
  id: string;
  note: string | null;
};

export type CreditSummary = {
  balance: number;
  monthlyCredits: number;
  planName: string;
  recentEntries: CreditLedgerEntry[];
  totalGranted: number;
  totalUsed: number;
  workspaceName: string;
};

export function summarizeLedgerAmounts(amounts: number[]) {
  const totalGranted = amounts
    .filter((value) => value > 0)
    .reduce((sum, value) => sum + value, 0);
  const totalUsed = Math.abs(
    amounts.filter((value) => value < 0).reduce((sum, value) => sum + value, 0)
  );
  const balance = amounts.reduce((sum, value) => sum + value, 0);

  return { totalGranted, totalUsed, balance };
}

export async function getCreditBalanceForUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase.rpc("current_credit_balance", {
    target_workspace_id: userRow.workspace_id
  });

  if (error) {
    throw error;
  }

  return data ?? 0;
}

export async function getCreditSummaryForUser(
  userId: string
): Promise<CreditSummary> {
  const supabase = await createSupabaseServerClient();
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("name, plan_id")
    .eq("id", userRow.workspace_id)
    .single();

  if (workspaceError) {
    throw workspaceError;
  }

  const [{ data: plan, error: planError }, { data: ledgerRows, error: ledgerError }] =
    await Promise.all([
      supabase
        .from("plans")
        .select("name, monthly_credits")
        .eq("id", workspace.plan_id)
        .single(),
      supabase
        .from("credits_ledger")
        .select("id, entry_kind, amount, note, created_at")
        .eq("workspace_id", userRow.workspace_id)
        .order("created_at", { ascending: false })
        .limit(8)
    ]);

  if (planError) {
    throw planError;
  }

  if (ledgerError) {
    throw ledgerError;
  }

  const recentEntries = (ledgerRows ?? []) as CreditLedgerEntry[];
  const summary = summarizeLedgerAmounts(
    recentEntries.map((entry) => entry.amount)
  );

  return {
    ...summary,
    workspaceName: workspace.name,
    planName: plan.name,
    monthlyCredits: plan.monthly_credits,
    recentEntries
  };
}

export async function assertUserCanRunTask(
  userId: string,
  creditsRequired: number
) {
  const balance = await getCreditBalanceForUser(userId);

  if (balance < creditsRequired) {
    throw new Error("Insufficient credits");
  }
}

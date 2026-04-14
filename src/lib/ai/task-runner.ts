import "server-only";

import { getProvider } from "@/lib/ai/provider-registry";
import type {
  BackgroundRemovalInput,
  ImageGenerationInput,
  ProviderResult
} from "@/lib/ai/types";
import { chargeCreditsForTask, type TaskType } from "@/lib/tasks/task-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StoredTask = {
  created_by: string;
  credits_to_charge: number;
  id: string;
  input: unknown;
  provider_key: string;
  task_type: TaskType;
  workspace_id: string;
};

function getFailureMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown AI task failure";
}

async function runProviderTask(task: StoredTask): Promise<ProviderResult> {
  const provider = getProvider(task.provider_key);

  if (task.task_type === "image_generation") {
    const result = await provider.runImageGeneration?.(
      task.input as ImageGenerationInput
    );

    if (!result) {
      throw new Error("Provider did not return a generation result");
    }

    return result;
  }

  const result = await provider.runBackgroundRemoval?.(
    task.input as BackgroundRemovalInput
  );

  if (!result) {
    throw new Error("Provider did not return a background-removal result");
  }

  return result;
}

export async function runTaskById(taskId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: task, error } = await supabase
    .from("ai_tasks")
    .select(
      "id, workspace_id, created_by, task_type, provider_key, input, credits_to_charge"
    )
    .eq("id", taskId)
    .single();

  if (error) {
    throw error;
  }

  await supabase
    .from("ai_tasks")
    .update({
      status: "processing",
      updated_at: new Date().toISOString()
    })
    .eq("id", taskId);

  try {
    const result = await runProviderTask(task as StoredTask);

    await chargeCreditsForTask({
      workspaceId: task.workspace_id,
      userId: task.created_by,
      taskId,
      amount: task.credits_to_charge
    });

    await supabase
      .from("ai_tasks")
      .update({
        status: "succeeded",
        output: result,
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    return result;
  } catch (error) {
    await supabase
      .from("ai_tasks")
      .update({
        status: "failed",
        failure_message: getFailureMessage(error),
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    throw error;
  }
}

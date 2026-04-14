import { inngest } from "@/inngest/client";
import { runTaskById } from "@/lib/ai/task-runner";

export const runAiTask = inngest.createFunction(
  { id: "run-ai-task" },
  { event: "ai/task.queued" },
  async ({ event }) => {
    await runTaskById(event.data.taskId);
    return { ok: true };
  }
);

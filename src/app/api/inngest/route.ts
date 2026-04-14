import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { runAiTask } from "@/inngest/functions/run-ai-task";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runAiTask]
});

import { NextResponse } from "next/server";
import { z } from "zod";
import { chooseProviderForTaskType } from "@/app/api/tasks/provider-key";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { assertUserCanRunTask } from "@/lib/credits/credits-service";
import { createTaskRecord } from "@/lib/tasks/task-service";

const createTaskSchema = z.object({
  taskType: z.enum(["image_generation", "background_removal"]),
  payload: z.record(z.string(), z.unknown())
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = createTaskSchema.parse(await request.json());

    await assertUserCanRunTask(user.id, 1);

    const task = await createTaskRecord({
      userId: user.id,
      taskType: body.taskType,
      providerKey: chooseProviderForTaskType(body.taskType),
      payload: body.payload,
      creditsToCharge: 1
    });

    await inngest.send({
      name: "ai/task.queued",
      data: {
        taskId: task.id
      }
    });

    return NextResponse.json({ taskId: task.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid task payload", issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to create task"
      },
      { status: 500 }
    );
  }
}

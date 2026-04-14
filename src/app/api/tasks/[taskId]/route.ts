import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const user = await getCurrentUser();
  const { taskId } = await context.params;
  const supabase = await createSupabaseServerClient();

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (userError) {
    return NextResponse.json({ message: userError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("ai_tasks")
    .select("id, task_type, status, output, failure_message, created_at")
    .eq("workspace_id", userRow.workspace_id)
    .eq("id", taskId)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

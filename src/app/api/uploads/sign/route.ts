import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (userError) {
    return NextResponse.json({ message: userError.message }, { status: 404 });
  }

  const path = `${userRow.workspace_id}/${crypto.randomUUID()}.png`;

  const { data, error } = await supabase.storage
    .from("assets")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, path });
}

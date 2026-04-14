import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: me, error: meError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (meError) {
    return NextResponse.json({ message: meError.message }, { status: 404 });
  }

  if (me?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, workspace_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

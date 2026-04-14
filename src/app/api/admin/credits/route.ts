import { NextResponse } from "next/server";
import { z } from "zod";
import { buildCreditEntry } from "@/app/api/admin/credits/payload";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  workspaceId: z.string().min(1),
  amount: z.number().int().positive(),
  note: z.string().min(3)
});

export async function POST(request: Request) {
  try {
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

    const body = bodySchema.parse(await request.json());

    const { error } = await supabase.from("credits_ledger").insert({
      ...buildCreditEntry(body.workspaceId, body.amount),
      user_id: user.id,
      note: body.note
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid credit payload", issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to grant credits"
      },
      { status: 500 }
    );
  }
}

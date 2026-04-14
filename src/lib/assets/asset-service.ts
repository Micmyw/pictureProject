import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createAssetRecord(input: {
  workspaceId: string;
  taskId?: string;
  uploadedBy: string;
  kind: "upload" | "generated" | "processed";
  storageBucket: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assets")
    .insert({
      workspace_id: input.workspaceId,
      task_id: input.taskId ?? null,
      uploaded_by: input.uploadedBy,
      kind: input.kind,
      storage_bucket: input.storageBucket,
      storage_path: input.storagePath,
      public_url: input.publicUrl,
      mime_type: input.mimeType
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

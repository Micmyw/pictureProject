import { AssetGrid } from "@/components/library/asset-grid";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (userError) {
    throw userError;
  }

  const { data: assets, error: assetError } = await supabase
    .from("assets")
    .select("id, public_url, kind, created_at")
    .eq("workspace_id", userRow.workspace_id)
    .order("created_at", { ascending: false });

  if (assetError) {
    throw assetError;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Library</h1>
        <p className="text-neutral-600">
          Browse generated and processed images from this workspace in one place.
        </p>
      </div>

      {assets?.length ? (
        <AssetGrid assets={assets} />
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--panel)] px-6 py-12 text-center text-neutral-600">
          Your image library is empty for now. Run generation or background
          cleanup to start building it.
        </div>
      )}
    </div>
  );
}

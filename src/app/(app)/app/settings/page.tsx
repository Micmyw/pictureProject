import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, role, workspace_id")
    .eq("id", user.id)
    .maybeSingle();
  const { data: workspace } = profile?.workspace_id
    ? await supabase
        .from("workspaces")
        .select("name, slug")
        .eq("id", profile.workspace_id)
        .maybeSingle()
    : { data: null };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-neutral-600">
          Keep your workspace identity and operator details in one place while
          the generation preferences area is still being built.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-xl font-semibold">Account</h2>
          <dl className="mt-5 grid gap-4">
            <div>
              <dt className="text-sm text-neutral-500">Email</dt>
              <dd className="mt-1 font-medium text-[#2b2119]">
                {user.email ?? "Unknown user"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Full name</dt>
              <dd className="mt-1 font-medium text-[#2b2119]">
                {profile?.full_name || "Not set yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Role</dt>
              <dd className="mt-1 font-medium capitalize text-[#2b2119]">
                {profile?.role ?? "user"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-xl font-semibold">Workspace</h2>
          <dl className="mt-5 grid gap-4">
            <div>
              <dt className="text-sm text-neutral-500">Name</dt>
              <dd className="mt-1 font-medium text-[#2b2119]">
                {workspace?.name ?? "Workspace pending"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Slug</dt>
              <dd className="mt-1 font-medium text-[#2b2119]">
                {workspace?.slug ?? "Unavailable"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Next settings drop</dt>
              <dd className="mt-1 text-neutral-700">
                Default prompt style, export presets, and brand-safe background
                templates.
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreditEntry = {
  amount: number;
  created_at: string;
  entry_kind: string;
  id: string;
  note: string | null;
};

function formatEntryKind(value: string) {
  return value
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CreditsPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: userRow } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!userRow?.workspace_id) {
    return (
      <div className="max-w-3xl rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <h1 className="text-3xl font-semibold">Credits</h1>
        <p className="mt-4 text-neutral-600">
          We could not load your workspace credits yet.
        </p>
      </div>
    );
  }

  const [{ data: balance }, { data: workspace }, { data: ledger }] =
    await Promise.all([
      supabase.rpc("current_credit_balance", {
        target_workspace_id: userRow.workspace_id
      }),
      supabase
        .from("workspaces")
        .select("name, plans(name, monthly_credits)")
        .eq("id", userRow.workspace_id)
        .maybeSingle(),
      supabase
        .from("credits_ledger")
        .select("id, entry_kind, amount, note, created_at")
        .eq("workspace_id", userRow.workspace_id)
        .order("created_at", { ascending: false })
        .limit(8)
    ]);

  const entries = (ledger ?? []) as CreditEntry[];
  const totalGranted = entries
    .filter((entry) => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalUsed = Math.abs(
    entries
      .filter((entry) => entry.amount < 0)
      .reduce((sum, entry) => sum + entry.amount, 0)
  );
  const workspacePlan =
    workspace && "plans" in workspace && workspace.plans
      ? Array.isArray(workspace.plans)
        ? workspace.plans[0]
        : workspace.plans
      : null;

  return (
    <div className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold">Credits</h1>
        <p className="text-neutral-600">
          Track your remaining balance and recent credit activity for this
          workspace.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Current balance</p>
          <p className="mt-2 text-3xl font-semibold">{balance ?? 0}</p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Plan</p>
          <p className="mt-2 text-2xl font-semibold">
            {workspacePlan?.name ?? "Free"}
          </p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Credits added</p>
          <p className="mt-2 text-2xl font-semibold">{totalGranted}</p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Credits used</p>
          <p className="mt-2 text-2xl font-semibold">{totalUsed}</p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent credit activity</h2>
            <p className="text-sm text-neutral-600">
              Workspace: {workspace?.name ?? "Unnamed workspace"}
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            Monthly plan allotment: {workspacePlan?.monthly_credits ?? 40}
          </p>
        </div>

        {entries.length ? (
          <ul className="mt-5 space-y-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[#2b2119]">
                    {formatEntryKind(entry.entry_kind)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {entry.note ?? "No note provided"}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      entry.amount >= 0
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-[#2b2119]"
                    }
                  >
                    {entry.amount >= 0 ? "+" : ""}
                    {entry.amount}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {new Date(entry.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-2xl border border-dashed border-[var(--border)] px-4 py-6 text-neutral-600">
            Credit activity will appear here after your first grant or AI task.
          </p>
        )}
      </section>
    </div>
  );
}

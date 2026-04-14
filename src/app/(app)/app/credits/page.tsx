import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCreditSummaryForUser } from "@/lib/credits/credits-service";

function formatEntryKind(value: string) {
  return value
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CreditsPage() {
  const user = await getCurrentUser();
  const summary = await getCreditSummaryForUser(user.id);

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
          <p className="mt-2 text-3xl font-semibold">{summary.balance}</p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Plan</p>
          <p className="mt-2 text-2xl font-semibold">{summary.planName}</p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Credits added</p>
          <p className="mt-2 text-2xl font-semibold">{summary.totalGranted}</p>
        </article>
        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-sm text-neutral-500">Credits used</p>
          <p className="mt-2 text-2xl font-semibold">{summary.totalUsed}</p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent credit activity</h2>
            <p className="text-sm text-neutral-600">
              Workspace: {summary.workspaceName}
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            Monthly plan allotment: {summary.monthlyCredits}
          </p>
        </div>

        {summary.recentEntries.length ? (
          <ul className="mt-5 space-y-3">
            {summary.recentEntries.map((entry) => (
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

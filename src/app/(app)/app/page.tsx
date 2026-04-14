import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { listRecentTasksForUser } from "@/lib/tasks/task-service";

function formatTaskLabel(value: string) {
  return value
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const recentTasks = await listRecentTasksForUser(user.id, 6);

  const firstName =
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.split(" ")[0]) ||
    user.email?.split("@")[0] ||
    "there";

  return (
    <div className="space-y-8">
      <section className="rounded-[2.25rem] bg-[#2b2119] px-6 py-8 text-white shadow-[0_24px_70px_rgba(43,33,25,0.2)] lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-white/65">
              Commerce workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-3 text-base text-white/75">
              Your image generation studio is taking shape. Credits and
              workspace settings are live now, and the first creative tools are
              next in the flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/credits"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#2b2119]"
            >
              Review credits
            </Link>
            <Link
              href="/app/settings"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Open settings
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/app/generate"
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 transition hover:-translate-y-0.5 hover:bg-white"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Generate product visuals</h2>
              <span className="rounded-full bg-[#efe3d0] px-3 py-1 text-xs font-medium text-[#7b5d42]">
                Live now
              </span>
            </div>
            <p className="mt-4 text-neutral-700">
              Prompt lifestyle scenes, clean studio shots, and listing-ready
              hero images from one workflow.
            </p>
          </Link>

          <Link
            href="/app/background"
            className="rounded-[2rem] border border-[var(--border)] bg-[#efe3d0] p-6 transition hover:-translate-y-0.5 hover:bg-[#f4ead8]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[#2b2119]">
                Remove backgrounds
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#7b5d42]">
                Live now
              </span>
            </div>
            <p className="mt-4 text-neutral-700">
              Clean up supplier photography fast, then ship transparent cutouts
              and marketplace-safe exports.
            </p>
          </Link>
        </div>

        <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-xl font-semibold">Workspace checklist</h2>
          <ul className="mt-5 space-y-3 text-sm text-neutral-700">
            <li className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3">
              Review your remaining credits before the first creative run.
            </li>
            <li className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3">
              Confirm your seller identity and workspace details in settings.
            </li>
            <li className="rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3">
              Generation and background cleanup are live now, with library and
              exports next.
            </li>
          </ul>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Recent tasks</h2>
            <p className="text-sm text-neutral-600">
              Jobs will appear here once generation and background cleanup go
              live.
            </p>
          </div>
        </div>

        {recentTasks.length ? (
          <ul className="mt-5 space-y-3">
            {recentTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[#2b2119]">
                    {formatTaskLabel(task.task_type)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {new Date(task.created_at).toLocaleString("en-US")}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-neutral-600">
                  {formatTaskLabel(task.status)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-neutral-600">
            No tasks yet. This workspace is ready for credits and settings while
            the first image tools land next.
          </div>
        )}
      </section>
    </div>
  );
}


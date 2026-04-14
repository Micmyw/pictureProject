import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: me, error: meError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (meError) {
    throw meError;
  }

  if (me?.role !== "admin") {
    return <div className="p-8">Forbidden</div>;
  }

  const [{ data: users, error: usersError }, { data: tasks, error: tasksError }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id, email, role, workspace_id, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("ai_tasks")
        .select("id, task_type, status, provider_key, created_at")
        .order("created_at", { ascending: false })
        .limit(20)
    ]);

  if (usersError) {
    throw usersError;
  }

  if (tasksError) {
    throw tasksError;
  }

  return (
    <main className="space-y-8 p-8">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <h1 className="text-3xl font-semibold">Admin console</h1>
        <p className="mt-3 text-neutral-600">
          Review workspace users and the latest AI task activity.
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-medium">Users</h2>
        <ul className="mt-4 space-y-3">
          {(users ?? []).map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{item.email}</span>
              <span className="capitalize text-neutral-600">{item.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-medium">Recent tasks</h2>
        <ul className="mt-4 space-y-3">
          {(tasks ?? []).map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{item.task_type}</span>
              <span className="text-neutral-600">{item.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

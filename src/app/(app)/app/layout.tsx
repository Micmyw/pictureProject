import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getCreditBalanceForUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userRow } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", userId)
    .maybeSingle();

  if (!userRow?.workspace_id) {
    return 0;
  }

  const { data } = await supabase.rpc("current_credit_balance", {
    target_workspace_id: userRow.workspace_id
  });

  return data ?? 0;
}

export default async function AppLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const credits = await getCreditBalanceForUser(user.id);

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[18rem_1fr]">
      <AppSidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar email={user.email ?? "Unknown user"} credits={credits} />
        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

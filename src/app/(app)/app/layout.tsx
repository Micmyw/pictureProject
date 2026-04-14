import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCreditBalanceForUser } from "@/lib/credits/credits-service";

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

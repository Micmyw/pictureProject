import Link from "next/link";

export function Topbar({
  credits,
  email
}: {
  credits: number;
  email: string;
}) {
  return (
    <header className="border-b border-[var(--border)] bg-white/70 px-6 py-5 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Workspace</p>
          <p className="mt-1 text-lg font-semibold text-[#2b2119]">{email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[#2b2119]">
            {credits} credits remaining
          </div>
          <Link
            href="/app/settings"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-neutral-700 hover:bg-white"
          >
            Account settings
          </Link>
        </div>
      </div>
    </header>
  );
}

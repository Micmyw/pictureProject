"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href?: string;
  label: string;
  status?: "available" | "coming-soon";
};

const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", status: "available" },
  { href: "/app/generate", label: "Generate", status: "available" },
  { label: "Background", status: "coming-soon" },
  { label: "Library", status: "coming-soon" },
  { href: "/app/credits", label: "Credits", status: "available" },
  { href: "/app/settings", label: "Settings", status: "available" }
];

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/app") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[var(--border)] bg-[var(--panel)]/95 px-5 py-5 backdrop-blur lg:min-h-screen lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-4 lg:block">
        <div>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2b2119] text-sm text-white">
              PF
            </span>
            <span>PixelForge Commerce</span>
          </Link>
          <p className="mt-2 hidden text-sm text-neutral-600 lg:block">
            Image tools for fast-moving e-commerce sellers.
          </p>
        </div>
        <div className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium text-neutral-600 lg:hidden">
          Workspace
        </div>
      </div>

      <nav className="mt-6 grid gap-2 sm:grid-cols-2 lg:mt-8 lg:grid-cols-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const content = (
            <>
              <span>{item.label}</span>
              {item.status === "coming-soon" ? (
                <span className="rounded-full border border-[var(--border)] bg-white px-2 py-0.5 text-[11px] text-neutral-500">
                  Soon
                </span>
              ) : null}
            </>
          );

          const className = cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
            active
              ? "bg-[#2b2119] text-white shadow-[0_14px_30px_rgba(43,33,25,0.18)]"
              : "border border-transparent bg-white/60 text-neutral-700 hover:border-[var(--border)] hover:bg-white"
          );

          if (!item.href) {
            return (
              <div
                key={item.label}
                className={cn(className, "cursor-not-allowed opacity-75")}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

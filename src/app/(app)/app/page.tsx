import Link from "next/link";

export default function AppPlaceholderPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold">PixelForge Commerce</h1>
      <p className="mt-4 text-neutral-700">
        Your workspace is being set up. The full app experience will land in the
        next task.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)]"
          href="/"
        >
          Back to home
        </Link>
        <Link
          className="inline-flex rounded-full border border-[var(--border)] px-5 py-3"
          href="/pricing"
        >
          View pricing
        </Link>
      </div>
    </main>
  );
}


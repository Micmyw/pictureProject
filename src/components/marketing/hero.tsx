import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-8 px-6 py-20">
      <span className="w-fit rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-sm">
        AI visuals for modern commerce teams
      </span>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-balance">
          Generate product images and remove backgrounds without leaving one
          workspace.
        </h1>
        <p className="text-lg text-neutral-700">
          Built for e-commerce sellers who need white-background shots,
          scene-based visuals, and quick repeatable output.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)]"
          href="/sign-up"
        >
          Start free
        </Link>
        <Link
          className="rounded-full border border-[var(--border)] px-5 py-3"
          href="/pricing"
        >
          View pricing
        </Link>
      </div>
    </section>
  );
}


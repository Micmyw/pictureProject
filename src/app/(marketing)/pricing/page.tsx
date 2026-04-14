import Link from "next/link";

const plans = [
  {
    name: "Free",
    credits: "40 credits / month",
    note: "Best for trying text-to-image and background cleanup.",
    cta: "Start free",
    href: "/sign-up"
  },
  {
    name: "Pro",
    credits: "600 credits / month",
    note: "Pro credits are enabled manually for now. Create an account, then request activation from an admin.",
    cta: "Create account",
    href: "/sign-up"
  }
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-semibold">Pricing</h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        Start free, then move to Pro when you need higher volume and admin
        activation.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8"
          >
            <h2 className="text-2xl font-medium">{plan.name}</h2>
            <p className="mt-4 text-neutral-700">{plan.credits}</p>
            <p className="mt-3 text-sm text-neutral-700">{plan.note}</p>
            <Link
              className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)]"
              href={plan.href}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

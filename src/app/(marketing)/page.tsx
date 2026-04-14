import Link from "next/link";
import { Hero } from "@/components/marketing/hero";

const features = [
  {
    title: "Text-to-image",
    body: "Turn product ideas into polished commerce visuals."
  },
  {
    title: "Background cleanup",
    body: "Erase clutter and export listing-ready product shots."
  },
  {
    title: "Catalog consistency",
    body: "Create reusable product variations with consistent style across your listings."
  }
];

export default function MarketingHomePage() {
  return (
    <main>
      <Hero />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        {features.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="text-xl font-medium">{item.title}</h2>
            <p className="mt-3 text-sm text-neutral-700">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2rem] bg-[#20160f] p-10 text-white">
          <h2 className="text-3xl font-semibold">
            Ready to create faster product imagery?
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-300">
            Start with free credits, build a product library, and request a
            larger plan when your team needs it.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-[#20160f]"
            href="/sign-up"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}

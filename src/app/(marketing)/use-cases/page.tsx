const useCases = [
  "White-background marketplace images",
  "Lifestyle scene product visuals",
  "Seasonal promotions",
  "Social commerce assets"
];

export default function UseCasesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-semibold">Use cases</h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        PixelForge Commerce is built for repeatable, listing-ready workflows
        across the channels e-commerce teams use every day.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {useCases.map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8"
          >
            {item}
          </div>
        ))}
      </div>
    </main>
  );
}


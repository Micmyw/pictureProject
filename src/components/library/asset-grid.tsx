import Image from "next/image";

export function AssetGrid({
  assets
}: {
  assets: Array<{
    created_at: string;
    id: string;
    kind: string;
    public_url: string;
  }>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {assets.map((asset) => (
        <article
          key={asset.id}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-4"
        >
          <Image
            alt={asset.kind}
            className="aspect-square w-full rounded-[1.5rem] object-cover"
            src={asset.public_url}
            width={1024}
            height={1024}
            unoptimized={asset.public_url.startsWith("data:")}
          />
          <div className="mt-3 flex items-center justify-between gap-4 text-sm">
            <div>
              <p className="font-medium capitalize text-[#2b2119]">
                {asset.kind}
              </p>
              <p className="text-neutral-500">
                {new Date(asset.created_at).toLocaleDateString("en-US")}
              </p>
            </div>
            <a
              href={asset.public_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-neutral-700 hover:bg-white"
            >
              Download
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

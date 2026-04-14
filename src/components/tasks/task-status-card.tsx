"use client";

import Image from "next/image";

type TaskStatus = "idle" | "queued" | "processing" | "succeeded" | "failed";

const statusCopy: Record<
  TaskStatus,
  { label: string; tone: string; helper: string }
> = {
  idle: {
    label: "Waiting to start",
    tone: "text-neutral-600",
    helper: "Submit a prompt to create your first image task."
  },
  queued: {
    label: "Queued",
    tone: "text-amber-700",
    helper: "Your prompt is in line and will begin shortly."
  },
  processing: {
    label: "Generating",
    tone: "text-[#2b2119]",
    helper: "The provider is creating your image now."
  },
  succeeded: {
    label: "Completed",
    tone: "text-emerald-700",
    helper: "Your latest generated image is ready below."
  },
  failed: {
    label: "Failed",
    tone: "text-red-600",
    helper: "We hit a problem while creating the image."
  }
};

export function TaskStatusCard({
  status,
  imageUrl,
  message
}: {
  status: TaskStatus;
  imageUrl?: string;
  message?: string;
}) {
  const copy = statusCopy[status];

  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500">
        Task status
      </p>
      <p className={`mt-3 text-2xl font-semibold ${copy.tone}`}>{copy.label}</p>
      <p className="mt-2 text-sm text-neutral-600">{copy.helper}</p>
      {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
      {imageUrl ? (
        <Image
          alt="Generated result"
          className="mt-5 aspect-square w-full rounded-[1.5rem] border border-[var(--border)] object-cover"
          src={imageUrl}
          width={1024}
          height={1024}
          unoptimized={imageUrl.startsWith("data:")}
        />
      ) : (
        <div className="mt-5 flex aspect-square items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/70 text-sm text-neutral-500">
          Preview will appear here
        </div>
      )}
    </div>
  );
}

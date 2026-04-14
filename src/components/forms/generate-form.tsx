"use client";

import { useEffect, useState } from "react";
import { TaskStatusCard } from "@/components/tasks/task-status-card";

type TaskApiResponse = {
  failure_message?: string | null;
  message?: string;
  output?: {
    outputUrls?: string[];
  } | null;
  status?: "queued" | "processing" | "succeeded" | "failed";
  taskId?: string;
};

export function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("studio product photo");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "queued" | "processing" | "succeeded" | "failed"
  >("idle");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        const payload = (await response.json()) as TaskApiResponse;

        if (!response.ok) {
          setStatus("failed");
          setMessage(payload.message ?? "Unable to refresh task status.");
          window.clearInterval(timer);
          return;
        }

        if (!payload.status) {
          return;
        }

        setStatus(payload.status);

        if (payload.status === "succeeded") {
          setImageUrl(payload.output?.outputUrls?.[0]);
          setMessage(undefined);
          window.clearInterval(timer);
        }

        if (payload.status === "failed") {
          setMessage(payload.failure_message ?? "Task failed");
          window.clearInterval(timer);
        }
      } catch {
        setStatus("failed");
        setMessage("Unable to refresh task status.");
        window.clearInterval(timer);
      }
    }, 2000);

    return () => window.clearInterval(timer);
  }, [taskId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("queued");
    setMessage(undefined);
    setImageUrl(undefined);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "image_generation",
          payload: {
            prompt,
            style,
            aspectRatio: "1:1",
            outputCount: 1
          }
        })
      });

      const payload = (await response.json()) as TaskApiResponse;

      if (!response.ok || !payload.taskId) {
        setStatus("failed");
        setMessage(payload.message ?? "Unable to start generation.");
        return;
      }

      setTaskId(payload.taskId);
      setPrompt("");
    } catch {
      setStatus("failed");
      setMessage("Unable to start generation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Generate image</h1>
          <p className="text-neutral-600">
            Describe the hero shot you want for a product listing, ad, or
            storefront mockup.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Prompt</span>
          <textarea
            className="min-h-40 w-full rounded-[1.5rem] border border-[var(--border)] p-4"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the product image you want to create"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Style</span>
          <input
            className="w-full rounded-2xl border border-[var(--border)] p-3"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            placeholder="Style"
            required
          />
        </label>

        <button
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] disabled:opacity-60"
          disabled={isSubmitting || !prompt.trim()}
          type="submit"
        >
          {isSubmitting ? "Starting..." : "Run generation"}
        </button>
      </form>

      <TaskStatusCard status={status} imageUrl={imageUrl} message={message} />
    </div>
  );
}

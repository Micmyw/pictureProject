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

type UploadSignResponse = {
  message?: string;
  path?: string;
  signedUrl?: string;
  token?: string;
};

export function BackgroundForm() {
  const [file, setFile] = useState<File | null>(null);
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

    if (!file) {
      setStatus("failed");
      setMessage("Choose an image before removing the background.");
      return;
    }

    setIsSubmitting(true);
    setStatus("queued");
    setMessage(undefined);
    setImageUrl(undefined);

    try {
      const signResponse = await fetch("/api/uploads/sign", { method: "POST" });
      const signPayload = (await signResponse.json()) as UploadSignResponse;

      if (!signResponse.ok || !signPayload.signedUrl || !signPayload.path) {
        setStatus("failed");
        setMessage(signPayload.message ?? "Unable to sign upload.");
        return;
      }

      const uploadResponse = await fetch(signPayload.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/png" },
        body: file
      });

      if (!uploadResponse.ok) {
        setStatus("failed");
        setMessage("Image upload failed.");
        return;
      }

      const taskResponse = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "background_removal",
          payload: {
            storagePath: signPayload.path
          }
        })
      });

      const taskPayload = (await taskResponse.json()) as TaskApiResponse;

      if (!taskResponse.ok || !taskPayload.taskId) {
        setStatus("failed");
        setMessage(taskPayload.message ?? "Unable to start background removal.");
        return;
      }

      setTaskId(taskPayload.taskId);
    } catch {
      setStatus("failed");
      setMessage("Unable to start background removal.");
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
          <h1 className="text-3xl font-semibold">Background cleanup</h1>
          <p className="text-neutral-600">
            Upload a supplier or studio shot and turn it into a clean cutout for
            product listings.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Product image</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setMessage(undefined);
              setStatus("idle");
            }}
            required
          />
        </label>

        <button
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] disabled:opacity-60"
          disabled={isSubmitting || !file}
          type="submit"
        >
          {isSubmitting ? "Uploading..." : "Remove background"}
        </button>
      </form>

      <TaskStatusCard status={status} imageUrl={imageUrl} message={message} />
    </div>
  );
}

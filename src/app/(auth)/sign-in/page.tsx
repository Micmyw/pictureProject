"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSafeRedirectTo } from "@/lib/auth/redirect-to";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"), "/app");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push(redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form
        className="w-full space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="text-sm text-neutral-700">
            New here?{" "}
            <Link
              className="underline"
              href={
                redirectTo === "/app"
                  ? "/sign-up"
                  : `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
              }
            >
              Create an account
            </Link>
            .
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Email</span>
          <input
            className="w-full rounded-2xl border border-[var(--border)] p-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Password</span>
          <input
            className="w-full rounded-2xl border border-[var(--border)] p-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

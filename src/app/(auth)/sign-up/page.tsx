"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSafeRedirectTo } from "@/lib/auth/redirect-to";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"), "/app");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const confirmUrl = new URL("/sign-in", window.location.origin);
      if (redirectTo !== "/app") {
        confirmUrl.searchParams.set("redirectTo", redirectTo);
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmUrl.toString(),
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.session) {
        setPassword("");
        setSuccess(
          "Account created. Please check your email to confirm your address before signing in."
        );
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
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="text-sm text-neutral-700">
            Already have an account?{" "}
            <Link
              className="underline"
              href={
                redirectTo === "/app"
                  ? "/sign-in"
                  : `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
              }
            >
              Sign in
            </Link>
            .
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Full name</span>
          <input
            className="w-full rounded-2xl border border-[var(--border)] p-3"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
            autoComplete="name"
            disabled={Boolean(success)}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-700">Email</span>
          <input
            className="w-full rounded-2xl border border-[var(--border)] p-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            disabled={Boolean(success)}
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
            autoComplete="new-password"
            disabled={Boolean(success)}
            required
          />
        </label>

        {success ? (
          <p className="rounded-2xl border border-[var(--border)] bg-white/60 p-3 text-sm text-neutral-800">
            {success}{" "}
            <Link
              className="underline"
              href={
                redirectTo === "/app"
                  ? "/sign-in"
                  : `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
              }
            >
              Go to sign in
            </Link>
            .
          </p>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--accent-foreground)] disabled:opacity-60"
          disabled={isSubmitting || Boolean(success)}
          type="submit"
        >
          {isSubmitting ? "Creating..." : "Start free"}
        </button>
      </form>
    </main>
  );
}

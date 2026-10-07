
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bookmark, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
    },
  },
});

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created. Check your email to confirm your account.",
    );

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center border border-border bg-surface">
            <Bookmark size={16} />
          </div>

          <span className="font-semibold tracking-tight">
            TabVault
          </span>
        </div>

        <div className="border border-border bg-surface p-6 sm:p-8">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-wider text-subtle">
              Get started
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-muted">
              Start building your personal bookmark vault.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
  <label
    htmlFor="name"
    className="mb-2 block text-sm font-medium"
  >
    Name
  </label>

  <input
    id="name"
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Your name"
    className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
  />
</div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-hover"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-hover"
              />
            </div>

            {error && (
              <div className="border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            {message && (
              <div className="border border-success/30 bg-success/5 px-3 py-2.5 text-sm text-success">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}



"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bookmark, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
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
              Welcome back
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in
            </h1>

            <p className="mt-2 text-sm text-muted">
              Access your bookmark vault.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
              />
            </div>

            {error && (
              <div className="border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger">
                {error}
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


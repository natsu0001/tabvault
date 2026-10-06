
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="border border-border bg-surface p-8">
        <p className="mb-2 text-xs uppercase tracking-wider text-subtle">
          Authenticated
        </p>

        <h1 className="text-2xl font-semibold">
          Welcome to TabVault
        </h1>

        <p className="mt-2 text-sm text-muted">
          {user.email}
        </p>
      </div>
    </main>
  );
}


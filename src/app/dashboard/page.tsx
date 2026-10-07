
import { createClient } from "@/lib/supabase/server";
import AddBookmarkForm from "@/components/bookmarks/AddBookmarkForm";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-subtle">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Welcome to TabVault
          </h1>

          <p className="mt-2 text-sm text-muted">
            Signed in as {user?.email}
          </p>
        </div>

        <AddBookmarkForm />
      </div>
    </main>
  );
}


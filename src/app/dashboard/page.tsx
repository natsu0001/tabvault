
import { createClient } from "@/lib/supabase/server";
import AddBookmarkForm from "@/components/bookmarks/AddBookmarkForm";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import type { Bookmark } from "@/types/bookmark";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  const typedBookmarks = (bookmarks ?? []) as Bookmark[];

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
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

        <div className="mb-10">
          <AddBookmarkForm />
        </div>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-subtle">
                Library
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Your bookmarks
              </h2>
            </div>

            <span className="text-sm text-muted">
              {typedBookmarks.length}{" "}
              {typedBookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </span>
          </div>

          {error ? (
            <div className="border border-danger/30 bg-danger/5 p-5">
              <p className="text-sm text-danger">
                Failed to load bookmarks.
              </p>
            </div>
          ) : typedBookmarks.length === 0 ? (
            <div className="border border-border bg-surface p-10 text-center">
              <p className="text-sm text-muted">
                No bookmarks yet.
              </p>

              <p className="mt-1 text-xs text-subtle">
                Add your first bookmark above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {typedBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}


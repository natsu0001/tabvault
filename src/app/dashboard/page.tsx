
import { createClient } from "@/lib/supabase/server";
import AddBookmarkForm from "@/components/bookmarks/AddBookmarkForm";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import CategoryManager from "@/components/categories/CategoryManager";
import type { Bookmark } from "@/types/bookmark";

type Category = {
  id: string;
  name: string;
  color: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: bookmarks, error: bookmarksError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("categories")
      .select("id, name, color")
      .order("name"),
  ]);

  const typedBookmarks = (bookmarks ?? []) as Bookmark[];
  const typedCategories = (categories ?? []) as Category[];

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        {/* Dashboard header */}
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wider text-subtle">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Welcome to TabVault
          </h1>

          <p className="mt-2 text-sm text-muted">
            Signed in as {user?.email}
          </p>
        </header>

        {/* Add bookmark */}
        <section className="mb-10">
          <AddBookmarkForm />
        </section>

        {/* Organization */}
        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-subtle">
              Organization
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Manage your library
            </h2>
          </div>

          {categoriesError ? (
            <p className="border border-danger/30 p-4 text-sm text-danger">
              Failed to load categories.
            </p>
          ) : (
            <div className="max-w-xl">
              <CategoryManager
                initialCategories={typedCategories}
              />
            </div>
          )}
        </section>

        {/* Bookmark library */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
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
              {typedBookmarks.length === 1
                ? "bookmark"
                : "bookmarks"}
            </span>
          </div>

          {bookmarksError ? (
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
                  categories={typedCategories}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

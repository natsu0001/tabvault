import { createClient } from "@/lib/supabase/server";
import AddBookmarkForm from "@/components/bookmarks/AddBookmarkForm";
import CategoryManager from "@/components/categories/CategoryManager";
import CollectionManager from "@/components/collections/CollectionManager";
import BookmarkLibrary from "@/components/bookmarks/BookmarkLibrary";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import type { Bookmark } from "@/types/bookmark";

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type Collection = {
  id: string;
  name: string;
  description: string | null;
};
type DashboardPageProps = {
  searchParams: Promise<{ view?: string; collection?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const activeView =
    params.view === "favorites" || params.view === "recent"
      ? params.view
      : "all";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: bookmarks, error: bookmarksError },
    { data: categories, error: categoriesError },
    { data: collections, error: collectionsError },
  ] = await Promise.all([
    supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("categories")
      .select("id, name, color")
      .order("name"),

    supabase
      .from("collections")
      .select("id, name, description")
      .order("name"),
  ]);

  const typedBookmarks = (bookmarks ?? []) as Bookmark[];
  const typedCategories = (categories ?? []) as Category[];
  const typedCollections = (collections ?? []) as Collection[];

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <Sidebar
        collections={typedCollections.map(({ id, name }) => ({ id, name }))}
         activeView={activeView}
      />

      <div className="min-w-0 flex-1">
        <Topbar email={user?.email ?? undefined} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <section id="overview" className="mb-8 scroll-mt-24">
            <p className="text-xs uppercase tracking-wider text-subtle">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome to TabVault
            </h1>
            <p className="mt-2 break-all text-sm text-muted">
              Signed in as {user?.email}
            </p>
          </section>

          <section id="add-bookmark" className="mb-10 scroll-mt-24">
            <AddBookmarkForm />
          </section>

          <section id="organization" className="mb-10 scroll-mt-24">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-subtle">
                Organization
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Manage your library
              </h2>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="min-w-0">
                {categoriesError ? (
                  <p className="border border-danger/30 p-4 text-sm text-danger">
                    Failed to load categories.
                  </p>
                ) : (
                  <CategoryManager initialCategories={typedCategories} />
                )}
              </div>

              <div className="min-w-0">
                {collectionsError ? (
                  <p className="border border-danger/30 p-4 text-sm text-danger">
                    Failed to load collections.
                  </p>
                ) : (
                  <CollectionManager initialCollections={typedCollections} />
                )}
              </div>
            </div>
          </section>

          <section id="library" className="scroll-mt-24">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-subtle">
                Library
              </p>
              <h2 className="mt-1 text-xl font-semibold">Your bookmarks</h2>
            </div>

            {bookmarksError ? (
              <div className="border border-danger/30 bg-danger/5 p-5">
                <p className="text-sm text-danger">
                  Failed to load bookmarks. Refresh the page to try again.
                </p>
              </div>
            ) : (
              <BookmarkLibrary
                bookmarks={typedBookmarks}
                categories={typedCategories}
                collections={typedCollections.map(({ id, name }) => ({
                  id,
                  name,
                }))}
                  initialView={activeView}
  initialCollectionId={params.collection}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
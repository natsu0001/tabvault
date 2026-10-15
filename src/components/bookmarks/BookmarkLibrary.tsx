"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import type { Bookmark } from "@/types/bookmark";

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type Collection = {
  id: string;
  name: string;
};

type BookmarkLibraryProps = {
  bookmarks: Bookmark[];
  categories: Category[];
  collections: Collection[];
    initialView?: "all" | "favorites" | "recent";
  initialCollectionId?: string;
};

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

export default function BookmarkLibrary({
  bookmarks,
  categories,
  collections,
}: BookmarkLibraryProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredBookmarks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = bookmarks.filter((bookmark) => {
      const matchesSearch =
        !query ||
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        (bookmark.description ?? "").toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "favorites") {
        matchesFilter = bookmark.is_favorite;
      } else if (filter.startsWith("category:")) {
        matchesFilter = bookmark.category_id === filter.slice(9);
      } else if (filter.startsWith("collection:")) {
        matchesFilter = bookmark.collection_id === filter.slice(11);
      } else if (filter === "uncategorized") {
        matchesFilter = !bookmark.category_id;
      } else if (filter === "uncollected") {
        matchesFilter = !bookmark.collection_id;
      }

      return matchesSearch && matchesFilter;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });
  }, [bookmarks, search, filter, sort]);

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, URLs, descriptions..."
            aria-label="Search bookmarks"
            className="w-full border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 border border-border px-2 py-1 text-xs text-subtle sm:block">
            {filteredBookmarks.length}
          </kbd>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <SlidersHorizontal size={15} className="text-subtle" />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter bookmarks"
              className="max-w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-hover"
            >
              <option value="all">All bookmarks</option>
              <option value="favorites">Favorites</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="uncollected">No collection</option>

              {categories.map((category) => (
                <option key={category.id} value={`category:${category.id}`}>
                  Category: {category.name}
                </option>
              ))}

              {collections.map((collection) => (
                <option
                  key={collection.id}
                  value={`collection:${collection.id}`}
                >
                  Collection: {collection.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              aria-label="Sort bookmarks"
              className="border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-hover"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </div>

          <div className="flex shrink-0 items-center gap-1 self-end border border-border p-1 sm:self-auto">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`p-2 ${view === "grid" ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`p-2 ${view === "list" ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 text-xs text-subtle" aria-live="polite">
        Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="border border-border bg-surface p-10 text-center">
          <p className="text-sm font-medium">
            {search || filter !== "all"
              ? "No matching bookmarks"
              : "Your library is empty"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {search || filter !== "all"
              ? "Try a different search or filter."
              : "Add your first bookmark to get started."}
          </p>
          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 border border-border px-3 py-2 text-sm hover:bg-surface-hover"
            >
              Clear search and filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid gap-4 md:grid-cols-2"
              : "grid grid-cols-1 gap-3"
          }
        >
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              categories={categories}
              collections={collections}
            />
          ))}
        </div>
      )}
    </section>
  );
}
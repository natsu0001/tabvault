
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Bookmark as BookmarkIcon,
} from "lucide-react";
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

function getFilterFromUrl(
  view: string | null,
  collectionId: string | null,
): string {
  if (collectionId) return `collection:${collectionId}`;
  if (view === "favorites" || view === "recent") return view;
  return "all";
}

export default function BookmarkLibrary({
  bookmarks,
  categories,
  collections,
  initialView = "all",
  initialCollectionId,
}: BookmarkLibraryProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlView = searchParams.get("view");
  const urlCollection = searchParams.get("collection");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(() =>
    getFilterFromUrl(
      urlView ?? initialView,
      urlCollection ?? initialCollectionId ?? null,
    ),
  );
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setFilter(
      getFilterFromUrl(
        urlView ?? initialView,
        urlCollection ?? initialCollectionId ?? null,
      ),
    );
  }, [urlView, urlCollection, initialView, initialCollectionId]);

  const filteredBookmarks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const result = bookmarks.filter((bookmark) => {
      const matchesSearch =
        !query ||
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        (bookmark.description ?? "").toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "favorites") {
        matchesFilter = bookmark.is_favorite;
      } else if (filter === "recent") {
        matchesFilter =
          new Date(bookmark.created_at).getTime() >= sevenDaysAgo;
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

  const hasActiveFilters = search.trim() !== "" || filter !== "all";

  function clearFilters() {
    setSearch("");
    setFilter("all");
    router.replace(pathname, { scroll: false });
  }

  return (
    <section className="min-w-0 space-y-5">
      {/* Search */}
      <div className="relative">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
        />
        <input
          id="bookmark-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your library..."
          aria-label="Search bookmarks"
          className="w-full border border-border bg-surface py-3 pl-10 pr-20 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border-hover focus:ring-1 focus:ring-border-hover"
        />
        {search ? (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-subtle transition-colors hover:text-foreground"
          >
            <X size={15} />
          </button>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 border border-border px-2 py-1 text-xs tabular-nums text-subtle">
            {filteredBookmarks.length}
          </span>
        )}
      </div>

      {/* Filters and view controls */}
      <div className="flex flex-col gap-3 border-y border-border py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SlidersHorizontal
            size={15}
            aria-hidden="true"
            className="mr-1 text-subtle"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter bookmarks"
            className="min-w-0 max-w-full border border-border bg-surface px-3 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-border-hover"
          >
            <option value="all">All bookmarks</option>
            <option value="favorites">Favorites</option>
            <option value="recent">Recent · 7 days</option>
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
            className="min-w-0 border border-border bg-surface px-3 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-border-hover"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-xs text-muted transition-colors hover:text-foreground"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        <div
          className="flex shrink-0 items-center self-end border border-border p-1 sm:self-auto"
          role="group"
          aria-label="Bookmark layout"
        >
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`flex size-8 items-center justify-center transition-colors ${
              view === "grid"
                ? "bg-foreground text-background"
                : "text-muted hover:bg-background hover:text-foreground"
            }`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`flex size-8 items-center justify-center transition-colors ${
              view === "list"
                ? "bg-foreground text-background"
                : "text-muted hover:bg-background hover:text-foreground"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted" aria-live="polite">
          <span className="font-medium text-foreground">
            {filteredBookmarks.length}
          </span>{" "}
          {filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"}
          {hasActiveFilters ? " found" : " in your library"}
        </p>

        {sort !== "newest" && (
          <p className="text-xs text-subtle">
            Sorted by{" "}
            {sort === "oldest"
              ? "oldest"
              : sort === "title-asc"
                ? "title A–Z"
                : "title Z–A"}
          </p>
        )}
      </div>

      {/* Empty state */}
      {filteredBookmarks.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-border bg-surface px-5 py-12 text-center">
          <div className="mb-4 flex size-12 items-center justify-center border border-border bg-background">
            {hasActiveFilters ? (
              <Search size={19} className="text-muted" />
            ) : (
              <BookmarkIcon size={19} className="text-muted" />
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground">
            {hasActiveFilters
              ? "No matching bookmarks"
              : "Your library is empty"}
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            {hasActiveFilters
              ? "Nothing matches your current search and filters. Try adjusting them."
              : "Save a useful link and it will appear here, ready whenever you need it."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-background"
            >
              <X size={14} />
              Clear search and filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
              : "grid min-w-0 grid-cols-1 gap-3"
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

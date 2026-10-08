
"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

type BookmarkCardProps = {
  bookmark: Bookmark;
};

export default function BookmarkCard({
  bookmark,
}: BookmarkCardProps) {
  const supabase = createClient();

  const [isFavorite, setIsFavorite] = useState(
    bookmark.is_favorite,
  );

  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (loading) return;

    const nextValue = !isFavorite;

    setIsFavorite(nextValue);
    setLoading(true);

    const { error } = await supabase
      .from("bookmarks")
      .update({
        is_favorite: nextValue,
      })
      .eq("id", bookmark.id);

    if (error) {
      setIsFavorite(!nextValue);
    }

    setLoading(false);
  }

  return (
    <article className="border border-border bg-surface p-5 transition-colors hover:border-border-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">
            {bookmark.title}
          </h2>

          <p className="mt-1 truncate text-sm text-subtle">
            {bookmark.url}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFavorite}
          disabled={loading}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          className="shrink-0 text-subtle transition-colors hover:text-warning disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Star
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {bookmark.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
          {bookmark.description}
        </p>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Open bookmark
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}


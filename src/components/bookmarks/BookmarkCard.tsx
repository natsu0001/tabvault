
import type { Bookmark } from "@/types/bookmark";
import { ExternalLink, Star } from "lucide-react";

type BookmarkCardProps = {
  bookmark: Bookmark;
};

export default function BookmarkCard({
  bookmark,
}: BookmarkCardProps) {
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
          className="shrink-0 text-subtle transition-colors hover:text-warning"
          aria-label={
            bookmark.is_favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Star
            size={17}
            fill={bookmark.is_favorite ? "currentColor" : "none"}
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


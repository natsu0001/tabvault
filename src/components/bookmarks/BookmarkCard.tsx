
"use client";

import { useState } from "react";
import {
  ExternalLink,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type BookmarkCardProps = {
  bookmark: Bookmark;
  categories?: Category[];
  onDeleted?: (id: string) => void;
};

export default function BookmarkCard({
  bookmark,
  categories = [],
  onDeleted,
}: BookmarkCardProps) {
  const supabase = createClient();

  const [isFavorite, setIsFavorite] = useState(bookmark.is_favorite);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [description, setDescription] = useState(bookmark.description ?? "");
  const [categoryId, setCategoryId] = useState(bookmark.category_id ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const category = categories.find((item) => item.id === categoryId);

  async function toggleFavorite() {
    if (loading || deleting) return;

    const previous = isFavorite;
    setIsFavorite(!previous);
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("bookmarks")
      .update({ is_favorite: !previous })
      .eq("id", bookmark.id);

    if (error) {
      setIsFavorite(previous);
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleUpdate() {
    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url.trim());
    } catch {
      setError("Enter a valid URL, including https://.");
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      setError("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: title.trim(),
        url: parsedUrl.href,
        description: description.trim() || null,
        category_id: categoryId || null,
      })
      .eq("id", bookmark.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setUrl(parsedUrl.href);
    setIsEditing(false);
    setLoading(false);
  }

  function cancelEdit() {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setDescription(bookmark.description ?? "");
    setCategoryId(bookmark.category_id ?? "");
    setError("");
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${bookmark.title}"?`)) return;

    setDeleting(true);
    setError("");

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id);

    if (error) {
      setError(error.message);
      setDeleting(false);
      return;
    }

    onDeleted?.(bookmark.id);
    window.location.reload();
  }

  if (isEditing) {
    return (
      <article className="border border-border bg-surface p-5">
        <div className="space-y-4">
          <div>
            <label htmlFor={`title-${bookmark.id}`} className="mb-2 block text-xs text-subtle">
              Title
            </label>
            <input
              id={`title-${bookmark.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-border-hover"
            />
          </div>

          <div>
            <label htmlFor={`url-${bookmark.id}`} className="mb-2 block text-xs text-subtle">
              URL
            </label>
            <input
              id={`url-${bookmark.id}`}
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-border-hover"
            />
          </div>

          <div>
            <label htmlFor={`description-${bookmark.id}`} className="mb-2 block text-xs text-subtle">
              Description
            </label>
            <textarea
              id={`description-${bookmark.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full resize-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-border-hover"
            />
          </div>

          <div>
            <label htmlFor={`category-${bookmark.id}`} className="mb-2 block text-xs text-subtle">
              Category
            </label>
            <select
              id={`category-${bookmark.id}`}
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            className="border border-border px-3 py-2 text-xs text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="bg-foreground px-3 py-2 text-xs font-medium text-background disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-border bg-surface p-5 transition-colors hover:border-border-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{title}</h2>
          <p className="mt-1 truncate text-sm text-subtle">{url}</p>
        </div>

        <button
          type="button"
          onClick={toggleFavorite}
          disabled={loading || deleting}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="shrink-0 text-subtle hover:text-warning disabled:opacity-50"
        >
          <Star size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {category && (
        <span
          className="mt-3 inline-flex items-center gap-2 border border-border px-2 py-1 text-xs text-muted"
        >
          <span className="size-2" style={{ backgroundColor: category.color ?? "#71717a" }} />
          {category.name}
        </span>
      )}

      {description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">{description}</p>
      )}

      {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground"
        >
          Open bookmark <ExternalLink size={13} />
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted hover:text-foreground"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted hover:text-danger"
          >
            <Trash2 size={13} /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

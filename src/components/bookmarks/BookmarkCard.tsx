
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Pencil,
  Star,
  Trash2,
  Folder,
  Globe,
  X,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

type BookmarkCardProps = {
  bookmark: Bookmark;
  categories?: Category[];
  collections?: Collection[];
  onDeleted?: (id: string) => void;
};

export default function BookmarkCard({
  bookmark,
  categories = [],
  collections = [],
  onDeleted,
}: BookmarkCardProps) {
  const [isFavorite, setIsFavorite] = useState(bookmark.is_favorite);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [description, setDescription] = useState(bookmark.description ?? "");
  const [categoryId, setCategoryId] = useState(bookmark.category_id ?? "");
  const [collectionId, setCollectionId] = useState(bookmark.collection_id ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  let hostname = "";
  let faviconUrl = "";

  try {
    const parsed = new URL(bookmark.url);
    hostname = parsed.hostname.replace(/^www\./, "");
    faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      parsed.hostname
    )}&sz=64`;
  } catch {
    hostname = bookmark.url;
  }

  const category = categories.find(
    (item) => item.id === (isEditing ? categoryId : bookmark.category_id)
  );

  const collection = collections.find(
    (item) => item.id === (isEditing ? collectionId : bookmark.collection_id)
  );

  const inputClass =
    "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border-hover focus:ring-1 focus:ring-border-hover";

  const labelClass = "mb-2 block text-xs font-medium text-muted";

  async function toggleFavorite() {
    if (loading || deleting) return;

    const previous = isFavorite;
    setIsFavorite(!previous);
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_favorite: !previous })
        .eq("id", bookmark.id);

      if (error) throw error;
    } catch {
      setIsFavorite(previous);
      setError("Couldn't update favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (loading || deleting) return;

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

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookmarks")
        .update({
          title: title.trim(),
          url: parsedUrl.href,
          description: description.trim() || null,
          category_id: categoryId || null,
          collection_id: collectionId || null,
        })
        .eq("id", bookmark.id);

      if (error) throw error;

      setUrl(parsedUrl.href);
      setIsEditing(false);
      router.refresh();
    } catch {
      setError("Couldn't save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setDescription(bookmark.description ?? "");
    setCategoryId(bookmark.category_id ?? "");
    setCollectionId(bookmark.collection_id ?? "");
    setError("");
    setIsEditing(false);
  }

  async function handleDelete() {
    if (loading || deleting) return;
    if (!window.confirm(`Delete "${bookmark.title}"?`)) return;

    setDeleting(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) throw error;

      onDeleted?.(bookmark.id);
      router.refresh();
    } catch {
      setError("Couldn't delete this bookmark. Please try again.");
      setDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <article className="min-w-0 border border-border bg-surface p-5 transition-colors">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Edit bookmark</p>
            <p className="mt-1 text-xs text-muted">Update your saved link and details.</p>
          </div>
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            aria-label="Cancel editing"
            className="inline-flex size-8 items-center justify-center border border-border text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor={`title-${bookmark.id}`} className={labelClass}>
              Title
            </label>
            <input
              id={`title-${bookmark.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor={`url-${bookmark.id}`} className={labelClass}>
              URL
            </label>
            <input
              id={`url-${bookmark.id}`}
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor={`description-${bookmark.id}`} className={labelClass}>
              Description
            </label>
            <textarea
              id={`description-${bookmark.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={1000}
              className={`${inputClass} resize-y`}
              placeholder="What do you want to remember about this link?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`category-${bookmark.id}`} className={labelClass}>
                Category
              </label>
              <select
                id={`category-${bookmark.id}`}
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className={inputClass}
              >
                <option value="">Uncategorized</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`collection-${bookmark.id}`} className={labelClass}>
                Collection
              </label>
              <select
                id={`collection-${bookmark.id}`}
                value={collectionId}
                onChange={(event) => setCollectionId(event.target.value)}
                className={inputClass}
              >
                <option value="">No collection</option>
                {collections.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            className="border border-border px-4 py-2.5 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={14} />
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-w-0 flex-col border border-border bg-surface p-4 transition-colors duration-200 hover:border-border-hover sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-background">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="size-5 object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <Globe size={18} className="text-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h2
            title={bookmark.title}
            className="line-clamp-2 break-words text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-foreground"
          >
            {bookmark.title}
          </h2>
          <p
            title={bookmark.url}
            className="mt-1.5 truncate text-xs text-subtle"
          >
            {hostname}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFavorite}
          disabled={loading || deleting}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`inline-flex size-8 shrink-0 items-center justify-center border transition-colors disabled:opacity-50 ${
            isFavorite
              ? "border-warning/30 bg-warning/10 text-warning"
              : "border-transparent text-subtle hover:border-border hover:bg-background hover:text-warning"
          }`}
        >
          <Star size={15} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {(category || collection) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {category && (
            <span className="inline-flex max-w-full items-center gap-2 border border-border px-2 py-1 text-xs text-muted">
              <span
                className="size-2 shrink-0"
                style={{ backgroundColor: category.color ?? "#71717a" }}
              />
              <span className="truncate">{category.name}</span>
            </span>
          )}

          {collection && (
            <span className="inline-flex max-w-full items-center gap-1.5 border border-border px-2 py-1 text-xs text-muted">
              <Folder size={12} className="shrink-0" />
              <span className="truncate">{collection.name}</span>
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex-1">
        {bookmark.description ? (
          <p className="line-clamp-3 break-words text-sm leading-6 text-muted">
            {bookmark.description}
          </p>
        ) : (
          <p className="text-xs text-subtle/80">No description added.</p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-hover"
        >
          Open link
          <ArrowUpRight size={14} />
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsEditing(true);
            }}
            disabled={deleting || loading}
            className="inline-flex min-h-8 items-center gap-1.5 px-2 text-xs text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || loading}
            className="inline-flex min-h-8 items-center gap-1.5 px-2 text-xs text-muted transition-colors hover:bg-danger/5 hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={13} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

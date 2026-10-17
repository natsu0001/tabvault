"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type Collection = {
  id: string;
  name: string;
};

type AddBookmarkFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AddBookmarkForm({
  onSuccess,
  onCancel,
}: AddBookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


useEffect(() => {
  let cancelled = false;

  async function loadOptions() {
    try {
      const supabase = createClient();

      const [categoryResult, collectionResult] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("collections").select("id, name").order("name"),
      ]);

      if (categoryResult.error || collectionResult.error) {
        throw new Error("Could not load categories or collections.");
      }

      if (!cancelled) {
        setCategories(categoryResult.data ?? []);
        setCollections(collectionResult.data ?? []);
        setError("");
      }
    } catch {
      if (!cancelled) {
        setError("Could not load categories or collections.");
      }
    } finally {
      if (!cancelled) {
        setLoadingOptions(false);
      }
    }
  }

  void loadOptions();

  return () => {
    cancelled = true;
  };
}, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      setError("Title and URL are required.");
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      setError("Enter a valid URL, including https://.");
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      setError("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please sign in again.");
      }

      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          title: trimmedTitle,
          url: parsedUrl.href,
          description: description.trim() || null,
          category_id: categoryId || null,
          collection_id: collectionId || null,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setTitle("");
      setUrl("");
      setDescription("");
      setCategoryId("");
      setCollectionId("");

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the bookmark.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border bg-surface p-6"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-subtle">
          New bookmark
        </p>
        <h2 className="mt-1 text-xl font-semibold">Add Bookmark</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="bookmark-title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="bookmark-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="React Documentation"
            maxLength={200}
            required
            className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
          />
        </div>

        <div>
          <label htmlFor="bookmark-url" className="mb-2 block text-sm font-medium">
            URL
          </label>
          <input
            id="bookmark-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://react.dev"
            required
            className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
          />
        </div>

        <div>
          <label htmlFor="bookmark-description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="bookmark-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this bookmark about?"
            rows={3}
            maxLength={1000}
            className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:border-border-hover"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bookmark-category" className="mb-2 block text-sm font-medium">
              Category
            </label>
            <select
              id="bookmark-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={loadingOptions}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-border-hover"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bookmark-collection" className="mb-2 block text-sm font-medium">
              Collection
            </label>
            <select
              id="bookmark-collection"
              value={collectionId}
              onChange={(event) => setCollectionId(event.target.value)}
              disabled={loadingOptions}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-border-hover"
            >
              <option value="">No collection</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="border border-border px-4 py-2 text-sm text-muted hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || loadingOptions}
          className="bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Bookmark"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AddBookmarkFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AddBookmarkForm({
  onSuccess,
  onCancel,
}: AddBookmarkFormProps) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to add a bookmark.");
      }

      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || null,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setTitle("");
      setUrl("");
      setDescription("");

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the bookmark.",
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

        <h2 className="mt-1 text-xl font-semibold">
          Add Bookmark
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="React Documentation"
            className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-hover"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="mb-2 block text-sm font-medium"
          >
            URL
          </label>

          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://react.dev"
            className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-hover"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this bookmark about?"
            rows={3}
            className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-subtle focus:border-border-hover"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-border-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Bookmark"}
        </button>
      </div>
    </form>
  );
}


"use client";

import { useState, type FormEvent } from "react";
import { FolderPlus, Trash2, Folder } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  description: string | null;
};

type CollectionManagerProps = {
  initialCollections: Collection[];
};

export default function CollectionManager({
  initialCollections,
}: CollectionManagerProps) {
  const [collections, setCollections] = useState(initialCollections);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Collection name is required.");
      return;
    }

    if (
      collections.some(
        (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setError("A collection with that name already exists.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Please sign in again.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("collections")
      .insert({
        user_id: user.id,
        name: trimmedName,
        description: description.trim() || null,
      })
      .select("id, name, description")
      .single();

    if (insertError) {
      setError(insertError.message);
    } else {
      setCollections((current) =>
        [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setName("");
      setDescription("");
    }

    setLoading(false);
  }

  async function deleteCollection(collection: Collection) {
    const confirmed = window.confirm(
      `Delete collection "${collection.name}"? Bookmarks will not be deleted.`,
    );

    if (!confirmed) return;

    setError("");

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", collection.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setCollections((current) =>
      current.filter((item) => item.id !== collection.id),
    );
  }

  return (
    <section className="border border-border bg-surface p-5">
      <div className="mb-5 flex items-center gap-3">
        <FolderPlus size={19} className="text-muted" />
        <div>
          <h2 className="font-semibold">Collections</h2>
          <p className="mt-1 text-xs text-subtle">
            Group bookmarks by project or purpose.
          </p>
        </div>
      </div>

      <form onSubmit={addCollection} className="space-y-3">
        <div>
          <label
            htmlFor="collection-name"
            className="mb-2 block text-sm text-muted"
          >
            Name
          </label>
          <input
            id="collection-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="React Learning"
            maxLength={80}
            required
            className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </div>

        <div>
          <label
            htmlFor="collection-description"
            className="mb-2 block text-sm text-muted"
          >
            Description <span className="text-subtle">(optional)</span>
          </label>
          <textarea
            id="collection-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Resources for learning React"
            maxLength={300}
            rows={2}
            className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          <FolderPlus size={15} />
          {loading ? "Creating..." : "Create collection"}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-subtle">
          Your collections ({collections.length})
        </p>

        {collections.length === 0 ? (
          <p className="py-4 text-sm text-muted">
            No collections yet. Create your first one above.
          </p>
        ) : (
          <div className="space-y-1">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center justify-between gap-3 border border-transparent px-2 py-3 hover:border-border"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Folder size={17} className="mt-0.5 shrink-0 text-muted" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {collection.name}
                    </p>
                    {collection.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-subtle">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteCollection(collection)}
                  aria-label={`Delete ${collection.name}`}
                  className="shrink-0 p-2 text-subtle hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
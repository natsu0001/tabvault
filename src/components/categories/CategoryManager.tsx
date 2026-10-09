
"use client";

import { useState } from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type CategoryManagerProps = {
  initialCategories: Category[];
};

const COLORS = [
  "#60a5fa",
  "#4ade80",
  "#c084fc",
  "#fb923c",
  "#f87171",
  "#facc15",
];

export default function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const supabase = createClient();

  const [categories, setCategories] =
    useState(initialCategories);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setError("You already have a category with that name.");
      return;
    }

    setLoading(true);
    setError("");

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
      .from("categories")
      .insert({
        user_id: user.id,
        name: trimmedName,
        color,
      })
      .select("id, name, color")
      .single();

    if (insertError) {
      setError(insertError.message);
    } else {
      setCategories((current) => [...current, data].sort(
        (a, b) => a.name.localeCompare(b.name),
      ));
      setName("");
    }

    setLoading(false);
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    setError("");

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setCategories((current) =>
      current.filter((item) => item.id !== category.id),
    );
  }

  return (
    <section className="border border-border bg-surface p-5">
      <div className="mb-5 flex items-center gap-3">
        <FolderOpen size={19} className="text-muted" />
        <div>
          <h2 className="font-semibold">Categories</h2>
          <p className="text-sm text-muted">
            Organize bookmarks by topic.
          </p>
        </div>
      </div>

      <form onSubmit={addCategory} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Development"
          maxLength={40}
          required
          className="min-w-0 flex-1 border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-border-hover"
        />

        <select
          value={color}
          onChange={(event) => setColor(event.target.value)}
          aria-label="Category color"
          className="border border-border bg-background px-3 py-2.5 text-sm outline-none"
        >
          {COLORS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          <Plus size={15} />
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-5 divide-y divide-border">
        {categories.length === 0 ? (
          <p className="py-5 text-sm text-muted">
            No categories yet. Create your first one above.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="size-2.5 shrink-0"
                  style={{
                    backgroundColor: category.color ?? "#71717a",
                  }}
                />
                <span className="truncate text-sm">
                  {category.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteCategory(category)}
                aria-label={`Delete ${category.name}`}
                className="p-2 text-muted transition-colors hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

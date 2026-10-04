
"use client";

import { Plus, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
      {/* Search */}
      <div className="flex w-full max-w-md items-center gap-2 border border-border bg-surface px-3 py-2">
        <Search size={16} className="shrink-0 text-subtle" />

        <input
          type="text"
          placeholder="Search bookmarks..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-subtle"
        />

        <kbd className="hidden border border-border px-1.5 py-0.5 text-[10px] text-subtle sm:block">
          /
        </kbd>
      </div>

      {/* Actions */}
      <div className="ml-4 flex items-center gap-2">
        <button className="hidden items-center gap-2 border border-border bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:flex">
          <Plus size={15} />
          Add Bookmark
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-sm font-medium transition-colors hover:bg-surface-hover"
          aria-label="Profile"
        >
          A
        </button>
      </div>
    </header>
  );
}


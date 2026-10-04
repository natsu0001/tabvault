
import { Bookmark, Folder, Heart, Plus } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Heading */}
          <section className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-subtle">
                Library
              </p>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your bookmarks
              </h1>

              <p className="mt-2 text-sm text-muted">
                Save and organize the things worth keeping.
              </p>
            </div>

            <button className="flex shrink-0 items-center gap-2 border border-border bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:hidden">
              <Plus size={15} />
              Add
            </button>
          </section>

          {/* Stats */}
          <section className="mb-8 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            <div className="bg-background p-5">
              <div className="mb-3 flex items-center gap-2 text-subtle">
                <Bookmark size={15} />
                <span className="text-xs uppercase tracking-wider">
                  Bookmarks
                </span>
              </div>

              <p className="text-2xl font-semibold">0</p>
            </div>

            <div className="bg-background p-5">
              <div className="mb-3 flex items-center gap-2 text-subtle">
                <Heart size={15} />
                <span className="text-xs uppercase tracking-wider">
                  Favorites
                </span>
              </div>

              <p className="text-2xl font-semibold">0</p>
            </div>

            <div className="bg-background p-5">
              <div className="mb-3 flex items-center gap-2 text-subtle">
                <Folder size={15} />
                <span className="text-xs uppercase tracking-wider">
                  Collections
                </span>
              </div>

              <p className="text-2xl font-semibold">0</p>
            </div>
          </section>

          {/* Empty state */}
          <section className="flex min-h-80 flex-col items-center justify-center border border-dashed border-border px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center border border-border bg-surface">
              <Bookmark size={20} className="text-muted" />
            </div>

            <h2 className="text-sm font-medium">
              No bookmarks yet
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted">
              Start building your personal library by saving your first
              bookmark.
            </p>

            <button className="mt-5 flex items-center gap-2 border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
              <Plus size={15} />
              Add your first bookmark
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}


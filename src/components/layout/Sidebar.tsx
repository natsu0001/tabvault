
"use client";

import {
  Bookmark,
  Clock3,
  Folder,
  Heart,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Bookmarks",
    icon: Bookmark,
  },
  {
    label: "Favorites",
    icon: Heart,
  },
  {
    label: "Recent",
    icon: Clock3,
  },
];

const collections = [
  "Development",
  "Design",
  "Learning",
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center border border-border bg-surface">
            <Bookmark size={15} />
          </div>

          <span className="text-sm font-semibold tracking-tight">
            TabVault
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-subtle">
          Library
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 border border-transparent px-3 py-2 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <Icon size={16} strokeWidth={1.8} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Collections */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">
              Collections
            </p>

            <button
              className="text-subtle transition-colors hover:text-foreground"
              aria-label="Create collection"
            >
              <Plus size={14} />
            </button>
          </div>

          <nav className="space-y-1">
            {collections.map((collection) => (
              <button
                key={collection}
                className="flex w-full items-center gap-3 border border-transparent px-3 py-2 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <Folder size={16} strokeWidth={1.8} />

                <span>{collection}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 border border-transparent px-3 py-2 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground">
          <Settings size={16} strokeWidth={1.8} />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}


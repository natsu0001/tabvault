"use client";

import Link from "next/link";
import {
  Bookmark,
  Clock3,
  Folder,
  Heart,
  LayoutDashboard,
  Settings,
} from "lucide-react";

type SidebarProps = {
  collections?: { id: string; name: string }[];
  activeView?: string;
};

export default function Sidebar({
  collections = [],
  activeView = "all",
}: SidebarProps) {
  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", view: "dashboard" },
    { label: "All Bookmarks", icon: Bookmark, href: "/dashboard?view=all", view: "all" },
    { label: "Favorites", icon: Heart, href: "/dashboard?view=favorites", view: "favorites" },
    { label: "Recent", icon: Clock3, href: "/dashboard?view=recent", view: "recent" },
  ];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
      <Link href="/dashboard" className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
        <span className="flex size-8 items-center justify-center border border-border bg-surface">
          <Bookmark size={16} />
        </span>
        <span className="text-sm font-semibold tracking-tight">TabVault</span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        <p className="px-3 pb-3 text-[11px] font-medium uppercase tracking-wider text-subtle">
          Library
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon, href, view }) => {
            const active = activeView === view;

            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 border px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-border bg-surface text-foreground"
                    : "border-transparent text-muted hover:border-border hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between px-3 pb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">
              Collections
            </p>
            <Link
              href="/dashboard#organization"
              aria-label="Manage collections"
              className="text-subtle hover:text-foreground"
            >
              <Folder size={15} />
            </Link>
          </div>

          {collections.length ? (
            <nav className="space-y-1">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/dashboard?view=all&collection=${encodeURIComponent(collection.id)}#library`}
                  className="flex items-center gap-3 border border-transparent px-3 py-2 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
                >
                  <Folder size={15} strokeWidth={1.8} />
                  <span className="truncate">{collection.name}</span>
                </Link>
              ))}
            </nav>
          ) : (
            <p className="px-3 py-2 text-xs leading-5 text-subtle">
              Your collections will appear here.
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/dashboard#organization"
          className="flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
        >
          <Settings size={16} strokeWidth={1.8} />
          Manage library
        </Link>
      </div>
    </aside>
  );
}
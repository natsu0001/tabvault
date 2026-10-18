
"use client";

import Link from "next/link";
import {
  Bookmark,
  Clock3,
  Folder,
  Heart,
  LayoutDashboard,
  Settings,
  ArrowUpRight,
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
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      view: "dashboard",
    },
    {
      label: "All bookmarks",
      icon: Bookmark,
      href: "/dashboard?view=all#library",
      view: "all",
    },
    {
      label: "Favorites",
      icon: Heart,
      href: "/dashboard?view=favorites#library",
      view: "favorites",
    },
    {
      label: "Recent",
      icon: Clock3,
      href: "/dashboard?view=recent#library",
      view: "recent",
    },
  ];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
      {/* Brand */}
      <Link
        href="/dashboard"
        className="group flex h-16 shrink-0 items-center gap-3 border-b border-border px-5 transition-colors hover:bg-surface/50"
      >
        <span className="flex size-9 items-center justify-center border border-border bg-surface text-foreground transition-colors group-hover:border-border-hover">
          <Bookmark size={17} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold tracking-tight text-foreground">
            TabVault
          </span>
          <span className="mt-0.5 block text-[10px] tracking-wide text-subtle">
            YOUR PERSONAL LIBRARY
          </span>
        </span>
        <ArrowUpRight
          size={14}
          className="text-subtle opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">
          Workspace
        </p>

        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.map(({ label, icon: Icon, href, view }) => {
            const active = activeView === view;

            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 border px-3 py-2.5 text-[13px] transition-colors duration-150 ${
                  active
                    ? "border-border bg-surface font-medium text-foreground"
                    : "border-transparent text-muted hover:border-border/70 hover:bg-surface/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-0 top-2 w-[2px] bg-foreground"
                  />
                )}

                <Icon
                  size={16}
                  strokeWidth={active ? 2 : 1.7}
                  className={
                    active
                      ? "text-foreground"
                      : "text-subtle transition-colors group-hover:text-foreground"
                  }
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <span className="size-1.5 bg-foreground" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collections */}
        <div className="mt-9">
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">
              Collections
            </p>
            <Link
              href="/dashboard#organization"
              aria-label="Manage collections"
              title="Manage collections"
              className="flex size-6 items-center justify-center text-subtle transition-colors hover:bg-surface hover:text-foreground"
            >
              <Folder size={14} />
            </Link>
          </div>

          {collections.length > 0 ? (
            <nav aria-label="Collections" className="space-y-1">
              {collections.map((collection) => {
                const active =
                  activeView === `collection:${collection.id}`;

                return (
                  <Link
                    key={collection.id}
                    href={`/dashboard?view=all&collection=${encodeURIComponent(collection.id)}#library`}
                    aria-current={active ? "page" : undefined}
                    title={collection.name}
                    className={`group flex min-w-0 items-center gap-3 border px-3 py-2 text-[13px] transition-colors ${
                      active
                        ? "border-border bg-surface text-foreground"
                        : "border-transparent text-muted hover:border-border/70 hover:bg-surface/70 hover:text-foreground"
                    }`}
                  >
                    <Folder
                      size={15}
                      strokeWidth={1.7}
                      className={
                        active
                          ? "text-foreground"
                          : "text-subtle group-hover:text-foreground"
                      }
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {collection.name}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="mx-1 border border-dashed border-border px-3 py-4">
              <Folder size={16} className="mb-2 text-subtle" />
              <p className="text-xs text-muted">Nothing here yet.</p>
              <p className="mt-1 text-[11px] leading-5 text-subtle">
                Create a collection to organize your bookmarks.
              </p>
              <Link
                href="/dashboard#organization"
                className="mt-3 inline-block text-xs text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Create collection
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/dashboard#organization"
          className="group flex items-center gap-3 border border-transparent px-3 py-2.5 text-[13px] text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
        >
          <Settings
            size={16}
            strokeWidth={1.7}
            className="text-subtle group-hover:text-foreground"
          />
          <span className="flex-1">Manage library</span>
          <ArrowUpRight
            size={13}
            className="text-subtle opacity-0 transition-opacity group-hover:opacity-100"
          />
        </Link>
      </div>
    </aside>
  );
}


"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Plus,
  Search,
  Menu,
  X,
  LayoutDashboard,
  Heart,
  Clock3,
  FolderKanban,
} from "lucide-react";

type TopbarProps = {
  email?: string;
};

const mobileLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Bookmarks",
    href: "/dashboard?view=all#library",
    icon: Bookmark,
  },
  {
    label: "Favorites",
    href: "/dashboard?view=favorites#library",
    icon: Heart,
  },
  {
    label: "Recent",
    href: "/dashboard?view=recent#library",
    icon: Clock3,
  },
  {
    label: "Categories & Collections",
    href: "/dashboard#organization",
    icon: FolderKanban,
  },
];

export default function Topbar({ email }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        focusLibrarySearch();
      }

      if (event.key === "Escape") {
        searchRef.current?.blur();
        setMobileOpen(false);
      }
    }

    function focusLibrarySearch() {
      const input = document.getElementById("bookmark-search");

      if (input instanceof HTMLInputElement) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function focusLibrarySearch() {
    const input = document.getElementById("bookmark-search");

    if (input instanceof HTMLInputElement) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => input.focus(), 200);
      return;
    }

    document.getElementById("library")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex size-9 shrink-0 items-center justify-center border border-border text-muted transition-colors hover:bg-surface hover:text-foreground lg:hidden"
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        <button
          type="button"
          onClick={focusLibrarySearch}
          aria-label="Search bookmarks"
          className="flex h-10 min-w-0 max-w-xl flex-1 items-center gap-3 border border-border bg-surface px-3 text-left transition-colors hover:border-border-hover"
        >
          <Search size={16} className="shrink-0 text-subtle" />

          <span className="flex-1 truncate text-sm text-subtle">
            Search bookmarks...
          </span>

          <kbd className="hidden border border-border px-1.5 py-0.5 text-[10px] text-subtle sm:inline">
            /
          </kbd>
        </button>

        <a
          href="#add-bookmark"
          onClick={() => setMobileOpen(false)}
          className="inline-flex h-10 shrink-0 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add bookmark</span>
        </a>

        <div
          title={email || "Your account"}
          aria-label={email || "Your account"}
          className="hidden size-9 shrink-0 items-center justify-center border border-border bg-surface text-sm font-medium sm:flex"
        >
          {email?.trim().charAt(0).toUpperCase() || (
            <Bookmark size={15} />
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Bookmark size={17} />
              TabVault
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center border border-border text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <X size={17} />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="space-y-1 p-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
              Workspace
            </p>

            {mobileLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 border border-transparent px-3 py-3 text-sm text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
              >
                <Icon
                  size={17}
                  className="shrink-0 text-subtle transition-colors group-hover:text-foreground"
                />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-4 border-t border-border pt-4">
            <p className="truncate px-3 text-xs text-subtle">
              Signed in as
            </p>
            <p className="mt-1 truncate px-3 text-sm text-muted">
              {email || "Your account"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

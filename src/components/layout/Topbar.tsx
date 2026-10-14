"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Plus, Search, Menu, X } from "lucide-react";

type TopbarProps = {
  email?: string;
};

export default function Topbar({ email }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shortcut, setShortcut] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (event.target as HTMLElement).tagName,
        )
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        searchRef.current?.blur();
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function focusLibrarySearch() {
    document.getElementById("bookmark-search")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      const input = document.getElementById("bookmark-search");
      if (input instanceof HTMLInputElement) input.focus();
    }, 250);
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex size-9 shrink-0 items-center justify-center border border-border text-muted hover:bg-surface lg:hidden"
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        <button
          type="button"
          onClick={focusLibrarySearch}
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
          className="inline-flex h-10 shrink-0 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add bookmark</span>
        </a>

        <div
          title={email || "Your account"}
          className="hidden size-9 shrink-0 items-center justify-center border border-border bg-surface text-sm font-medium sm:flex"
        >
          {email?.charAt(0).toUpperCase() || <Bookmark size={15} />}
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Bookmark size={17} /> TabVault
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="border border-border p-2 text-muted hover:text-foreground"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="space-y-1 p-4">
            {[
              ["Dashboard", "#overview"],
              ["All Bookmarks", "#library"],
              ["Favorites", "#library"],
              ["Recent", "#library"],
              ["Categories & Collections", "#organization"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block border border-transparent px-3 py-3 text-sm text-muted hover:border-border hover:bg-surface hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
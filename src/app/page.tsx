"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Check,
  Folder,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Bookmark,
    title: "Save anything",
    description:
      "Keep useful links, articles, tools, and resources in one personal library.",
  },
  {
    icon: Folder,
    title: "Stay organized",
    description:
      "Group bookmarks into categories and collections that make sense to you.",
  },
  {
    icon: Search,
    title: "Find it instantly",
    description:
      "Search your saved links and find what you need without digging through browser tabs.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-border bg-surface">
              <Bookmark size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              TabVault<span className="text-subtle">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Get started
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(128,128,128,0.13),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 bg-foreground" />
              YOUR PERSONAL BOOKMARK LIBRARY
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              The internet is huge.
              <br />
              <span className="text-muted">Keep what matters.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Stop losing great links in endless tabs and scattered notes.
              Save, organize, and rediscover everything worth keeping in one
              simple space.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                Build your library
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-surface"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-subtle">
              <span className="flex items-center gap-2">
                <Check size={14} />
                Your own private library
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} />
                Categories and collections
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} />
                Quick search
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="mt-16 max-w-4xl border border-border bg-surface shadow-2xl sm:mt-20">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <Bookmark size={17} />
                <span className="text-sm font-medium">Your library</span>
              </div>
              <span className="text-xs text-subtle">PRODUCT PREVIEW</span>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-[190px_1fr]">
              <aside className="hidden space-y-1 bg-background p-4 sm:block">
                <p className="mb-3 px-2 text-[10px] uppercase tracking-widest text-subtle">
                  Workspace
                </p>
                <div className="flex items-center gap-2 bg-surface px-3 py-2 text-sm">
                  <Bookmark size={14} />
                  All bookmarks
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
                  <Star size={14} />
                  Favorites
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
                  <Folder size={14} />
                  Collections
                </div>
              </aside>

              <div className="min-w-0 bg-background p-4 sm:p-6">
                <div className="flex items-center gap-3 border border-border bg-surface px-3 py-2.5 text-sm text-subtle">
                  <Search size={15} />
                  Search your bookmarks...
                  <span className="ml-auto hidden text-xs sm:block">⌘ K</span>
                </div>

                <div className="mb-4 mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Recently saved</p>
                    <p className="mt-1 text-xs text-subtle">
                      Your useful corners of the internet
                    </p>
                  </div>
                  <span className="text-xs text-subtle">03 ITEMS</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border border-border p-4">
                    <div className="mb-4 flex h-8 w-8 items-center justify-center border border-border">
                      <Bookmark size={15} />
                    </div>
                    <p className="text-sm font-medium">Design resources</p>
                    <p className="mt-1 truncate text-xs text-muted">
                      design.example.com
                    </p>
                    <div className="mt-4 border-t border-border pt-3 text-xs text-subtle">
                      DESIGN
                    </div>
                  </div>

                  <div className="border border-border p-4">
                    <div className="mb-4 flex h-8 w-8 items-center justify-center border border-border">
                      <Folder size={15} />
                    </div>
                    <p className="text-sm font-medium">Developer toolkit</p>
                    <p className="mt-1 truncate text-xs text-muted">
                      tools.example.com
                    </p>
                    <div className="mt-4 border-t border-border pt-3 text-xs text-subtle">
                      DEVELOPMENT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-subtle">
            LESS CLUTTER. MORE CLARITY.
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything worth saving.
            <br />
            Nothing hard to find.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            A focused workspace for the links you want to keep close.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="bg-background p-6 sm:p-8">
                <Icon size={21} className="text-muted" />
                <h3 className="mt-6 text-base font-medium">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Privacy and CTA */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={18} />
              A space that belongs to you
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Your bookmark library is tied to your account. Sign in to access
              your saved links and keep your workspace personal.
            </p>
          </div>

          <Link
            href="/signup"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 md:self-auto"
          >
            Get started for free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="font-medium text-foreground">
          TabVault.
        </Link>
        <p>Keep what matters. Find it when you need it.</p>
      </footer>
    </main>
  );
}
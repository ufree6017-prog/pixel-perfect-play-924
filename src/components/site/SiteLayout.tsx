import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SupportWidget } from "./SupportWidget";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SupportWidget />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="surface-hero">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm opacity-85 md:text-base">{description}</p>
        ) : null}
      </div>
    </section>
  );
}

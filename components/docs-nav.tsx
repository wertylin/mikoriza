"use client";

import { useEffect, useState } from "react";
import { DOC_SECTIONS } from "@/lib/docs";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>(DOC_SECTIONS[0].id);

  useEffect(() => {
    const nodes = DOC_SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: [0, 0.25, 1] },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8 md:pt-14">
      <nav
        aria-label="On this page"
        className="sticky top-14 z-20 -mx-5 mb-8 border-b border-line/80 bg-background/85 px-5 backdrop-blur-xl md:hidden"
      >
        <ul className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DOC_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active === s.id
                    ? "bg-spore/15 text-spore"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex gap-10">
        <nav
          aria-label="On this page"
          className="sticky top-24 hidden w-48 shrink-0 self-start md:block lg:w-52"
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            on this page
          </p>
          <ul className="flex flex-col gap-0.5 border-l border-line/80">
            {DOC_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`-ml-px flex items-baseline gap-2.5 border-l px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] transition-colors ${
                    active === s.id
                      ? "border-spore text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-[10px] text-muted">{s.num}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </div>
    </div>
  );
}

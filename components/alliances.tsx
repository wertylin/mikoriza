"use client";

import { useEffect, useRef, useState } from "react";
import type { Alliance, AllianceId } from "@/lib/alliances";

export function Alliances({
  alliances,
  selected,
  unlocked,
  onSelect,
  onUnlock,
}: {
  alliances: Alliance[];
  selected: AllianceId | null;
  unlocked: boolean;
  onSelect: (id: AllianceId) => void;
  onUnlock: (code: string) => boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCode("");
    setError(false);
    if (selected && !unlocked) {
      inputRef.current?.focus();
    }
  }, [selected, unlocked]);

  function submit() {
    const ok = onUnlock(code);
    setError(!ok);
    if (ok) setCode("");
  }

  return (
    <div className="mx-auto w-full max-w-[40rem]">
      <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        live alliances
      </p>
      <div
        role="radiogroup"
        aria-label="Live alliances"
        className="grid gap-3 sm:grid-cols-2"
      >
        {alliances.map((alliance) => {
          const active = selected === alliance.id;
          const showCode = active && !unlocked;
          return (
            <div
              key={alliance.id}
              className={`flex flex-col rounded-2xl border bg-panel/70 p-4 text-left shadow-[0_0_0_1px_rgba(200,240,74,0.06),0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors ${
                active
                  ? "border-spore/55 shadow-[0_0_0_1px_rgba(200,240,74,0.18),0_0_32px_rgba(200,240,74,0.12)]"
                  : "border-line/80 hover:border-spore/35"
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={alliance.name}
                onClick={() => onSelect(alliance.id)}
                className="flex flex-1 flex-col text-left focus-visible:outline-none"
              >
                <span className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-spore">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_10px_rgba(200,240,74,0.9)]" />
                  live
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {alliance.kicker}
                </span>
                <span className="mt-1 font-serif text-[1.85rem] leading-8 text-foreground">
                  {alliance.title}
                </span>
                <span className="mt-2 text-sm leading-5 text-muted">
                  {alliance.blurb}
                </span>
                <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {alliance.meta}
                </span>
              </button>
              {showCode ? (
                <form
                  className="mt-4 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <label className="sr-only" htmlFor={`code-${alliance.id}`}>
                    Alliance code
                  </label>
                  <input
                    ref={active ? inputRef : undefined}
                    id={`code-${alliance.id}`}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError(false);
                    }}
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="code"
                    aria-invalid={error}
                    className={`h-9 min-w-0 flex-1 rounded-full border bg-transparent px-3 font-mono text-[12px] tracking-[0.16em] text-foreground placeholder:tracking-[0.12em] placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70 ${
                      error ? "border-spore/80" : "border-line/80"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!code.trim()}
                    className="inline-flex h-9 shrink-0 items-center rounded-full bg-spore px-4 font-sans text-sm font-medium text-ink shadow-[0_0_18px_rgba(200,240,74,0.28)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
                  >
                    Unlock
                  </button>
                </form>
              ) : (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <a
                    href={alliance.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
                  >
                    open
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelect(alliance.id)}
                    className={`inline-flex h-9 items-center rounded-full px-4 font-sans text-sm font-medium transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70 ${
                      active
                        ? "bg-spore text-ink shadow-[0_0_18px_rgba(200,240,74,0.28)]"
                        : "border border-line bg-transparent text-foreground"
                    }`}
                  >
                    {active ? "joined" : "join"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

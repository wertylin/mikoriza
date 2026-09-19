"use client";

import { useState } from "react";

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export function CopyPrompt({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function copy() {
    setCopied(true);
    await writeClipboard(prompt);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative mx-auto w-full max-w-[40rem]">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-spore/10 blur-3xl" />
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-panel/70 text-left shadow-[0_0_0_1px_rgba(200,240,74,0.06),0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {open ? (
          <div className="relative">
            <pre className="max-h-[min(14rem,30vh)] overflow-y-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-[12.5px] leading-5 text-muted sm:px-6 sm:text-[13px] sm:leading-[1.55]">
              {prompt}
            </pre>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-panel to-transparent" />
          </div>
        ) : null}
        <div
          className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-6 ${open ? "border-t border-line/80" : ""}`}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
          >
            {open ? "hide prompt" : "show prompt"}
          </button>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied. Paste it into your agent." : "Copy prompt"}
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-spore px-5 font-sans text-sm font-medium text-ink shadow-[0_0_24px_rgba(200,240,74,0.28)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
          >
            {copied ? "Paste into your agent" : "Copy prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}

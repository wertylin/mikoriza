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

export function CopyCode({
  code,
  lang = "ts",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    setCopied(true);
    await writeClipboard(code);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line/80 bg-panel/70 shadow-[0_0_0_1px_rgba(200,240,74,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-line/80 px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {filename ?? lang}
        </p>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-5 text-muted sm:px-5 sm:text-[13px] sm:leading-[1.55]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

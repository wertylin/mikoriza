"use client";

import { useState } from "react";
import Link from "next/link";
import { useMikoriza } from "@/components/mikoriza-tools-provider";
import type { AllianceData } from "@/lib/soroban-alliance";
import type { NodeManifest } from "@/lib/nodes";

const CONTRACT_ID = "CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU";
const GITHUB_REPO = "wertylin/mikoriza";

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`;
}

function formatTimestamp(ts: number): string {
  if (!ts) return "—";
  try {
    return new Date(ts * 1000).toISOString().split("T")[0];
  } catch {
    return "—";
  }
}

function MemberRow({
  address,
  isSelf,
  node,
}: {
  address: string;
  isSelf: boolean;
  node: NodeManifest | null;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 transition-colors ${
        isSelf
          ? "border-spore/55 bg-panel shadow-[0_0_24px_rgba(200,240,74,0.08)]"
          : "border-line/60 bg-panel/50"
      }`}
    >
      {/* Address row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isSelf && (
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-spore shadow-[0_0_10px_rgba(200,240,74,0.9)]" />
          )}
          <span
            className={`font-mono text-[12px] tracking-[0.08em] ${isSelf ? "text-spore" : "text-foreground/80"}`}
            title={address}
          >
            {truncateAddress(address)}
          </span>
          {isSelf && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-spore">
              you
            </span>
          )}
        </div>
        <a
          href={`https://stellar.expert/explorer/testnet/account/${address}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
        >
          explorer ↗
        </a>
      </div>

      {/* Node manifest */}
      {node ? (
        <div className="rounded-lg border border-spore/20 bg-background/40 px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] text-spore">{node.app}</span>
            <a
              href={node.repo}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              repo ↗
            </a>
            <a
              href={node.origin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              origin ↗
            </a>
          </div>
          {node.capabilities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {node.capabilities.map((cap) => (
                <span
                  key={cap.name}
                  title={cap.description}
                  className="inline-block rounded border border-spore/25 bg-spore/5 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-spore/80"
                >
                  {cap.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/50">
          no project registered yet
        </p>
      )}
    </div>
  );
}

function RegisterPanel({ allianceId }: { allianceId: string }) {
  const [app, setApp] = useState("");
  const [repo, setRepo] = useState("");
  const [origin, setOrigin] = useState("");
  const [capName, setCapName] = useState("");
  const [capDesc, setCapDesc] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const memberPlaceholder = "<YOUR_G_ADDRESS>";
  const manifest: NodeManifest = {
    protocol: "mikoriza/0.1-mock",
    alliance: allianceId,
    member: memberPlaceholder,
    app: app || "<app name>",
    repo: repo || "https://github.com/owner/repo",
    origin: origin || "https://app.example.com",
    capabilities: [
      {
        name: capName || "my_tool",
        description: capDesc || "What this tool does",
        readOnly: true,
      },
    ],
    submitted_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
  const manifestJson = JSON.stringify(manifest, null, 2);
  const targetPath = `data/nodes/${allianceId}/${memberPlaceholder}.json`;
  const folderUrl = `https://github.com/${GITHUB_REPO}/tree/main/data/nodes/${allianceId}`;

  function copyManifest() {
    void navigator.clipboard.writeText(manifestJson).catch(() => {
      const el = document.createElement("textarea");
      el.value = manifestJson;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-10 rounded-2xl border border-spore/30 bg-panel/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-spore">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_10px_rgba(200,240,74,0.9)]" />
          register your project
        </span>
        <span className="font-mono text-[10px] text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-spore/20 px-4 pb-5 pt-4">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            fill in the fields → copy the manifest → open a PR
          </p>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                app name
              </span>
              <input
                type="text"
                value={app}
                onChange={(e) => setApp(e.target.value)}
                placeholder="Demo Node"
                className="rounded-lg border border-line/80 bg-background/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted/40 focus:border-spore/50 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                capability name
              </span>
              <input
                type="text"
                value={capName}
                onChange={(e) => setCapName(e.target.value)}
                placeholder="quote_swap"
                className="rounded-lg border border-line/80 bg-background/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted/40 focus:border-spore/50 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                repo url
              </span>
              <input
                type="url"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="rounded-lg border border-line/80 bg-background/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted/40 focus:border-spore/50 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                origin url
              </span>
              <input
                type="url"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="https://app.example.com"
                className="rounded-lg border border-line/80 bg-background/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted/40 focus:border-spore/50 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                capability description
              </span>
              <input
                type="text"
                value={capDesc}
                onChange={(e) => setCapDesc(e.target.value)}
                placeholder="What this tool does for an agent"
                className="rounded-lg border border-line/80 bg-background/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted/40 focus:border-spore/50 focus:outline-none"
              />
            </label>
          </div>

          {/* Manifest preview */}
          <div className="relative mb-4 overflow-hidden rounded-xl border border-line/80 bg-background/80">
            <div className="flex items-center justify-between border-b border-line/80 px-3 py-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                manifest.json
              </span>
              <button
                type="button"
                onClick={copyManifest}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-spore focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
              >
                {copied ? "copied ✓" : "copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-5 text-foreground/80">
              {manifestJson}
            </pre>
          </div>

          {/* PR instructions */}
          <div className="rounded-xl border border-line/60 bg-background/40 px-3 py-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              pr instructions
            </p>
            <ol className="flex flex-col gap-1.5 font-mono text-[11px] leading-5 text-foreground/70">
              <li>
                1. Replace{" "}
                <code className="text-spore/90">{memberPlaceholder}</code> in the
                manifest with your G-address
              </li>
              <li>
                2. Target path:{" "}
                <code className="break-all text-spore/90">{targetPath}</code>
              </li>
              <li>
                3. PR title:{" "}
                <code className="text-spore/90">
                  node: {app || "<app name>"} ({allianceId})
                </code>
              </li>
              <li>
                4. Fork the repo, create the file, open the PR
              </li>
            </ol>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={folderUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-spore transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
              >
                view folder on github ↗
              </a>
              <a
                href={`https://github.com/${GITHUB_REPO}/fork`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
              >
                fork repo ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AllianceDetail({
  data,
  error,
  nodes,
}: {
  data: AllianceData | null;
  error: string | null;
  nodes: NodeManifest[];
}) {
  const { selected } = useMikoriza();

  const visitorJoinedThis = data && selected === data.id;

  // Build address → manifest lookup
  const nodeByAddress = new Map<string, NodeManifest>(
    nodes.map((n) => [n.member, n]),
  );

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          error
        </p>
        <p className="font-mono text-sm text-foreground/70">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_12px_rgba(200,240,74,0.85)]" />
          alliance
        </p>
        <h1 className="font-serif text-5xl tracking-tight text-foreground [text-shadow:0_0_42px_rgba(200,240,74,0.14)] sm:text-6xl">
          {data.name || data.id}
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {data.id}
        </p>
      </div>

      {/* Meta grid */}
      <div className="mb-8 grid gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/30">
        <MetaRow label="protocol" value={data.protocol} />
        <MetaRow
          label="created by"
          value={truncateAddress(data.created_by)}
          title={data.created_by}
          href={
            data.created_by
              ? `https://stellar.expert/explorer/testnet/account/${data.created_by}`
              : undefined
          }
        />
        <MetaRow label="created" value={formatTimestamp(data.created_at)} />
      </div>

      {/* Contract info */}
      <div className="mb-8 rounded-2xl border border-line/60 bg-panel/60 p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          contract
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <code className="break-all font-mono text-[11px] tracking-[0.05em] text-foreground/70">
            {CONTRACT_ID}
          </code>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-spore focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
          >
            lab ↗
          </a>
          <CopyButton value={CONTRACT_ID} />
        </div>
      </div>

      {/* Your membership banner */}
      {visitorJoinedThis && (
        <div className="mb-8 rounded-2xl border border-spore/40 bg-panel/70 px-4 py-3 shadow-[0_0_24px_rgba(200,240,74,0.08)]">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-spore">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_10px_rgba(200,240,74,0.9)]" />
            you are joined to this alliance
          </p>
        </div>
      )}

      {/* Members */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          members{" "}
          <span className="text-foreground/40">({data.members.length})</span>
        </p>
        {data.members.length === 0 ? (
          <p className="font-mono text-sm text-muted">No members yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.members.map((addr) => (
              <MemberRow
                key={addr}
                address={addr}
                isSelf={false}
                node={nodeByAddress.get(addr) ?? null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Register panel */}
      <RegisterPanel allianceId={data.id} />
    </div>
  );
}

function MetaRow({
  label,
  value,
  title,
  href,
}: {
  label: string;
  value: string;
  title?: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-panel/50 px-4 py-3">
      <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          title={title}
          className="min-w-0 break-all font-mono text-[12px] tracking-[0.06em] text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
        >
          {value}
        </a>
      ) : (
        <span
          title={title}
          className="min-w-0 break-all font-mono text-[12px] tracking-[0.06em] text-foreground/80"
        >
          {value}
        </span>
      )}
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-spore focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
      onClick={() => {
        void navigator.clipboard.writeText(value).catch(() => {
          const el = document.createElement("textarea");
          el.value = value;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        });
      }}
    >
      copy
    </button>
  );
}

// Re-export Link so the page can use it without importing both
export { Link };

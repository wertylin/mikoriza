"use client";

import Link from "next/link";
import { useMikoriza } from "@/components/mikoriza-tools-provider";
import type { AllianceData } from "@/lib/soroban-alliance";

const CONTRACT_ID = "CBQ7EUAUUZLKUD2VAMQHPIIMYRLZQI4UFAGFNUTB6LXOXXDATZ7OH4OU";

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
}: {
  address: string;
  isSelf: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
        isSelf
          ? "border-spore/55 bg-panel shadow-[0_0_24px_rgba(200,240,74,0.08)]"
          : "border-line/60 bg-panel/50"
      }`}
    >
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
  );
}

export function AllianceDetail({
  data,
  error,
}: {
  data: AllianceData | null;
  error: string | null;
}) {
  const { selected } = useMikoriza();

  // The visitor is considered a member if the alliance they joined (via WebMCP)
  // matches this page's alliance id and their address appears in the member list.
  // Since we don't have wallet connectivity here, we use a best-effort heuristic:
  // highlight membership if they joined this alliance via the tool.
  const visitorJoinedThis = data && selected === data.id;

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
      <div className="mb-8 grid gap-px rounded-2xl border border-line/60 bg-line/30 overflow-hidden">
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
              <MemberRow key={addr} address={addr} isSelf={false} />
            ))}
          </div>
        )}
      </div>
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

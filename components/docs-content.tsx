import Link from "next/link";
import { CopyCode } from "@/components/copy-code";
import { DocsShell } from "@/components/docs-nav";
import {
  BUILD_RULES,
  HANDSHAKE_SNIPPET,
  LIVE_ALLIANCES,
  MIKORIZA_TOOLS,
  PROTOCOL_VERSION,
  RAVEN_SNIPPET,
  REGISTER_SNIPPET,
  REQUIRED_TOOLS,
  TOOL_SHAPE_SNIPPET,
} from "@/lib/docs";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_12px_rgba(200,240,74,0.85)]" />
      {children}
    </p>
  );
}

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line/80 pt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-spore">
        {num}
      </p>
      <h2 className="mt-2 font-serif text-4xl tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 flex flex-col gap-5 text-[15px] leading-7 text-muted">
        {children}
      </div>
    </section>
  );
}

export function DocsContent() {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,rgba(200,240,74,0.06)_0%,transparent_42%),radial-gradient(ellipse_at_center,rgba(9,10,8,0.2)_0%,rgba(9,10,8,0.55)_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 z-[2]" />

      <header className="sticky top-0 z-30 border-b border-line/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-serif text-xl tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
          >
            mikoriza
          </Link>
          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="text-spore">docs</span>
            <Link
              href="/"
              className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
            >
              join
            </Link>
          </div>
        </div>
      </header>

      <DocsShell>
          <article className="min-w-0 flex-1">
          <header className="mb-14 max-w-2xl">
            <Kicker>{PROTOCOL_VERSION}</Kicker>
            <h1 className="font-serif text-5xl tracking-tight text-foreground [text-shadow:0_0_42px_rgba(200,240,74,0.18)] sm:text-6xl">
              The mycelium spec
            </h1>
            <p className="mt-5 text-lg leading-7 text-muted">
              Mikoriza turns Stellar apps into a shared capability pool. Alliance
              is not a slogan. If the app only has a UI, it is not in the
              mycelium. If the app exposes WebMCP tools, it is a node.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              v0 mock · treat as live
            </p>
          </header>

          <div className="flex max-w-3xl flex-col gap-16">
            <Section id="overview" num="00" title="Overview">
              <p>
                Other agents call the node. That is the whole protocol. Humans
                keep the page. Agents get the tools. Same session, same state,
                same chain actions.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line/80 bg-panel/70 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    not a node
                  </p>
                  <p className="mt-2 text-foreground">
                    Landing page. Chat wrapper. DOM scrape. A button with no
                    verb behind it.
                  </p>
                </div>
                <div className="rounded-2xl border border-spore/40 bg-panel/70 p-4 shadow-[0_0_0_1px_rgba(200,240,74,0.12)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-spore">
                    a node
                  </p>
                  <p className="mt-2 text-foreground">
                    Live origin. WebMCP tools.{" "}
                    <code className="font-mono text-[13px] text-spore">
                      describe_node
                    </code>{" "}
                    returns the handshake. Domain verbs actually hit the chain.
                  </p>
                </div>
              </div>
              <ol className="flex flex-col gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                <li>1 · join a live alliance</li>
                <li>2 · enter the check-in code</li>
                <li>3 · copy the builder prompt</li>
                <li>4 · graft the app you ship</li>
              </ol>
            </Section>

            <Section id="protocol" num="01" title="Protocol">
              <p>
                Current version is{" "}
                <code className="font-mono text-[13px] text-spore">
                  {PROTOCOL_VERSION}
                </code>
                . The network is mocked. The graft is local. Follow it as if it
                were already live.
              </p>
              <div className="overflow-hidden rounded-2xl border border-line/80">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-line/80">
                    <tr>
                      <th className="w-36 bg-panel/50 px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
                        version
                      </th>
                      <td className="px-4 py-3 font-mono text-[13px] text-foreground">
                        {PROTOCOL_VERSION}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-panel/50 px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
                        transport
                      </th>
                      <td className="px-4 py-3 text-foreground">
                        WebMCP in the page. No backend MCP server for page
                        actions — the page is the server.
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-panel/50 px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
                        alliance
                      </th>
                      <td className="px-4 py-3 font-mono text-[13px] text-foreground">
                        istanbul-2026 | organizma
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-panel/50 px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
                        identity
                      </th>
                      <td className="px-4 py-3 text-foreground">
                        HTTPS origin + stable tool names + handshake JSON
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Required tools on every mikoriza node, plus the domain tools of
                whatever you actually built:
              </p>
              <ul className="flex flex-col gap-3">
                {REQUIRED_TOOLS.map((tool) => (
                  <li
                    key={tool.name}
                    className="rounded-2xl border border-line/80 bg-panel/70 p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <code className="font-mono text-[13px] text-spore">
                        {tool.name}
                      </code>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {tool.role}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{tool.blurb}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="webmcp" num="02" title="WebMCP">
              <p>
                On every live page of the app, register tools against{" "}
                <code className="font-mono text-[13px] text-spore">
                  document.modelContext
                </code>{" "}
                or{" "}
                <code className="font-mono text-[13px] text-spore">
                  navigator.modelContext
                </code>
                . Feature-detect. Do not assume the flag is on.
              </p>
              <CopyCode code={REGISTER_SNIPPET} lang="ts" filename="registerTool" />
              <p>
                <code className="font-mono text-[13px] text-spore">execute</code>{" "}
                runs in-page and uses the user&apos;s session. Return structured
                JSON or{" "}
                <code className="font-mono text-[13px] text-foreground">
                  {"{ content: [{ type: \"text\", text }] }"}
                </code>
                . Fail loud — return an error object, do not throw into the void.
              </p>
              <p>
                Pass{" "}
                <code className="font-mono text-[13px] text-spore">
                  AbortSignal
                </code>{" "}
                so the tools drop on unmount. Keep names stable across reloads.
              </p>
            </Section>

            <Section id="capabilities" num="03" title="Capabilities">
              <p>
                Each tool is a verb the app can actually perform. Never a CSS
                class. Never a screenshot of a button.
              </p>
              <CopyCode
                code={TOOL_SHAPE_SNIPPET}
                lang="ts"
                filename="capability"
              />
              <div className="overflow-hidden rounded-2xl border border-line/80">
                <table className="w-full text-left text-sm">
                  <thead className="bg-panel/50 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    <tr>
                      <th className="px-4 py-3 font-normal">field</th>
                      <th className="px-4 py-3 font-normal">rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/80">
                    <tr>
                      <td className="px-4 py-3 font-mono text-[13px] text-spore">
                        name
                      </td>
                      <td className="px-4 py-3">
                        Stable snake_case verb: quote_swap, send_payment,
                        mint_subtoken.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-[13px] text-spore">
                        description
                      </td>
                      <td className="px-4 py-3">
                        What an agent can do. Not what the button looks like.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-[13px] text-spore">
                        inputSchema
                      </td>
                      <td className="px-4 py-3">
                        JSON Schema. Required fields listed. No mystery bags.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-[13px] text-spore">
                        annotations
                      </td>
                      <td className="px-4 py-3">
                        readOnlyHint, destructiveHint, idempotentHint,
                        openWorldHint.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-[13px] text-spore">
                        execute
                      </td>
                      <td className="px-4 py-3">
                        Call the same logic the UI uses. Same session, same
                        chain.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="handshake" num="04" title="Handshake">
              <p>
                Until the network exists, the graft is local.{" "}
                <code className="font-mono text-[13px] text-spore">
                  describe_node
                </code>{" "}
                returns this payload. If twenty teams at a hackathon do that, we
                do not have twenty demos. We have one Stellar capability pool
                with twenty hyphae.
              </p>
              <CopyCode
                code={HANDSHAKE_SNIPPET}
                lang="json"
                filename="describe_node"
              />
            </Section>

            <Section id="alliances" num="05" title="Alliances">
              <p>
                An alliance is a live mycelium you graft onto. Joining one locks
                the builder prompt until the check-in code is entered. Switching
                alliances relocks it.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {LIVE_ALLIANCES.map((a) => (
                  <a
                    key={a.id}
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col rounded-2xl border border-line/80 bg-panel/70 p-4 transition-colors hover:border-spore/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {a.kicker}
                    </span>
                    <span className="mt-1 font-serif text-[1.7rem] leading-8 text-foreground">
                      {a.title}
                    </span>
                    <span className="mt-2 text-sm leading-5">{a.blurb}</span>
                    <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      id · {a.id}
                    </span>
                    <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {a.meta}
                    </span>
                  </a>
                ))}
              </div>
              <p>
                <code className="font-mono text-[13px] text-spore">
                  describe_node.alliance
                </code>{" "}
                must be the joined id. Istanbul grafts onto this weekend&apos;s
                event. Organizma is treated as a live capability node, not a
                landing page.
              </p>
            </Section>

            <Section id="this-node" num="06" title="This node">
              <p>
                mikoriza itself is a node. The landing page registers four
                WebMCP tools on mount, using refs so join/unlock state is live
                without re-registering. Tools abort on unmount.
              </p>
              <ul className="flex flex-col gap-3">
                {MIKORIZA_TOOLS.map((tool) => (
                  <li
                    key={tool.name}
                    className="rounded-2xl border border-line/80 bg-panel/70 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <code className="font-mono text-[13px] text-spore">
                        {tool.name}
                      </code>
                      {tool.hints.length > 0 ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                          {tool.hints.join(" · ")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6">{tool.blurb}</p>
                    <p className="mt-3 font-mono text-[11px] leading-5 text-muted">
                      in {tool.input}
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-5 text-muted">
                      out {tool.returns}
                    </p>
                  </li>
                ))}
              </ul>
              <p>
                The unlocked prompt is{" "}
                <code className="font-mono text-[13px] text-foreground">
                  PROMPT + alliance context
                </code>
                . Agents can drive the same join → unlock → copy loop the UI
                exposes.
              </p>
            </Section>

            <Section id="graft" num="07" title="Graft">
              <p>
                Ship a real Stellar integration, then expose it. Whatever we
                build must be callable by another agent on the same machine, in
                the same tab, without DOM scraping.
              </p>
              <ol className="flex flex-col gap-3">
                {BUILD_RULES.map((rule, i) => (
                  <li key={rule} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-[11px] text-spore">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="raven" num="08" title="Raven">
              <p>
                Use Stellar Raven MCP for every Stellar protocol, ecosystem,
                funding, SDK, or API fact. Do not guess. Tools:{" "}
                <code className="font-mono text-[13px] text-spore">search</code>
                ,{" "}
                <code className="font-mono text-[13px] text-spore">execute</code>
                .
              </p>
              <CopyCode
                code={RAVEN_SNIPPET}
                lang="json"
                filename="~/.cursor/mcp.json"
              />
              <p>
                Endpoint:{" "}
                <a
                  href="https://raven.stellar.org/mcp"
                  className="font-mono text-[13px] text-spore underline decoration-line underline-offset-4 transition-colors hover:text-foreground"
                >
                  https://raven.stellar.org/mcp
                </a>
                . Classify the claim, search the right family (stellarDocs /
                scout / lumenloop / skills), never guess operation ids, write
                one execute script, read payloads under{" "}
                <code className="font-mono text-[13px] text-foreground">
                  .data
                </code>
                , treat soft-empty as inconclusive.
              </p>
            </Section>
          </div>
          </article>
      </DocsShell>
    </div>
  );
}

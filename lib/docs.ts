import { ALLIANCES } from "@/lib/alliances";
import { PROTOCOL_VERSION } from "@/lib/prompt";

export const DOC_SECTIONS = [
  { id: "overview", num: "00", label: "Overview" },
  { id: "protocol", num: "01", label: "Protocol" },
  { id: "webmcp", num: "02", label: "WebMCP" },
  { id: "capabilities", num: "03", label: "Capabilities" },
  { id: "handshake", num: "04", label: "Handshake" },
  { id: "alliances", num: "05", label: "Alliances" },
  { id: "this-node", num: "06", label: "This node" },
  { id: "graft", num: "07", label: "Graft" },
  { id: "raven", num: "08", label: "Raven" },
] as const;

export const REQUIRED_TOOLS = [
  {
    name: "describe_node",
    role: "identity",
    blurb:
      "App name, one-line purpose, alliance id, origin, protocol version. Returns the mycelium handshake.",
  },
  {
    name: "list_capabilities",
    role: "index",
    blurb:
      "Names + descriptions of tools this page currently exposes. The pool reads this, not the DOM.",
  },
] as const;

export const MIKORIZA_TOOLS = [
  {
    name: "list_alliances",
    hints: ["readOnlyHint", "idempotentHint"],
    input: "{ }",
    blurb:
      "List live alliances a builder can join. Includes join/unlock state of this tab.",
    returns:
      "{ protocol, selected, unlocked, alliances: [{ id, name, kicker, blurb, meta, href, live, joined }] }",
  },
  {
    name: "join_alliance",
    hints: [],
    input: '{ id: "istanbul-2026" | "organizma" }',
    blurb:
      "Join an alliance. Selecting a different alliance relocks the prompt. Unknown ids fail loud.",
    returns:
      '{ joined: { id, name }, next: "Call unlock_prompt with the alliance code…" }',
  },
  {
    name: "unlock_prompt",
    hints: [],
    input: "{ code: string }",
    blurb:
      "Code is issued at check-in. Wrong code leaves the prompt locked. No alliance → fail closed.",
    returns: "{ unlocked, alliance, protocol, prompt }",
  },
  {
    name: "get_mikoriza_prompt",
    hints: ["readOnlyHint", "idempotentHint"],
    input: "{ }",
    blurb:
      "Return the unlocked builder prompt for the joined alliance. Fails closed if still locked.",
    returns: "prompt string, or a lock/join error",
  },
] as const;

export const BUILD_RULES = [
  "Ship a real Stellar integration, then expose it. A tool with no chain behind it is copy, not capability.",
  "Prefer read tools first (quote, balance, lookup), then writes (sign, submit, mint). Mark writes with destructiveHint.",
  "Keep tool names stable across reloads. The pool cannot grow if every refresh renames the verbs.",
  "If WebMCP is missing in the browser, still write the tools behind a helper so they light up when the flag is on.",
  "Feature-detect. HTTPS. Pass AbortSignal so tools drop on unmount.",
  "Do not wrap the app in a chatbot. Do not replace the UI. Humans keep the page. Agents get the tools.",
] as const;

export const REGISTER_SNIPPET = `const ctx = document.modelContext ?? navigator.modelContext
if (ctx?.registerTool) {
  await ctx.registerTool({
    name,
    description,
    inputSchema,   // JSON Schema
    annotations,   // readOnlyHint / destructiveHint
    execute,       // in-page, same session as the UI
  }, { signal })
}`;

export const HANDSHAKE_SNIPPET = `{
  "protocol": "${PROTOCOL_VERSION}",
  "alliance": "<istanbul-2026 | organizma>",
  "app": "<what we shipped>",
  "origin": "<https origin of the live UI>",
  "tools": ["describe_node", "list_capabilities", "..."]
}`;

export const RAVEN_SNIPPET = `{
  "mcpServers": {
    "stellar-raven": {
      "url": "https://raven.stellar.org/mcp"
    }
  }
}`;

export const TOOL_SHAPE_SNIPPET = `{
  name: "quote_swap",           // stable snake_case verb
  description: "Quote a swap",  // what an agent can DO
  inputSchema: {
    type: "object",
    properties: { /* typed fields */ },
    required: [/* no mystery bags */]
  },
  annotations: { readOnlyHint: true },
  execute: async (input) => {
    // same logic the UI uses
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  }
}`;

export const LIVE_ALLIANCES = ALLIANCES;
export { PROTOCOL_VERSION };

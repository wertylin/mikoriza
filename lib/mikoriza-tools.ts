// Shared metadata for all WebMCP tools exposed by mikoriza.
// Registered once via MikorizaToolsProvider in app/layout.tsx.
export const TOOL_DEFS: { name: string; description: string }[] = [
  {
    name: "list_alliances",
    description:
      "List live mikoriza alliances a hackathon builder can join right now.",
  },
  {
    name: "join_alliance",
    description:
      "Join a live mikoriza alliance. Locks the builder prompt until the alliance code is entered. Pass id: istanbul-2026 or organizma.",
  },
  {
    name: "unlock_prompt",
    description:
      "Unlock the mikoriza builder prompt. Code is issued at check-in.",
  },
  {
    name: "get_mikoriza_prompt",
    description:
      "Return the unlocked mikoriza builder prompt for the joined alliance. Fails closed if still locked.",
  },
  {
    name: "describe_node",
    description:
      "Return the mycelium handshake JSON for this node: protocol, alliance, app, origin, and registered tool names.",
  },
  {
    name: "list_capabilities",
    description:
      "List all tools registered on this page with their name and description.",
  },
  {
    name: "onboarding_status",
    description:
      "Read-only: derive onboarding progress from current state. Returns next recommended step, consent, member, and handshake status.",
  },
  {
    name: "open_alliance",
    description:
      "Navigate client-side to the alliance detail page /a/<id>. Returns { opened, href }.",
  },
];

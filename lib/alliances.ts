import { PROMPT, PROTOCOL_VERSION } from "@/lib/prompt";

export type AllianceId = "istanbul-2026" | "organizma";

export const UNLOCK_CODE = "1453";

export type Alliance = {
  id: AllianceId;
  name: string;
  title: string;
  kicker: string;
  blurb: string;
  meta: string;
  href: string;
};

export const ALLIANCES: Alliance[] = [
  {
    id: "istanbul-2026",
    name: "Stellar Hackathon Istanbul 2026",
    title: "Istanbul 2026",
    kicker: "Stellar Hackathon",
    blurb: "Rise In × Stellar Pro Hackathon. Graft a callable node this weekend.",
    meta: "Grand Pera · Sep 19–20",
    href: "https://www.risein.com/programs/stellar-pro-hackathon",
  },
  {
    id: "organizma",
    name: "Organizma",
    title: "Organizma",
    kicker: "Stellar",
    blurb: "Self-enforcing creator ecosystem. A live capability node.",
    meta: "organizma.co",
    href: "https://organizma.co",
  },
];

const ALLIANCE_CONTEXT: Record<AllianceId, string> = {
  "istanbul-2026": `## Alliance
istanbul-2026 — Stellar Hackathon Istanbul 2026. Rise In × Stellar Pro Hackathon, Grand Pera, Beyoğlu, Sep 19–20 2026.
Event: https://www.risein.com/programs/stellar-pro-hackathon
Protocol: ${PROTOCOL_VERSION}

You are grafting this team's app onto the Istanbul mycelium. Every WebMCP tool you register is a hypha other agents at this hackathon can call. Build for this event. describe_node.alliance must be "istanbul-2026".`,
  organizma: `## Alliance
organizma — https://organizma.co
Protocol: ${PROTOCOL_VERSION}

You are grafting this team's app onto Organizma. Treat it as a live capability node, not a landing page. describe_node.alliance must be "organizma".`,
};

export function allianceById(id: string | null | undefined) {
  return ALLIANCES.find((a) => a.id === id) ?? null;
}

export function normalizeCode(code: string) {
  return code.trim().replace(/\s+/g, "");
}

export function codeUnlocks(code: string) {
  return normalizeCode(code) === UNLOCK_CODE;
}

export function promptForAlliance(id: AllianceId | null) {
  if (!id) return PROMPT;
  return `${PROMPT}

${ALLIANCE_CONTEXT[id]}`;
}

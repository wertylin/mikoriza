"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ALLIANCES,
  allianceById,
  codeUnlocks,
  promptForAlliance,
  type AllianceId,
} from "@/lib/alliances";
import { PROTOCOL_VERSION } from "@/lib/prompt";
import { TOOL_DEFS } from "@/lib/mikoriza-tools";
import { getModelContext, toolText } from "@/lib/webmcp";

// ── Context ───────────────────────────────────────────────────────────────────

type MikorizaContextValue = {
  selected: AllianceId | null;
  unlocked: boolean;
  join: (id: AllianceId) => void;
  unlock: (code: string) => boolean;
};

export const MikorizaContext = createContext<MikorizaContextValue>({
  selected: null,
  unlocked: false,
  join: () => undefined,
  unlock: () => false,
});

export function useMikoriza() {
  return useContext(MikorizaContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function MikorizaToolsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<AllianceId | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Refs so tool execute closures always see the latest values.
  const selectedRef = useRef(selected);
  const unlockedRef = useRef(unlocked);
  selectedRef.current = selected;
  unlockedRef.current = unlocked;

  const router = useRouter();

  function join(id: AllianceId) {
    if (id === selectedRef.current) return;
    setSelected(id);
    setUnlocked(false);
  }

  function unlock(code: string): boolean {
    if (!selectedRef.current || !codeUnlocks(code)) return false;
    setUnlocked(true);
    return true;
  }

  useEffect(() => {
    const ctx = getModelContext();
    if (!ctx) return;
    const controller = new AbortController();
    const { signal } = controller;

    void Promise.all([
      // ── existing tools ────────────────────────────────────────────────────
      ctx.registerTool(
        {
          name: "list_alliances",
          description: TOOL_DEFS.find((t) => t.name === "list_alliances")!
            .description,
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true, idempotentHint: true },
          execute: () =>
            toolText(
              JSON.stringify(
                {
                  protocol: PROTOCOL_VERSION,
                  selected: selectedRef.current,
                  unlocked: unlockedRef.current,
                  alliances: ALLIANCES.map((a) => ({
                    id: a.id,
                    name: a.name,
                    kicker: a.kicker,
                    blurb: a.blurb,
                    meta: a.meta,
                    href: a.href,
                    live: true,
                    joined: selectedRef.current === a.id,
                  })),
                },
                null,
                2,
              ),
            ),
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "join_alliance",
          description: TOOL_DEFS.find((t) => t.name === "join_alliance")!
            .description,
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                enum: ALLIANCES.map((a) => a.id),
                description: "Alliance to join",
              },
            },
            required: ["id"],
          },
          execute: (input) => {
            const alliance = allianceById(String(input.id ?? ""));
            if (!alliance) {
              return toolText(
                `Unknown alliance. Valid ids: ${ALLIANCES.map((a) => a.id).join(", ")}`,
              );
            }
            join(alliance.id);
            // Auto-navigate to the alliance detail page.
            router.push(`/a/${alliance.id}`);
            return toolText(
              JSON.stringify({
                joined: { id: alliance.id, name: alliance.name },
                navigating_to: `/a/${alliance.id}`,
                next: "Call unlock_prompt with the alliance code to release the builder prompt.",
              }),
            );
          },
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "unlock_prompt",
          description: TOOL_DEFS.find((t) => t.name === "unlock_prompt")!
            .description,
          inputSchema: {
            type: "object",
            properties: {
              code: {
                type: "string",
                description: "Alliance unlock code",
              },
            },
            required: ["code"],
          },
          execute: (input) => {
            const alliance = allianceById(selectedRef.current);
            if (!alliance) {
              return toolText("Join an alliance first.");
            }
            const ok = unlock(String(input.code ?? ""));
            if (!ok) return toolText("Wrong code. Prompt stays locked.");
            return toolText(
              JSON.stringify({
                unlocked: true,
                alliance: alliance.id,
                protocol: PROTOCOL_VERSION,
                prompt: promptForAlliance(alliance.id),
              }),
            );
          },
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "get_mikoriza_prompt",
          description: TOOL_DEFS.find((t) => t.name === "get_mikoriza_prompt")!
            .description,
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true, idempotentHint: true },
          execute: () => {
            if (!selectedRef.current) return toolText("Join an alliance first.");
            if (!unlockedRef.current) {
              return toolText(
                "Prompt is locked. Call unlock_prompt with the alliance code.",
              );
            }
            return toolText(promptForAlliance(selectedRef.current));
          },
        },
        { signal },
      ),

      // ── new tools ─────────────────────────────────────────────────────────
      ctx.registerTool(
        {
          name: "describe_node",
          description: TOOL_DEFS.find((t) => t.name === "describe_node")!
            .description,
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true, idempotentHint: true },
          execute: () =>
            toolText(
              JSON.stringify({
                protocol: PROTOCOL_VERSION,
                alliance: selectedRef.current,
                app: "mikoriza",
                origin:
                  typeof location !== "undefined" ? location.origin : null,
                tools: TOOL_DEFS.map((t) => t.name),
              }),
            ),
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "list_capabilities",
          description: TOOL_DEFS.find((t) => t.name === "list_capabilities")!
            .description,
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true, idempotentHint: true },
          execute: () =>
            toolText(JSON.stringify(TOOL_DEFS, null, 2)),
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "onboarding_status",
          description: TOOL_DEFS.find((t) => t.name === "onboarding_status")!
            .description,
          inputSchema: { type: "object", properties: {} },
          annotations: { readOnlyHint: true, idempotentHint: true },
          execute: () => {
            const s = selectedRef.current;
            const u = unlockedRef.current;
            const next = !s
              ? "call join_alliance with an alliance id"
              : !u
                ? "call unlock_prompt with the alliance code"
                : "call get_mikoriza_prompt to retrieve the builder prompt";
            return toolText(
              JSON.stringify({
                next,
                consent: !!s,
                member: u,
                handshake: !!(s && u),
              }),
            );
          },
        },
        { signal },
      ),

      ctx.registerTool(
        {
          name: "open_alliance",
          description: TOOL_DEFS.find((t) => t.name === "open_alliance")!
            .description,
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Alliance id to open",
              },
            },
            required: ["id"],
          },
          execute: (input) => {
            const id = String(input.id ?? "");
            const href = `/a/${id}`;
            router.push(href);
            return toolText(JSON.stringify({ opened: id, href }));
          },
        },
        { signal },
      ),
    ]).catch((error: unknown) => {
      if (signal.aborted) return;
      throw error;
    });

    return () => controller.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MikorizaContext.Provider value={{ selected, unlocked, join, unlock }}>
      {children}
    </MikorizaContext.Provider>
  );
}

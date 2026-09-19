"use client";

import { useEffect, useRef, useState } from "react";
import { Alliances } from "@/components/alliances";
import { CopyPrompt } from "@/components/copy-prompt";
import {
  ALLIANCES,
  allianceById,
  codeUnlocks,
  promptForAlliance,
  type AllianceId,
} from "@/lib/alliances";
import { PROTOCOL_VERSION } from "@/lib/prompt";
import { getModelContext, toolText } from "@/lib/webmcp";

export function MikorizaActions() {
  const [selected, setSelected] = useState<AllianceId | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const selectedRef = useRef(selected);
  const unlockedRef = useRef(unlocked);
  selectedRef.current = selected;
  unlockedRef.current = unlocked;

  function join(id: AllianceId) {
    if (id === selectedRef.current) return;
    setSelected(id);
    setUnlocked(false);
  }

  function unlock(code: string) {
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
      ctx.registerTool(
        {
          name: "list_alliances",
          description:
            "List live mikoriza alliances a hackathon builder can join right now.",
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
          description:
            "Join a live mikoriza alliance. Locks the builder prompt until the alliance code is entered. Pass id: istanbul-2026 or organizma.",
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
            return toolText(
              JSON.stringify({
                joined: { id: alliance.id, name: alliance.name },
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
          description:
            "Unlock the mikoriza builder prompt. Code is issued at check-in.",
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
          description:
            "Return the unlocked mikoriza builder prompt for the joined alliance. Fails closed if still locked.",
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
    ]);

    return () => controller.abort();
  }, []);

  return (
    <div className="mt-8 flex w-full flex-col gap-7">
      <Alliances
        alliances={ALLIANCES}
        selected={selected}
        unlocked={unlocked}
        onSelect={join}
        onUnlock={unlock}
      />
      {unlocked ? (
        <CopyPrompt prompt={promptForAlliance(selected)} />
      ) : null}
    </div>
  );
}

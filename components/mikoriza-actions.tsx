"use client";

import { useMikoriza } from "@/components/mikoriza-tools-provider";
import { Alliances } from "@/components/alliances";
import { CopyPrompt } from "@/components/copy-prompt";
import { ALLIANCES, promptForAlliance } from "@/lib/alliances";

export function MikorizaActions() {
  const { selected, unlocked, join, unlock } = useMikoriza();

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

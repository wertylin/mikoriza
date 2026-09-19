export type NodeManifest = {
  protocol: string;
  alliance: string;
  member: string;
  app: string;
  repo: string;
  origin: string;
  capabilities: { name: string; description: string; readOnly?: boolean }[];
  submitted_at: string;
};

type GHFile = {
  name: string;
  download_url: string | null;
  type: string;
};

const GITHUB_REPO = "wertylin/mikoriza";

export async function fetchNodesForAlliance(
  alliance: string,
): Promise<NodeManifest[]> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/data/nodes/${alliance}`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    },
  );

  if (res.status === 404) return [];

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const files: GHFile[] = (await res.json()) as GHFile[];
  const jsonFiles = files.filter(
    (f) => f.type === "file" && f.name.endsWith(".json"),
  );

  const results = await Promise.all(
    jsonFiles.map(async (f) => {
      if (!f.download_url) return null;
      try {
        const r = await fetch(f.download_url, { next: { revalidate: 60 } });
        if (!r.ok) return null;
        return (await r.json()) as NodeManifest;
      } catch {
        return null;
      }
    }),
  );

  return results.filter((n): n is NodeManifest => n !== null);
}

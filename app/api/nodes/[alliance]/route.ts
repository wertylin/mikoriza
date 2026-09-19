import type { NextRequest } from "next/server";
import { fetchNodesForAlliance } from "@/lib/nodes";

export const revalidate = 60;

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/nodes/[alliance]">,
) {
  const { alliance } = await ctx.params;

  try {
    const nodes = await fetchNodesForAlliance(alliance);
    return Response.json({ alliance, nodes });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 502 });
  }
}

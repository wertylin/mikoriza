import type { NextRequest } from "next/server";
import { fetchAllianceData } from "@/lib/soroban-alliance";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/alliance/[id]">,
) {
  const { id } = await ctx.params;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "Missing alliance id" }, { status: 400 });
  }

  try {
    const data = await fetchAllianceData(id);
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const notFound =
      message.toLowerCase().includes("not found") ||
      message.toLowerCase().includes("alliance not found");
    return Response.json({ error: message }, { status: notFound ? 404 : 500 });
  }
}

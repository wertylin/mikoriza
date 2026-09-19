import type { Metadata } from "next";
import { DocsContent } from "@/components/docs-content";

export const metadata: Metadata = {
  title: "docs",
  description:
    "Mikoriza protocol spec: WebMCP nodes, mycelium handshake, alliances, and how to graft a Stellar app into the capability pool.",
};

export default function DocsPage() {
  return <DocsContent />;
}

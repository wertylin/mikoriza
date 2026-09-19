import type { Metadata } from "next";
import Link from "next/link";
import { AllianceDetail } from "@/components/alliance-detail";
import { fetchAllianceData } from "@/lib/soroban-alliance";
import type { AllianceData } from "@/lib/soroban-alliance";

export async function generateMetadata(
  props: PageProps<"/a/[alliance]">,
): Promise<Metadata> {
  const { alliance } = await props.params;
  return { title: alliance };
}

export default async function AlliancePage(props: PageProps<"/a/[alliance]">) {
  const { alliance } = await props.params;

  let data: AllianceData | null = null;
  let error: string | null = null;

  try {
    data = await fetchAllianceData(alliance);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-background">
      {/* Top nav */}
      <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
        >
          ← mikoriza
        </Link>
        <Link
          href="/docs"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70"
        >
          docs
        </Link>
      </nav>

      {/* Grain overlay */}
      <div className="grain pointer-events-none absolute inset-0 z-[2]" />

      <main className="relative z-10 pt-20">
        <AllianceDetail data={data} error={error} />
      </main>
    </div>
  );
}

import Link from "next/link";
import { MikorizaActions } from "@/components/mikoriza-actions";
import { Mycelium } from "@/components/mycelium";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden">
      <Mycelium />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(9,10,8,0.28)_0%,rgba(9,10,8,0.08)_40%,rgba(9,10,8,0.55)_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 z-[2]" />
      <Link
        href="/docs"
        className="absolute right-5 top-5 z-20 font-mono text-[11px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spore/70 sm:right-8 sm:top-7"
      >
        docs
      </Link>
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <p className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spore shadow-[0_0_12px_rgba(200,240,74,0.85)]" />
          stellar
        </p>
        <h1 className="font-serif text-6xl tracking-tight text-foreground [text-shadow:0_0_42px_rgba(200,240,74,0.18)] sm:text-7xl">
          mikoriza
        </h1>
        <p className="mt-4 max-w-lg text-center text-lg leading-7 text-muted">
          Join a live alliance. Unlock the prompt. Your agent exposes the app
          as a Stellar capability.
        </p>
        <MikorizaActions />
        <ol className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <li>1 join</li>
          <li>2 enter code</li>
          <li>3 copy</li>
          <li>4 give it to your agent</li>
        </ol>
      </main>
    </div>
  );
}

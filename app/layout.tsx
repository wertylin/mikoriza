import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Outfit } from "next/font/google";
import { MikorizaToolsProvider } from "@/components/mikoriza-tools-provider";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "mikoriza",
    template: "%s — mikoriza",
  },
  description:
    "Join a live alliance. Unlock the prompt. Turn Stellar apps into callable capabilities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <MikorizaToolsProvider>{children}</MikorizaToolsProvider>
      </body>
    </html>
  );
}

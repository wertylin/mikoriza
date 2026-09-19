"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MyceliumScene = dynamic(
  () => import("./mycelium-scene").then((m) => m.MyceliumScene),
  { ssr: false },
);

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

function MyceliumSvg() {
  return (
    <svg
      aria-hidden="true"
      className="mycelium pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="hypha hypha-a" d="M600 780 C590 640 520 560 380 500 C240 440 180 320 140 180" />
        <path className="hypha hypha-b" d="M600 780 C610 650 680 570 820 510 C960 450 1040 340 1080 190" />
        <path className="hypha hypha-c" d="M380 500 C340 430 280 400 160 360" />
        <path className="hypha hypha-d" d="M380 500 C430 430 470 360 490 240" />
        <path className="hypha hypha-e" d="M820 510 C860 430 920 400 1040 350" />
        <path className="hypha hypha-f" d="M820 510 C770 430 730 350 710 220" />
        <path className="hypha hypha-g" d="M600 780 C598 620 560 480 600 320 C640 160 620 80 600 20" />
        <path className="hypha hypha-h" d="M490 240 C520 180 560 140 600 120" />
        <path className="hypha hypha-i" d="M710 220 C680 170 640 140 600 120" />
        <path className="hypha hypha-j" d="M140 180 C110 120 90 80 70 40" />
        <path className="hypha hypha-k" d="M1080 190 C1110 130 1130 80 1150 40" />
        <path className="hypha hypha-l" d="M160 360 C90 340 50 300 20 240" />
        <path className="hypha hypha-m" d="M1040 350 C1110 330 1150 290 1180 230" />
      </g>
      <g fill="currentColor">
        <circle className="spore spore-a" cx="600" cy="780" r="3.2" />
        <circle className="spore spore-b" cx="380" cy="500" r="2.4" />
        <circle className="spore spore-c" cx="820" cy="510" r="2.4" />
        <circle className="spore spore-d" cx="600" cy="320" r="2.1" />
        <circle className="spore spore-e" cx="490" cy="240" r="1.8" />
        <circle className="spore spore-f" cx="710" cy="220" r="1.8" />
        <circle className="spore spore-g" cx="140" cy="180" r="1.6" />
        <circle className="spore spore-h" cx="1080" cy="190" r="1.6" />
      </g>
    </svg>
  );
}

export function Mycelium() {
  const [mode, setMode] = useState<"off" | "webgl" | "svg">("off");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(reduce || !hasWebGL() ? "svg" : "webgl");
  }, []);

  if (mode === "svg") return <MyceliumSvg />;
  if (mode === "webgl") return <MyceliumScene />;
  return null;
}

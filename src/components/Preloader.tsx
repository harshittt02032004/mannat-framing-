"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const HOLD_MS = 2300; // how long the splash stays fully visible
const FADE_MS = 600;

/**
 * Brand splash shown once per session on the first page a visitor opens.
 * The logo artwork fades up over black; a gold arc spins around the ring that is part of the artwork.
 * CSS-driven and always unmounted by a timer so it can never trap the visitor.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"hidden" | "shown" | "leaving">("hidden");
  // Decided once per mount; survives React Strict Mode's double effect invocation.
  const shouldShow = useRef<boolean | null>(null);

  useEffect(() => {
    if (shouldShow.current === null) {
      let show = true;
      try {
        show = !sessionStorage.getItem("mf-preloaded");
        if (show) sessionStorage.setItem("mf-preloaded", "1");
      } catch {
        /* storage unavailable: show once */
      }
      shouldShow.current = show;
    }
    if (!shouldShow.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 900 : HOLD_MS;
    setPhase("shown");
    const leave = setTimeout(() => setPhase("leaving"), hold);
    const gone = setTimeout(() => setPhase("hidden"), hold + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black transition-[opacity,visibility] duration-[600ms] ease-spring ${
        phase === "leaving" ? "pointer-events-none invisible opacity-0" : "opacity-100"
      }`}
    >
      {/* soft gold glow behind the artwork */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[90px]" />

      {/* artwork: square, sized to the shorter side; the grain fades into the black edges via a radial mask */}
      <div className="mf-splash-art relative aspect-square w-[min(130vw,80vh,760px)] md:w-[min(92vw,92vh,760px)] [mask-image:radial-gradient(circle_at_50%_50%,#000_46%,transparent_71%)] [-webkit-mask-image:radial-gradient(circle_at_50%_50%,#000_46%,transparent_71%)]">
        <Image src="/assets/brand/splash-logo.jpg" alt="" fill priority sizes="(max-width: 768px) 92vw, 760px" className="object-cover" />
      </div>

      {/* loading ring: sits exactly over the ring in the artwork (50% / 78.5% of the square) */}
      <div className="mf-splash-ring pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(130vw,80vh,760px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(92vw,92vh,760px)]">
        <span className="absolute left-1/2 top-[78.5%] h-[10.5%] w-[10.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25" />
        <span className="mf-splash-spin absolute left-1/2 top-[78.5%] h-[10.5%] w-[10.5%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <span className="mf-splash-caption absolute bottom-7 left-0 right-0 text-center font-mono text-[11px] tracking-[3px] text-gold/70">LOADING</span>
    </div>
  );
}

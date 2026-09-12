"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HOLD_MS = 2400; // how long the splash stays fully visible
const FADE_MS = 750;

/**
 * Brand splash shown once per session on the first page a visitor opens.
 *
 * It is part of the server-rendered HTML so it is on screen before hydration (no flash of the page
 * underneath). The inline script in the root layout adds `html.mf-splash` when the session has not seen
 * it yet; CSS hides the overlay otherwise. The artwork has a true-black background so it sits seamlessly
 * on the black overlay; a gold arc spins around the ring that is part of the artwork.
 * Always unmounted by a timer so it can never trap the visitor.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"shown" | "leaving" | "hidden">("shown");

  useEffect(() => {
    if (!document.documentElement.classList.contains("mf-splash")) {
      setPhase("hidden");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 900 : HOLD_MS;
    const leave = setTimeout(() => setPhase("leaving"), hold);
    const gone = setTimeout(() => {
      setPhase("hidden");
      document.documentElement.classList.remove("mf-splash");
    }, hold + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
    };
  }, []);

  if (phase === "hidden") return null;
  const leaving = phase === "leaving";

  return (
    <div
      aria-hidden="true"
      className={`mf-splash-overlay fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#000000] transition-[opacity,visibility,transform] duration-[750ms] ease-spring ${
        leaving ? "pointer-events-none invisible scale-[1.03] opacity-0" : "opacity-100"
      }`}
    >
      {/* artwork box: 888 x 1051 source, ring centred at 50% / 89% of the box; edges feathered so JPEG noise never shows a rectangle */}
      <div className="mf-splash-art relative aspect-[888/1051] w-[min(86vw,62vh,640px)] shrink-0 [mask-image:radial-gradient(ellipse_at_50%_50%,#000_58%,transparent_86%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_50%,#000_58%,transparent_86%)]">
        <Image src="/assets/brand/splash-logo.jpg" alt="" fill priority sizes="(max-width: 768px) 86vw, 640px" className="object-contain" />
        <span className="mf-splash-spin absolute left-1/2 top-[89%] w-[13.6%] rounded-full" style={{ aspectRatio: "1" }} />
      </div>

      {/* soft gold glow, screen-blended on top so it never reveals the artwork's edges */}
      <div className="mf-splash-glow pointer-events-none absolute left-1/2 top-[44%] z-[1] h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.10] mix-blend-screen blur-[80px]" />

      <span className="mf-splash-caption absolute bottom-7 left-0 right-0 text-center font-mono text-[11px] tracking-[3px] text-gold/70">LOADING</span>
    </div>
  );
}

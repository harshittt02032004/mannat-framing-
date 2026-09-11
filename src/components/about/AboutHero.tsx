"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import HeroSlideshow from "@/components/about/HeroSlideshow";
import IsoFrame from "@/components/about/IsoFrame";

const EASE_CSS = "cubic-bezier(0.23, 1, 0.32, 1)";
const lines = ["10+ Years.", "Built in", "Surrey."];

export default function AboutHero() {
  return (
    <section className="mf-grid-bg relative overflow-hidden bg-black">
      <span className="absolute left-5 top-9 z-[3] font-mono text-[11px] tracking-[1px] text-gold md:left-10">DWG. 02 / ABOUT</span>
      <span className="absolute right-5 top-9 z-[3] hidden font-mono text-[11px] tracking-[1px] text-ink-2 sm:block md:right-10">49.1913&deg; N, 122.8490&deg; W</span>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:min-h-[88vh] md:grid-cols-[1.1fr_0.9fr]">
        {/* Below lg the bottom padding reserves a 300px band for the compact IsoFrame (COMPACT_BAND in IsoFrame.tsx). */}
        <div className="relative z-[2] flex flex-col justify-center px-5 pb-[300px] pt-[120px] md:pl-10 md:pr-0 md:pt-[150px] lg:pb-[90px]">
          {/* Decorative click-to-build isometric frame; canvas sits behind the text (see IsoFrame.tsx) */}
          <IsoFrame />
          <motion.span
            className="font-mono text-xs font-medium tracking-[2.5px] text-gold"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            [ ABOUT US ]
          </motion.span>
          <h1 className="m-0 mb-[30px] mt-[26px] max-w-[520px] font-heading text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] text-warm-white">
            {lines.map((line, li) => (
              <span key={line} className="block overflow-hidden">
                {line.split(" ").map((w, wi) => {
                  const idx = li * 2 + wi;
                  return (
                    <span
                      key={`${w}-${wi}`}
                      className="mr-[0.28em] inline-block"
                      style={{
                        animation: `mf-word-in 0.6s ${EASE_CSS} ${idx * 120}ms both`,
                      }}
                    >
                      {w}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <motion.p
            className="m-0 mb-[26px] max-w-[400px] text-base leading-[1.7] text-concrete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
          >
            Mannat Framing Ltd. is one of the Lower Mainland&rsquo;s most trusted framing and construction companies — serving homeowners, builders, and developers since 2014.
          </motion.p>
          <motion.div
            className="flex max-w-[400px] gap-7 border-t border-dashed border-gold/30 pt-[18px] font-mono text-[11px] tracking-[0.5px] text-ink-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
          >
            <span>EST. <span className="text-gold">2014</span></span>
            <span>SCALE <span className="text-gold">1:1</span></span>
            <span>REV. <span className="text-gold">10.2</span></span>
          </motion.div>
        </div>

        <motion.div
          className="relative h-[60vh] overflow-hidden md:h-auto md:[clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
          initial={{ opacity: 0, clipPath: "polygon(100% 0,100% 0,100% 100%,100% 100%)" }}
          animate={{ opacity: 1, clipPath: "polygon(12% 0,100% 0,100% 100%,0 100%)" }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          <div className="absolute inset-0">
            <HeroSlideshow />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(200deg,rgba(13,13,13,0.05)_0%,rgba(13,13,13,0)_35%,rgba(13,13,13,0.55)_100%)]" />
          <span className="absolute bottom-[26px] left-[calc(12%+24px)] z-[3] font-mono text-[11px] tracking-[1px] text-gold">FIG. 01</span>
          <span className="pointer-events-none absolute bottom-6 right-6 z-[2] font-heading text-[clamp(100px,14vw,180px)] font-extrabold leading-none text-warm-white opacity-[0.14]">01</span>
        </motion.div>
      </div>
    </section>
  );
}

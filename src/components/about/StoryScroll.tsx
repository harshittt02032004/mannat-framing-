"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import CountUp from "@/components/CountUp";

type Chapter = { label: string; title: string; text: string; stat: { num: string; label: string } };

const chapters: Chapter[] = [
  {
    label: "01 / THE MISSION",
    title: "Founded on one promise.",
    text: "Mannat Framing Ltd. was founded with a simple mission: deliver exceptional framing work that builders, developers, and homeowners in Surrey and across the Lower Mainland can rely on.",
    stat: { num: "2014", label: "Founded in Surrey, BC" },
  },
  {
    label: "02 / THE GROWTH",
    title: "From a crew to a company.",
    text: "Over the past decade, we have grown from a focused residential framing crew into a full-service construction company capable of handling projects of every scale, from single-family custom homes to large multi-family townhouse developments and commercial buildings.",
    stat: { num: "200+", label: "Projects delivered across the Lower Mainland" },
  },
  {
    label: "03 / THE MARKET",
    title: "Built for this region.",
    text: "Headquartered in Surrey, BC, we understand the local market, the regional building codes, and the high expectations that come with building in one of Canada’s most active real estate markets.",
    stat: { num: "15+", label: "Cities served in Greater Vancouver & BC" },
  },
  {
    label: "04 / THE DIFFERENCE",
    title: "Why clients come back.",
    text: "What sets us apart is simple: we show up on time, communicate clearly, and consistently deliver quality framing that makes every trade that follows our work easier. Our clients come back to us project after project because of it.",
    stat: { num: "6", label: "In-house service divisions under one roof" },
  },
];

/**
 * Story section: a pinned column on the left carries a stat that swaps as the chapters
 * on the right scroll past. On phones the stat is inlined above each chapter instead.
 */
export default function StoryScroll() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLDivElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const stat = chapters[active].stat;

  return (
    <section className="relative mx-auto max-w-[1440px] px-5 pb-[100px] pt-[80px] md:px-10 md:pb-[140px] md:pt-[110px]">
      {/* Photo strip */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="group relative mb-16 h-[260px] overflow-hidden md:mb-24 md:h-[460px]"
      >
        <div className="relative h-full transform-gpu transition-transform duration-[900ms] ease-spring group-hover:scale-[1.02]">
          <Image src="/assets/photos/about-story-townhouses.jpg" alt="Framed townhouse development on a Mannat Framing site" fill sizes="(min-width: 1024px) 1360px, 100vw" className="object-cover" />
        </div>
        <span className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[1px] text-warm-white/80">FIG. 02 &middot; TOWNHOUSE DEVELOPMENT, LOWER MAINLAND</span>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* LEFT: pinned intro + swapping stat */}
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <span className="text-xs font-medium tracking-[2.5px] text-accent">OUR STORY</span>
          <h2 className="m-0 mt-4 max-w-[460px] font-heading text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.12] text-ink">
            From a framing crew to a full construction company.
          </h2>

          <div className="mt-10 hidden border-t border-gold/40 pt-8 lg:block">
            <div className="relative h-[150px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <CountUp value={stat.num} duration={900} className="block font-heading text-[clamp(72px,7vw,104px)] font-extrabold leading-none text-accent" />
                  <span className="mt-3 block max-w-[300px] text-sm leading-[1.6] text-ink-2">{stat.label}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* progress rail */}
            <div className="mt-6 flex items-center gap-3" aria-hidden="true">
              {chapters.map((c, i) => (
                <span key={c.label} className={`h-[3px] rounded-full transition-[width,background-color] duration-500 ease-spring ${i === active ? "w-8 bg-gold" : "w-3 bg-ink/15"}`} />
              ))}
              <span className="ml-2 font-mono text-[11px] tracking-[1px] text-ink-2">0{active + 1} / 0{chapters.length}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: chapters */}
        <div className="flex flex-col gap-14 lg:gap-0">
          {chapters.map((c, i) => (
            <div
              key={c.label}
              ref={(el) => { refs.current[i] = el; }}
              className="lg:flex lg:min-h-[42vh] lg:flex-col lg:justify-center lg:py-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
                className={`border-l-2 pl-6 transition-colors duration-500 ease-spring md:pl-8 ${i === active ? "border-gold" : "border-ink/10"}`}
              >
                {/* phones: inline stat */}
                <div className="mb-5 flex items-baseline gap-3 lg:hidden">
                  <CountUp value={c.stat.num} className="font-heading text-[40px] font-extrabold leading-none text-accent" />
                  <span className="text-xs text-ink-2">{c.stat.label}</span>
                </div>
                <span className="font-mono text-[11px] tracking-[1.5px] text-accent">{c.label}</span>
                <h3 className="m-0 mt-3 font-heading text-[22px] font-bold leading-[1.3] text-ink md:text-[26px]">{c.title}</h3>
                <p className={`m-0 mt-4 max-w-[560px] text-[15px] leading-[1.85] transition-colors duration-500 ease-spring md:text-base ${i === active ? "text-ink-3" : "text-ink-2 lg:text-ink-2/70"}`}>{c.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

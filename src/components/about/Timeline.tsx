"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE } from "@/lib/motion";

// Milestones are drawn from copy already on the site; only 2014 is a dated claim. Add real dates once the client confirms them.
const milestones = [
  { when: "2014", title: "Founded in Surrey", text: "Mannat Framing starts as a focused residential framing crew serving Surrey and the Lower Mainland." },
  { when: "EARLY YEARS", title: "Custom homes & duplexes", text: "Single-family and duplex framing builds the reputation: accurate layouts, clean framing, on schedule." },
  { when: "GROWTH", title: "Townhouse & multi-family", text: "Crews scale up to townhouse complexes and low-rise multi-family developments across Greater Vancouver." },
  { when: "EXPANSION", title: "Forming & site prep in-house", text: "Concrete forming, excavation and site preparation join the company so projects start with one team." },
  { when: "MATURITY", title: "Project management & pre-construction", text: "Planning, budgeting and trade coordination added, taking projects from drawings to handover." },
  { when: "TODAY", title: "A full-service construction company", text: "200+ projects across 15+ cities, six in-house divisions, and clients who come back project after project." },
];

/** Vertical timeline whose gold line draws down as you scroll; milestones pop in as the line reaches them. */
export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const dotTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section className="mf-grid-bg relative overflow-hidden bg-surface-2 py-[100px] md:py-[140px]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 max-w-[640px] md:mb-24"
        >
          <span className="text-xs font-medium tracking-[2.5px] text-accent">HOW WE GOT HERE</span>
          <h2 className="m-0 mt-4 font-heading text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.12] text-ink">A decade of building, one milestone at a time.</h2>
        </motion.div>

        <div ref={ref} className="relative mx-auto max-w-[980px]">
          {/* guide + drawn line */}
          <div aria-hidden="true" className="absolute bottom-0 left-[18px] top-0 w-px bg-gold/20 md:left-1/2" />
          <motion.div aria-hidden="true" style={{ scaleY }} className="absolute bottom-0 left-[18px] top-0 w-px origin-top bg-gold md:left-1/2" />
          <motion.span
            aria-hidden="true"
            style={{ top: dotTop }}
            className="absolute left-[18px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgba(197,164,109,0.18)] md:left-1/2"
          />

          <ol className="m-0 list-none p-0">
            {milestones.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <li key={m.title} className={`relative flex pb-14 last:pb-0 md:pb-20 ${right ? "md:justify-end" : ""}`}>
                  {/* node */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute left-[18px] top-[10px] h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gold bg-surface-2 md:left-1/2"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 26, x: right ? 16 : -16 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`group ml-12 w-full border border-ink/[0.08] border-t-2 border-t-gold/70 bg-surface p-6 shadow-[0_2px_8px_rgba(13,13,13,0.04)] transition-[transform,box-shadow,border-color] duration-500 ease-spring hover:-translate-y-1 hover:border-t-gold hover:shadow-card md:ml-0 md:w-[calc(50%-40px)] md:p-7 ${right ? "" : ""}`}
                  >
                    <span className="font-mono text-[11px] tracking-[1.5px] text-accent">{m.when}</span>
                    <h3 className="m-0 mt-2 font-heading text-[19px] font-bold leading-[1.3] text-ink transition-colors duration-300 group-hover:text-accent md:text-[21px]">{m.title}</h3>
                    <p className="m-0 mt-3 text-[14px] leading-[1.75] text-ink-2 md:text-[15px]">{m.text}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

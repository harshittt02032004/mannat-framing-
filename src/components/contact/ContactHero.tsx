"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const EASE_CSS = "cubic-bezier(0.23, 1, 0.32, 1)";
const words = ["CONTACT", "US"];

/** Full-bleed photo hero, modelled on the NuFrame contact page: photo, dark wash, headline bottom-left. */
export default function ContactHero() {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-black md:min-h-[64vh]">
      <Image
        src="/assets/gallery/g23.jpg"
        alt="Row of townhouses framed by Mannat Framing in the Lower Mainland"
        fill
        priority
        sizes="100vw"
        className="mf-kenburns object-cover object-[50%_40%]"
      />
      {/* readability wash — darker at the bottom-left where the copy sits */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,13,0.72)_0%,rgba(13,13,13,0.35)_50%,rgba(13,13,13,0.15)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      <span className="absolute left-5 top-9 z-[3] font-mono text-[11px] tracking-[1px] text-gold md:left-10">DWG. 05 / CONTACT</span>
      <span className="absolute right-5 top-9 z-[3] hidden font-mono text-[11px] tracking-[1px] text-concrete sm:block md:right-10">SURREY, BC</span>

      <div className="relative z-[2] mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        <motion.span
          className="mb-5 flex items-center gap-3 font-mono text-xs font-medium tracking-[2.5px] text-gold"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="h-px w-7 bg-gold" /> GET IN TOUCH
        </motion.span>
        <h1 className="m-0 font-heading text-[clamp(44px,8vw,96px)] font-extrabold uppercase leading-[0.98] tracking-[-0.01em] text-warm-white">
          {words.map((w, i) => (
            <span key={w} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <span className="inline-block" style={{ animation: `mf-word-in 0.7s ${EASE_CSS} ${150 + i * 130}ms both` }}>
                {w}
              </span>
            </span>
          ))}
        </h1>
        <motion.p
          className="m-0 mt-5 max-w-[520px] text-[17px] leading-[1.6] text-warm-white/90 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
        >
          Let&rsquo;s put the plans in place for your upcoming project.
        </motion.p>
      </div>
    </section>
  );
}

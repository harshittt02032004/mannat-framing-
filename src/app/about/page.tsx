import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import AboutHero from "@/components/about/AboutHero";
import SawdustLight from "@/components/about/SawdustLight";
import StoryScroll from "@/components/about/StoryScroll";
import Timeline from "@/components/about/Timeline";
import ServiceAreaMap from "@/components/about/ServiceAreaMap";

export const metadata: Metadata = {
  title: "About Mannat Framing Ltd. | Framing Contractor Surrey BC",
  description:
    "Mannat Framing Ltd. is one of the Lower Mainland's most trusted framing and construction companies — serving homeowners, builders, and developers since 2014.",
};

const values = [
  { num: "01", t: "Precision", d: "Accurate layouts, clean framing, and structural integrity — every time." },
  { num: "02", t: "Accountability", d: "We own our timelines. Our crews coordinate with your trades and never leave a project hanging." },
  { num: "03", t: "Compliance", d: "Every project is built to BC Building Code — including seismic, shear wall, and Step Code requirements." },
  { num: "04", t: "Partnership", d: "We treat every client like a long-term partner, not a one-time job." },
];

/**
 * About page: hero (click-to-build frame) -> story with pinned stats -> scroll-drawn timeline
 * -> values (sawdust canvas) -> interactive service-area map -> CTA.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StoryScroll />
      <Timeline />

      {/* VALUES */}
      <section className="mf-grid-bg relative isolate overflow-hidden bg-charcoal py-[100px] md:py-[120px]">
        {/* Decorative "sawdust in light" canvas: above the CSS grid, below the rows (see SawdustLight.tsx) */}
        <SawdustLight />
        <Reveal className="mx-auto max-w-[1440px] px-5 md:px-10">
          <span className="font-mono text-xs font-medium tracking-[2.5px] text-gold">[ WHAT WE STAND FOR ]</span>
          <h2 className="m-0 mb-16 mt-5 max-w-[700px] font-heading text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.15] text-warm-white md:mb-20">The Standard We Hold on Every Project.</h2>
        </Reveal>
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-px bg-gold/15 px-5 md:px-10 lg:grid-cols-2 lg:border lg:border-gold/15">
          {values.map((v, i) => (
            <Reveal
              key={v.num}
              index={i}
              y={20}
              className="group relative bg-charcoal/95 px-6 py-9 transition-colors duration-300 ease-spring hover:bg-black/60 active:bg-black/60 md:px-10 md:py-12"
            >
              <span className="pointer-events-none absolute right-6 top-6 font-heading text-[64px] font-extrabold leading-none text-gold opacity-[0.14] transition-[opacity,transform] duration-[450ms] ease-spring group-hover:-translate-y-1 group-hover:opacity-40 md:text-[96px]">
                {v.num}
              </span>
              <span className="mb-5 block h-px w-8 bg-gold transition-[width] duration-500 ease-spring group-hover:w-14" />
              <h3 className="m-0 mb-3 font-heading text-2xl font-bold text-warm-white transition-colors duration-300 ease-spring group-hover:text-gold">{v.t}</h3>
              <p className="m-0 max-w-[460px] text-[15px] leading-[1.7] text-concrete">{v.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ServiceAreaMap />

      <CtaBand />
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { COMPANY, SERVICE_CITIES, directionsUrl, mapEmbedUrl } from "@/lib/company";

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
);

function LocationCol({ icon, label, children, delay }: { icon: React.ReactNode; label: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/[0.14] text-accent transition-all duration-[400ms] ease-spring group-hover:bg-gold group-hover:text-black group-hover:shadow-[0_4px_14px_rgba(197,164,109,0.45)]">
          {icon}
        </span>
        <span className="font-heading text-[13px] font-bold uppercase tracking-[1.6px] text-accent">{label}</span>
      </div>
      {children}
    </motion.div>
  );
}

/**
 * "Our Locations": the live Google map is the section background (pin in the left half),
 * with the location copy floating on a glass panel to the right, mirroring NuFrame's map-left / text-right layout.
 */
export default function ContactMap() {
  return (
    <section id="locations" className="relative overflow-hidden bg-surface">
      {/* On large screens the iframe is 140% wide and anchored right, so the map pin lands at ~30% of the section (left half). */}
      <iframe
        title={`${COMPANY.name} location map`}
        src={mapEmbedUrl}
        className="mf-map absolute inset-y-0 right-0 h-full w-full border-0 lg:w-[140%]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* readability wash, heavier on the right where the copy lives */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-surface via-surface/85 to-surface/40 lg:via-surface/45 lg:to-transparent"
      />
      {/* name chip floating above the map pin (the embed renders its pin at its own centre) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] hidden -translate-x-1/2 -translate-y-[calc(100%+34px)] flex-col items-center lg:left-[30%] lg:flex"
      >
        <div className="border border-ink/10 border-t-2 border-t-gold bg-surface-2/95 px-4 py-2.5 text-center shadow-lift backdrop-blur-sm">
          <p className="m-0 font-heading text-sm font-extrabold leading-tight text-ink">{COMPANY.name}</p>
          <p className="m-0 mt-0.5 text-[11px] font-semibold tracking-[1px] text-accent">SURREY, BC</p>
        </div>
        <div className="-mt-1.5 h-3 w-3 rotate-45 border-b border-r border-ink/10 bg-surface-2/95" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
          viewport={{ once: true, amount: 0.1 }}
          className="ml-auto w-full max-w-[600px] border border-ink/[0.08] border-t-2 border-t-gold bg-surface-2/90 p-7 shadow-[0_2px_8px_rgba(13,13,13,0.04)] backdrop-blur-[16px] transition-[box-shadow,border-color] duration-500 ease-spring hover:border-gold/40 hover:shadow-card md:p-10"
        >
          <span className="inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[2.5px] text-accent">
            <span className="h-px w-6 bg-gold" /> OUR LOCATIONS
          </span>
          <h2 className="m-0 mt-4 font-heading text-[clamp(30px,3.8vw,44px)] font-extrabold uppercase leading-[1.05] text-ink">Our Locations</h2>
          <p className="m-0 mt-4 text-[15px] leading-[1.75] text-ink-2">
            From our head office in Surrey to job sites across the Lower Mainland, our team is here to discuss framing and construction solutions for large and small builds. Give us a call, we look forward to hearing from you.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 border-t border-dashed border-gold/30 pt-8 sm:grid-cols-2">
            <LocationCol icon={<PinIcon />} label="Surrey (Head Office)" delay={0.1}>
              <p className="m-0 text-sm leading-[1.7] text-ink">
                {COMPANY.name}
                <br />
                <span className="text-ink-2">{COMPANY.address}</span>
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-[gap,color] duration-300 ease-spring hover:gap-2 hover:text-ink"
              >
                Get Directions <span aria-hidden="true">&rarr;</span>
              </a>
            </LocationCol>

            <LocationCol icon={<CompassIcon />} label="Where We Work" delay={0.2}>
              <p className="m-0 text-sm leading-[1.7] text-ink-2">
                Surrey, {SERVICE_CITIES.join(", ")} and across Greater Vancouver.
              </p>
              <Link
                href="/about#where-we-work"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-[gap,color] duration-300 ease-spring hover:gap-2 hover:text-ink"
              >
                Full service area <span aria-hidden="true">&rarr;</span>
              </Link>
            </LocationCol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

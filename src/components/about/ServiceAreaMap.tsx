"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type City = { name: string; lat: number; lng: number; hq?: boolean };

const CITIES: City[] = [
  { name: "Surrey", lat: 49.19, lng: -122.85, hq: true },
  { name: "Langley", lat: 49.1, lng: -122.66 },
  { name: "Burnaby", lat: 49.25, lng: -122.98 },
  { name: "Vancouver", lat: 49.28, lng: -123.12 },
  { name: "Coquitlam", lat: 49.29, lng: -122.79 },
  { name: "Maple Ridge", lat: 49.22, lng: -122.6 },
  { name: "New Westminster", lat: 49.21, lng: -122.91 },
  { name: "North Vancouver", lat: 49.32, lng: -123.07 },
  { name: "Delta", lat: 49.09, lng: -123.06 },
  { name: "Abbotsford", lat: 49.05, lng: -122.33 },
  { name: "Richmond", lat: 49.17, lng: -123.14 },
  { name: "Port Moody", lat: 49.3, lng: -122.87 },
  { name: "Port Coquitlam", lat: 49.26, lng: -122.76 },
  { name: "White Rock", lat: 49.03, lng: -122.8 },
  { name: "West Vancouver", lat: 49.33, lng: -123.17 },
];

// Equirectangular projection into a 720 x 440 drawing space (latitude stretched ~1.5x to match local aspect).
const VB = { w: 720, h: 440 };
const LNG0 = -123.28, LNG1 = -122.22, LAT0 = 49.38, LAT1 = 48.98;
const px = (lng: number) => 40 + ((lng - LNG0) / (LNG1 - LNG0)) * (VB.w - 80);
const py = (lat: number) => 30 + ((LAT0 - lat) / (LAT0 - LAT1)) * (VB.h - 60);

// Label side per city so names don't collide.
const LABEL_LEFT = new Set(["Richmond", "Delta", "Vancouver", "West Vancouver", "New Westminster", "Port Moody"]);

/** Stylised Lower Mainland map: gold city nodes, lines that draw out from the Surrey head office on scroll, hover/tap to highlight. */
export default function ServiceAreaMap() {
  const [hover, setHover] = useState<string | null>(null);
  const hq = CITIES.find((c) => c.hq)!;
  const hx = px(hq.lng), hy = py(hq.lat);

  return (
    <section id="where-we-work" className="relative scroll-mt-24 overflow-hidden bg-surface py-[100px] md:py-[140px]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-14 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* LEFT: copy + city chips */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: EASE }}>
          <span className="text-xs font-medium tracking-[2.5px] text-accent">WHERE WE WORK</span>
          <h2 className="m-0 mt-4 font-heading text-[clamp(56px,8vw,120px)] font-extrabold leading-[0.95] tracking-[-2px] text-ink">Surrey</h2>
          <p className="m-0 mt-5 max-w-[440px] text-[15px] leading-[1.8] text-ink-2">
            Based in Surrey, BC, we take on projects throughout Greater Vancouver and the Fraser Valley. Hover or tap a city to find it on the map.
          </p>
          <ul className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">
            {CITIES.filter((c) => !c.hq).map((c) => {
              const on = hover === c.name;
              return (
                <li key={c.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setHover(c.name)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(c.name)}
                    onBlur={() => setHover(null)}
                    onClick={() => setHover(on ? null : c.name)}
                    aria-pressed={on}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-heading text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-300 ease-spring ${
                      on ? "-translate-y-0.5 border-gold bg-gold text-black" : "border-ink/15 bg-transparent text-ink-2 hover:border-gold hover:text-ink"
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* RIGHT: map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mf-grid-bg relative border border-ink/[0.08] bg-surface-2/60 p-3 md:p-6"
        >
          <span className="absolute left-4 top-3 font-mono text-[10px] tracking-[1px] text-accent md:left-6 md:top-4">DWG. 02.3 &middot; SERVICE AREA</span>
          <span className="absolute right-4 top-3 hidden font-mono text-[10px] tracking-[1px] text-ink-2 sm:block md:right-6 md:top-4">LOWER MAINLAND, BC</span>
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="mt-5 h-auto w-full" role="img" aria-label="Map of the Lower Mainland showing the cities Mannat Framing serves">
            {/* Fraser River, drawn loosely as a blueprint guide */}
            <path
              d={`M ${px(-122.25)} ${py(49.15)} C ${px(-122.55)} ${py(49.17)}, ${px(-122.7)} ${py(49.2)}, ${px(-122.9)} ${py(49.2)} S ${px(-123.1)} ${py(49.16)}, ${px(-123.28)} ${py(49.12)}`}
              fill="none"
              stroke="var(--color-gold)"
              strokeOpacity="0.28"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Burrard Inlet */}
            <path d={`M ${px(-123.28)} ${py(49.3)} C ${px(-123.1)} ${py(49.3)}, ${px(-123.0)} ${py(49.29)}, ${px(-122.84)} ${py(49.3)}`} fill="none" stroke="var(--color-gold)" strokeOpacity="0.22" strokeWidth="5" strokeLinecap="round" />

            {/* spokes from Surrey */}
            {CITIES.filter((c) => !c.hq).map((c, i) => {
              const on = hover === c.name;
              return (
                <motion.line
                  key={c.name}
                  x1={hx}
                  y1={hy}
                  x2={px(c.lng)}
                  y2={py(c.lat)}
                  stroke="var(--color-gold)"
                  strokeWidth={on ? 1.6 : 1}
                  strokeOpacity={hover && !on ? 0.18 : on ? 0.95 : 0.5}
                  strokeDasharray="3 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.06 }}
                  style={{ transition: "stroke-opacity 0.3s cubic-bezier(0.23,1,0.32,1), stroke-width 0.3s" }}
                />
              );
            })}

            {/* city nodes */}
            {CITIES.map((c, i) => {
              const x = px(c.lng), y = py(c.lat);
              const on = hover === c.name || (hover === null && c.hq);
              const left = LABEL_LEFT.has(c.name);
              return (
                <motion.g
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: EASE, delay: c.hq ? 0 : 0.5 + i * 0.05 }}
                  style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(hover === c.name ? null : c.name)}
                >
                  {c.hq && <circle cx={x} cy={y} r="16" fill="var(--color-gold)" fillOpacity="0.14" className="animate-subtle-pulse" />}
                  <circle cx={x} cy={y} r={c.hq ? 7 : on ? 6 : 4} fill={c.hq || on ? "var(--color-gold)" : "var(--color-surface-2)"} stroke="var(--color-gold)" strokeWidth={c.hq ? 2 : 1.5} style={{ transition: "r 0.3s, fill 0.3s" }} />
                  <text
                    x={left ? x - 12 : x + 12}
                    y={y + 4}
                    textAnchor={left ? "end" : "start"}
                    fontSize={c.hq ? 15 : 12}
                    fontWeight={c.hq || on ? 700 : 500}
                    fill={c.hq || on ? "var(--color-ink)" : "var(--color-ink-2)"}
                    fillOpacity={hover && !on && !c.hq ? 0.45 : 1}
                    style={{ fontFamily: "var(--font-heading)", transition: "fill-opacity 0.3s, fill 0.3s", pointerEvents: "none" }}
                  >
                    {c.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[1px] text-ink-2">
            <span>&#9679; HEAD OFFICE &nbsp;&middot;&nbsp; &#9675; SERVICE CITY</span>
            <span className="hidden sm:inline">SCALE: NOT TO SCALE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

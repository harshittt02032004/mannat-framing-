"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";

type Category = "Residential" | "Multi-Family" | "Commercial" | "Framing";
type Filter = "All" | Category;

type Project = {
  id: string;
  num: string;
  cat: Category;
  title: string;
  photo: string; // alt text
  src: string;
  span: string; // desktop grid placement
  status: "In progress" | "Completed";
  location: string; // TODO: replace with the real city once project details are confirmed
  service: string; // related service slug
  size: "large" | "medium" | "small";
};

const filters: Filter[] = ["All", "Residential", "Multi-Family", "Commercial", "Framing"];

const projects: Project[] = [
  { id: "hero", num: "01", cat: "Residential", title: "Custom Home Framing", photo: "Two-storey custom home fully framed", src: "/assets/photos/proj-custom-home.jpg", span: "md:col-span-7 md:row-span-4", size: "large", status: "In progress", location: "Lower Mainland, BC", service: "framing" },
  { id: "vertical1", num: "02", cat: "Multi-Family", title: "Multi-Family Development", photo: "Multi-family building with tower crane", src: "/assets/photos/svc-project-management.jpg", span: "md:col-span-5 md:row-span-4", size: "medium", status: "In progress", location: "Lower Mainland, BC", service: "general-construction" },
  { id: "wide1", num: "03", cat: "Framing", title: "Structural Framing", photo: "Roof trusses set on a framed building", src: "/assets/photos/proj-structural-framing.jpg", span: "md:col-span-4 md:row-span-3", size: "small", status: "In progress", location: "Lower Mainland, BC", service: "framing" },
  { id: "detail1", num: "04", cat: "Framing", title: "Structural Detail", photo: "Stair and wall framing detail", src: "/assets/photos/proj-structural-detail.jpg", span: "md:col-span-4 md:row-span-3", size: "small", status: "In progress", location: "Lower Mainland, BC", service: "framing" },
  { id: "grid1", num: "05", cat: "Residential", title: "Concrete Forming", photo: "Concrete foundation formwork", src: "/assets/photos/teaser-concrete-forms.jpg", span: "md:col-span-4 md:row-span-3", size: "small", status: "In progress", location: "Lower Mainland, BC", service: "concrete-forming" },
  { id: "grid2", num: "06", cat: "Commercial", title: "Site Preparation", photo: "Prepared site with foundations and gravel", src: "/assets/photos/proj-site-preparation.jpg", span: "md:col-span-6 md:row-span-3", size: "medium", status: "In progress", location: "Lower Mainland, BC", service: "excavation-site-prep" },
  { id: "grid3", num: "07", cat: "Commercial", title: "Commercial Build", photo: "Five-storey wood-frame commercial building", src: "/assets/photos/svc-general-construction.jpg", span: "md:col-span-6 md:row-span-3", size: "medium", status: "In progress", location: "Lower Mainland, BC", service: "general-construction" },
  { id: "vertical2", num: "08", cat: "Multi-Family", title: "Townhouse Complex", photo: "Framed townhouse complex", src: "/assets/photos/proj-townhouse-complex.jpg", span: "md:col-span-5 md:row-span-4", size: "medium", status: "In progress", location: "Lower Mainland, BC", service: "framing" },
  { id: "wide2", num: "09", cat: "Residential", title: "Project Handover", photo: "Completed townhouse framing at handover", src: "/assets/photos/proj-handover.jpg", span: "md:col-span-7 md:row-span-4", size: "large", status: "Completed", location: "Lower Mainland, BC", service: "framing" },
];

const titleSize = { large: "text-2xl", medium: "text-xl", small: "text-base" } as const;

export default function ProjectsGallery() {
  const [active, setActive] = useState<Filter>("All");
  const visible = projects.filter((p) => active === "All" || p.cat === active);

  return (
    <LayoutGroup>
      {/* FILTER BAR */}
      <div className="z-10 border-b border-ink/[0.08] bg-surface/95 backdrop-blur-md md:sticky md:top-[68px]">
        <div className="mx-auto flex max-w-[1440px] gap-x-7 overflow-x-auto px-5 [scrollbar-width:none] md:flex-wrap md:gap-x-9 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => {
            const isActive = f === active;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={isActive}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent py-5 font-heading text-[13px] font-semibold tracking-[0.4px] transition-[color,transform] duration-300 ease-spring hover:-translate-y-0.5 hover:text-ink active:-translate-y-0.5 ${
                  isActive ? "text-ink" : "text-[#8a8a82]"
                }`}
              >
                {f}
                {isActive && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-gold"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOSAIC */}
      <div className="mx-auto max-w-[1440px] px-5 pb-[130px] pt-20 md:px-10">
        <motion.div layout className="grid grid-cols-1 auto-rows-[260px] gap-5 md:grid-cols-12 md:auto-rows-[140px]">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                whileHover={{ y: -6 }}
                whileTap={{ y: -4 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                className={`group col-span-1 row-span-1 ${p.span}`}
              >
                <div className="relative h-full overflow-hidden shadow-[0_0_0_0_rgba(13,13,13,0)] transition-shadow duration-[450ms] ease-spring group-hover:shadow-lift">
                  <div className="absolute left-[18px] top-[18px] z-[2] flex items-center gap-2">
                    <span className="bg-black/35 px-[10px] py-[5px] font-heading text-xs font-extrabold tracking-[1px] text-warm-white backdrop-blur-[6px]">{p.num}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-black/45 px-2.5 py-[5px] text-[10px] font-semibold tracking-[1.5px] text-gold backdrop-blur-[6px]">
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full bg-gold ${p.status === "In progress" ? "animate-subtle-pulse" : ""}`} />
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute inset-0 transform-gpu will-change-transform transition-transform duration-[600ms] ease-spring group-hover:scale-[1.05]">
                    <Image src={p.src} alt={p.photo} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,13,0.8)_0%,rgba(13,13,13,0)_40%)] transition-opacity duration-[450ms] ease-spring group-hover:opacity-90" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pr-[76px] transition-transform duration-[450ms] ease-spring group-hover:-translate-y-1 md:p-[26px] md:pr-[84px]">
                    <span className="mb-2 block text-[11px] font-semibold tracking-[2px] text-gold">{p.cat.toUpperCase()}</span>
                    <span className={`block font-heading font-extrabold text-warm-white ${titleSize[p.size]}`}>{p.title}</span>
                    <span className="mt-1.5 flex items-center gap-1.5 text-[12px] text-concrete">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      {p.location}
                    </span>
                  </div>
                  <Link
                    href={`/services/${p.service}`}
                    aria-label={`${p.title}: see our related services`}
                    className="absolute bottom-5 right-5 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-warm-white/30 bg-black/30 text-warm-white backdrop-blur-[6px] transition-[transform,background-color,border-color,color] duration-300 ease-spring hover:scale-105 group-hover:border-gold group-hover:bg-gold group-hover:text-black active:scale-95 md:bottom-[26px] md:right-[26px]"
                  >
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        {visible.length === 0 && (
          <p className="py-20 text-center text-sm text-ink-2">No projects in this category yet.</p>
        )}
      </div>
    </LayoutGroup>
  );
}

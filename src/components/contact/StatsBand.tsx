import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

const BuildingIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" /></svg>
);
const HomeIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
);
const MapIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></svg>
);
const LayersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>
);

const stats = [
  { num: "10+", label: "Years in business", icon: <HomeIcon /> },
  { num: "200+", label: "Projects delivered", icon: <BuildingIcon /> },
  { num: "15+", label: "Cities served", icon: <MapIcon /> },
  { num: "6", label: "Service divisions", icon: <LayersIcon /> },
];

/** Gold stats band above the footer — our take on NuFrame's blue numbers strip. */
export default function StatsBand() {
  return (
    <section className="bg-gold py-16 text-black md:py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-5 md:px-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} index={i} className="flex items-start gap-4">
            <span className="mt-1 shrink-0 text-black/80">{s.icon}</span>
            <div>
              <CountUp value={s.num} className="block font-heading text-[clamp(30px,3.4vw,40px)] font-extrabold leading-none" />
              <span className="mt-2 block text-sm font-medium text-black/75">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

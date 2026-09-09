import Image from "next/image";
import Reveal from "@/components/Reveal";
import { COMPANY } from "@/lib/company";

const careersMailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent("Careers at Mannat Framing")}`;

/** "Join our crew" block — photo flush to the left edge, copy on the right. */
export default function CareersBlock() {
  return (
    <section id="careers" className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 pr-5 md:pr-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal scale={0.97} className="relative">
          <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[2/1]">
            <Image
              src="/assets/photos/careers-crew.jpg"
              alt="Framing crew in hard hats and safety vests raising a stud wall on a commercial job site"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-spring hover:scale-[1.03]"
            />
          </div>
        </Reveal>

        <div className="pl-5 md:pl-10 lg:pl-0">
          <Reveal index={0}>
            <span className="inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[2.5px] text-accent">
              <span className="h-px w-6 bg-gold" /> NOW HIRING FRAMERS
            </span>
            <h2 className="m-0 mt-4 max-w-[560px] font-heading text-[clamp(30px,3.8vw,44px)] font-extrabold uppercase leading-[1.05] text-ink">Join Our Exceptional Crew</h2>
          </Reveal>
          <Reveal index={1}>
            <p className="m-0 mt-5 max-w-[520px] text-[15px] leading-[1.8] text-ink-2">
              Learn, grow, and sharpen your skills with an experienced team using proven framing methods. We are structured so our people succeed and our projects exceed expectations — send us a note and tell us about your experience.
            </p>
          </Reveal>
          <Reveal index={2} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={careersMailto}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-[14px] text-sm font-semibold text-black shadow-[0_18px_40px_-16px_rgba(197,164,109,0.6)] transition-[transform,background-color,box-shadow] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-gold-pale hover:shadow-card active:translate-y-0"
            >
              Explore Careers <span aria-hidden="true">&rarr;</span>
            </a>
            <a href={`tel:${COMPANY.phoneRaw}`} className="text-sm font-semibold text-ink transition-colors duration-300 hover:text-accent">
              or call {COMPANY.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

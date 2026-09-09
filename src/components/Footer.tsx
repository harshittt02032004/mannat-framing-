import Link from "next/link";
import Image from "next/image";
import { SERVICES } from "@/lib/services";

const cities = ["Surrey", "Langley", "Burnaby", "Vancouver", "Coquitlam", "Maple Ridge"];

const linkCls = "text-concrete transition-[color,transform] duration-300 ease-spring hover:text-gold hover:translate-x-1 active:text-gold active:translate-x-1 inline-block";

export default function Footer() {
  return (
    <footer className="bg-black px-5 md:px-10 pt-20 pb-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-start justify-between gap-10 pb-14">
          <div className="flex items-center gap-[14px]">
            <Image src="/assets/icon-dark.png" alt="Mannat Framing Ltd. logo" width={48} height={48} className="h-12 w-auto" />
            <div>
              <div className="font-heading font-extrabold text-lg text-warm-white">MANNAT FRAMING</div>
              <div className="text-xs text-concrete">Surrey, BC</div>
            </div>
          </div>
          <div className="flex gap-[14px]">
            {["f", "in", "ig"].map((s) => (
              <span
                key={s}
                aria-hidden="true"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-gold/40 text-gold text-sm transition-[background-color,color,transform] duration-300 ease-spring hover:bg-gold hover:text-black hover:-translate-y-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[60px] gap-y-10 border-t border-gold/15 pt-14 pb-[70px] sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="m-0 max-w-[340px] text-sm leading-[1.7] text-concrete">
              Mannat Framing Ltd. is a licensed framing contractor in Surrey, BC, delivering residential, multi-family and commercial framing across the Lower Mainland for over 10 years.
            </p>
            <div className="mt-[18px] text-[13px] leading-[1.8] text-concrete">
              <div><a href="tel:+17787238994" className="text-concrete transition-colors duration-300 ease-spring hover:text-gold">(778) 723-8994</a></div>
              <div><a href="mailto:m.framing9@gmail.com" className="text-concrete transition-colors duration-300 ease-spring hover:text-gold">m.framing9@gmail.com</a></div>
              <div>Surrey, BC</div>
            </div>
          </div>
          <FooterCol title="SERVICES">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className={linkCls}>{s.title}</Link>
            ))}
          </FooterCol>
          <FooterCol title="CITIES">
            {cities.map((c) => (
              <Link key={c} href="/about#where-we-work" className={linkCls}>{c}</Link>
            ))}
          </FooterCol>
          <FooterCol title="COMPANY">
            <Link href="/about" className={linkCls}>About Us</Link>
            <Link href="/projects" className={linkCls}>Projects</Link>
            <Link href="/contact#careers" className={linkCls}>Careers</Link>
            <span className="text-concrete/60">Blog</span>
            <Link href="/contact" className={linkCls}>Contact</Link>
          </FooterCol>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-gold/15 pt-6 text-[13px] text-ink-2">
          <span>&copy; 2026 Mannat Framing Ltd. All rights reserved. | Surrey, British Columbia</span>
          <span className="text-accent">Built in Surrey. Built to Last.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="mb-[10px] block text-xs font-medium tracking-[2px] text-gold">{title}</span>
      {children}
    </div>
  );
}

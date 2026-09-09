import Image from "next/image";
import Reveal from "@/components/Reveal";
import { COMPANY } from "@/lib/company";

const careersMailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent("Careers at Mannat Framing")}`;
const quoteMailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent("Quote request - Mannat Framing")}`;

const rows: { label: string; lines: { text: string; href?: string }[] }[] = [
  { label: "Business Hours", lines: [{ text: COMPANY.hours }] },
  {
    label: "Contact Info",
    lines: [
      { text: COMPANY.address },
      { text: COMPANY.region },
      { text: `Tel: ${COMPANY.phone}`, href: `tel:${COMPANY.phoneRaw}` },
    ],
  },
  { label: "General Inquiry", lines: [{ text: `Email: ${COMPANY.email}`, href: `mailto:${COMPANY.email}` }] },
  { label: "Quotes & Estimates", lines: [{ text: `Email: ${COMPANY.email}`, href: quoteMailto }] },
  { label: "Careers Inquiry", lines: [{ text: `Email: ${COMPANY.email}`, href: careersMailto }] },
];

/** Photo + contact details block, mirroring NuFrame's "Contact Information" section. */
export default function ContactInfo() {
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
        {/* LEFT: photo with the tagline bar overlapping its bottom-left corner */}
        <Reveal scale={0.97} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <Image
              src="/assets/gallery/g14.jpg"
              alt="Tower crane over a five-storey wood-frame building framed by Mannat Framing"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-spring hover:scale-[1.03]"
            />
          </div>
          <div className="absolute -bottom-6 left-0 max-w-[360px] bg-gold px-6 py-5 shadow-lift">
            <p className="m-0 font-heading text-[13px] font-extrabold uppercase leading-[1.5] tracking-[1.4px] text-black">
              Where precision and process deliver a better build.
            </p>
          </div>
        </Reveal>

        {/* RIGHT: details */}
        <div className="pt-4 lg:pt-6">
          <Reveal index={0}>
            <span className="inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[2.5px] text-accent">
              <span className="h-px w-6 bg-gold" /> REACH US
            </span>
            <h2 className="m-0 mb-10 mt-4 font-heading text-[clamp(30px,3.8vw,44px)] font-extrabold uppercase leading-[1.05] text-ink">Contact Information</h2>
          </Reveal>
          <dl className="m-0 grid grid-cols-1 gap-7 sm:grid-cols-2">
            {rows.map((r, i) => (
              <Reveal key={r.label} index={i + 1} className={i < 2 ? "sm:col-span-2" : ""}>
                <dt className="mb-1.5 font-heading text-[13px] font-bold uppercase tracking-[1.6px] text-accent">{r.label}</dt>
                <dd className="m-0 text-[15px] leading-[1.75] text-ink">
                  {r.lines.map((l) =>
                    l.href ? (
                      <a key={l.text} href={l.href} className="block w-fit transition-[color,transform] duration-300 ease-spring hover:translate-x-1 hover:text-accent">
                        {l.text}
                      </a>
                    ) : (
                      <span key={l.text} className="block text-ink-2">{l.text}</span>
                    ),
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

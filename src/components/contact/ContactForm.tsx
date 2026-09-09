"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/services";

const fieldCls =
  "peer w-full rounded-none border border-transparent bg-warm-white px-4 py-[14px] pr-10 text-sm text-black outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-spring placeholder:text-[#7d7a72] focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(197,164,109,0.25)]";

function ValidCheck() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-emerald-600 opacity-0 transition-opacity duration-300 ease-spring peer-valid:opacity-100 peer-placeholder-shown:opacity-0"
    >
      &#10003;
    </span>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      {children}
    </div>
  );
}

/**
 * "Ready to start a project?" band, modelled on NuFrame's form section:
 * headline + copy on the left, a two-column field grid on a solid band to the right.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="form" className="relative isolate overflow-hidden bg-black py-20 md:py-24">
      <div aria-hidden="true" className="mf-grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* LEFT: headline */}
        <div className="lg:pt-2">
          <Reveal index={0}>
            <span className="inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[2.5px] text-gold">
              <span className="h-px w-6 bg-gold" /> FREE QUOTE
            </span>
            <h2 className="m-0 mt-4 max-w-[480px] font-heading text-[clamp(32px,4.2vw,50px)] font-extrabold uppercase leading-[1.04] text-warm-white">
              Ready to start a project?
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="m-0 mt-5 max-w-[440px] text-[15px] leading-[1.8] text-concrete">
              If you&rsquo;d like to send your inquiry by email, fill out the form. The right person will contact you within one business day.
            </p>
          </Reveal>
          <Reveal index={2} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.5px] text-concrete">
            <span>RESPONSE <span className="text-gold">&lt; 1 BUSINESS DAY</span></span>
            <span>QUOTES <span className="text-gold">FREE</span></span>
            <span>LICENSED <span className="text-gold">&amp; INSURED</span></span>
          </Reveal>
        </div>

        {/* RIGHT: fields */}
        <Reveal index={1} y={30} className="min-h-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="success"
                className="flex h-full flex-col items-center justify-center border border-gold/40 bg-charcoal/60 px-6 py-16 text-center backdrop-blur"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
                role="status"
                aria-live="polite"
              >
                <motion.span
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg text-black"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                >
                  &#10003;
                </motion.span>
                <h3 className="m-0 mb-3 font-heading text-2xl font-extrabold text-warm-white">Request received.</h3>
                <p className="m-0 max-w-[380px] text-[15px] leading-[1.7] text-concrete">Thanks for reaching out. We&rsquo;ll get back to you within one business day.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <Field id="cf-name" label="Your name">
                  <input id="cf-name" name="name" type="text" required placeholder="Your Name" autoComplete="name" className={fieldCls} />
                  <ValidCheck />
                </Field>
                <Field id="cf-company" label="Company name (optional)">
                  <input id="cf-company" name="company" type="text" placeholder="Company Name (optional)" autoComplete="organization" className={fieldCls} />
                </Field>
                <Field id="cf-phone" label="Phone number">
                  <input id="cf-phone" name="phone" type="tel" required placeholder="Phone Number" autoComplete="tel" className={fieldCls} />
                  <ValidCheck />
                </Field>
                <Field id="cf-email" label="Email address">
                  <input id="cf-email" name="email" type="email" required placeholder="Email Address" autoComplete="email" className={fieldCls} />
                  <ValidCheck />
                </Field>
                <Field id="cf-service" label="Service required">
                  <select id="cf-service" name="service" required defaultValue="" className={`${fieldCls} appearance-none invalid:text-[#7d7a72]`}>
                    <option value="" disabled>Service Required</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gold-dark">&#9662;</span>
                </Field>
                <Field id="cf-location" label="Project location">
                  <input id="cf-location" name="location" type="text" required placeholder="Project Location (city or address)" className={fieldCls} />
                  <ValidCheck />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="cf-details" label="Your message">
                    <textarea id="cf-details" name="details" required rows={4} placeholder="Your Message" className={`${fieldCls} resize-y pr-4`} />
                  </Field>
                </div>
                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="cursor-pointer rounded-full border-0 bg-gold px-8 py-[15px] text-sm font-semibold tracking-[0.3px] text-black shadow-[0_18px_40px_-16px_rgba(197,164,109,0.7)] transition-colors duration-300 ease-spring hover:bg-gold-pale"
                  >
                    Submit Request
                  </motion.button>
                  <span className="text-xs text-concrete">No spam. Your details go straight to our estimating team.</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

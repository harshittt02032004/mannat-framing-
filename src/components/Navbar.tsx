"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { SERVICES } from "@/lib/services";
import ThemeToggle from "@/components/ThemeToggle";
import ServiceIcon from "@/components/ServiceIcon";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export const NAV_REST_HEIGHT = 76;

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`opacity-60 transition-transform duration-300 ease-spring ${open ? "rotate-180" : ""}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * Fixed header. At the top of the page it is a full-width 76px bar; once the
 * visitor scrolls it shrinks into a floating 56px glass capsule with a smaller
 * logo and tighter padding. A flow spacer holds the rest height so page content
 * never reflows while the capsule resizes. "Services" opens a mega-menu of the
 * six services on hover/focus (desktop) and as a collapsible list on mobile.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  /**
   * Next's <Link> does nothing when the target is the page you are already on, so a tap on
   * "Home" while on the homepage (often scrolled down) looked dead. For a same-page tap we
   * close the menus and do a full reload to the top of that page, as the client expects.
   */
  const onNav = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href !== pathname) return;
    e.preventDefault();
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    window.location.assign(href);
  };

  const linkCls = (active: boolean) =>
    `relative text-sm whitespace-nowrap transition-[color,transform] duration-300 ease-spring hover:-translate-y-0.5 active:-translate-y-0.5 after:absolute after:bottom-[-6px] after:left-0 after:h-px after:bg-gold after:transition-[width] after:duration-300 after:ease-spring after:content-[''] ${
      active ? "text-accent after:w-full" : "text-ink after:w-0 hover:after:w-full active:after:w-full"
    }`;

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding] duration-[450ms] ease-spring ${
          scrolled ? "px-3 sm:px-4" : "px-0"
        }`}
      >
        <div
          className={`pointer-events-auto relative mx-auto border transition-[height,max-width,margin,border-radius,background-color,box-shadow,border-color] duration-[450ms] ease-spring ${
            scrolled
              ? "mt-3 h-14 max-w-[82rem] rounded-full border-ink/10 bg-surface/85 shadow-[0_8px_32px_rgba(13,13,13,0.14)] backdrop-blur-[20px] backdrop-saturate-[1.3]"
              : "mt-0 h-[76px] max-w-none rounded-none border-transparent border-b-ink/[0.08] bg-surface"
          }`}
          style={{ willChange: "height, max-width, border-radius" }}
        >
          <nav
            className={`mx-auto flex h-full w-full max-w-[1440px] items-center justify-between transition-[padding] duration-[450ms] ease-spring ${
              scrolled ? "px-4 md:px-6" : "px-5 md:px-10"
            }`}
          >
            <Link href="/" onClick={onNav("/")} className="group flex shrink-0 items-center gap-3">
              {/* Navy/red mark on light surfaces; cream/red variant when the site is in dark mode */}
              <Image
                src="/assets/icon-light.png"
                alt="Mannat Framing Ltd. logo"
                width={38}
                height={40}
                priority
                className={`w-auto object-contain transition-[height,transform] duration-[450ms] ease-spring group-hover:scale-[1.04] dark:hidden ${
                  scrolled ? "h-7 md:h-8" : "h-[38px]"
                }`}
              />
              <Image
                src="/assets/icon-dark.png"
                alt=""
                aria-hidden="true"
                width={38}
                height={40}
                className={`hidden w-auto object-contain transition-[height,transform] duration-[450ms] ease-spring group-hover:scale-[1.04] dark:block ${
                  scrolled ? "h-7 md:h-8" : "h-[38px]"
                }`}
              />
              <span className="flex flex-col leading-[1.15]">
                <span className="font-heading text-[15px] font-extrabold tracking-[0.5px] text-ink">MANNAT FRAMING</span>
                <span
                  className={`overflow-hidden text-[11px] tracking-[0.3px] text-ink-2 transition-[max-height,opacity] duration-[450ms] ease-spring ${
                    scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
                  }`}
                >
                  Surrey, BC
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {links.map((l) =>
                l.label === "Services" ? (
                  <div
                    key={l.href}
                    className="relative"
                    onMouseEnter={openServices}
                    onMouseLeave={closeServices}
                    onFocus={openServices}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false);
                    }}
                  >
                    <Link
                      href="/services"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={(e) => {
                        // First tap on touch devices opens the menu; second tap follows the link.
                        if (window.matchMedia("(hover: none)").matches && !servicesOpen) {
                          e.preventDefault();
                          setServicesOpen(true);
                          return;
                        }
                        onNav("/services")(e);
                      }}
                      className={`${linkCls(isActive("/services"))} flex items-center gap-1`}
                    >
                      Services
                      <Chevron open={servicesOpen} />
                    </Link>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: EASE }}
                          className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-4"
                        >
                          <div className="overflow-hidden border border-ink/10 border-t-2 border-t-gold bg-surface-2 p-3 shadow-lift backdrop-blur-xl">
                            <div className="grid grid-cols-2 gap-1.5">
                              {SERVICES.map((s) => {
                                const active = pathname === `/services/${s.slug}`;
                                return (
                                  <Link
                                    key={s.slug}
                                    href={`/services/${s.slug}`}
                                    onClick={onNav(`/services/${s.slug}`)}
                                    className={`group/item flex items-center gap-3 p-2.5 transition-[background-color,transform] duration-300 ease-spring hover:bg-gold/10 active:bg-gold/10 ${
                                      active ? "bg-gold/10" : ""
                                    }`}
                                  >
                                    <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-charcoal">
                                      <Image src={s.photo} alt="" fill sizes="48px" className="object-cover transition-transform duration-500 ease-spring group-hover/item:scale-110" />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block font-mono text-[9.5px] font-medium uppercase tracking-[1.4px] text-accent">{s.tag}</span>
                                      <span className="mt-0.5 block truncate font-heading text-sm font-bold text-ink transition-colors duration-300 group-hover/item:text-accent">
                                        {s.title}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                              <Link
                                href="/services"
                                onClick={onNav("/services")}
                                className="group/all col-span-2 flex items-center justify-center gap-2 rounded-full bg-gold p-3 font-heading text-sm font-bold text-black transition-[background-color,gap] duration-300 ease-spring hover:gap-3 hover:bg-gold-dark active:bg-gold-dark"
                              >
                                View All Services
                                <span aria-hidden="true" className="transition-transform duration-300 ease-spring group-hover/all:translate-x-1">
                                  &rarr;
                                </span>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={l.href} href={l.href} onClick={onNav(l.href)} className={linkCls(isActive(l.href))}>
                    {l.label}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <a
                href="tel:+17787238994"
                className="hidden items-center gap-1.5 whitespace-nowrap text-[13px] text-ink transition-[color,transform] duration-300 ease-spring hover:-translate-y-0.5 hover:text-accent lg:flex"
              >
                <ServiceIcon slug="phone" size={13} className="text-accent" />
                (778) 723-8994
              </a>
              <ThemeToggle />
              <Link
                href="/contact"
                onClick={onNav("/contact")}
                className={`hidden whitespace-nowrap border border-gold text-xs tracking-[0.3px] text-ink transition-[background-color,color,transform,border-radius,padding] md:inline-block duration-[450ms] ease-spring hover:scale-[1.03] hover:bg-gold hover:text-black active:scale-[0.98] active:bg-gold active:text-black md:text-[13px] ${
                  scrolled ? "rounded-full px-4 py-2 md:px-5 md:py-[9px]" : "rounded-full px-[14px] py-[9px] md:px-[22px] md:py-[11px]"
                }`}
              >
                Get a Free Quote &rarr;
              </Link>
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center text-ink transition-transform duration-300 ease-spring active:scale-90 md:hidden"
              >
                <span className="relative block h-4 w-5">
                  <span className={`absolute left-0 top-0 h-[2px] w-5 bg-current transition-transform duration-300 ease-spring ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                  <span className={`absolute left-0 top-[7px] h-[2px] w-5 bg-current transition-opacity duration-300 ease-spring ${open ? "opacity-0" : ""}`} />
                  <span className={`absolute left-0 top-[14px] h-[2px] w-5 bg-current transition-transform duration-300 ease-spring ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden border border-ink/10 bg-surface/95 shadow-lift backdrop-blur-xl md:hidden ${
                  scrolled ? "rounded-3xl" : "mx-3 rounded-3xl"
                }`}
              >
                <div className="flex max-h-[calc(100vh-140px)] flex-col gap-1 overflow-y-auto px-4 py-4">
                  {links.map((l, i) => {
                    const active = isActive(l.href);
                    const itemCls = `block rounded-xl px-3 py-3 font-heading text-base font-bold transition-[background-color,color,transform] duration-300 ease-spring active:translate-x-1 active:bg-gold/10 ${
                      active ? "bg-gold/10 text-accent" : "text-ink"
                    }`;
                    return (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: EASE, delay: 0.05 + i * 0.05 }}
                      >
                        {l.label === "Services" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setMobileServicesOpen((v) => !v)}
                              aria-expanded={mobileServicesOpen}
                              className={`${itemCls} flex w-full cursor-pointer items-center justify-between border-0 bg-transparent text-left`}
                            >
                              <span className="flex items-center gap-1.5">
                                Services <Chevron open={mobileServicesOpen} />
                              </span>
                            </button>
                            <AnimatePresence initial={false}>
                              {mobileServicesOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <div className="mb-2 ml-4 flex flex-col gap-1 border-l-2 border-gold/40 pl-3">
                                    <Link href="/services" onClick={onNav("/services")} className="block rounded-lg px-3 py-2 text-sm font-semibold text-accent transition-transform duration-300 ease-spring active:translate-x-1">
                                      All Services
                                    </Link>
                                    {SERVICES.map((s) => (
                                      <Link
                                        key={s.slug}
                                        href={`/services/${s.slug}`}
                                        onClick={onNav(`/services/${s.slug}`)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-[background-color,transform] duration-300 ease-spring active:translate-x-1 active:bg-gold/10 ${
                                          pathname === `/services/${s.slug}` ? "text-accent" : "text-ink-2"
                                        }`}
                                      >
                                        <span className="relative h-8 w-8 shrink-0 overflow-hidden bg-charcoal">
                                          <Image src={s.photo} alt="" fill sizes="32px" className="object-cover" />
                                        </span>
                                        {s.title}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link href={l.href} onClick={onNav(l.href)} className={itemCls}>
                            {l.label}
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE, delay: 0.05 + links.length * 0.05 }}
                    className="mt-2 px-1 pb-1"
                  >
                    <Link
                      href="/contact"
                      onClick={onNav("/contact")}
                      className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-heading text-sm font-bold text-black shadow-[0_12px_30px_-12px_rgba(197,164,109,0.7)] transition-transform duration-300 ease-spring active:scale-[0.98]"
                    >
                      Get a Free Quote <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      {/* Flow spacer: keeps page content below the fixed header at its rest height. */}
      <div aria-hidden="true" style={{ height: NAV_REST_HEIGHT }} />
    </>
  );
}

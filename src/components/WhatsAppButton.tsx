"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const NUMBER = "17787238994"; // (778) 723-8994
const MESSAGE = "Hi Mannat Framing, I'd like to talk about a framing project.";
const HREF = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

/** Floating WhatsApp chat button: slides in after the visitor scrolls, sits above the mobile quote bar. */
export default function WhatsAppButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShown(window.scrollY > 240);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.a
          key="whatsapp"
          href={HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Mannat Framing on WhatsApp"
          title="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="group fixed bottom-[86px] right-4 z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.65)] md:bottom-7 md:right-7"
        >
          {/* pulsing halo */}
          <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/45 animate-[mf-wa-pulse_2.4s_ease-out_infinite]" />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            <path d="M12.05 2C6.58 2 2.13 6.45 2.13 11.92c0 1.75.46 3.46 1.33 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.47 0 9.92-4.45 9.92-9.92S17.52 2 12.05 2Zm0 18.16c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.24-8.2 8.24Z" />
          </svg>
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-black/85 px-3 py-1.5 text-xs text-warm-white opacity-0 shadow-lift backdrop-blur transition-[opacity,transform] duration-300 ease-spring translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 md:block">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

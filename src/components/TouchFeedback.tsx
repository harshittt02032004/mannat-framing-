"use client";

import { useEffect } from "react";

/**
 * Site-wide press feedback. On pointerdown over any link / button / select / summary we add
 * `.mf-press` (transition only) and `.mf-press-down` (the pressed state); CSS in globals.css does the animating.
 * Inline text links (phone, email, footer links) get a colour shift instead of a transform,
 * because transforms do not apply to `display: inline` boxes.
 */
const SELECTOR = "a, button, select, summary, [role='button'], [role='menuitem'], [role='option'], [data-press]";
const MIN_VISIBLE_MS = 170; // keep the pressed state on screen long enough to read as feedback on a quick tap
const RELEASE_TRANSITION_MS = 380;

export default function TouchFeedback() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = new WeakMap<Element, number>();

    const release = (el: HTMLElement, downAt: number) => {
      const elapsed = performance.now() - downAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      const prev = timers.get(el);
      if (prev) window.clearTimeout(prev);
      const t = window.setTimeout(() => {
        el.classList.remove("mf-press-down");
        const t2 = window.setTimeout(() => el.classList.remove("mf-press"), RELEASE_TRANSITION_MS);
        timers.set(el, t2);
      }, wait);
      timers.set(el, t);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null;
      if (!target || target.hasAttribute("data-no-press") || (target as HTMLButtonElement).disabled) return;

      const display = getComputedStyle(target).display;
      target.classList.toggle("mf-press-inline", display === "inline");
      const prev = timers.get(target);
      if (prev) window.clearTimeout(prev);
      target.classList.add("mf-press");
      // next frame so the transition is in place before the state flips
      requestAnimationFrame(() => target.classList.add("mf-press-down"));

      const downAt = performance.now();
      const end = () => {
        release(target, downAt);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        target.removeEventListener("pointerleave", end);
      };
      window.addEventListener("pointerup", end, { passive: true });
      window.addEventListener("pointercancel", end, { passive: true });
      target.addEventListener("pointerleave", end, { passive: true });
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}

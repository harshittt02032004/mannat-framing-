"use client";

import { useEffect, useRef } from "react";

/**
 * Looping tower-crane motif drawn in thin gold lines on a canvas. Mount it inside a
 * `position: relative` hero (it attaches resize / visibility / mouse tracking to its parent).
 * It anchors to the right edge, vertically centres on the block from the eyebrow to the
 * paragraph, never comes within `clearance` px of the heading's right edge, and hides below
 * `minWidth`. Vanilla canvas on a delta-time RAF loop; no libraries.
 */
export type CraneMotifProps = {
  /** Desktop size at ≥1280px; scales to ~76% of this at 1024px. */
  size?: { w: number; h: number };
  /** Structure / moving-part opacity (both capped at 0.65). */
  opacity?: { structure: number; moving: number };
  /** Run the lift cycle after the draw-in. */
  loop?: boolean;
  /** Viewport width below which the motif switches to compact mode (flows below the copy instead of floating beside it). */
  minWidth?: number;
  /** Minimum gap between the crane's left edge and the heading's right edge. */
  clearance?: number;
  /** CSS `right` offset inside the hero. */
  right?: string;
};

// Design space (everything below is in these units and scaled to the rendered size)
const DW = 340, DH = 260;
const GROUND_Y = 248, MAST_X = 85, MAST_TOP = 39, APEX_Y = 20, RAIL = 6, JIB_END = 323, CJIB_END = 34;
const CHORD_TOP = 39, CHORD_BOT = 47, LACE = 14;
const LAND_X = Math.round(DW * 0.78); // 265
const TROLLEY_START = MAST_X + 0.3 * (JIB_END - MAST_X); // 30% of jib length
const CARRY_Y = 110;
const LAYER = 8; // stack layer: 2px blocks + 5px beam + 1px
const CYCLE_MS = 6000, DRAW_MS = 2400, STACK_MAX = 4, STACK_FADE_MS = 1200;

type Seg = [number, number, number, number, "chord" | "lace" | "trolley"];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Static structure in draw order: ground → mast → apex → jib + counter-jib → trolley (trolley drawn live). */
function buildStructure(): { ground: Seg[]; mast: Seg[]; apex: Seg[]; jib: Seg[] } {
  const ground: Seg[] = [[6, GROUND_Y, DW - 6, GROUND_Y, "chord"]];
  const mast: Seg[] = [
    [MAST_X - RAIL, GROUND_Y, MAST_X - RAIL, MAST_TOP, "chord"],
    [MAST_X + RAIL, GROUND_Y, MAST_X + RAIL, MAST_TOP, "chord"],
  ];
  let flip = false;
  for (let y = GROUND_Y; y - LACE >= MAST_TOP; y -= LACE) {
    mast.push(flip ? [MAST_X + RAIL, y, MAST_X - RAIL, y - LACE, "lace"] : [MAST_X - RAIL, y, MAST_X + RAIL, y - LACE, "lace"]);
    flip = !flip;
  }
  const apex: Seg[] = [
    [MAST_X, MAST_TOP, MAST_X, APEX_Y, "chord"], // pinnacle
    [MAST_X, APEX_Y, MAST_X + 0.6 * (JIB_END - MAST_X), CHORD_TOP, "lace"], // pendant to jib
    [MAST_X, APEX_Y, CJIB_END + 4, CHORD_TOP, "lace"], // pendant to counter-jib
  ];
  const jib: Seg[] = [
    [MAST_X, CHORD_TOP, JIB_END, CHORD_TOP, "chord"],
    [MAST_X, CHORD_BOT, JIB_END, CHORD_BOT, "chord"],
    [JIB_END, CHORD_TOP, JIB_END, CHORD_BOT, "chord"],
  ];
  flip = false;
  for (let x = MAST_X; x + LACE <= JIB_END; x += LACE) {
    jib.push(flip ? [x, CHORD_BOT, x + LACE, CHORD_TOP, "lace"] : [x, CHORD_TOP, x + LACE, CHORD_BOT, "lace"]);
    flip = !flip;
  }
  jib.push([MAST_X, CHORD_TOP, CJIB_END, CHORD_TOP, "chord"], [MAST_X, CHORD_BOT, CJIB_END, CHORD_BOT, "chord"]);
  for (let x = MAST_X; x - LACE >= CJIB_END; x -= LACE) {
    jib.push(flip ? [x, CHORD_BOT, x - LACE, CHORD_TOP, "lace"] : [x, CHORD_TOP, x - LACE, CHORD_BOT, "lace"]);
    flip = !flip;
  }
  // counterweight block
  const cw = { x1: CJIB_END, x2: CJIB_END + 16, y1: CHORD_BOT, y2: CHORD_BOT + 11 };
  jib.push([cw.x1, cw.y1, cw.x1, cw.y2, "chord"], [cw.x1, cw.y2, cw.x2, cw.y2, "chord"], [cw.x2, cw.y2, cw.x2, cw.y1, "chord"]);
  return { ground, mast, apex, jib };
}

export default function CraneMotif({
  size = { w: 340, h: 260 },
  opacity = { structure: 0.42, moving: 0.6 },
  loop = true,
  minWidth = 1024,
  clearance = 40,
  right = "6%",
}: CraneMotifProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const OP_S = Math.min(0.65, opacity.structure), OP_M = Math.min(0.65, opacity.moving);
    const S = buildStructure();
    const drawOrder: Seg[] = [...S.ground, ...S.mast, ...S.apex, ...S.jib];
    const cum: number[] = []; let total = 0;
    for (const s of drawOrder) { total += Math.hypot(s[2] - s[0], s[3] - s[1]); cum.push(total); }
    const TROLLEY_DRAW = 24; // trolley outline drawn last during the draw-in
    total += TROLLEY_DRAW;

    const st = {
      w: 0, h: 0, scale: 1, dpr: 1, visible: false,
      rgb: [201, 169, 97] as [number, number, number],
      drawnIn: reduced, drawT: 0,
      cycleT: 0, stack: reduced ? 2 : 0, stackFade: -1, ring: -1, ringAt: { x: LAND_X, y: GROUND_Y },
      sway: 0, bob: 0,
      par: { x: 0, y: 0 }, parTarget: { x: 0, y: 0 },
      raf: 0, lastT: 0, onScreen: true,
    };

    // ---------- placement ----------
    const measure = () => {
      const hr = hero.getBoundingClientRect();
      const vw = window.innerWidth;
      st.rgb = hexToRgb((getComputedStyle(document.documentElement).getPropertyValue("--color-gold") || "").trim() || "#c9a961");
      const h1 = hero.querySelector("h1");
      if (vw < minWidth) {
        // Compact mode (phones / tablets): the canvas flows below the hero copy instead of floating beside it.
        const padL = parseFloat(getComputedStyle(hero).paddingLeft) || 0;
        const padR = parseFloat(getComputedStyle(hero).paddingRight) || 0;
        const w = Math.min(size.w * 0.85, hr.width - padL - padR - 24);
        if (w < 140) { st.visible = false; canvas.style.display = "none"; stopLoop(); return; }
        const h = (w * size.h) / size.w;
        st.w = w; st.h = h; st.scale = w / DW;
        st.dpr = Math.min(2, window.devicePixelRatio || 1);
        Object.assign(canvas.style, { display: "block", position: "relative", right: "", top: "", marginTop: "36px", marginLeft: "auto", marginRight: "24px" });
        canvas.style.width = `${Math.round(w)}px`; canvas.style.height = `${Math.round(h)}px`;
        canvas.width = Math.round(w * st.dpr); canvas.height = Math.round(h * st.dpr);
        st.visible = true;
        if (reduced) render(); else startLoop();
        return;
      }
      Object.assign(canvas.style, { position: "", marginTop: "", marginLeft: "", marginRight: "" });
      // size: full at ≥1280, ~76% at 1024, linear between
      const t = clamp((vw - 1024) / (1280 - 1024), 0, 1);
      let w = size.w * (0.7647 + 0.2353 * t);
      // never within `clearance` of the heading's right edge
      let headingRight = 0;
      if (h1) { const range = document.createRange(); range.selectNodeContents(h1); headingRight = range.getBoundingClientRect().right - hr.left; }
      const rightPx = right.endsWith("%") ? (parseFloat(right) / 100) * hr.width : parseFloat(right);
      const maxW = hr.width - rightPx - headingRight - clearance;
      w = Math.min(w, maxW);
      if (w < 140) { st.visible = false; canvas.style.display = "none"; stopLoop(); return; }
      const h = (w * size.h) / size.w;
      // vertical centre of the eyebrow → paragraph block
      const eyebrow = h1?.previousElementSibling as HTMLElement | null;
      const para = hero.querySelector("p");
      const topEl = eyebrow ?? h1, botEl = para ?? h1;
      const top = topEl ? topEl.getBoundingClientRect().top - hr.top : 0;
      const bottom = botEl ? botEl.getBoundingClientRect().bottom - hr.top : hr.height;
      const cy = (top + bottom) / 2;
      st.w = w; st.h = h; st.scale = w / DW;
      st.dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.style.display = "block";
      canvas.style.right = right;
      canvas.style.top = `${Math.round(cy - h / 2)}px`;
      canvas.style.width = `${Math.round(w)}px`; canvas.style.height = `${Math.round(h)}px`;
      canvas.width = Math.round(w * st.dpr); canvas.height = Math.round(h * st.dpr);
      st.visible = true;
      if (reduced) render(); else startLoop();
    };

    // ---------- drawing helpers ----------
    const rgba = (a: number) => `rgba(${st.rgb[0]},${st.rgb[1]},${st.rgb[2]},${a})`;
    const line = (x1: number, y1: number, x2: number, y2: number, width: number, alpha: number) => {
      ctx.strokeStyle = rgba(alpha); ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const segStyle = (s: Seg): [number, number] => (s[4] === "lace" ? [0.75, OP_S * 0.6] : [1, OP_S]);

    /** Rotate a design point around the apex (jib sway). */
    const swayPt = (x: number, y: number) => {
      const c = Math.cos(st.sway), s = Math.sin(st.sway);
      const dx = x - MAST_X, dy = y - MAST_TOP;
      return { x: MAST_X + dx * c - dy * s, y: MAST_TOP + dx * s + dy * c };
    };

    const drawTrolley = (tx: number, frac = 1) => {
      // 8 x 4 block on the jib underside, drawn as an outline (frac draws it progressively)
      const pts = [[tx - 4, CHORD_BOT], [tx + 4, CHORD_BOT], [tx + 4, CHORD_BOT + 4], [tx - 4, CHORD_BOT + 4], [tx - 4, CHORD_BOT]];
      const per = 1 / 4;
      for (let i = 0; i < 4; i++) {
        const f = clamp((frac - i * per) / per, 0, 1);
        if (f <= 0) break;
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        line(x1, y1, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 1, OP_M);
      }
    };

    const drawStack = (count: number, alpha: number) => {
      for (let n = 0; n < count; n++) {
        const top = GROUND_Y - LAYER * (n + 1);
        line(LAND_X - 15, top + 5, LAND_X - 11, top + 5, 1, OP_S * alpha); // blocks
        line(LAND_X + 11, top + 5, LAND_X + 15, top + 5, 1, OP_S * alpha);
        line(LAND_X - 15, top + 7, LAND_X - 11, top + 7, 1, OP_S * alpha);
        line(LAND_X + 11, top + 7, LAND_X + 15, top + 7, 1, OP_S * alpha);
        ctx.strokeStyle = rgba(OP_M * alpha); ctx.lineWidth = 1.6;
        ctx.strokeRect(LAND_X - 17, top, 34, 5); // beam
      }
    };

    const render = () => {
      ctx.setTransform(st.dpr * st.scale, 0, 0, st.dpr * st.scale, 0, 0);
      ctx.clearRect(0, 0, DW, DH);
      ctx.lineCap = "round";
      ctx.translate(st.par.x / st.scale, st.par.y / st.scale);

      // ---- static structure (progressive during the draw-in) ----
      const drawnLen = st.drawnIn ? Infinity : (st.drawT / DRAW_MS) * total;
      let pen: { x: number; y: number } | null = null;
      const inJib = (i: number) => i >= S.ground.length + S.mast.length + S.apex.length;
      for (let i = 0; i < drawOrder.length; i++) {
        const start = i === 0 ? 0 : cum[i - 1];
        if (drawnLen <= start) break;
        const s = drawOrder[i];
        const len = cum[i] - start;
        const f = Math.min(1, (drawnLen - start) / len);
        const [wdt, alpha] = segStyle(s);
        let a = { x: s[0], y: s[1] }, b = { x: s[2], y: s[3] };
        if (inJib(i) && st.drawnIn) { a = swayPt(a.x, a.y); b = swayPt(b.x, b.y); }
        const ex = a.x + (b.x - a.x) * f, ey = a.y + (b.y - a.y) * f;
        line(a.x, a.y, ex, ey, wdt, alpha);
        if (f < 1) pen = { x: ex, y: ey };
      }

      // ---- trolley, hoist, hook, beam ----
      const structDone = drawnLen >= cum[cum.length - 1];
      if (structDone) {
        const trolleyFrac = st.drawnIn ? 1 : clamp((drawnLen - cum[cum.length - 1]) / TROLLEY_DRAW, 0, 1);
        // lift cycle
        const ph = (st.cycleT % CYCLE_MS) / CYCLE_MS;
        let tx = TROLLEY_START, hookY = CARRY_Y, carrying = true;
        const stackTop = GROUND_Y - LAYER * st.stack;
        const landY = stackTop - 2 - 9; // hook height so the beam rests on its blocks
        if (reduced) { tx = LAND_X; hookY = CARRY_Y; carrying = false; }
        else if (st.drawnIn && loop) {
          if (ph < 0.25) tx = TROLLEY_START + (LAND_X - TROLLEY_START) * easeInOut(ph / 0.25);
          else if (ph < 0.6) { tx = LAND_X; hookY = CARRY_Y + (landY - CARRY_Y) * easeInOut((ph - 0.25) / 0.35); }
          else if (ph < 0.75) { tx = LAND_X; hookY = landY; carrying = false; }
          else { carrying = false; const u = easeInOut((ph - 0.75) / 0.25); tx = LAND_X + (TROLLEY_START - LAND_X) * u; hookY = landY + (CARRY_Y - landY) * u; }
        } else { carrying = false; }
        if (!st.drawnIn) { pen = trolleyFrac < 1 ? { x: tx - 4 + 8 * Math.min(1, trolleyFrac * 4), y: CHORD_BOT } : pen; }
        // trolley rides the swaying jib
        ctx.save();
        ctx.translate(MAST_X, MAST_TOP); ctx.rotate(st.sway); ctx.translate(-MAST_X, -MAST_TOP);
        drawTrolley(tx, trolleyFrac);
        ctx.restore();
        if (st.drawnIn) {
          const tp = swayPt(tx, CHORD_BOT + 4);
          const hy = hookY + st.bob;
          line(tp.x, tp.y, tp.x, hy, 1, OP_M); // hoist line
          ctx.strokeStyle = rgba(OP_M); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(tp.x, hy + 3, 3, 0, Math.PI * 2); ctx.stroke(); // hook
          if (carrying) { ctx.lineWidth = 1.6; ctx.strokeRect(tp.x - 17, hy + 7, 34, 5); } // beam
        }
      }

      // ---- stack + landing ring ----
      const stackAlpha = st.stackFade >= 0 ? 1 - st.stackFade / STACK_FADE_MS : 1;
      drawStack(st.stack, stackAlpha);
      if (st.ring >= 0) {
        const u = st.ring / 600;
        ctx.strokeStyle = `rgba(255,236,196,${0.6 * (1 - u)})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(st.ringAt.x, st.ringAt.y, 4 + 14 * u, 0, Math.PI * 2); ctx.stroke();
      }

      // ---- leading pen dot during the draw-in ----
      if (pen && !st.drawnIn) {
        ctx.fillStyle = "rgba(255,236,196,0.9)";
        ctx.beginPath(); ctx.arc(pen.x, pen.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
    };

    // ---------- loop ----------
    const tick = (now: number) => {
      st.raf = 0;
      if (!st.onScreen || !st.visible || reduced) return;
      const dt = Math.min(50, now - st.lastT);
      st.lastT = now;
      // parallax easing, 5% per 60fps frame
      const k = 1 - Math.pow(0.95, dt / 16.667);
      st.par.x += (st.parTarget.x - st.par.x) * k;
      st.par.y += (st.parTarget.y - st.par.y) * k;
      if (!st.drawnIn) {
        st.drawT += dt;
        if (st.drawT >= DRAW_MS) { st.drawnIn = true; st.cycleT = 0; }
      } else if (loop) {
        const before = (st.cycleT % CYCLE_MS) / CYCLE_MS;
        st.cycleT += dt;
        const after = (st.cycleT % CYCLE_MS) / CYCLE_MS;
        if (before < 0.6 && (after >= 0.6 || after < before)) {
          // beam released
          st.stack = Math.min(STACK_MAX, st.stack + 1);
          st.ring = 0; st.ringAt = { x: LAND_X, y: GROUND_Y - LAYER * st.stack };
          if (st.stack >= STACK_MAX) st.stackFade = 0;
        }
        if (st.ring >= 0) { st.ring += dt; if (st.ring > 600) st.ring = -1; }
        if (st.stackFade >= 0) { st.stackFade += dt; if (st.stackFade >= STACK_FADE_MS) { st.stackFade = -1; st.stack = 0; } }
        st.sway = (0.4 * Math.PI / 180) * Math.sin((now / 9000) * Math.PI * 2);
        st.bob = Math.sin((now / 3000) * Math.PI * 2);
      }
      render();
      st.raf = requestAnimationFrame(tick);
    };
    const startLoop = () => { if (st.raf || reduced || !st.visible || !st.onScreen) return; st.lastT = performance.now(); st.raf = requestAnimationFrame(tick); };
    const stopLoop = () => { if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; };

    // ---------- listeners ----------
    const onMove = (e: MouseEvent) => {
      if (reduced) return;
      const r = hero.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2, ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      st.parTarget = { x: -nx * 6, y: -ny * 4 };
    };
    const onLeave = () => { st.parTarget = { x: 0, y: 0 }; };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    const io = new IntersectionObserver((entries) => {
      st.onScreen = !!entries[0]?.isIntersecting;
      if (st.onScreen) startLoop(); else stopLoop();
    }, { threshold: 0 });
    io.observe(hero);
    measure();
    const remeasure = window.setTimeout(measure, 1600); // after the heading's word reveal settles

    return () => {
      stopLoop();
      window.clearTimeout(remeasure);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [size.w, size.h, opacity.structure, opacity.moving, loop, minWidth, clearance, right]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute -z-10" style={{ display: "none" }} />;
}

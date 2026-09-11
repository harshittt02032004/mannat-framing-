"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Click-driven isometric wireframe house frame, drawn on a <canvas> behind the About hero's
 * text. Sill plate + ground grid are always visible; three clicks on the panel build the studs,
 * then plates + rafters, then reset. Vanilla canvas on a delta-time RAF loop; no libraries.
 *
 * Mount it as the first child of the dark panel (a `position: relative` element) — it attaches
 * its click / mouse listeners to that parent and covers it with the canvas.
 */

const GOLD = "#c9a961";
const GOLD_RGB = "201,169,97";
const DOT = "rgba(255,236,196,1)";

// Model: 220 x 150 footprint, 95 wall height, ridge at 155. Origin at footprint centre, z up.
const HW = 110, HD = 75, H = 95, RIDGE = 155, STUD = 22, RAFTER = 44;
// 0.52 is specified relative to a 2x unit; this is the resulting px-per-model-unit at desktop.
const BASE_SCALE = 0.52 * 1.75;
const BASE_TILT = 0.62;
const CENTER = { x: 0.78, y: 0.38 };
const AUTO_ROTATE = 0.1; // rad/s
const BUILD_MS = 3000;
const RESET_MS = 1200;
/** Height of the band reserved under the hero copy on phones / tablets (matches AboutHero's compact bottom padding). */
const COMPACT_BAND = 300;

type V3 = [number, number, number];
type Stage = 1 | 2 | 3 | 4;
type Seg = { a: V3; b: V3; stage: Stage; width: number; alpha: number; len: number };

const STAGE_LABEL: Record<Stage | 5, string> = {
  1: "SILL PLATE",
  2: 'WALL STUDS 16" O.C.',
  3: "TOP PLATE",
  4: "RAFTERS + RIDGE",
  5: "COMPLETE",
};
// Progress windows: stage 2 = 0..0.5, stage 3 = 0.5..0.62, stage 4 = 0.62..1
const WINDOW: Record<2 | 3 | 4, [number, number]> = { 2: [0, 0.5], 3: [0.5, 0.62], 4: [0.62, 1] };

function seg(a: V3, b: V3, stage: Stage, width: number, alpha: number): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  return { a, b, stage, width, alpha, len };
}

function buildModel(): Seg[] {
  const s: Seg[] = [];
  // 1. Sill plate
  const c: V3[] = [[-HW, -HD, 0], [HW, -HD, 0], [HW, HD, 0], [-HW, HD, 0]];
  for (let i = 0; i < 4; i++) s.push(seg(c[i], c[(i + 1) % 4], 1, 1.4, 0.6));
  // 2. Studs (pen travels front → right → back → left). Window between studs 3–6 on the front wall.
  const winL = -HW + STUD * 3, winR = -HW + STUD * 6, sillZ = 35, headZ = 70;
  for (let k = 0; k <= 10; k++) {
    const x = -HW + STUD * k;
    if (x > winL && x < winR) {
      s.push(seg([x, -HD, 0], [x, -HD, sillZ], 2, 1, 0.45)); // cripple below sill
      s.push(seg([x, -HD, headZ], [x, -HD, H], 2, 1, 0.45)); // cripple above header
    } else s.push(seg([x, -HD, 0], [x, -HD, H], 2, 1, 0.45));
  }
  s.push(seg([winL, -HD, sillZ], [winR, -HD, sillZ], 2, 1, 0.45)); // window sill
  s.push(seg([winL, -HD, headZ], [winR, -HD, headZ], 2, 1, 0.45)); // window header
  for (let k = 1; k <= 6; k++) s.push(seg([HW, -HD + STUD * k, 0], [HW, -HD + STUD * k, H], 2, 1, 0.45)); // right wall
  for (let k = 10; k >= 0; k--) s.push(seg([-HW + STUD * k, HD, 0], [-HW + STUD * k, HD, H], 2, 1, 0.45)); // back wall
  for (let k = 6; k >= 1; k--) s.push(seg([-HW, -HD + STUD * k, 0], [-HW, -HD + STUD * k, H], 2, 1, 0.45)); // left wall
  // 3. Top plates
  const t: V3[] = [[-HW, -HD, H], [HW, -HD, H], [HW, HD, H], [-HW, HD, H]];
  for (let i = 0; i < 4; i++) s.push(seg(t[i], t[(i + 1) % 4], 3, 1.4, 0.6));
  // 4. Ridge, rafters every 44 units from both plates, gable posts at both ends
  s.push(seg([-HW, 0, RIDGE], [HW, 0, RIDGE], 4, 1, 0.65));
  for (let x = -HW; x <= HW; x += RAFTER) {
    s.push(seg([x, -HD, H], [x, 0, RIDGE], 4, 1, 0.65));
    s.push(seg([x, HD, H], [x, 0, RIDGE], 4, 1, 0.65));
  }
  s.push(seg([-HW, 0, H], [-HW, 0, RIDGE], 4, 1, 0.65));
  s.push(seg([HW, 0, H], [HW, 0, RIDGE], 4, 1, 0.65));
  return s;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function IsoFrame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const [hint, setHint] = useState("CLICK TO FRAME");
  const [stage, setStage] = useState<string>(STAGE_LABEL[1]);
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = canvas?.parentElement;
    if (!canvas || !panel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    const VERB = touch ? "TAP" : "CLICK";
    let compact = false;
    const model = buildModel();
    const stageLen: Record<2 | 3 | 4, number> = { 2: 0, 3: 0, 4: 0 };
    for (const s of model) if (s.stage !== 1) stageLen[s.stage] += s.len;

    // ---- state (refs, not React state: the loop must never re-render) ----
    const st = {
      W: 0, H: 0, dpr: 1,
      scale: BASE_SCALE, cx: 0, cy: 0, visible: false, onScreen: true,
      rot: 0.6, autoRot: 0.6, rotTarget: 0.6, tilt: BASE_TILT, tiltTarget: BASE_TILT, hovering: false,
      progress: 0, from: 0, to: 0, animStart: 0, animMs: 0, phase: "idle" as "idle" | "build" | "reset",
      builtAlpha: 1, clicks: 0, currentStage: 1 as Stage | 5,
      ring: 0, ringAt: { x: 0, y: 0 }, lastT: 0, raf: 0,
    };
    let lastHint = "", lastLabel = "", lastBusy: boolean | null = null, lastHidden: boolean | null = null;
    const setUi = (h: string, l: string, b: boolean) => {
      if (h !== lastHint) { lastHint = h; setHint(h); }
      if (l !== lastLabel) { lastLabel = l; setStage(l); }
      if (b !== lastBusy) { lastBusy = b; setBusy(b); panel.style.cursor = st.visible ? (b ? "default" : "pointer") : ""; }
    };

    // ---- sizing ----
    const measure = () => {
      const r = panel.getBoundingClientRect();
      st.W = r.width; st.H = r.height;
      st.dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(st.W * st.dpr); canvas.height = Math.round(st.H * st.dpr);
      canvas.style.width = `${st.W}px`; canvas.style.height = `${st.H}px`;
      const halfW = 0.5 * (2 * HW + 2 * HD) * Math.SQRT1_2; // widest projected half-width per unit of scale
      compact = window.innerWidth < 1024;
      if (compact) {
        // Phones / tablets: the frame sits centred in the reserved band below the hero copy (see AboutHero's bottom padding).
        st.cx = st.W * 0.5;
        st.cy = st.H - COMPACT_BAND * 0.62;
        st.scale = Math.min(BASE_SCALE * 0.8, (st.W - 48) / (2 * halfW), (COMPACT_BAND - 70) / (RIDGE + (2 * HD) * BASE_TILT * 0.5));
        st.visible = st.scale >= BASE_SCALE * 0.3;
      } else {
        st.cx = st.W * CENTER.x; st.cy = st.H * CENTER.y;
        // keep the frame right of the paragraph: shrink before overlapping, hide when it can't fit
        const para = panel.querySelector("p");
        const paraRight = para ? para.getBoundingClientRect().right - r.left : 0;
        const maxScale = (st.cx - paraRight - 16) / halfW;
        st.scale = Math.min(BASE_SCALE, maxScale);
        st.visible = st.scale >= BASE_SCALE * 0.45;
      }
      const wasHidden = lastHidden;
      lastHidden = !st.visible;
      if (wasHidden !== lastHidden) setHidden(!st.visible);
      if (hintRef.current) {
        hintRef.current.style.left = `${st.cx}px`;
        // clear the lowest projected sill corner (worst case at any rotation) before placing the hint
        const lowest = (HW + HD) * st.tilt * st.scale;
        hintRef.current.style.top = `${st.cy + lowest + (compact ? 22 : 12)}px`;
      }
      if (stageRef.current) {
        Object.assign(stageRef.current.style, compact
          ? { left: "50%", right: "auto", bottom: "22px", transform: "translateX(-50%)" }
          : { left: "auto", right: "24px", bottom: "96px", transform: "" });
      }
      panel.style.cursor = st.visible ? (st.phase === "idle" ? "pointer" : "default") : "";
    };
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    measure();

    // ---- projection ----
    const project = (p: V3) => {
      const c = Math.cos(st.rot), s = Math.sin(st.rot);
      const rx = p[0] * c - p[1] * s, ry = p[0] * s + p[1] * c;
      return { x: st.cx + rx * st.scale, y: st.cy + ry * st.tilt * st.scale - p[2] * st.scale, depth: ry };
    };

    // ---- interaction ----
    const stageAt = (p: number): Stage => (p <= 0 ? 1 : p <= WINDOW[2][1] ? 2 : p <= WINDOW[3][1] ? 3 : 4);
    const startAnim = (to: number, ms: number) => {
      st.phase = "build"; st.from = st.progress; st.to = to; st.animStart = performance.now(); st.animMs = ms;
    };
    const onClick = (e: MouseEvent) => {
      if (!st.visible || st.phase !== "idle") return;
      if ((e.target as HTMLElement).closest("a, button")) return;
      if (st.clicks === 0) {
        if (reduced) { st.progress = 0.5; st.clicks = 1; st.currentStage = 2; } else startAnim(0.5, BUILD_MS);
      } else if (st.clicks === 1) {
        if (reduced) { st.progress = 1; st.clicks = 2; st.currentStage = 5; } else startAnim(1, BUILD_MS);
      } else {
        if (reduced) { st.progress = 0; st.builtAlpha = 1; st.clicks = 0; st.currentStage = 1; }
        else { st.phase = "reset"; st.animStart = performance.now(); st.animMs = RESET_MS; }
      }
    };
    const onMove = (e: MouseEvent) => {
      if (reduced || !st.visible) return;
      const r = panel.getBoundingClientRect();
      st.hovering = true;
      st.rotTarget = st.autoRot + ((e.clientX - r.left) / r.width - 0.5) * 1.2; // ±0.6 rad
      st.tiltTarget = BASE_TILT + ((e.clientY - r.top) / r.height - 0.5) * 0.24; // ±0.12
    };
    const onLeave = () => { st.hovering = false; st.tiltTarget = BASE_TILT; };
    panel.addEventListener("click", onClick);
    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);

    const io = new IntersectionObserver((entries) => {
      st.onScreen = !!entries[0]?.isIntersecting;
      if (st.onScreen && !st.raf) { st.lastT = performance.now(); st.raf = requestAnimationFrame(frame); }
    }, { threshold: 0.05 });
    io.observe(panel);

    // ---- render loop ----
    function frame(now: number) {
      st.raf = 0;
      if (!st.onScreen) return;
      const dt = Math.min(50, now - st.lastT || 16) / 1000;
      st.lastT = now;

      // rotation / tilt
      if (!reduced) {
        if (!st.hovering) { st.autoRot += AUTO_ROTATE * dt; st.rotTarget = st.autoRot; }
        const k = 1 - Math.pow(0.94, dt * 60); // 6% per 60fps frame
        st.rot += (st.rotTarget - st.rot) * k;
        st.tilt += (st.tiltTarget - st.tilt) * k;
      }

      // build / reset animation
      if (st.phase === "build") {
        const t = Math.min(1, (now - st.animStart) / st.animMs);
        st.progress = st.from + (st.to - st.from) * easeInOut(t);
        st.currentStage = stageAt(st.progress);
        if (t >= 1) {
          st.phase = "idle";
          if (st.to >= 1) {
            st.clicks = 2; st.currentStage = 5; st.ring = 1;
            const peak = project([0, 0, RIDGE]); st.ringAt = { x: peak.x, y: peak.y };
          } else st.clicks = 1;
        }
      } else if (st.phase === "reset") {
        const t = Math.min(1, (now - st.animStart) / st.animMs);
        st.builtAlpha = 1 - t;
        if (t >= 1) { st.phase = "idle"; st.progress = 0; st.builtAlpha = 1; st.clicks = 0; st.currentStage = 1; }
      }
      if (st.ring > 0) st.ring = Math.max(0, st.ring - dt / 0.8);

      // UI text
      const busyNow = st.phase !== "idle";
      const hintText = busyNow ? "" : st.clicks === 0 ? `${VERB} TO FRAME` : st.clicks === 1 ? `${VERB} TO FINISH` : `${VERB} TO RESET`;
      setUi(hintText, STAGE_LABEL[st.phase === "reset" ? 1 : st.currentStage], busyNow);

      draw();
      st.raf = requestAnimationFrame(frame);
    }

    function draw() {
      ctx!.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx!.clearRect(0, 0, st.W, st.H);
      if (!st.visible) return;
      ctx!.lineCap = "round";

      // ground grid (gold at 8%), fading toward its edges
      ctx!.strokeStyle = `rgba(${GOLD_RGB},0.08)`; ctx!.lineWidth = 1;
      for (let x = -HW - 66; x <= HW + 66; x += STUD) {
        const a = project([x, -HD - 44, 0]), b = project([x, HD + 44, 0]);
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }
      for (let y = -HD - 44; y <= HD + 44; y += STUD) {
        const a = project([-HW - 66, y, 0]), b = project([HW + 66, y, 0]);
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }

      // depth range for the cue
      let dMin = Infinity, dMax = -Infinity;
      const proj = model.map((s) => {
        const a = project(s.a), b = project(s.b);
        const d = (a.depth + b.depth) / 2;
        if (d < dMin) dMin = d; if (d > dMax) dMax = d;
        return { a, b, d };
      });
      const depthMul = (d: number) => 0.4 + 0.6 * (dMax === dMin ? 1 : (d - dMin) / (dMax - dMin));

      // how much of each stage is drawn
      let cursor: { x: number; y: number } | null = null;
      const acc: Record<2 | 3 | 4, number> = { 2: 0, 3: 0, 4: 0 };
      model.forEach((s, i) => {
        const { a, b, d } = proj[i];
        let frac = 1;
        let alphaMul = 1;
        if (s.stage !== 1) {
          const [w0, w1] = WINDOW[s.stage];
          const stageFrac = Math.max(0, Math.min(1, (st.progress - w0) / (w1 - w0)));
          const drawnLen = stageFrac * stageLen[s.stage];
          const start = acc[s.stage];
          acc[s.stage] += s.len;
          frac = Math.max(0, Math.min(1, (drawnLen - start) / s.len));
          alphaMul = st.builtAlpha;
          if (frac > 0 && frac < 1 && st.phase === "build") cursor = { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
        }
        if (frac <= 0) return;
        const alpha = s.alpha * depthMul(d) * alphaMul;
        ctx!.strokeStyle = `rgba(${GOLD_RGB},${alpha})`;
        ctx!.lineWidth = s.width;
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(a.x + (b.x - a.x) * frac, a.y + (b.y - a.y) * frac); ctx!.stroke();
        if (frac >= 1) {
          ctx!.fillStyle = `rgba(${GOLD_RGB},${0.35 * alphaMul})`;
          ctx!.beginPath(); ctx!.arc(a.x, a.y, 1, 0, Math.PI * 2); ctx!.arc(b.x, b.y, 1, 0, Math.PI * 2); ctx!.fill();
        }
      });

      // leading pen dot
      if (cursor) {
        const c = cursor as { x: number; y: number };
        ctx!.fillStyle = DOT; ctx!.shadowColor = DOT; ctx!.shadowBlur = 10;
        ctx!.beginPath(); ctx!.arc(c.x, c.y, 2.5, 0, Math.PI * 2); ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // completion ring at the ridge peak
      if (st.ring > 0) {
        const t = 1 - st.ring;
        ctx!.strokeStyle = `rgba(255,236,196,${0.8 * (1 - t)})`; ctx!.lineWidth = 1.2;
        ctx!.beginPath(); ctx!.arc(st.ringAt.x, st.ringAt.y, 4 + 28 * t, 0, Math.PI * 2); ctx!.stroke();
      }
    }

    st.lastT = performance.now();
    st.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      panel.removeEventListener("click", onClick);
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
      panel.style.cursor = "";
    };
  }, []);

  const meta = "pointer-events-none absolute font-mono text-[11px] tracking-[0.5px] text-gold/55";
  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" />
      <span
        ref={hintRef}
        aria-hidden="true"
        className={`${meta} -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 ${hidden || busy || !hint ? "opacity-0" : "opacity-100 animate-subtle-pulse"}`}
      >
        {hint}
      </span>
      <span ref={stageRef} aria-live="polite" className={`${meta} whitespace-nowrap ${hidden ? "hidden" : ""}`}>
        {stage}
      </span>
    </>
  );
}

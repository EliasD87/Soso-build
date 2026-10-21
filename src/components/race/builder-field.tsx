"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
 * Interactive hero background: a flat grid where little "builder" agents walk
 * around laying blocks that slowly fade. The cursor lays blocks too, and a
 * click spawns extra builders. Drawn in the current text colour, so it follows
 * the light/dark theme. Static dots only under prefers-reduced-motion.
 */

const CELL = 26;
const GAP = 4;
const RADIUS = 110;
const MAX_BUILDERS = 18;
const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
] as const;

type Builder = { x: number; y: number; dir: number; wait: number; life: number };

export function BuilderField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let rgb = "245,245,245";
    let builders: Builder[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;

    const readColor = () => {
      const m = getComputedStyle(canvas).color.match(/\d+/g);
      if (m) rgb = m.slice(0, 3).join(",");
    };

    const spawn = (x: number, y: number, life = 400) => {
      if (builders.length >= MAX_BUILDERS) builders.shift();
      builders.push({ x, y, dir: Math.floor(Math.random() * 4), wait: 0, life });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      heat = new Float32Array(cols * rows);
      builders = [];
      for (let i = 0; i < Math.max(4, Math.round((cols * rows) / 260)); i++) {
        spawn(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), Infinity);
      }
    };

    const step = () => {
      for (const b of builders) {
        if (b.wait-- > 0) continue;
        b.wait = 3 + Math.floor(Math.random() * 4);
        // Mostly straight lines, occasional turns — like laying a course of bricks.
        if (Math.random() < 0.18) b.dir = (b.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        const [dx, dy] = DIRS[b.dir];
        b.x = (b.x + dx + cols) % cols;
        b.y = (b.y + dy + rows) % rows;
        heat[b.y * cols + b.x] = 1;
        b.life--;
      }
      builders = builders.filter((b) => b.life > 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const size = CELL - GAP;
      for (let y = 0; y < rows; y++) {
        // Fade the field out towards the bottom so it settles into the page.
        const fade = 1 - Math.min(1, (y * CELL) / h) ** 2.5;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const cx = x * CELL + CELL / 2;
          const cy = y * CELL + CELL / 2;
          if (pointer.active) {
            const d = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (d < RADIUS) heat[i] = Math.max(heat[i], (1 - d / RADIUS) * 0.9);
          }
          const v = heat[i];
          if (v > 0.03) {
            const s = size * (0.3 + 0.7 * v);
            ctx.fillStyle = `rgba(${rgb},${(v * 0.32 * fade).toFixed(3)})`;
            ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
          } else {
            ctx.fillStyle = `rgba(${rgb},${(0.13 * fade).toFixed(3)})`;
            ctx.fillRect(cx - 1, cy - 1, 2, 2);
          }
          heat[i] *= 0.982;
        }
      }
    };

    const loop = () => {
      step();
      draw();
      raf = visible && document.visibilityState === "visible" ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && !reduceMotion) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.inside;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p.inside) return;
      const gx = Math.floor(p.x / CELL);
      const gy = Math.floor(p.y / CELL);
      for (let i = 0; i < 3; i++) spawn(gx, gy, 120);
    };
    const onLeave = () => (pointer.active = false);

    readColor();
    resize();
    draw();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColor();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => document.visibilityState === "visible" && start();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none text-fg", className)} />;
}

"use client";

import { useEffect, useRef } from "react";

// Fundo animado: ideias (pontos) que se conectam ao se aproximar e órbitas ao redor da logo,
// fazendo referência ao slogan "novas ideias orbitam aqui".
export function InnovationBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["32,144,164", "172,32,140"];
    let w = 0, h = 0, raf = 0, t = 0;
    const orbits = [
      { rx: 1.0, ry: 0.36, speed: 0.0021, phase: 0, c: colors[0] },
      { rx: 1.35, ry: 0.5, speed: -0.0014, phase: 2, c: colors[1] },
      { rx: 1.75, ry: 0.66, speed: 0.0009, phase: 4, c: colors[0] },
    ];
    let pts: { x: number; y: number; vx: number; vy: number; r: number; c: string }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 2.5,
        c: colors[i % 5 === 0 ? 1 : 0],
      }));
    };

    const drawOrbits = () => {
      // Centro aproximado da logo, que fica acima do formulário.
      const cx = w / 2, cy = Math.max(140, h / 2 - 220);
      const base = Math.min(w * 0.42, 340);
      for (const o of orbits) {
        const rx = base * o.rx, ry = base * o.ry;
        ctx.strokeStyle = `rgba(${o.c},0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, -0.18, 0, Math.PI * 2);
        ctx.stroke();
        const a = o.phase + t * o.speed;
        const x = cx + rx * Math.cos(a) * Math.cos(-0.18) - ry * Math.sin(a) * Math.sin(-0.18);
        const y = cy + rx * Math.cos(a) * Math.sin(-0.18) + ry * Math.sin(a) * Math.cos(-0.18);
        ctx.fillStyle = `rgba(${o.c},0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t++;
      drawOrbits();
      const max = 140;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < max) {
            ctx.strokeStyle = `rgba(${pts[i].c},${0.18 * (1 - d / max)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(${p.c},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden />;
}

"use client";

import { useEffect, useRef, useState } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; plum: boolean };

/**
 * Fundo animado da tela inicial: manchas de cor em deriva + uma rede de "ideias" conectadas
 * nas cores da marca. Respeita prefers-reduced-motion, pausa com a aba oculta e pode ser
 * desligado pelo botão "Pausar animação".
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    try {
      if (localStorage.getItem("inovaparq-motion") === "off") setPaused(true);
    } catch {}
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = paused || reduced;
    let w = 0, h = 0, raf = 0, nodes: Node[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 22000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.6 + Math.random() * 2.6,
        plum: i % 7 === 0,
      }));
      draw();
    };

    const link = 150;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(40,125,142,${0.22 * (1 - d / link)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.plum ? "rgba(146,40,120,.75)" : "rgba(40,125,142,.55)";
        ctx.arc(n.x, n.y, n.plum ? n.r + 1.5 : n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.plum) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(146,40,120,.18)";
          ctx.arc(n.x, n.y, n.r + 9, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(step);
    };

    resize();
    if (!still) raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, reduced]);

  const toggle = () => {
    setPaused((p) => {
      try {
        localStorage.setItem("inovaparq-motion", p ? "on" : "off");
      } catch {}
      return !p;
    });
  };

  return (
    <>
      <div className={`landing-bg ${paused ? "reduce-motion" : ""}`} aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <canvas ref={canvasRef} />
      </div>
      {!reduced && (
        <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={paused}>
          {paused ? "Retomar animação" : "Pausar animação"}
        </button>
      )}
    </>
  );
}

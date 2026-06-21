"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal — aparición sutil on-scroll (CSS + IntersectionObserver, sin framer-motion).
 * Mantiene la misma API que antes para no tocar las secciones.
 * Respeta prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      className: `${className} reveal${shown ? " reveal-in" : ""}`,
      style: { transitionDelay: `${delay}s` },
    },
    children
  );
}

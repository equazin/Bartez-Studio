"use client";

import { useEffect, useRef } from "react";

/**
 * Polling que se pausa cuando la pestaña no está visible.
 *
 * Los paneles quedan abiertos de fondo durante horas; sin este corte cada
 * pestaña olvidada seguía consultando la base indefinidamente. Al volver a
 * primer plano se dispara una consulta inmediata si pasó más de un intervalo.
 */
export function usePolling(callback: () => void | Promise<void>, intervalMs: number): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | null = null;
    let lastRunAt = 0;

    async function run() {
      if (!active || document.hidden) return;
      lastRunAt = Date.now();
      await callbackRef.current();
    }

    function start() {
      if (timer) return;
      timer = setInterval(() => { void run(); }, intervalMs);
    }

    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
        return;
      }
      if (Date.now() - lastRunAt >= intervalMs) void run();
      start();
    }

    void run();
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs]);
}

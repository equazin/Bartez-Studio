"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "../lib/attribution";

/**
 * Captura la atribución publicitaria (UTMs + gclid/fbclid) en el primer
 * ingreso al sitio y la persiste como first-touch. Sin UI: sólo efecto.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureFirstTouch();
  }, []);

  return null;
}

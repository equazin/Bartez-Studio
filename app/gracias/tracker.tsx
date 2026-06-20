"use client";

import { useEffect } from "react";
import { trackConversion } from "../../components/Analytics";

/** Dispara el evento de conversión (GA4 + Meta Pixel) al cargar /gracias. */
export function ConversionTracker() {
  useEffect(() => {
    trackConversion("generate_lead", { value: 1, currency: "ARS", source: "web-form" });
  }, []);
  return null;
}

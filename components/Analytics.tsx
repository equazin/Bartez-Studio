"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Analítica: GA4 + Meta Pixel + Microsoft Clarity (heatmaps).
 * Activadas por env públicas (si faltan, no renderizan nada):
 *  - NEXT_PUBLIC_GA4_ID
 *  - NEXT_PUBLIC_META_PIXEL_ID
 *  - NEXT_PUBLIC_CLARITY_ID
 */
export function Analytics() {
  // GA4 de Bartez (fallback hardcodeado para garantizar la medición aunque falte el env)
  const ga = process.env.NEXT_PUBLIC_GA4_ID || "G-5GHLRGMEZT";
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  // Microsoft Clarity de Bartez (fallback hardcodeado; el Project ID no es secreto)
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID || "xa5i69udic";

  // Tracking declarativo: cualquier elemento con [data-track] dispara un evento al click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest("[data-track]");
      if (el) track((el as HTMLElement).dataset.track || "cta_click", { label: (el as HTMLElement).innerText?.slice(0, 40) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
          'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
      {clarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarity}');`}
        </Script>
      )}
    </>
  );
}

/** Evento genérico → GA4 + Meta Pixel. */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // @ts-expect-error gtag inyectado por GA4
  if (window.gtag) window.gtag("event", event, params);
  // @ts-expect-error fbq inyectado por Meta Pixel
  if (window.fbq) window.fbq("trackCustom", event, params);
}

/** Conversión (lead). Mantiene compatibilidad con /gracias. */
export function trackConversion(event: string, params?: Record<string, unknown>) {
  track(event, params);
  // @ts-expect-error fbq estándar de Lead
  if (typeof window !== "undefined" && window.fbq) window.fbq("track", "Lead", params);
}

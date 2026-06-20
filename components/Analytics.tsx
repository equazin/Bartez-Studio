"use client";

import Script from "next/script";

/**
 * GA4 + Meta Pixel — placeholders activados por env públicas:
 *  - NEXT_PUBLIC_GA4_ID
 *  - NEXT_PUBLIC_META_PIXEL_ID
 * Si no están seteadas, no renderiza nada (sin impacto en performance).
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
    </>
  );
}

/** Helper de tracking de conversión (usado en /gracias y submits). */
export function trackConversion(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // @ts-expect-error gtag inyectado por GA4
  if (window.gtag) window.gtag("event", event, params);
  // @ts-expect-error fbq inyectado por Meta Pixel
  if (window.fbq) window.fbq("track", "Lead", params);
}

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "streamdown/styles.css";
import "./globals.css";
import { company, seo, contact, faq } from "../constants";
import { Analytics } from "../components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WhatsAppFloat } from "../components/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1236d8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: company.url,
    siteName: company.name,
    title: seo.title,
    description: seo.description,
    // La imagen OG (1200x630) se genera en app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  icons: {
    icon: "/brand/bartez-isologo.png",
    apple: "/brand/bartez-isologo.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    other: { "facebook-domain-verification": ["lne0ay8twnu51nbcgo74vymd4cvzac"] },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${company.url}/#organization`,
      name: company.name,
      url: company.url,
      logo: `${company.url}/brand/bartez-isologo.png`,
      description: seo.description,
      sameAs: [contact.social.linkedin, contact.social.instagram],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${company.url}/#localbusiness`,
      name: company.name,
      image: `${company.url}${seo.ogImage}`,
      url: company.url,
      telephone: contact.phoneDisplay,
      email: contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "9 de Julio 3418",
        addressLocality: "Rosario",
        addressRegion: "Santa Fe",
        addressCountry: "AR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: company.geo.lat,
        longitude: company.geo.lng,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${company.url}/#faq`,
      mainEntity: faq.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Ir al contenido principal
        </a>
        {children}
        <WhatsAppFloat />
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

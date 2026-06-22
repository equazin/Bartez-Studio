import { Navbar } from "../components/Navbar";
import { Hero } from "../components/sections/Hero";
import { TrustBar } from "../components/sections/TrustBar";
import { Needs } from "../components/sections/Needs";
import { WhyBartez } from "../components/sections/WhyBartez";
import { Process } from "../components/sections/Process";
import { Experience } from "../components/sections/Experience";
import { Testimonials } from "../components/sections/Testimonials";
import { ResellerBanner } from "../components/sections/ResellerBanner";
import { CatalogDownload } from "../components/sections/CatalogDownload";
import { QuoteBuilder } from "../components/sections/QuoteBuilder";
import { Faq } from "../components/sections/Faq";
import { Footer } from "../components/Footer";
import { Assistant } from "../components/Assistant";
import { CookieBanner } from "../components/CookieBanner";
import { WhatsAppFloat } from "../components/WhatsAppFloat";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero + señales de confianza */}
        <Hero />
        {/* 2. TrustBar: marcas en color + 4 badges de credibilidad */}
        <TrustBar />
        {/* 3. Selector de necesidades por canal */}
        <Needs />
        {/* 4. Quiénes somos: 30 años, canales, descripción real */}
        <WhyBartez />
        {/* 5. Proceso de trabajo en 4 pasos */}
        <Process />
        {/* 6. Mini-casos de experiencia real */}
        <Experience />
        {/* 7. Testimonios de clientes por canal */}
        <Testimonials />
        {/* 8. Banner de captación de revendedores */}
        <ResellerBanner />
        {/* 9. Catálogo como lead magnet */}
        <CatalogDownload />
        {/* 10. Formulario guiado de 3 pasos */}
        <QuoteBuilder />
        {/* 11. FAQ expandido */}
        <Faq />
      </main>
      <Footer />
      <Assistant />
      <CookieBanner />
      <WhatsAppFloat />
    </>
  );
}
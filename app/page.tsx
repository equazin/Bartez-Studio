import { Navbar } from "../components/Navbar";
import { Hero } from "../components/sections/Hero";
import { TrustBar } from "../components/sections/TrustBar";
import { Pillars } from "../components/sections/Pillars";
import { Solutions } from "../components/sections/Solutions";
import { Services } from "../components/sections/Services";
import { Showcase } from "../components/sections/Showcase";
import { WhyBartez } from "../components/sections/WhyBartez";
import { Industries } from "../components/sections/Industries";
import { Cases } from "../components/sections/Cases";
import { Testimonial } from "../components/sections/Testimonial";
import { CatalogPreview } from "../components/sections/CatalogPreview";
import { Process } from "../components/sections/Process";
import { QuoteBuilder } from "../components/sections/QuoteBuilder";
import { Faq } from "../components/sections/Faq";
import { Contact } from "../components/sections/Contact";
import { Payments } from "../components/sections/Payments";
import { Downloads } from "../components/sections/Downloads";
import { Footer } from "../components/Footer";
import { WhatsAppFloat } from "../components/WhatsAppFloat";
import { MobileCTA } from "../components/MobileCTA";
import { CookieBanner } from "../components/CookieBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Pillars />
        <Solutions />
        <Services />
        <Showcase />
        <WhyBartez />
        <Industries />
        <Cases />
        <CatalogPreview />
        <Process />
        <Testimonial />
        <QuoteBuilder />
        <Faq />
        <Contact />
        <Downloads />
        <Payments />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileCTA />
      <CookieBanner />
    </>
  );
}

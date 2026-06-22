import { Navbar } from "../components/Navbar";
import { Hero } from "../components/sections/Hero";
import { TrustBar } from "../components/sections/TrustBar";
import { Needs } from "../components/sections/Needs";
import { WhyBartez } from "../components/sections/WhyBartez";
import { Process } from "../components/sections/Process";
import { Experience } from "../components/sections/Experience";
import { QuoteBuilder } from "../components/sections/QuoteBuilder";
import { Faq } from "../components/sections/Faq";
import { Footer } from "../components/Footer";
import { Assistant } from "../components/Assistant";
import { CookieBanner } from "../components/CookieBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Needs />
        <WhyBartez />
        <Process />
        <Experience />
        <QuoteBuilder />
        <Faq />
      </main>
      <Footer />
      <Assistant />
      <CookieBanner />
    </>
  );
}
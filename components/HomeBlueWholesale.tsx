import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Headphones,
  Landmark,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { company, partners } from "@/constants";
import { capabilities } from "@/lib/capabilities";
import { resolveClientLogo } from "@/lib/client-logo";
import { staticSuccessCases } from "@/lib/success-cases";
import { CookieBanner } from "@/components/CookieBanner";
import { CorporateSolutionsShowcase } from "@/components/CorporateSolutionsShowcase";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { buildWhatsAppUrl, whatsappLinks } from "@/lib/whatsapp";

const heroProof = [
  { icon: ClipboardList, title: "Cotización en 24 hs", text: "hábiles y sin compromiso" },
  { icon: Truck, title: "Envíos a todo", text: "el país" },
  { icon: Headphones, title: "Asesoramiento", text: "especializado" },
  { icon: ShieldCheck, title: "Respaldo y garantía", text: "en cada solución" },
];

const heroTrust = [
  { value: `+${company.experienceYears}`, label: "años" },
  { value: company.clients, label: "clientes" },
  { value: "24 hs", label: "respuesta" },
];

const audienceCards = [
  {
    icon: Building2,
    title: "Empresas",
    text: "Soluciones IT para potenciar tu operación.",
    href: "/empresas",
    cta: "Solicitar asesoramiento",
    image: "/photos/office.jpg",
    bullets: ["Proyectos a medida", "Equipamiento corporativo", "Soporte y garantía oficial"],
  },
  {
    icon: Users,
    title: "Revendedores",
    text: "Sumate a nuestro canal mayorista.",
    href: "/revendedores",
    cta: "Alta de revendedor",
    image: "/photos/bartez-operations-hero-v2.webp",
    bullets: ["Precios y condiciones exclusivas", "Abastecimiento a pedido", "Acompañamiento comercial"],
  },
  {
    icon: Landmark,
    title: "Gobierno",
    text: "Tecnología y servicios para organismos públicos.",
    href: "/gobierno",
    cta: "Ver soluciones",
    image: "/photos/datacenter.jpg",
    bullets: ["Licitaciones y contratos", "Soluciones escalables", "Cumplimiento y trazabilidad"],
  },
];

// La lista `capabilities` vive en lib/capabilities.ts y se comparte con /casos
// (fallback cuando no hay casos autorizados publicados). En home mostramos
// solo las primeras 4 — el resto se ve en /casos.
const homeCapabilities = capabilities.slice(0, 4);

function SunsetButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("https://wa.me/") ? "_blank" : undefined}
      rel={href.startsWith("https://wa.me/") ? "noopener noreferrer" : undefined}
      className={`inline-flex max-w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a18] via-[#ff8f1f] to-[#ffb000] px-6 py-3.5 text-center text-[14px] font-black text-white shadow-[0_18px_38px_-18px_rgba(255,122,24,0.9)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_44px_-16px_rgba(255,122,24,0.95)] ${className}`}
    >
      {children}
    </a>
  );
}

function ProofItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-11 flex-none place-items-center rounded-2xl bg-blue-50 text-brand">
        <Icon size={23} strokeWidth={1.85} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-black leading-tight text-ink">{title}</span>
        <span className="mt-0.5 block text-[11.5px] font-semibold leading-tight text-slate-600">{text}</span>
      </span>
    </div>
  );
}

export function HomeBlueWholesale() {
  // Logos de clientes reales para el trust bar — se filtran los que aún no
  // tienen archivo subido en disco (ver lib/client-logo.ts).
  const clientLogos = staticSuccessCases
    .map((item) => ({ name: item.clientName, logo: resolveClientLogo(item.logoUrl) }))
    .filter((item): item is { name: string; logo: string } => Boolean(item.logo));

  return (
    <>
      <main id="main-content" className="home-blue min-h-screen w-full max-w-full overflow-hidden bg-white text-ink">
        <Navbar />

        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(132deg,transparent_0%,transparent_25%,rgba(0,70,234,0.06)_25%,rgba(0,70,234,0.06)_62%,transparent_62%)] lg:block" />
          <div className="absolute right-0 top-16 hidden h-56 w-36 bg-[radial-gradient(circle,#b8cdfd_1px,transparent_1.6px)] opacity-50 [background-size:10px_10px] lg:block" />
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-6 pb-10 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-12 lg:pt-16">
            <div className="relative z-10 min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.17em] text-brand">Mayorista IT en Argentina</p>
              <h1 className="mt-5 max-w-[620px] font-display text-[clamp(38px,4.6vw,52px)] font-semibold leading-[1.06] tracking-[-0.035em] text-ink">
                Distribución IT para <span className="text-brand">empresas y revendedores</span>
              </h1>
              <p className="mt-6 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-600 lg:text-[16.5px]">
                Cotizamos en 24 hs hábiles, conseguimos el equipamiento que necesitás y lo entregamos con garantía
                oficial a todo el país.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLinks.quote}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[14px] font-black text-white shadow-[0_18px_38px_-18px_rgba(0,70,234,0.65)] transition hover:-translate-y-0.5 hover:bg-brand-bright"
                >
                  <MessageCircle size={19} /> Cotizar por WhatsApp
                </a>
                <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/70 bg-white px-6 py-3.5 text-[14px] font-black text-brand transition hover:bg-blue-50">
                  <Box size={18} /> Catálogo de soluciones
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-slate-200 pt-6">
                {heroTrust.map((item) => (
                  <span key={item.label} className="text-[12.5px] font-semibold text-slate-500">
                    <span className="font-display text-[15px] font-semibold text-ink">{item.value}</span> {item.label}
                  </span>
                ))}
              </div>
              <Link href="/como-trabajamos" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 transition hover:text-brand">
                Cómo trabajamos: cotización 24 hs · Andreani nacional · garantía oficial <ArrowRight size={14} />
              </Link>
            </div>

            <div className="relative z-10 overflow-hidden rounded-2xl border border-blue-100 shadow-[0_28px_70px_-46px_rgba(0,70,234,0.35)]">
              <div className="relative aspect-[4/3.05]">
                <Image
                  src="/photos/bartez-operations-hero-v2.webp"
                  alt="Operación y logística de Bartez Tecnología"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 660px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(200deg,rgba(0,70,234,0.14),transparent_55%)]" />
              </div>
              <div className="absolute bottom-4 left-4 rounded-xl bg-white/94 px-4 py-2 text-[12px] font-black text-ink shadow-sm backdrop-blur-sm">
                Operación y logística propia · Rosario
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid gap-6 border-t border-slate-200 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {heroProof.map((item) => (
                <ProofItem key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#f7f9fc] py-6">
          <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-5 px-6 lg:flex-row lg:gap-9 lg:px-10">
            {clientLogos.length > 0 ? (
              <>
                <span className="flex-none text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Clientes reales</span>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
                  {clientLogos.map((client) => (
                    <div key={client.name} className="relative h-6 w-[110px]">
                      <Image src={client.logo} alt={client.name} fill sizes="110px" className="object-contain object-left opacity-80" />
                    </div>
                  ))}
                </div>
                <span className="hidden h-6 w-px flex-none bg-slate-200 lg:block" />
              </>
            ) : null}
            <span className="flex-none text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Marcas</span>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
              {partners.brands.slice(0, 8).map((brand) => (
                <div key={brand.name} className="relative h-6 w-[86px]">
                  <Image src={brand.logo} alt={brand.name} fill sizes="86px" className="object-contain object-left opacity-75" />
                </div>
              ))}
            </div>
            <Link href="/marcas" className="flex-none text-[12px] font-bold text-brand hover:underline">
              Ver todas →
            </Link>
          </div>
        </section>

        <CorporateSolutionsShowcase />

        <section className="bg-white py-10 lg:py-16">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
            {audienceCards.map((card) => (
              <article key={card.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_70px_-54px_rgba(15,23,42,0.75)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-48px_rgba(0,70,234,0.5)]">
                <div className="p-6">
                  <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#0046EA] via-[#006dff] to-[#0ea5ff] text-white">
                    <card.icon size={27} strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.035em] text-ink">{card.title}</h3>
                  <p className="mt-2 min-h-[44px] text-[13.5px] leading-relaxed text-slate-600">{card.text}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-[13px] font-semibold text-slate-700">
                        <CheckCircle2 size={15} className="mt-0.5 flex-none text-brand" /> {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link href={card.href} className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-black text-brand">
                    {card.cta} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="relative aspect-[16/8] bg-slate-100">
                  <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/18 to-transparent" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f9fc] py-12 lg:py-16">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.17em] text-brand">Capacidades demostradas</p>
                <h2 className="mt-2 max-w-[24ch] font-display text-[clamp(26px,3.5vw,38px)] font-semibold tracking-[-0.04em] text-ink">
                  Operaciones que resolvemos, más allá de vender un equipo suelto.
                </h2>
              </div>
              <Link href="/casos" className="inline-flex items-center gap-1.5 text-[13px] font-black text-brand">
                Ver todos los casos <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {homeCapabilities.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-card"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-brand">
                    <item.icon size={22} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-[16.5px] font-semibold tracking-[-0.03em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-black text-brand">
                    Ver detalle <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-6 py-5">
              <p className="text-[13.5px] leading-relaxed text-slate-600">
                ¿Un proyecto que no encaja en ninguna categoría? Contanos el contexto y armamos una propuesta.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/rfq?origen=proyecto"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13.5px] font-black text-white shadow-[0_14px_28px_-16px_rgba(0,70,234,0.6)] transition hover:-translate-y-0.5 hover:bg-brand-bright"
                >
                  Cotizar un proyecto <ArrowRight size={15} />
                </Link>
                <Link
                  href="/servicios-profesionales"
                  className="inline-flex items-center gap-2 rounded-xl border border-brand/70 bg-white px-5 py-2.5 text-[13.5px] font-black text-brand transition hover:bg-blue-50"
                >
                  Cómo trabajamos servicios profesionales
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#f7f9fc] py-12 lg:py-14">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.17em] text-brand">Respaldos verificables</p>
                <h2 className="mt-3 font-display text-[clamp(22px,2.6vw,32px)] font-semibold leading-[1.1] tracking-[-0.035em] text-ink">
                  Documentación B2B, sin promesas infladas.
                </h2>
                <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-slate-600">
                  Publicamos solo lo que podemos respaldar. Cada operación se documenta según lo que tu proceso de compra o pliego necesite.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/certificaciones" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline">
                    Ver certificaciones y respaldos <ArrowRight size={14} />
                  </Link>
                  <Link href="/gobierno" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 hover:text-brand hover:underline">
                    Operatoria con sector público <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Receipt, title: "Facturación tipo A", desc: "Para todas las operaciones B2B y sector público." },
                  { icon: FileCheck2, title: "CUIT verificable", desc: `Responsable Inscripto · ${company.cuit}` },
                  { icon: ShieldCheck, title: "Revendedor autorizado", desc: "Lenovo, Dell, HP, Aruba y Cisco." },
                  { icon: ClipboardList, title: "Deal registration", desc: "Precio de proyecto con Dell, HPE y Lenovo." },
                  { icon: Truck, title: "Logística nacional", desc: "Cobertura documentada con seguro vigente." },
                  { icon: Landmark, title: "Cotización para pliegos", desc: "Validez de oferta, retenciones y plazos por escrito." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <span className="grid size-9 flex-none place-items-center rounded-lg border border-blue-100 bg-blue-50">
                      <item.icon size={17} className="text-brand" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071d78] via-[#0046EA] to-[#0ea5ff] p-7 text-white shadow-[0_34px_80px_-44px_rgba(0,109,255,0.85)] md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(255,255,255,0.24),transparent_20%),radial-gradient(circle_at_88%_0%,rgba(255,176,0,0.18),transparent_26%)]" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-5">
                  <span className="grid size-20 flex-none place-items-center rounded-3xl bg-white text-[#20b956] shadow-2xl">
                    <MessageCircle size={42} />
                  </span>
                  <div>
                    <h2 className="font-display text-[clamp(26px,3.3vw,40px)] font-semibold tracking-[-0.045em]">¿Tenés un proyecto?</h2>
                    <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-blue-50">Hablemos por WhatsApp y te ayudamos a encontrar la mejor solución.</p>
                  </div>
                </div>

                <div className="text-center">
                  <SunsetButton href={buildWhatsAppUrl("quote", ["Origen: CTA final home rediseñada"])} className="min-w-[290px]">
                    <MessageCircle size={19} /> Cotizar por WhatsApp
                  </SunsetButton>
                  <p className="mt-3 text-[12px] font-semibold text-blue-100">Respuesta de nuestro equipo comercial en 24 hs hábiles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}

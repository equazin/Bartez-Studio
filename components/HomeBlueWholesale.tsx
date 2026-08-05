import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Box,
  Building2,
  CheckCircle2,
  GitCompareArrows,
  GraduationCap,
  HardDrive,
  Headphones,
  Landmark,
  Laptop,
  MessageCircle,
  Monitor,
  PackageCheck,
  Printer,
  ShieldCheck,
  SlidersHorizontal,
  ClipboardList,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { company, contact, partners } from "@/constants";
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
  {
    icon: GraduationCap,
    title: "Educación",
    text: "Equipamiento y soluciones para instituciones educativas.",
    href: "/educacion",
    cta: "Ver soluciones",
    image: "/photos/engineer.jpg",
    bullets: ["Aulas y laboratorios", "Conectividad y redes", "Soporte especializado"],
  },
];

const stats = [
  { icon: Users, value: company.clients, label: "clientes" },
  { icon: ShieldCheck, value: company.experienceYears, label: "años en el rubro" },
  { icon: PackageCheck, value: "Factura A", label: "en todas las operaciones" },
  { icon: Headphones, value: "Soporte técnico", label: "especializado" },
];

const families = [
  { image: "/photos/products/laptop1.jpg", label: "Notebooks y PCs", href: "/catalogo#notebooks" },
  { image: "/photos/products/peripherals.jpg", label: "Componentes y hardware", href: "/catalogo#componentes" },
  { image: "/photos/products/monitor.jpg", label: "Monitores y displays", href: "/catalogo#monitores" },
  { image: "/photos/products/peripherals.jpg", label: "Impresión y periféricos", href: "/catalogo#perifericos" },
  { image: "/photos/products/storage.jpg", label: "Almacenamiento y memoria", href: "/catalogo#almacenamiento" },
  { image: "/photos/products/ups.jpg", label: "Energía y continuidad", href: "/catalogo#energia" },
];

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
  return (
    <>
      <main className="home-blue min-h-screen w-full max-w-full overflow-hidden bg-white text-ink">
        <Navbar />

        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-[linear-gradient(132deg,transparent_0%,transparent_25%,rgba(0,70,234,0.08)_25%,rgba(0,70,234,0.08)_62%,transparent_62%)] lg:block" />
          <div className="absolute right-0 top-20 hidden h-64 w-40 bg-[radial-gradient(circle,#b8cdfd_1px,transparent_1.6px)] opacity-55 [background-size:10px_10px] lg:block" />
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-8 px-6 pb-8 pt-12 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:pb-10 lg:pt-14">
            <div className="relative z-10 min-w-0">
              <p className="text-[12px] font-black uppercase tracking-[0.17em] text-brand">Mayorista IT en Argentina</p>
              <h1 className="mt-5 max-w-[660px] font-display text-[clamp(38px,4.6vw,56px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
                Distribución IT para <span className="text-brand">empresas y revendedores</span>
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-600 lg:text-[17px]">
                Cotizamos en 24 hs hábiles, conseguimos el equipamiento con los principales mayoristas del país y lo
                entregamos con garantía oficial.
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
            </div>

            <div className="relative z-10 min-h-[300px] overflow-hidden rounded-3xl border border-blue-100 bg-[#f7f9ff] shadow-[0_34px_90px_-62px_rgba(0,70,234,0.6)] lg:min-h-[430px]">
              <div className="absolute inset-y-0 right-0 w-[78%] origin-bottom-left -skew-x-12 overflow-hidden rounded-l-[48px] bg-brand/10">
                <Image
                  src="/photos/home/warehouse-hero.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 620px"
                  className="scale-110 object-cover object-center opacity-80 skew-x-12"
                />
                <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(50,20,180,0.62),rgba(0,70,234,0.22)_45%,rgba(255,255,255,0.08))]" />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.9)_20%,rgba(255,255,255,0.22)_54%,rgba(255,255,255,0)_100%)]" />
              <Image
                src="/photos/home/hero-it-equipment-transparent.png"
                alt="Equipamiento IT para empresas y revendedores"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="relative z-10 object-contain object-center p-0 drop-shadow-[0_28px_34px_rgba(15,23,42,0.18)] sm:p-2 lg:p-0"
              />
              <div className="absolute bottom-4 left-4 hidden rounded-xl border border-blue-100 bg-white/92 px-4 py-2 text-[12px] font-black text-brand shadow-sm backdrop-blur-sm sm:block">
                Equipamiento, infraestructura y soluciones IT
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

        <CorporateSolutionsShowcase />

        <section className="bg-white py-10 lg:py-16">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
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
                  <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/18 to-transparent" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white pb-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-blue-100 bg-blue-100 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.value} className="flex items-center gap-4 bg-white px-7 py-5">
                  <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-brand">
                    <item.icon size={26} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block font-display text-[28px] font-semibold tracking-[-0.04em] text-ink">{item.value}</span>
                    <span className="block text-[13px] font-semibold text-slate-600">{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f9fc] py-12 lg:py-16">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.17em] text-brand">Herramientas online</p>
                <h2 className="mt-2 font-display text-[clamp(26px,3.5vw,38px)] font-semibold tracking-[-0.04em] text-ink">Empezá a definir tu solución</h2>
              </div>
              <p className="max-w-[42ch] text-[14px] leading-relaxed text-slate-600">Usá estas herramientas para dimensionar, comparar y cotizar antes de hablar con un asesor.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/configurador" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <SlidersHorizontal size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-semibold tracking-[-0.03em] text-ink">Configurador IT</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Elegí perfil de uso, ajustá escala y obtené una recomendación técnica para llevar a cotización.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-brand">Usar herramienta <ArrowRight size={15} /></span>
              </Link>
              <Link href="/comparador" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <GitCompareArrows size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-semibold tracking-[-0.03em] text-ink">Comparador orientativo</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Compará hasta 3 familias de equipos para ordenar la decisión según tu escenario real.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-brand">Comparar equipos <ArrowRight size={15} /></span>
              </Link>
              <Link href="/rfq" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <ClipboardList size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-semibold tracking-[-0.03em] text-ink">Cotización masiva (RFQ)</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Cargá tu pliego o lista técnica y recibí una propuesta formal con condiciones B2B en 24 hs.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-brand">Iniciar RFQ <ArrowRight size={15} /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-8">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-5 border-y border-slate-100 py-6 lg:grid-cols-[170px_1fr_auto]">
              <h2 className="font-display text-[25px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">Familias de productos</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
                {families.map((family) => (
                  <Link
                    key={family.label}
                    href={family.href}
                    className="group flex min-w-0 min-h-[44px] items-center gap-2 rounded-xl p-1.5 transition hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    <div className="relative size-14 flex-none overflow-hidden rounded-xl bg-white transition group-hover:scale-[1.04]">
                      <Image src={family.image} alt="" fill sizes="56px" className="object-contain" />
                    </div>
                    <p className="text-[11.5px] font-black leading-tight text-slate-800 group-hover:text-brand">{family.label}</p>
                  </Link>
                ))}
              </div>
              <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 text-[12.5px] font-black text-brand">
                Ver todas las categorías <span className="grid size-8 place-items-center rounded-full bg-brand text-white"><ArrowRight size={15} /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white pb-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-5 lg:grid-cols-[190px_1fr_auto]">
              <h2 className="font-display text-[21px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">Marcas que trabajamos</h2>
              <div className="grid grid-cols-3 items-center gap-x-6 gap-y-5 sm:grid-cols-5 lg:grid-cols-9">
                {partners.brands.slice(0, 9).map((brand) => (
                  <div key={brand.name} className="flex h-10 items-center justify-center">
                    <Image src={brand.logo} alt={brand.name} width={118} height={42} className="max-h-9 w-auto object-contain" />
                  </div>
                ))}
              </div>
              <Link href="/marcas" className="inline-flex items-center justify-center gap-2 text-[12.5px] font-black text-brand">
                Ver todas las marcas <span className="grid size-8 place-items-center rounded-full bg-brand text-white"><ArrowRight size={15} /></span>
              </Link>
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

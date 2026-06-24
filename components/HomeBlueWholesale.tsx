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
  { icon: PackageCheck, title: "Stock real", text: "y disponibilidad inmediata" },
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
    bullets: ["Precios y condiciones exclusivas", "Stock y disponibilidad", "Acompañamiento comercial"],
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
    image: "/photos/office.jpg",
    bullets: ["Aulas y laboratorios", "Conectividad y redes", "Soporte especializado"],
  },
];

const stats = [
  { icon: Users, value: company.clients, label: "clientes" },
  { icon: ShieldCheck, value: company.experienceYears, label: "años en el rubro" },
  { icon: PackageCheck, value: "Stock real", label: "y entregas ágiles" },
  { icon: Headphones, value: "Soporte técnico", label: "especializado" },
];

const families = [
  { image: "/photos/products/laptop1.jpg", label: "Notebooks y PCs" },
  { image: "/photos/products/peripherals.jpg", label: "Componentes y hardware" },
  { image: "/photos/products/monitor.jpg", label: "Monitores y displays" },
  { image: "/photos/products/peripherals.jpg", label: "Impresión y periféricos" },
  { image: "/photos/products/storage.jpg", label: "Almacenamiento y memoria" },
  { image: "/photos/products/ups.jpg", label: "Energía y continuidad" },
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
      <span className="grid size-11 flex-none place-items-center rounded-2xl bg-blue-50 text-[#1236d8]">
        <Icon size={23} strokeWidth={1.85} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-black leading-tight text-[#11142a]">{title}</span>
        <span className="mt-0.5 block text-[11.5px] font-semibold leading-tight text-slate-500">{text}</span>
      </span>
    </div>
  );
}

export function HomeBlueWholesale() {
  return (
    <>
      <main className="home-blue min-h-screen w-full max-w-full overflow-hidden bg-white text-[#11142a]">
        <style>{`
          .home-blue,
          .home-blue *,
          .home-blue *::before,
          .home-blue *::after {
            box-sizing: border-box;
          }
          .home-blue,
          .home-blue section {
            max-width: 100vw;
            overflow-x: clip;
          }
          .home-blue h1,
          .home-blue h2,
          .home-blue h3,
          .home-blue p {
            overflow-wrap: break-word;
          }
        `}</style>

        <Navbar />

        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-[linear-gradient(132deg,transparent_0%,transparent_25%,rgba(18,54,216,0.08)_25%,rgba(18,54,216,0.08)_62%,transparent_62%)] lg:block" />
          <div className="absolute right-0 top-20 hidden h-64 w-40 bg-[radial-gradient(circle,#b8cdfd_1px,transparent_1.6px)] opacity-55 [background-size:10px_10px] lg:block" />
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-8 px-6 pb-8 pt-12 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:pb-10 lg:pt-14">
            <div className="relative z-10 min-w-0">
              <p className="text-[12px] font-black uppercase tracking-[0.17em] text-[#1236d8]">Mayorista IT en Argentina</p>
              <h1 className="mt-5 max-w-[660px] font-display text-[clamp(42px,6vw,76px)] font-black leading-[0.96] tracking-[-0.065em] text-[#11142a]">
                Distribución IT para <span className="text-[#1236d8]">empresas y revendedores</span>
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-600 lg:text-[17px]">
                Brindamos stock real, precios competitivos y asesoramiento especializado para que tu negocio crezca.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLinks.quote}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1236d8] px-6 py-3.5 text-[14px] font-black text-white shadow-[0_18px_38px_-18px_rgba(18,54,216,0.65)] transition hover:-translate-y-0.5 hover:bg-[#0b2bb7]"
                >
                  <MessageCircle size={19} /> Cotizar por WhatsApp
                </a>
                <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1236d8]/70 bg-white px-6 py-3.5 text-[14px] font-black text-[#1236d8] transition hover:bg-blue-50">
                  <Box size={18} /> Catálogo de soluciones
                </Link>
              </div>
            </div>

            <div className="relative z-10 min-h-[300px] overflow-hidden rounded-3xl border border-blue-100 bg-[#f7f9ff] shadow-[0_34px_90px_-62px_rgba(18,54,216,0.6)] lg:min-h-[430px]">
              <div className="absolute inset-y-0 right-0 w-[78%] origin-bottom-left -skew-x-12 overflow-hidden rounded-l-[48px] bg-[#1236d8]/10">
                <Image
                  src="/photos/home/warehouse-hero.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 620px"
                  className="scale-110 object-cover object-center opacity-80 skew-x-12"
                />
                <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(50,20,180,0.62),rgba(18,54,216,0.22)_45%,rgba(255,255,255,0.08))]" />
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
              <div className="absolute bottom-4 left-4 hidden rounded-xl border border-blue-100 bg-white/92 px-4 py-2 text-[12px] font-black text-[#1236d8] shadow-sm backdrop-blur-sm sm:block">
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
              <article key={card.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_70px_-54px_rgba(15,23,42,0.75)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-48px_rgba(18,54,216,0.5)]">
                <div className="p-6">
                  <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#1236d8] via-[#006dff] to-[#0ea5ff] text-white">
                    <card.icon size={27} strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-[22px] font-black tracking-[-0.035em] text-[#11142a]">{card.title}</h3>
                  <p className="mt-2 min-h-[44px] text-[13.5px] leading-relaxed text-slate-500">{card.text}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-[13px] font-semibold text-slate-700">
                        <CheckCircle2 size={15} className="mt-0.5 flex-none text-[#1236d8]" /> {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link href={card.href} className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-black text-[#1236d8]">
                    {card.cta} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="relative aspect-[16/8] bg-slate-100">
                  <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11142a]/18 to-transparent" />
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
                  <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#1236d8]">
                    <item.icon size={26} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block font-display text-[28px] font-black tracking-[-0.04em] text-[#11142a]">{item.value}</span>
                    <span className="block text-[13px] font-semibold text-slate-500">{item.label}</span>
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
                <p className="text-[12px] font-black uppercase tracking-[0.17em] text-[#1236d8]">Herramientas online</p>
                <h2 className="mt-2 font-display text-[clamp(26px,3.5vw,38px)] font-black tracking-[-0.04em] text-[#11142a]">Empezá a definir tu solución</h2>
              </div>
              <p className="max-w-[42ch] text-[14px] leading-relaxed text-slate-500">Usá estas herramientas para dimensionar, comparar y cotizar antes de hablar con un asesor.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/configurador" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-[#1236d8]/10 text-[#1236d8] transition group-hover:bg-[#1236d8] group-hover:text-white">
                  <SlidersHorizontal size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-black tracking-[-0.03em] text-[#11142a]">Configurador IT</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">Elegí perfil de uso, ajustá escala y obtené una recomendación técnica para llevar a cotización.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-[#1236d8]">Usar herramienta <ArrowRight size={15} /></span>
              </Link>
              <Link href="/comparador" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] transition group-hover:bg-[#7c3aed] group-hover:text-white">
                  <GitCompareArrows size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-black tracking-[-0.03em] text-[#11142a]">Comparador orientativo</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">Compará hasta 3 familias de equipos para ordenar la decisión según tu escenario real.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-[#7c3aed]">Comparar equipos <ArrowRight size={15} /></span>
              </Link>
              <Link href="/rfq" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-[#ff8f1f]/10 text-[#ff8f1f] transition group-hover:bg-[#ff8f1f] group-hover:text-white">
                  <ClipboardList size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[20px] font-black tracking-[-0.03em] text-[#11142a]">Cotización masiva (RFQ)</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">Cargá tu pliego o lista técnica y recibí una propuesta formal con condiciones B2B en 24 hs.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-[#ff8f1f]">Iniciar RFQ <ArrowRight size={15} /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-8">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-5 border-y border-slate-100 py-6 lg:grid-cols-[170px_1fr_auto]">
              <h2 className="font-display text-[25px] font-black leading-[1.05] tracking-[-0.04em] text-[#11142a]">Familias de productos</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
                {families.map((family) => (
                  <div key={family.label} className="flex min-w-0 items-center gap-2">
                    <div className="relative size-14 flex-none overflow-hidden rounded-xl bg-white">
                      <Image src={family.image} alt="" fill sizes="56px" className="object-contain" />
                    </div>
                    <p className="text-[11px] font-black leading-tight text-slate-700">{family.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 text-[12.5px] font-black text-[#1236d8]">
                Ver todas las categorías <span className="grid size-8 place-items-center rounded-full bg-[#1236d8] text-white"><ArrowRight size={15} /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white pb-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-5 lg:grid-cols-[190px_1fr_auto]">
              <h2 className="font-display text-[21px] font-black leading-[1.08] tracking-[-0.035em] text-[#11142a]">Marcas que trabajamos</h2>
              <div className="grid grid-cols-3 items-center gap-x-6 gap-y-5 sm:grid-cols-5 lg:grid-cols-9">
                {partners.brands.slice(0, 9).map((brand) => (
                  <div key={brand.name} className="flex h-10 items-center justify-center">
                    <Image src={brand.logo} alt={brand.name} width={118} height={42} className="max-h-9 w-auto object-contain" />
                  </div>
                ))}
              </div>
              <Link href="/marcas" className="inline-flex items-center justify-center gap-2 text-[12.5px] font-black text-[#1236d8]">
                Ver todas las marcas <span className="grid size-8 place-items-center rounded-full bg-[#1236d8] text-white"><ArrowRight size={15} /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071d78] via-[#1236d8] to-[#0ea5ff] p-7 text-white shadow-[0_34px_80px_-44px_rgba(0,109,255,0.85)] md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(255,255,255,0.24),transparent_20%),radial-gradient(circle_at_88%_0%,rgba(255,176,0,0.18),transparent_26%)]" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-5">
                  <span className="grid size-20 flex-none place-items-center rounded-3xl bg-white text-[#20b956] shadow-2xl">
                    <MessageCircle size={42} />
                  </span>
                  <div>
                    <h2 className="font-display text-[clamp(26px,3.3vw,40px)] font-black tracking-[-0.045em]">¿Tenés un proyecto?</h2>
                    <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-blue-50">Hablemos por WhatsApp y te ayudamos a encontrar la mejor solución.</p>
                  </div>
                </div>

                <div className="text-center">
                  <SunsetButton href={buildWhatsAppUrl("quote", ["Origen: CTA final home rediseñada"])} className="min-w-[290px]">
                    <MessageCircle size={19} /> Cotizar por WhatsApp
                  </SunsetButton>
                  <p className="mt-3 text-[12px] font-semibold text-blue-100">Respuesta inmediata de nuestro equipo comercial</p>
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

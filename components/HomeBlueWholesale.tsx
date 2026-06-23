import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Box,
  Building2,
  CheckCircle2,
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
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { company, contact, partners } from "@/constants";
import { CookieBanner } from "@/components/CookieBanner";
import { CorporateSolutionsShowcase } from "@/components/CorporateSolutionsShowcase";
import { buildWhatsAppUrl, whatsappLinks } from "@/lib/whatsapp";

const navItems = [
  { label: "Productos", href: "/catalogo", hasDropdown: true },
  { label: "Soluciones", href: "#soluciones", hasDropdown: true },
  { label: "Empresas", href: "/empresas" },
  { label: "Revendedores", href: "/revendedores" },
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" },
];

const heroProof = [
  { icon: PackageCheck, title: "Stock real", text: "disponible" },
  { icon: Truck, title: "Envíos", text: "a todo el país" },
  { icon: Headphones, title: "Asesoría", text: "especializada" },
  { icon: ShieldCheck, title: "Posventa", text: "y soporte" },
];

const audienceCards = [
  {
    icon: Building2,
    title: "Empresas",
    text: "Soluciones IT para potenciar tu operación.",
    href: "/empresas",
    cta: "Solicitar asesoramiento",
    image: "/photos/office.jpg",
    bullets: ["Proyectos a medida", "Equipamiento corporativo", "Soporte y posventa"],
  },
  {
    icon: Users,
    title: "Revendedores",
    text: "Sumate a nuestro canal mayorista.",
    href: "/revendedores",
    cta: "Alta de revendedor",
    image: "/photos/bartez-operations-hero-v2.webp",
    bullets: ["Condiciones comerciales", "Stock y disponibilidad", "Acompañamiento comercial"],
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
  { icon: Laptop, image: "/photos/products/laptop1.jpg", label: "Notebooks y PCs" },
  { icon: Box, image: "/photos/products/peripherals.jpg", label: "Componentes y hardware" },
  { icon: Monitor, image: "/photos/products/monitor.jpg", label: "Monitores y displays" },
  { icon: Printer, image: "/photos/products/peripherals.jpg", label: "Impresión y periféricos" },
  { icon: HardDrive, image: "/photos/products/storage.jpg", label: "Almacenamiento y memoria" },
  { icon: BatteryCharging, image: "/photos/products/ups.jpg", label: "Energía y continuidad" },
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
      className={`inline-flex max-w-full items-center justify-center gap-2 whitespace-normal rounded-xl bg-gradient-to-r from-[#ff7a18] via-[#ff8f1f] to-[#ffb000] px-6 py-3.5 text-center text-[14px] font-black text-white shadow-[0_18px_38px_-18px_rgba(255,122,24,0.9)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_44px_-16px_rgba(255,122,24,0.95)] ${className}`}
    >
      {children}
    </a>
  );
}

function IconTile({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3">
      <span className="grid size-11 flex-none place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-[#1236d8]">
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-black leading-tight text-[#11142a]">{title}</span>
        <span className="mt-0.5 block text-[12px] font-semibold leading-snug text-slate-500">{text}</span>
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
          .home-blue section {
            max-width: 100vw;
            overflow-x: clip;
          }
          .home-blue,
          .home-blue *,
          .home-blue *::before,
          .home-blue *::after {
            box-sizing: border-box;
          }
          .home-blue h1,
          .home-blue h2,
          .home-blue h3,
          .home-blue p {
            overflow-wrap: break-word;
          }
        `}</style>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04060d] text-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.9)]">
          <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-10">
            <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Bartez Tecnología — inicio">
              <span className="grid size-11 flex-none place-items-center rounded-2xl bg-gradient-to-br from-[#1236d8] via-[#006dff] to-[#0ea5ff] font-display text-[30px] font-black leading-none text-white shadow-[0_14px_28px_-18px_rgba(0,109,255,0.95)]">
                B
              </span>
              <span className="leading-none">
                <span className="block font-display text-[28px] font-black tracking-[-0.08em] text-white">BARTEZ</span>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.45em] text-white/70">Tecnología</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="group inline-flex items-center gap-1.5 text-[13.5px] font-bold text-white/88 transition hover:text-[#8fb5ff]">
                  {item.label}
                  {item.hasDropdown ? <span className="text-[10px] text-white/50 transition group-hover:text-[#8fb5ff]">⌄</span> : null}
                </Link>
              ))}
            </nav>

            <SunsetButton href={whatsappLinks.quote} className="hidden px-5 py-3 lg:inline-flex">
              <MessageCircle size={18} /> Cotizar por WhatsApp
            </SunsetButton>

            <a href={whatsappLinks.quote} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-xl bg-gradient-to-r from-[#ff7a18] to-[#ffb000] text-white lg:hidden" aria-label="Cotizar por WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-[#0726b8] via-[#006dff] to-[#0ea5ff] lg:block" style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }} />
          <div className="absolute bottom-0 right-0 hidden h-56 w-56 bg-[radial-gradient(circle,rgba(14,165,255,0.2)_1px,transparent_1px)] [background-size:16px_16px] lg:block" />

          <div className="relative mx-auto grid w-[calc(100vw-48px)] max-w-[1440px] min-w-0 gap-12 px-0 py-14 lg:w-full lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
            <div className="flex w-full min-w-0 max-w-full flex-col justify-center">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#1236d8]">Mayorista IT en Argentina</p>
              <h1 className="mt-5 max-w-full font-display text-[clamp(39px,10.5vw,86px)] font-black leading-[0.95] tracking-[-0.065em] text-[#11142a] text-balance sm:max-w-[720px]">
                Distribución IT para <span className="bg-gradient-to-r from-[#1236d8] via-[#006dff] to-[#0ea5ff] bg-clip-text text-transparent">empresas y revendedores</span>
              </h1>
              <p className="mt-7 max-w-full text-[15.5px] leading-relaxed text-slate-600 sm:max-w-[55ch] sm:text-[clamp(16px,1.35vw,20px)]">
                Brindamos stock real, condiciones comerciales y asesoramiento especializado para que tu negocio crezca con tecnología confiable.
              </p>

              <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <SunsetButton href={whatsappLinks.quote} className="w-full sm:w-auto">
                  <MessageCircle size={19} /> Cotizar por WhatsApp
                </SunsetButton>
                <Link href="/catalogo" className="inline-flex w-full max-w-full items-center justify-center gap-2 rounded-xl border border-[#1236d8]/30 bg-white px-6 py-3.5 text-center text-[14px] font-black text-[#1236d8] shadow-sm transition hover:border-[#1236d8] hover:bg-blue-50 sm:w-auto">
                  <Box size={18} /> Catálogo de soluciones
                </Link>
              </div>

              <div className="mt-10 grid min-w-0 gap-3 sm:grid-cols-2">
                {heroProof.map((item) => (
                  <IconTile key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div className="relative min-h-[430px] w-full min-w-0 max-w-full overflow-hidden rounded-[30px] bg-gradient-to-br from-[#071d78] via-[#1236d8] to-[#0ea5ff] p-3 shadow-[0_38px_80px_-38px_rgba(0,109,255,0.82)] sm:min-h-[470px] lg:min-h-[560px] lg:rounded-[44px]" style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%, 0 20%)" }}>
              <div className="absolute inset-3 overflow-hidden rounded-[28px] bg-[#0a1028]/40 lg:rounded-[36px]">
                <Image src="/photos/bartez-operations-hero-v2.webp" alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" priority className="object-cover opacity-80 mix-blend-screen saturate-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1236d8]/20 to-white/20" />
              </div>

              <div className="absolute bottom-6 left-4 right-4 grid min-w-0 grid-cols-3 gap-2 sm:bottom-8 sm:left-8 sm:right-8 sm:gap-4">
                {[
                  { src: "/photos/products/laptop1.jpg", label: "Notebooks" },
                  { src: "/photos/products/server.jpg", label: "Servidores" },
                  { src: "/photos/products/switch.jpg", label: "Redes" },
                ].map((item) => (
                  <div key={item.label} className="min-w-0 rounded-2xl border border-white/20 bg-white/90 p-1.5 shadow-2xl backdrop-blur last:hidden sm:p-2 sm:last:block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                      <Image src={item.src} alt="" fill sizes="180px" className="object-cover" />
                    </div>
                    <p className="mt-2 truncate text-center text-[10px] font-black text-[#1236d8] sm:text-[11px]">{item.label}</p>
                  </div>
                ))}
              </div>
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

        <section className="bg-white pb-12">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-blue-100 bg-blue-100 shadow-[0_18px_60px_-48px_rgba(18,54,216,0.6)] sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.value} className="flex items-center gap-4 bg-white px-7 py-6">
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

        <section className="bg-white py-12">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr_auto]">
              <h2 className="font-display text-[28px] font-black leading-[1.05] tracking-[-0.04em] text-[#11142a]">Familias de productos</h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {families.map((family) => (
                  <div key={family.label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                    <div className="relative mx-auto aspect-[4/3] max-w-[110px] overflow-hidden rounded-xl bg-slate-50">
                      <Image src={family.image} alt="" fill sizes="120px" className="object-contain p-1" />
                    </div>
                    <p className="mt-2 text-[11.5px] font-black leading-tight text-slate-700">{family.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-full text-[13px] font-black text-[#1236d8]">
                Ver todas las categorías <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-10">
          <div className="mx-auto grid max-w-[1320px] items-center gap-7 px-6 lg:grid-cols-[230px_1fr_auto] lg:px-10">
            <h2 className="font-display text-[24px] font-black leading-[1.05] tracking-[-0.035em] text-[#11142a]">Marcas que trabajamos</h2>
            <div className="grid grid-cols-3 items-center gap-6 sm:grid-cols-4 lg:grid-cols-7">
              {partners.brands.map((brand) => (
                <div key={brand.name} className="flex h-12 items-center justify-center opacity-75 grayscale transition hover:opacity-100 hover:grayscale-0">
                  <Image src={brand.logo} alt={brand.name} width={116} height={42} className="max-h-9 w-auto object-contain" />
                </div>
              ))}
            </div>
            <Link href="/marcas" className="inline-flex items-center justify-center gap-2 text-[13px] font-black text-[#1236d8]">
              Ver todas las marcas <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071d78] via-[#1236d8] to-[#0ea5ff] p-7 text-white shadow-[0_34px_80px_-44px_rgba(0,109,255,0.85)] md:p-10">
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

        <footer className="border-t border-slate-200 bg-white py-7">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-6 text-[12px] font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <span>© {new Date().getFullYear()} {company.name}. Distribución IT para empresas y revendedores.</span>
            <span>{contact.phoneDisplay} · {contact.email}</span>
          </div>
        </footer>
      </main>
      <CookieBanner />
    </>
  );
}

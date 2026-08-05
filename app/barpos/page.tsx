import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Headset,
  MessageCircle,
  Monitor,
  PackageCheck,
  Printer,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { BarposWhatsAppForm } from "@/components/BarposWhatsAppForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "BarPOS 4.0 - Punto de venta electronico | Bartez Tecnologia",
  description:
    "BarPOS 4.0: equipamiento, software, implementacion y soporte para comercios. Consulta precio vigente o condiciones para distribuidores por WhatsApp.",
};

const productCards = [
  {
    title: "PC BARTEZ POS I3",
    image: "/photos/barpos/pc-monitor.png",
    alt: "PC y monitor BarPOS",
    specs: ["Intel Core i3", "8GB memoria", "HDD 500GB", "Monitor 19 pulgadas", "Teclado y mouse"],
  },
  {
    title: "IMPRESORA TERMICA OCOM 80MM",
    image: "/photos/barpos/printer.png",
    alt: "Impresora termica OCOM",
    specs: ["USB + LAN", "Autocutter", "Alta velocidad", "Ticket 80mm"],
  },
  {
    title: "LECTOR LASER OCOM OCBS-LA15",
    image: "/photos/barpos/scanner.png",
    alt: "Lector laser OCOM con base",
    specs: ["USB 1D", "Base incluida", "Lectura rapida", "Uso intensivo"],
  },
];

const heroBenefits = [
  { title: "Controladora fiscal", detail: "homologada", icon: ShieldCheck },
  { title: "Cumple 100%", detail: "reglamentacion ARCA", icon: CheckCircle2 },
  { title: "Soporte tecnico", detail: "garantizado", icon: Headset },
];

const proofStrip = [
  { title: "Mas de 1.000", detail: "puntos de venta instalados", icon: BadgeCheck },
  { title: "Soluciones completas", detail: "equipamiento + software + soporte", icon: BarChart3 },
  { title: "Capacitacion", detail: "y herramientas para vender mas", icon: GraduationCap },
  { title: "Marca confiable", detail: "respaldo, calidad y trayectoria", icon: ShieldCheck },
];

const modules = [
  { title: "Modulos de ventas", detail: "Caja / terminal de venta, gestion de clientes, pedidos y facturacion electronica.", icon: ShoppingCart },
  { title: "Inventario y stock", detail: "Control de stock, gestion de productos y movimientos de inventario.", icon: Boxes },
  { title: "Administracion", detail: "Proveedores, usuarios y cajas.", icon: Users },
  { title: "Reportes y analisis", detail: "Reportes de ventas, rendimiento y financieros.", icon: BarChart3 },
  { title: "Modulos de pagos", detail: "Gestion de pagos y medios.", icon: ReceiptText },
  { title: "Compatibilidad fiscal", detail: "Controladora fiscal homologada. Cumple 100% ARCA.", icon: ShieldCheck },
];

const distributorBenefits = [
  "Zonas a todo el pais",
  "Excelente rentabilidad",
  "Capacitacion y herramientas",
  "Soporte continuo",
  "Marca confiable",
];

const contactBenefits = [
  { title: "Envios a todo el pais", icon: Truck },
  { title: "Asesoramiento especializado", icon: Headset },
  { title: "Respaldo y garantia en cada solucion", icon: ShieldCheck },
];

export default function BarposPage() {
  const quoteHref = buildWhatsAppUrl("barpos", ["Consulta: precio vigente de BarPOS 4.0", "Origen: landing BarPOS"]);
  const resellerHref = buildWhatsAppUrl("barpos", ["Consulta: condiciones para distribuir/revender BarPOS", "Origen: landing BarPOS"]);

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main id="main-content" className="overflow-x-hidden bg-white text-[#071033]">
        <section className="relative overflow-hidden border-b border-[#dce7ff] bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[48%] bg-[linear-gradient(135deg,transparent_0%,transparent_28%,#eef6ff_28%,#eef6ff_56%,transparent_56%)] lg:block" />
          <div className="absolute right-0 top-16 hidden h-72 w-52 bg-[radial-gradient(circle,#b9d6ff_1px,transparent_1.6px)] [background-size:10px_10px] opacity-70 lg:block" />
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:px-6 md:py-18 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
            <div className="relative z-10">
              <p className="text-[13px] font-black uppercase tracking-[0.13em] text-[#071033]">
                Punto de venta <span className="text-[#0046EA]">electronico</span>
              </p>
              <h1 className="mt-4 font-display text-[clamp(52px,7vw,92px)] font-black leading-[0.94] tracking-[-0.055em] text-[#071033] text-balance">
                Bar<span className="text-[#1254e8]">POS 4.0</span>
              </h1>
              <h2 className="mt-4 font-display text-[clamp(24px,3vw,36px)] font-extrabold leading-tight tracking-[-0.03em] text-[#071033]">
                Completo, confiable y homologado.
              </h2>
              <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-600">
                El punto de venta electronico pensado para supermercados, despensas, panaderias, mini mercados, bares y todo tipo de comercio. Equipamiento profesional + software + controladora fiscal homologada.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {heroBenefits.map((item) => (
                  <div key={item.title} className="border-r border-slate-200 pr-4 last:border-r-0">
                    <item.icon className="size-10 text-[#1254e8]" strokeWidth={1.8} />
                    <p className="mt-3 text-[13px] font-extrabold text-[#071033]">{item.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={quoteHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7718,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14px] font-extrabold text-white shadow-[0_18px_34px_-18px_rgba(255,122,24,0.9)] transition hover:-translate-y-0.5">
                  <MessageCircle size={18} strokeWidth={2} /> Pedir cotizacion por WhatsApp
                </a>
                <Link href="#software" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-[#1254e8] bg-white px-6 py-3.5 text-[14px] font-extrabold text-[#1254e8] shadow-sm transition hover:bg-blue-50">
                  Ver software BarPOS 4.0 <ArrowRight size={17} strokeWidth={2} />
                </Link>
              </div>
            </div>

            <div className="relative z-10 min-h-[360px] lg:min-h-[560px]">
              <div className="absolute right-0 top-6 z-20 hidden rotate-1 rounded-lg border-4 border-[#1254e8] bg-[#0845c8] px-5 py-4 text-center font-display text-[22px] font-black uppercase leading-[0.95] text-white shadow-[0_18px_32px_-18px_rgba(0,70,234,0.8)] md:block">
                Mejor precio<br />del mercado
                <div className="mx-auto mt-2 grid size-14 place-items-center rounded-full border-4 border-white bg-white text-[#1254e8]">
                  <BadgeCheck size={28} fill="currentColor" strokeWidth={1.6} />
                </div>
              </div>
              <Image
                src="/photos/barpos/kit-completo.png"
                alt="Kit completo BarPOS con PC, impresora termica y lector laser"
                width={1519}
                height={1001}
                priority
                className="relative z-10 mx-auto w-full max-w-[820px] object-contain drop-shadow-[0_34px_42px_rgba(15,23,42,0.18)]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-6">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
            <div className="grid overflow-hidden rounded-lg border border-[#cbdcfb] bg-white shadow-[0_18px_54px_-42px_rgba(17,20,42,0.5)] md:grid-cols-4">
              {proofStrip.map((item) => (
                <div key={item.title} className="flex items-center gap-4 border-b border-[#dce7ff] p-5 md:border-b-0 md:border-r md:last:border-r-0">
                  <item.icon className="size-12 flex-none text-[#1254e8]" strokeWidth={1.7} />
                  <div>
                    <p className="text-[15px] font-extrabold leading-tight text-[#071033]">{item.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.1em] text-[#1254e8]">Equipamiento incluido</p>
              <h2 className="mt-3 font-display text-[clamp(34px,4.6vw,58px)] font-black leading-[1.02] tracking-[-0.055em] text-[#071033] text-balance">
                Un punto de venta <span className="text-[#1254e8]">listo para trabajar</span>
              </h2>
              <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-slate-600">
                Hardware profesional seleccionado por su rendimiento, durabilidad y compatibilidad total con BarPOS 4.0.
              </p>
              <div className="mt-7 grid gap-4">
                {[
                  ["PC BARTEZ POS I3 C/W10", "Gabinete mate black alum 500W + teclado y mouse black + Intel Core i3 + 8GB RAM + HDD 500GB + monitor 19 pulgadas."],
                  ["Impresora termica OCOM 80mm", "USB + LAN + autocutter."],
                  ["Lector OCOM laser OCBS-LA15", "USB 1D con base."],
                ].map(([title, detail]) => (
                  <div key={title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 flex-none text-[#1254e8]" fill="currentColor" strokeWidth={1.8} />
                    <div>
                      <p className="text-[13.5px] font-extrabold text-[#071033]">{title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {productCards.map((product, index) => (
                <article key={product.title} className="relative rounded-lg border border-[#cbdcfb] bg-white p-5 shadow-[0_20px_60px_-50px_rgba(17,20,42,0.7)]">
                  {index < productCards.length - 1 ? (
                    <div className="absolute -right-5 top-[38%] z-20 hidden size-10 place-items-center rounded-full bg-[#1254e8] text-[28px] font-black leading-none text-white shadow-lg md:grid">
                      +
                    </div>
                  ) : null}
                  <div className="relative aspect-[4/3]">
                    <Image src={product.image} alt={product.alt} fill sizes="(max-width: 1024px) 100vw, 28vw" className="object-contain" />
                  </div>
                  <h3 className="mt-5 min-h-[42px] text-[15px] font-black uppercase leading-tight text-[#1254e8]">{product.title}</h3>
                  <ul className="mt-4 grid gap-2 text-[13px] leading-relaxed text-slate-700">
                    {product.specs.map((spec) => (
                      <li key={spec} className="flex gap-2">
                        <span className="mt-2 size-1.5 flex-none rounded-full bg-[#071033]" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="software" className="border-y border-slate-200 bg-white py-12 md:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.1em] text-[#1254e8]">Software BarPOS 4.0</p>
              <h2 className="mt-3 font-display text-[clamp(32px,4.3vw,54px)] font-black leading-[1.03] tracking-[-0.052em] text-[#071033] text-balance">
                Modulos pensados para <span className="text-[#1254e8]">cada area de tu negocio</span>
              </h2>
              <p className="mt-5 max-w-[55ch] text-[15px] leading-relaxed text-slate-600">
                Una plataforma completa para gestionar ventas, stock, clientes, proveedores, reportes y mucho mas. Escalable para acompanar el crecimiento de tu negocio.
              </p>
              <Link href="#consulta" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#1254e8] bg-white px-5 py-3 text-[14px] font-extrabold text-[#1254e8] transition hover:bg-blue-50">
                Conocer BarPOS 4.0 <ArrowRight size={17} strokeWidth={2} />
              </Link>
              <div className="relative mt-9 overflow-hidden rounded-lg border border-[#cbdcfb] bg-[#071033] p-2 shadow-[0_28px_70px_-48px_rgba(0,70,234,0.7)]">
                <Image src="/photos/barpos/software.png" alt="Pantalla principal del software BarPOS 4.0" width={1749} height={1001} className="rounded-md object-cover" />
              </div>
            </div>

            <div className="grid overflow-hidden rounded-lg border border-[#dce7ff] bg-white md:grid-cols-2">
              {modules.map((module) => (
                <article key={module.title} className="flex gap-4 border-b border-[#dce7ff] p-5 last:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0">
                  <span className="grid size-14 flex-none place-items-center rounded-lg bg-[linear-gradient(135deg,#1254e8,#0440b8)] text-white shadow-[0_14px_24px_-18px_rgba(18,84,232,0.8)]">
                    <module.icon size={27} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#071033]">{module.title}</h3>
                    <p className="mt-2 text-[12.8px] leading-relaxed text-slate-600">{module.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#06307c] py-12 text-white md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(23,123,255,0.42),transparent_35%),linear-gradient(120deg,#08255e,#004cbf_52%,#08255e)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0%,transparent_40%,rgba(255,255,255,0.12)_40%,transparent_62%)]" />
          <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 md:grid-cols-[0.92fr_0.72fr] lg:grid-cols-[0.9fr_0.82fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#6bd2ff]">Red de distribucion</p>
              <h2 className="mt-3 font-display text-[clamp(32px,4vw,56px)] font-black leading-[1.03] tracking-[-0.05em] text-balance">
                Sumate a una <span className="text-[#34c8ff]">red que crece</span> todos los dias
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-blue-50">
                Si queres vender soluciones y no cajas, tenemos todo lo que necesitas para crecer con nosotros.
              </p>
              <ul className="mt-6 grid gap-2">
                {distributorBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-[14px] font-semibold text-blue-50">
                    <CheckCircle2 className="size-4 text-[#34c8ff]" fill="currentColor" strokeWidth={1.8} />
                    {benefit}
                  </li>
                ))}
              </ul>
              <a href={resellerHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7718,#ff8f1f,#ffb000)] px-6 py-3 text-[14px] font-extrabold text-white shadow-[0_18px_34px_-18px_rgba(255,122,24,0.9)] transition hover:-translate-y-0.5">
                <MessageCircle size={18} strokeWidth={2} /> Quiero ser distribuidor
              </a>
            </div>

            <ArgentinaMap />

            <div className="grid gap-5 md:col-span-2 lg:col-span-1">
              {[
                { title: "Soluciones completas", detail: "Equipamiento + software + soporte para todo tipo de negocios.", icon: Handshake },
                { title: "Soporte continuo", detail: "Acompanamiento tecnico y comercial permanente.", icon: Headset },
                { title: "Capacitacion y herramientas", detail: "Todo lo que necesitas para vender mas y mejor.", icon: GraduationCap },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 border-b border-white/18 pb-5 last:border-b-0">
                  <span className="grid size-16 flex-none place-items-center rounded-full border border-white/25 bg-white/10 text-white">
                    <item.icon size={30} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-display text-[20px] font-black leading-tight">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-blue-100">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="consulta" className="bg-white py-12 md:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.1em] text-[#1254e8]">Cotiza BarPOS 4.0</p>
              <h2 className="mt-3 font-display text-[clamp(32px,4.4vw,56px)] font-black leading-[1.03] tracking-[-0.052em] text-[#071033] text-balance">
                Hablemos <span className="text-[#1254e8]">de tu proyecto</span>
              </h2>
              <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-slate-600">
                Completa tus datos y te respondemos con la mejor propuesta para tu comercio.
              </p>
              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                {contactBenefits.map((item) => (
                  <div key={item.title} className="border-r border-slate-200 pr-4 last:border-r-0">
                    <item.icon className="size-9 text-[#1254e8]" strokeWidth={1.7} />
                    <p className="mt-3 text-[12.8px] font-semibold leading-tight text-slate-700">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#dce7ff] bg-white p-5 shadow-[0_26px_76px_-54px_rgba(17,20,42,0.65)] md:p-6">
              <BarposWhatsAppForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ArgentinaMap() {
  const pins = [
    "left-[60%] top-[37%]",
    "left-[58%] top-[39%]",
    "left-[62%] top-[40%]",
    "left-[56%] top-[42%]",
    "left-[61%] top-[43%]",
    "left-[64%] top-[45%]",
    "left-[58%] top-[46%]",
    "left-[62%] top-[48%]",
    "left-[55%] top-[49%]",
    "left-[59%] top-[51%]",
  ];

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[250px] md:h-[440px] md:max-w-[300px]">
      <div className="absolute inset-8 rounded-full bg-[#4d7dff]/30 blur-3xl" />
      <Image
        src="/photos/barpos/argentina-map-cropped.png"
        alt="Mapa de Argentina con zonas disponibles"
        fill
        sizes="(max-width: 768px) 250px, 300px"
        className="object-contain opacity-95"
        style={{
          filter:
            "brightness(0) invert(1) drop-shadow(0 0 6px rgba(105,216,255,0.95)) drop-shadow(0 0 18px rgba(91,214,255,0.65))",
        }}
      />
      {pins.map((pin) => (
        <span key={pin} className={`absolute ${pin} z-10 -translate-x-1/2 -translate-y-1/2`}>
          <span className="block size-3 rounded-full border-[1.5px] border-white bg-[#62d5ff] shadow-[0_0_8px_rgba(98,213,255,0.85)]">
            <span className="mx-auto mt-[2.5px] block size-1 rounded-full bg-[#4237d0]" />
          </span>
        </span>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Catálogo de soluciones IT — Bartez Tecnología", description: "Explorá familias de equipamiento e infraestructura IT y consultá disponibilidad por WhatsApp." };

const families = [
  { title: "Notebooks corporativas", image: "/photos/products/laptop1.jpg", use: "Administración, ventas, dirección, movilidad y renovación de flotas.", brands: "Dell · Lenovo · HP", href: "/soluciones/notebooks-corporativas" },
  { title: "PCs y workstations", image: "/photos/products/desktop.jpg", use: "Oficina, diseño, ingeniería, CAD, desarrollo y alto desempeño.", brands: "Dell · Lenovo · HP · Intel · AMD", href: "/configurador" },
  { title: "Servidores y almacenamiento", image: "/photos/products/server.jpg", use: "Virtualización, archivos, bases de datos, aplicaciones y continuidad.", brands: "Dell · HPE · Lenovo · Kingston", href: "/soluciones/servidores" },
  { title: "Redes e infraestructura", image: "/photos/products/switch.jpg", use: "Switching, WiFi, routing, segmentación y conectividad multi-sede.", brands: "Cisco y alternativas según proyecto", href: "/soluciones/redes-infraestructura" },
  { title: "Monitores y periféricos", image: "/photos/products/monitor.jpg", use: "Puestos completos, videollamadas, productividad y ergonomía.", brands: "Líneas corporativas y de uso profesional", href: "/comparador" },
  { title: "Componentes y upgrades", image: "/photos/products/storage.jpg", use: "Memoria, SSD, almacenamiento, procesadores y ampliaciones.", brands: "Intel · AMD · Kingston y más", href: "/comparador" },
  { title: "Energía y continuidad", image: "/photos/products/ups.jpg", use: "UPS, protección eléctrica y continuidad para puestos e infraestructura.", brands: "Alternativas según potencia y autonomía", href: "/soluciones/servidores" },
  { title: "Videovigilancia", image: "/photos/products/cctv.jpg", use: "Cámaras IP, grabación, almacenamiento y monitoreo empresarial.", brands: "Opciones dimensionadas por cobertura y retención", href: "/empresas" },
];

export default function CatalogoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] pt-20 text-white">
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <h1 className="max-w-[820px] font-display text-[clamp(40px,6vw,70px)] font-bold leading-[0.98] tracking-[-0.05em]">Catálogo de familias y soluciones IT.</h1>
            <p className="mt-6 max-w-[66ch] text-[16px] leading-relaxed text-slate-400">Explorá el tipo de solución que necesitás. No publicamos precios ni stock en tiempo real: confirmamos modelos, alternativas y plazos cuando recibimos tu consulta.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={buildWhatsAppUrl("quote", ["Origen: catálogo web"])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink"><MessageCircle size={18} /> Consultar disponibilidad</a>
              <Link href="/rfq" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-[14px] font-semibold text-white">Ya tengo modelos y cantidades <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-2">
            {families.map((family) => (
              <article key={family.title} className="group overflow-hidden border border-white/10 bg-[#06140d]">
                <div className="relative aspect-[16/7] overflow-hidden bg-[#082214]">
                  <Image src={family.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-75 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90" />
                </div>
                <div className="p-6 md:p-7">
                  <h2 className="font-display text-[22px] font-bold text-white">{family.title}</h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{family.use}</p>
                  <p className="mt-4 text-[12px] font-semibold text-slate-500">{family.brands}</p>
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                    <Link href={family.href} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">Ver opciones <ArrowRight size={15} /></Link>
                    <a href={buildWhatsAppUrl("quote", [`Familia de interés: ${family.title}`])} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-white"><MessageCircle size={15} /> Consultar</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

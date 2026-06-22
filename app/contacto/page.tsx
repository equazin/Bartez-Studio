import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { company, contact } from "../../constants";
import { Map } from "../../components/Map";

export const metadata: Metadata = {
  title: "Contacto — Bartez Tecnología",
  description:
    "Contactá a Bartez Tecnología por WhatsApp, email o teléfono. Estamos en Rosario, Santa Fe, con atención a todo el país. Respondemos en 24 hs hábiles.",
};

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: contact.phoneDisplay,
    sub: "Respuesta rápida en horario comercial",
    href: `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, quiero consultar sobre tecnología.")}`,
    cta: "Escribir por WhatsApp",
    accent: "bg-[#082214] border-white/5 hover:border-emerald/40 text-white",
    iconColor: "text-emerald-400",
  },
  {
    icon: Mail,
    title: "Email",
    value: contact.email,
    sub: "Para consultas formales y cotizaciones",
    href: `mailto:${contact.email}`,
    cta: "Enviar email",
    accent: "bg-[#082214] border-white/5 hover:border-blue/40 text-white",
    iconColor: "text-blue-400",
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: contact.phoneDisplay,
    sub: contact.hours,
    href: `tel:${contact.phoneDisplay.replace(/\s/g, "")}`,
    cta: "Llamar ahora",
    accent: "bg-[#082214] border-white/5 hover:border-violet/40 text-white",
    iconColor: "text-violet-400",
  },
];

const topics = [
  { label: "Cotización de equipos", href: "/#cotiza" },
  { label: "Programa de revendedores", href: "/revendedores" },
  { label: "Garantía / RMA", href: "/garantias-rma" },
  { label: "Instituciones educativas", href: "/educacion" },
  { label: "Sector público / gobierno", href: "/gobierno" },
  { label: "Canal corporativo", href: "/empresas" },
];

const darkInputClass = 
  "w-full rounded-xl border border-white/10 bg-[#06140d] px-4 py-3 text-[14px] text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder-slate-500";

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        
        {/* Hero */}
        <section className="bg-[#030c07] py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[620px]">
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Contacto Directo</span>
              <h1 className="mt-3 font-display text-[clamp(36px,5vw,62px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white text-balance">
                Hablemos de lo que necesitás.
              </h1>
              <p className="mt-5 text-[clamp(15px,1.4vw,17px)] leading-relaxed text-slate-400">
                Estamos en Rosario, Santa Fe, atendiendo clientes en toda Argentina. Elegí el canal que prefieras — respondemos siempre en 24 hs hábiles.
              </p>
            </div>

            {/* Canales de contacto */}
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {channels.map((ch) => (
                <div key={ch.title} className={`rounded-3xl border p-6 transition duration-300 ${ch.accent}`}>
                  <ch.icon className={`size-7 ${ch.iconColor}`} strokeWidth={1.6} />
                  <h2 className="mt-4 font-display text-[18px] font-bold text-white">{ch.title}</h2>
                  <p className="mt-1 text-[14px] font-medium text-slate-200">{ch.value}</p>
                  <p className="mt-1 text-[12px] text-slate-400">{ch.sub}</p>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
                  >
                    {ch.cta} <ArrowRight size={13} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid: Formulario + Datos + Mapa */}
        <section className="bg-[#06140d] border-t border-white/5 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              
              {/* Formulario */}
              <div className="rounded-3xl bg-[#030c07] border border-white/10 p-7 md:p-9 text-white">
                <h2 className="font-display text-[22px] font-bold text-white">Mandanos tu consulta</h2>
                <p className="mt-2 text-[13.5px] text-slate-400">Sin compromiso. Respondemos en 24 hs hábiles.</p>

                <form
                  className="mt-7 grid gap-4 sm:grid-cols-2"
                  aria-label="Formulario de contacto"
                >
                  <label>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Nombre</span>
                    <input
                      className={darkInputClass}
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Empresa</span>
                    <input
                      className={darkInputClass}
                      placeholder="Nombre de la empresa"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Email</span>
                    <input
                      type="email"
                      className={darkInputClass}
                      placeholder="nombre@empresa.com"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">¿Sobre qué querés consultar?</span>
                    <select className={darkInputClass}>
                      <option value="" className="bg-[#030c07] text-white">Seleccioná un tema</option>
                      {topics.map((t) => (
                        <option key={t.label} value={t.label} className="bg-[#030c07] text-white">{t.label}</option>
                      ))}
                      <option value="otro" className="bg-[#030c07] text-white">Otro</option>
                    </select>
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350">Mensaje</span>
                    <textarea
                      rows={4}
                      className={`${darkInputClass} resize-none`}
                      placeholder="Contanos qué necesitás..."
                    />
                  </label>
                  <div className="sm:col-span-2 pt-2">
                    <a
                      href={`mailto:${contact.email}?subject=Consulta%20desde%20web`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]"
                    >
                      Enviar consulta <ArrowRight size={16} />
                    </a>
                    <p className="mt-4 text-center text-[11.5px] text-slate-450">
                      O escribinos directo a{" "}
                      <a href={`mailto:${contact.email}`} className="font-semibold text-accent hover:underline">
                        {contact.email}
                      </a>
                    </p>
                  </div>
                </form>
              </div>

              {/* Datos + Mapa */}
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl bg-[#030c07] border border-white/10 p-7 text-white">
                  <h2 className="font-display text-[18px] font-bold text-white">Dónde encontrarnos</h2>
                  <ul className="mt-5 grid gap-4 text-[13.5px] text-slate-300">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-5 flex-none text-accent" strokeWidth={1.6} />
                      <div>
                        <p className="font-bold text-white">{company.address}</p>
                        <p className="text-slate-400">Rosario, Santa Fe, Argentina</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock3 className="size-5 flex-none text-accent" strokeWidth={1.6} />
                      <span>{contact.hours}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="size-5 flex-none text-accent" strokeWidth={1.6} />
                      <a href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`} className="hover:text-accent">
                        {contact.phoneDisplay}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="size-5 flex-none text-accent" strokeWidth={1.6} />
                      <a href={`mailto:${contact.email}`} className="hover:text-accent">{contact.email}</a>
                    </li>
                  </ul>
                </div>

                {/* Mapa OpenStreetMap */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#030c07]">
                  <Map />
                  <div className="bg-[#082214] px-5 py-3 border-t border-white/5">
                    <p className="text-[12px] text-slate-300">
                      {company.address}, Rosario, Santa Fe
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#082214] border border-white/5 p-6 text-white">
                  <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-accent">Atención nacional</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-slate-350">
                    Aunque nuestra sede está en Rosario, coordinamos proyectos y entregas en{" "}
                    <span className="font-semibold text-white">toda la Argentina.</span>
                  </p>
                  <Link
                    href="/#cotiza"
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent hover:underline"
                  >
                    Solicitar presupuesto <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { getDynamicSuccessCases } from "@/lib/db-content";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Casos de éxito - Bartez Tecnología",
  description: "Proyectos tecnológicos documentados y autorizados por clientes de Bartez.",
};

export default async function CasosPage() {
  const cases = await getDynamicSuccessCases();

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Casos documentados"
        title={
          <>
            Casos de éxito <span className="text-[#0046EA]">verificables.</span>
          </>
        }
        intro="Publicamos únicamente proyectos con información y autorización suficiente para respaldar alcance, contexto y resultados."
        image="/photos/datacenter.jpg"
        imageAlt="Proyecto tecnológico documentado"
        imagePriority
        mediaLabel="Proyectos"
        mediaTitle="Contenido publicado solo con respaldo."
        mediaSubtitle="Preferimos mostrar menos casos, pero con información real y autorizada."
        mediaItems={[
          { icon: FileText, title: "Alcance", description: "Contexto y solución aplicada." },
          { icon: MessageCircle, title: "Consulta", description: "Casos similares por WhatsApp." },
          { icon: ArrowRight, title: "Detalle", description: "Lectura simple y verificable." },
        ]}
        metrics={[
          { value: `${cases.length}`, label: "casos publicados" },
          { value: "OK", label: "autorización" },
          { value: "B2B", label: "proyectos reales" },
        ]}
        actions={[
          { label: "Consultar una solución similar", href: whatsappLinks.company, external: true, icon: MessageCircle },
          { label: "Ver empresas", href: "/empresas", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Biblioteca" title="Proyectos publicados.">
        {cases.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {cases.map((item) => (
              <Link key={item.id} href={`/casos/${item.id}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
                <div className="relative aspect-[16/8] bg-slate-100">
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6">
                  <p className="text-[12px] font-bold text-[#0046EA]">{item.clientName}</p>
                  <h2 className="mt-2 font-display text-[21px] font-semibold text-[#11142a]">{item.title}</h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0046EA]">
                    Ver caso <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="font-display text-[24px] font-semibold text-[#11142a]">Contenido en preparación</h2>
            <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-slate-600">
              Los casos anónimos fueron retirados. Esta sección se habilitará a medida que contemos con clientes, resultados y autorizaciones verificables.
            </p>
            <a href={whatsappLinks.company} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-5 py-3 text-[14px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(255,122,24,0.9)]">
              <MessageCircle size={17} /> Consultar una solución similar
            </a>
          </div>
        )}
      </InternalSection>

      <InternalCta
        title="¿Tenés un proyecto parecido en mente?"
        intro="Contanos el contexto y armamos una propuesta adaptada a tu escala y restricciones."
        actions={[
          { label: "Hablar por WhatsApp", href: whatsappLinks.company, external: true, icon: MessageCircle },
          { label: "Ver soluciones", href: "/soluciones/servidores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}

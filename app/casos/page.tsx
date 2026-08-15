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
import { capabilities } from "@/lib/capabilities";
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
          <div className="space-y-8">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-[22px] font-semibold text-[#11142a]">
                Biblioteca en preparación
              </h2>
              <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-slate-600">
                Publicamos casos únicamente con autorización del cliente. Hasta
                completar esas piezas, describimos abajo las clases de operación
                que resolvemos habitualmente — sin identificar clientes ni
                fabricar métricas puntuales.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200"
                >
                  <span className="grid size-11 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA]">
                    <item.icon size={22} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-semibold text-[#11142a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0046EA]">
                    Ver detalle <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
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

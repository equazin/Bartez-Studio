import type { Metadata } from "next";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, FileCheck2, HelpCircle, Mail, MessageCircle, Package, RefreshCw, Shield, Truck, Wrench } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { contact } from "@/constants";

export const metadata: Metadata = {
  title: "Garantías y RMA - Bartez Tecnología",
  description:
    "Conocé cómo acompaña Bartez las consultas de garantía y el proceso de RMA según las condiciones aplicables a cada producto y fabricante.",
};

const steps = [
  { num: "01", icon: HelpCircle, title: "Detectas el problema", desc: "El equipo presenta una falla o defecto durante el período de garantía." },
  { num: "02", icon: AlertCircle, title: "Nos contactas", desc: "Escribinos con el problema, modelo, número de serie y comprobante." },
  { num: "03", icon: FileCheck2, title: "Evaluamos el caso", desc: "Revisamos si corresponde garantía del fabricante o soporte técnico." },
  { num: "04", icon: RefreshCw, title: "Gestionamos la solución", desc: "Coordinamos retiro, reparación o reemplazo según corresponda." },
];

const covered = [
  "Defectos de fabricación detectados durante el uso normal.",
  "Fallas de hardware bajo condiciones normales de operación.",
  "Componentes defectuosos dentro del período de garantía.",
  "Problemas asociados al equipo según condiciones del fabricante.",
];

const notCovered = [
  "Daños por golpes, líquidos o mal uso del equipo.",
  "Modificaciones o reparaciones realizadas por terceros.",
  "Desgaste normal por uso y consumibles fuera de cobertura.",
  "Pérdida de datos: recomendamos backup previo a cualquier gestión.",
];

const brands = [
  { name: "Dell", warranty: "1 a 3 años según línea; ProSupport disponible." },
  { name: "Lenovo", warranty: "1 a 3 años según línea y cobertura contratada." },
  { name: "HP", warranty: "1 año base con extensiones disponibles." },
  { name: "Cisco", warranty: "Varía por modelo y contrato; consultar." },
  { name: "Kingston", warranty: "Según línea de memoria, SSD o accesorio." },
  { name: "Intel / AMD", warranty: "Según producto, versión boxed y condiciones del fabricante." },
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, necesito hacer un reclamo de garantía.")}`;

export default function GarantiasRmaPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Garantías y RMA"
        eyebrowIcon={Shield}
        title={
          <>
            Tu compra está respaldada. <span className="text-[#0046EA]">Siempre.</span>
          </>
        }
        intro="Si un producto presenta una falla, te ayudamos a identificar el procedimiento aplicable y acompañamos el seguimiento con información clara en cada paso."
        image="/photos/products/ups.jpg"
        imageAlt="Soporte de garantía y RMA"
        imagePriority
        mediaLabel="Postventa"
        mediaTitle="Proceso ordenado desde el primer contacto."
        mediaSubtitle="Reunimos datos del producto, validamos condiciones y coordinamos el siguiente paso."
        mediaItems={[
          { icon: Clock, title: "24 hs", description: "Respuesta inicial hábil." },
          { icon: Truck, title: "Logística", description: "Coordinación según caso y ubicación." },
          { icon: Wrench, title: "Resolución", description: "Reparación, reemplazo u orientación." },
        ]}
        metrics={[
          { value: "24 hs", label: "respuesta inicial" },
          { value: "RMA", label: "seguimiento del caso" },
          { value: "ARG", label: "gestión nacional" },
        ]}
        actions={[
          { label: "Iniciar reclamo", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Enviar por email", href: `mailto:${contact.email}?subject=Reclamo%20de%20garantía`, variant: "secondary", icon: Mail },
        ]}
      />

      <InternalSection tone="white" eyebrow="Fabricantes" title="Garantías por fabricante.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <article key={brand.name} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Package className="mt-0.5 size-5 flex-none text-[#0046EA]" strokeWidth={1.7} />
              <div>
                <p className="font-display text-[16px] font-semibold text-[#11142a]">{brand.name}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">{brand.warranty}</p>
              </div>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalSection tone="soft" eyebrow="Proceso" title="Proceso de garantía paso a paso.">
        <ol className="grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.num} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-display text-[13px] font-semibold text-[#0046EA]">{step.num}</span>
              <step.icon className="mt-6 size-6 text-[#0046EA]" strokeWidth={1.7} />
              <h3 className="mt-4 font-display text-[16px] font-semibold text-[#11142a]">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{step.desc}</p>
            </li>
          ))}
        </ol>
      </InternalSection>

      <InternalSection tone="white" eyebrow="Cobertura" title="Qué cubre y que no cubre la garantía.">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-[22px] font-semibold text-[#11142a]">
              <CheckCircle2 className="size-6 text-[#0046EA]" strokeWidth={1.8} /> Qué cubre
            </h3>
            <InternalChecklist items={covered} className="mt-6" />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-[22px] font-semibold text-[#11142a]">
              <AlertCircle className="size-6 text-red-500" strokeWidth={1.8} /> Qué no cubre
            </h3>
            <ul className="mt-6 grid gap-4">
              {notCovered.map((item) => (
                <li key={item} className="flex gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-[14px] leading-relaxed text-red-900">
                  <AlertCircle className="mt-0.5 size-5 flex-none text-red-500" strokeWidth={1.8} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </InternalSection>

      <InternalCta
        title="¿Tenés un problema con un equipo comprado en Bartez?"
        intro="Escribinos y lo resolvemos. Nuestro equipo te acompaña en el proceso de garantía sin burocracia innecesaria."
        actions={[
          { label: "Iniciar por WhatsApp", href: whatsappHref, external: true, icon: MessageCircle },
          { label: contact.email, href: `mailto:${contact.email}?subject=Reclamo%20de%20garantía`, variant: "secondary", icon: Mail },
        ]}
      />
    </InternalPageShell>
  );
}

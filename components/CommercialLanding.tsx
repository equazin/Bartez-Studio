import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { buildWhatsAppUrl, type WhatsAppIntent } from "@/lib/whatsapp";

type CommercialItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type CommercialLandingProps = {
  title: string;
  intro: string;
  items: CommercialItem[];
  proof: string[];
  ctaLabel?: string;
  intent?: WhatsAppIntent;
  whatsappDetails?: string[];
  note?: string;
  secondary?: { label: string; href: string };
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
};

const defaultProfile = {
  eyebrow: "Soluciones Bartez",
  image: "/photos/hero-products-combo.png",
  mediaTitle: "Una propuesta preparada con contexto real.",
  mediaSubtitle: "Relevamos necesidad, alcance y restricciones antes de cotizar.",
  label: "B2B",
};

function getProfile(title: string, intent: WhatsAppIntent) {
  const text = title.toLowerCase();

  if (text.includes("ciberseguridad")) {
    return {
      eyebrow: "Seguridad IT",
      image: "/photos/products/router.jpg",
      mediaTitle: "Proteccion por capas, sin sobredimensionar.",
      mediaSubtitle: "Ordenamos prioridades: acceso, red, endpoints, backup y continuidad.",
      label: "Riesgo controlado",
    };
  }

  if (text.includes("cloud") || text.includes("licenciamiento")) {
    return {
      eyebrow: "Cloud y software",
      image: "/photos/office.jpg",
      mediaTitle: "Licencias y servicios alíneados a usuarios reales.",
      mediaSubtitle: "Evaluamos renovaciones, cuentas, backups y productividad.",
      label: "Licencias B2B",
    };
  }

  if (text.includes("soporte") || text.includes("administrados")) {
    return {
      eyebrow: "Servicios IT",
      image: "/photos/engineer.jpg",
      mediaTitle: "Acompañamiento técnico con alcance documentado.",
      mediaSubtitle: "Definimos niveles de atencion segun criticidad, sedes y equipos.",
      label: "Operaciones",
    };
  }

  if (text.includes("renting") || text.includes("leasing") || text.includes("renovacion")) {
    return {
      eyebrow: "Financiacion tecnológica",
      image: "/photos/products/laptop2.jpg",
      mediaTitle: "Renovar tecnología con impacto financiero claro.",
      mediaSubtitle: "Comparamos alternativas comerciales segun monto, plazo y disponibilidad.",
      label: "Renovacion",
    };
  }

  if (text.includes("logistica") || text.includes("cobertura")) {
    return {
      eyebrow: "Cobertura nacional",
      image: "/photos/products/storage.jpg",
      mediaTitle: "Entregas coordinadas para una o varias sedes.",
      mediaSubtitle: "Validamos destino, urgencia, volumen y modalidad de entrega.",
      label: "ARG",
    };
  }

  if (text.includes("industriales") || text.includes("industria")) {
    return {
      eyebrow: "Entornos industriales",
      image: "/photos/datacenter.jpg",
      mediaTitle: "Infraestructura para planta, oficina y operaciones.",
      mediaSubtitle: "Priorizamos continuidad, conectividad y equipos adecuados al uso.",
      label: "Planta + oficina",
    };
  }

  if (text.includes("salud")) {
    return {
      eyebrow: "Organizaciones de salud",
      image: "/photos/products/monitor.jpg",
      mediaTitle: "Puestos, conectividad y continuidad para sedes criticas.",
      mediaSubtitle: "Dimensionamos segun usuarios, areas administrativas y servicios internos.",
      label: "Continuidad",
    };
  }

  if (text.includes("pago") || intent === "quote") {
    return {
      eyebrow: "Condiciones comerciales",
      image: "/photos/products/desktop.jpg",
      mediaTitle: "Cada operación se evalua con información vigente.",
      mediaSubtitle: "Confirmamos disponibilidad, alternativas y condiciones al cotizar.",
      label: "Cotización",
    };
  }

  return defaultProfile;
}

export function CommercialLanding({
  title,
  intro,
  items,
  proof,
  ctaLabel = "Consultar por WhatsApp",
  intent = "quote",
  whatsappDetails = [],
  note,
  secondary,
  eyebrow,
  image,
  imageAlt,
}: CommercialLandingProps) {
  const whatsappHref = buildWhatsAppUrl(intent, whatsappDetails);
  const profile = getProfile(title, intent);
  const heroItems = items.slice(0, 3).map((item) => ({
    icon: item.icon,
    title: item.title,
    description: item.description,
  }));

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow={eyebrow ?? profile.eyebrow}
        title={title}
        intro={intro}
        image={image ?? profile.image}
        imageAlt={imageAlt ?? title}
        imagePriority
        mediaLabel={profile.label}
        mediaTitle={profile.mediaTitle}
        mediaSubtitle={profile.mediaSubtitle}
        mediaItems={heroItems}
        actions={[
          { label: ctaLabel, href: whatsappHref, external: true, icon: MessageCircle },
          ...(secondary ? [{ label: secondary.label, href: secondary.href, variant: "secondary" as const, icon: ArrowRight }] : []),
        ]}
        metrics={[
          { value: "24 hs", label: "respuesta inicial" },
          { value: "B2B", label: "condiciones comerciales" },
          { value: "ARG", label: "cobertura nacional" },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Alcance de trabajo"
        title="Una solución definida por necesidad, no por catalogo."
        intro="Cada consulta se ordena con información técnica y comercial para llegar a una propuesta concreta."
      >
        <InternalFeatureGrid features={items} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Criterios de propuesta"
        title="Antes de cotizar, validamos lo que puede cambiar el resultado."
        intro="La diferencia no esta solo en el producto: esta en elegirlo con datos de operación, plazos y condiciones reales."
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-[#f7f9fc] p-6">
            <CheckCircle2 className="size-7 text-[#1236d8]" strokeWidth={1.7} />
            <h3 className="mt-5 font-display text-[22px] font-extrabold text-[#11142a]">Propuesta con respaldo</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
              No publicamos precios o promesas genéricas. Confirmamos el alcance según disponibilidad, marcas posibles y condiciones vigentes.
            </p>
            {note ? <p className="mt-4 border-t border-slate-200 pt-4 text-[12.5px] leading-relaxed text-slate-500">{note}</p> : null}
          </div>
          <InternalChecklist items={proof} columns="two" />
        </div>
      </InternalSection>

      <InternalCta
        title="Hablemos de tu operación y armamos el siguiente paso."
        intro="Contaños qué necesitás resolver, con que plazo y en que escala. Un especialista te responde por WhatsApp."
        actions={[
          { label: ctaLabel, href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Ver marcas", href: "/marcas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}

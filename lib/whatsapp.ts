import { contact } from "@/constants";

export type WhatsAppIntent =
  | "general"
  | "quote"
  | "rfq"
  | "reseller"
  | "company"
  | "government"
  | "education"
  | "rma"
  | "services";

const intentOpeners: Record<WhatsAppIntent, string> = {
  general: "Hola, vengo de la web de Bartez y necesito asesoramiento.",
  quote: "Hola, vengo de la web de Bartez y quiero solicitar una cotización.",
  rfq: "Hola, vengo de la web de Bartez y quiero enviar una cotización masiva (RFQ).",
  reseller: "Hola, vengo de la web de Bartez y quiero consultar por el canal de revendedores.",
  company: "Hola, represento a una empresa y necesito una solución tecnológica.",
  government: "Hola, represento a un organismo público y necesito asesoramiento para una compra o proyecto tecnológico.",
  education: "Hola, represento a una institución educativa y necesito cotizar equipamiento tecnológico.",
  rma: "Hola, necesito iniciar una consulta de garantía o RMA.",
  services: "Hola, quiero consultar por servicios y soporte IT para mi organización.",
};

export function buildWhatsAppMessage(
  intent: WhatsAppIntent,
  details: Array<string | false | null | undefined> = [],
) {
  return [intentOpeners[intent], ...details.filter(Boolean)].join("\n");
}

export function buildWhatsAppUrl(
  intent: WhatsAppIntent = "general",
  details: Array<string | false | null | undefined> = [],
) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    buildWhatsAppMessage(intent, details),
  )}`;
}

export const whatsappLinks = {
  general: buildWhatsAppUrl("general"),
  quote: buildWhatsAppUrl("quote"),
  rfq: buildWhatsAppUrl("rfq"),
  reseller: buildWhatsAppUrl("reseller"),
  company: buildWhatsAppUrl("company"),
  government: buildWhatsAppUrl("government"),
  education: buildWhatsAppUrl("education"),
  rma: buildWhatsAppUrl("rma"),
  services: buildWhatsAppUrl("services"),
} as const;

import { contactConfig } from '../data/site'

export type ContactPayload = {
  name: string
  company: string
  email: string
  whatsapp: string
  service: string
  budget: string
  message: string
}

export function buildContactMessage(payload: ContactPayload) {
  return [
    'Hola Bartez Studio, quiero solicitar una propuesta.',
    '',
    `Nombre: ${payload.name}`,
    `Empresa: ${payload.company || 'No indicado'}`,
    `Email: ${payload.email}`,
    `WhatsApp: ${payload.whatsapp || 'No indicado'}`,
    `Servicio de interés: ${payload.service}`,
    `Presupuesto aproximado: ${payload.budget || 'No indicado'}`,
    '',
    `Mensaje: ${payload.message}`,
  ].join('\n')
}

export function buildWhatsAppUrl(payload: ContactPayload) {
  const message = encodeURIComponent(buildContactMessage(payload))
  return `https://wa.me/${contactConfig.whatsappNumber}?text=${message}`
}

export function buildMailtoUrl(payload: ContactPayload) {
  const subject = encodeURIComponent(`Consulta comercial - ${payload.service}`)
  const body = encodeURIComponent(buildContactMessage(payload))
  return `mailto:${contactConfig.email}?subject=${subject}&body=${body}`
}

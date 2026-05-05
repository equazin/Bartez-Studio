import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { services } from '../data/site'

const baseTitle = 'Bartez Studio'
const defaultDescription =
  'Diseño web, ecommerce, branding, automatización y consultoría digital para empresas que quieren verse mejor, vender mejor y funcionar mejor.'

const staticMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Bartez Studio | Diseño, ecommerce, branding y automatización',
    description:
      'Creamos sitios web, ecommerce, branding y herramientas digitales pensadas para convertir visitas en oportunidades reales.',
  },
  '/servicios': {
    title: `Servicios digitales | ${baseTitle}`,
    description:
      'Diseño web, ecommerce, branding, marketing visual, automatización y consultoría digital con foco comercial.',
  },
  '/portfolio': {
    title: `Portfolio y casos de referencia | ${baseTitle}`,
    description:
      'Casos de referencia para entender cómo Bartez Studio combina diseño, estrategia comercial y tecnología aplicada.',
  },
  '/nosotros': {
    title: `Nosotros | ${baseTitle}`,
    description:
      'Una división creativa y digital de Bartez enfocada en identidad, experiencia, conversión y producto digital.',
  },
  '/contacto': {
    title: `Solicitar propuesta | ${baseTitle}`,
    description:
      'Contactá a Bartez Studio para pedir un diagnóstico inicial y una propuesta clara para tu web, ecommerce, marca o automatización.',
  },
}

export function Seo() {
  const location = useLocation()

  useEffect(() => {
    const serviceSlug = location.pathname.replace('/servicios/', '')
    const service = services.find((item) => item.slug === serviceSlug)
    const meta = service
      ? {
          title: `${service.title} | ${baseTitle}`,
          description: `${service.summary} ${service.benefit}`,
        }
      : staticMeta[location.pathname] ?? {
          title: `Página no disponible | ${baseTitle}`,
          description: defaultDescription,
        }

    document.title = meta.title
    setMeta('description', meta.description)
    setMeta('og:title', meta.title, 'property')
    setMeta('og:description', meta.description, 'property')
    setMeta('twitter:title', meta.title)
    setMeta('twitter:description', meta.description)
    setCanonical(`${window.location.origin}${location.pathname}`)
  }, [location.pathname])

  return null
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

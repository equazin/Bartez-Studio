import { type ReactNode, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Mail, Menu, MessageCircle, X } from 'lucide-react'
import { contactConfig, navItems, services } from '../data/site'
import { Seo } from '../components/Seo'
import { Button } from '../components/ui'

const resourceItems = [
  { label: 'Diagnóstico inicial', href: '/contacto', text: 'Para ordenar prioridades antes de invertir.' },
  { label: 'Proceso de trabajo', href: '/#proceso', text: 'Etapas visibles desde diagnóstico hasta mejora.' },
  { label: 'Preguntas frecuentes', href: '/#faq', text: 'Dudas comunes antes de pedir propuesta.' },
]

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen overflow-hidden bg-[#03050b] text-white">
      <Seo />
      <ScrollManager />
      <Header open={open} setOpen={setOpen} />
      <AnimatePresence>{open ? <MobileMenu close={() => setOpen(false)} /> : null}</AnimatePresence>
      <main key={location.pathname}>{children}</main>
      <FloatingContact />
      <Footer />
    </div>
  )
}

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

  return null
}

function Header({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-5 z-50 px-4">
      <div className="mx-auto flex h-[76px] w-full max-w-[1620px] items-center justify-between gap-5 rounded-[10px] border border-white/10 bg-[#060a13]/[0.82] px-6 shadow-[0_20px_80px_rgba(0,0,0,.32)] backdrop-blur-2xl sm:px-7">
        <Logo />
        <nav className="hidden items-center gap-10 lg:flex" aria-label="Navegación principal">
          <NavDropdown
            label="Servicios"
            href="/servicios"
            items={services.map((service) => ({
              label: service.title,
              href: `/servicios/${service.slug}`,
              text: service.benefit,
            }))}
          />
          <DesktopNavLink href="/portfolio">Proyectos</DesktopNavLink>
          <DesktopNavLink href="/nosotros">Sobre nosotros</DesktopNavLink>
          <NavDropdown label="Recursos" href="/contacto" items={resourceItems} compact />
          <DesktopNavLink href="/contacto">Contacto</DesktopNavLink>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button className="min-w-[210px] rounded-lg border-violet-400/50 px-6" to="/contacto" variant="secondary">
            Solicitar propuesta <ArrowRight size={16} />
          </Button>
        </div>
        <button
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white lg:hidden"
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  )
}

function DesktopNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `inline-flex items-center gap-1.5 text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
      }
      to={href}
    >
      {children}
    </NavLink>
  )
}

function NavDropdown({
  label,
  href,
  items,
  compact = false,
}: {
  label: string
  href: string
  items: { label: string; href: string; text: string }[]
  compact?: boolean
}) {
  return (
    <div className="group relative">
      <NavLink
        className={({ isActive }) =>
          `inline-flex items-center gap-1.5 text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
        }
        to={href}
      >
        {label}
        <ChevronDown className="transition group-hover:rotate-180" size={14} strokeWidth={1.8} />
      </NavLink>

      <div
        className={`invisible absolute left-1/2 top-8 z-50 -translate-x-1/2 translate-y-2 rounded-[1.25rem] border border-white/10 bg-[#07101b]/95 p-3 opacity-0 shadow-[0_24px_90px_rgba(0,0,0,.42)] backdrop-blur-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
          compact ? 'w-[340px]' : 'w-[620px]'
        }`}
      >
        <div className={compact ? 'grid gap-2' : 'grid grid-cols-2 gap-2'}>
          {items.map((item) => (
            <Link
              className="rounded-[1rem] border border-transparent p-4 transition hover:border-cyan-300/20 hover:bg-white/[0.045]"
              to={item.href}
              key={item.href}
            >
              <span className="block text-sm font-semibold text-white">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileMenu({ close }: { close: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed inset-x-4 top-24 z-40 rounded-[2rem] border border-white/10 bg-night-900/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden"
    >
      <nav className="grid max-h-[calc(100svh-7rem)] gap-2 overflow-y-auto" aria-label="Navegación mobile">
        {navItems.map((item) => (
          <Link className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-100 hover:bg-white/10" to={item.href} onClick={close} key={item.href}>
            {item.label}
          </Link>
        ))}
        <div className="my-2 h-px bg-white/10" />
        {services.slice(0, 4).map((service) => (
          <Link
            className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white"
            to={`/servicios/${service.slug}`}
            onClick={close}
            key={service.slug}
          >
            {service.title}
          </Link>
        ))}
        <Link className="mt-2 rounded-2xl bg-white px-4 py-3 text-center font-semibold text-night-950" to="/contacto" onClick={close}>
          Solicitar propuesta
        </Link>
      </nav>
    </motion.div>
  )
}

function Logo() {
  return (
    <Link className="flex items-center gap-3" to="/" aria-label="Bartez Studio inicio">
      <span className="relative flex size-9 items-center justify-center">
        <svg className="size-9 drop-shadow-[0_0_22px_rgba(53,231,255,.35)]" viewBox="0 0 40 44" aria-hidden="true">
          <path d="M7 4 31 14 20 22 7 16Z" fill="#35e7ff" />
          <path d="M7 18 20 24 32 17 32 30 20 38 7 31Z" fill="#6c63ff" />
          <path d="M7 31 20 38 8 42 2 36Z" fill="#9d4cff" />
          <path d="M20 24 32 17 38 22 32 30Z" fill="#21c6ff" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight text-white">Bartez Studio</span>
    </Link>
  )
}

function FloatingContact() {
  const message = encodeURIComponent('Hola Bartez Studio, quiero solicitar una propuesta.')

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-3 sm:flex">
      <a
        className="flex size-12 items-center justify-center rounded-full border border-cyan-300/25 bg-[#07101b]/90 text-studio-cyan shadow-[0_18px_70px_rgba(53,231,255,.16)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/60"
        href={`https://wa.me/${contactConfig.whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp de Bartez Studio"
      >
        <MessageCircle size={22} />
      </a>
      <a
        className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-[#07101b]/80 text-slate-300 shadow-[0_18px_70px_rgba(0,0,0,.24)] backdrop-blur-xl transition hover:-translate-y-1 hover:text-white"
        href={`mailto:${contactConfig.email}`}
        aria-label="Enviar email a Bartez Studio"
      >
        <Mail size={20} />
      </a>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-950/70">
      <div className="studio-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-md leading-7 text-slate-400">
              Diseño, tecnología y estrategia digital para empresas que necesitan verse mejor, vender mejor y funcionar mejor.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Servicios</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {services.slice(0, 4).map((service) => (
                <li key={service.slug}>
                  <Link className="hover:text-studio-cyan" to={`/servicios/${service.slug}`}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Mapa</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className="hover:text-studio-cyan" to={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a className="hover:text-studio-cyan" href={`mailto:${contactConfig.email}`}>
                  {contactConfig.email}
                </a>
              </li>
              <li>
                <Link className="hover:text-studio-cyan" to="/contacto">
                  Solicitar propuesta
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Bartez Studio. Todos los derechos reservados.</p>
          <p>División creativa/digital de Bartez.</p>
        </div>
      </div>
    </footer>
  )
}

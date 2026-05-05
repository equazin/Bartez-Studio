import { type FormEvent, useMemo, useState } from 'react'
import { Mail, MessageCircle, Send, Sparkles } from 'lucide-react'
import { services } from '../data/site'
import { buildMailtoUrl, buildWhatsAppUrl, type ContactPayload } from '../lib/contact'
import { Button } from './ui'

const initialPayload: ContactPayload = {
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  service: 'Diseño web',
  budget: '',
  message: '',
}

export function ContactForm() {
  const [payload, setPayload] = useState<ContactPayload>(initialPayload)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = useMemo(
    () => payload.name.trim() && payload.email.trim() && payload.service.trim() && payload.message.trim(),
    [payload],
  )

  function update(field: keyof ContactPayload, value: string) {
    setPayload((current) => ({ ...current, [field]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      setError('Completá nombre, email, servicio y mensaje para preparar la consulta.')
      return
    }

    setError('')
    setSubmitted(true)
    window.open(buildWhatsAppUrl(payload), '_blank', 'noopener,noreferrer')
  }

  return (
    <form
      className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#07101b] p-5 shadow-[0_30px_120px_rgba(0,0,0,.28)] sm:p-7"
      onSubmit={submit}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(53,231,255,.16),transparent_34%),radial-gradient(circle_at_95%_18%,rgba(139,92,246,.2),transparent_30%)]" />
      <div className="relative mb-6 flex flex-col gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Datos para orientar la propuesta</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">Con esto podemos responder con más criterio y menos ida y vuelta.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-2 text-xs font-semibold text-lime-100">
          <Sparkles size={14} /> Diagnóstico inicial
        </span>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" value={payload.name} onChange={(value) => update('name', value)} required />
        <Field label="Empresa" value={payload.company} onChange={(value) => update('company', value)} />
        <Field label="Email" type="email" value={payload.email} onChange={(value) => update('email', value)} required />
        <Field label="WhatsApp" value={payload.whatsapp} onChange={(value) => update('whatsapp', value)} />
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Servicio de interés
          <select
            className="min-h-12 rounded-2xl border border-white/10 bg-night-950/70 px-4 text-white transition hover:border-cyan-200/30"
            value={payload.service}
            onChange={(event) => update('service', event.target.value)}
          >
            {services.map((service) => (
              <option value={service.title} key={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Presupuesto aproximado
          <select
            className="min-h-12 rounded-2xl border border-white/10 bg-night-950/70 px-4 text-white transition hover:border-cyan-200/30"
            value={payload.budget}
            onChange={(event) => update('budget', event.target.value)}
          >
            <option value="">Seleccionar rango</option>
            <option value="A definir">A definir</option>
            <option value="Proyecto inicial">Proyecto inicial</option>
            <option value="Proyecto completo">Proyecto completo</option>
            <option value="Solución avanzada">Solución avanzada</option>
          </select>
        </label>
      </div>

      <label className="relative mt-4 grid gap-2 text-sm font-medium text-slate-200">
        Mensaje
        <textarea
          className="min-h-36 resize-y rounded-2xl border border-white/10 bg-night-950/70 px-4 py-3 leading-7 text-white transition placeholder:text-slate-500 hover:border-cyan-200/30"
          placeholder="Contanos qué querés mejorar, qué necesita tu negocio y si ya tenés una web o marca existente."
          value={payload.message}
          onChange={(event) => update('message', event.target.value)}
          required
        />
      </label>

      {error ? <p className="relative mt-4 rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
      {submitted ? (
        <p className="relative mt-4 rounded-2xl border border-lime-300/25 bg-lime-400/10 px-4 py-3 text-sm text-lime-100">
          Listo. Abrimos WhatsApp con tu consulta preparada. También podés enviarla por email.
        </p>
      ) : null}

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1 rounded-[10px]" type="submit">
          <Send size={18} /> Enviar por WhatsApp
        </Button>
        <Button className="flex-1 rounded-[10px]" href={buildMailtoUrl(payload)} variant="secondary">
          <Mail size={18} /> Enviar por email
        </Button>
      </div>
      <a
        className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-studio-cyan"
        href={buildWhatsAppUrl(payload)}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={17} /> Abrir WhatsApp directo
      </a>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      {label}
      <input
        className="min-h-12 rounded-2xl border border-white/10 bg-night-950/70 px-4 text-white transition placeholder:text-slate-500 hover:border-cyan-200/30"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  )
}

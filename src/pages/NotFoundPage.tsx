import { Button } from '../components/ui'

export function NotFoundPage() {
  return (
    <section className="section-y">
      <div className="studio-shell flex min-h-[55svh] flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-studio-cyan">404</p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Esta página no está disponible.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
          Volvé al inicio o solicitá una propuesta para conversar sobre tu proyecto.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/">Volver al inicio</Button>
          <Button to="/contacto" variant="secondary">Contactar</Button>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { ChevronDown, CreditCard, Headphones, Home, LineChart, Package, ShoppingCart, Users } from 'lucide-react'

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay: 0.12 }}
      className="relative mx-auto w-full max-w-[870px] lg:-mt-20"
      aria-hidden="true"
    >
      <MobileMockup />
      <DesktopMockup />
    </motion.div>
  )
}

function DesktopMockup() {
  return (
    <div className="relative hidden h-[560px] origin-center -translate-x-52 scale-[0.78] lg:block xl:-translate-x-36 xl:scale-[0.88] 2xl:translate-x-0 2xl:scale-100">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_0%,rgba(73,124,255,.12)_48%,transparent_70%)]" />
      <div className="absolute -right-12 top-2 h-full w-[620px] opacity-40 [background-image:linear-gradient(115deg,rgba(53,231,255,.2)_1px,transparent_1px),linear-gradient(25deg,rgba(139,92,246,.18)_1px,transparent_1px)] [background-size:86px_86px]" />

      <div className="absolute left-[12%] top-[44%] z-30 w-[136px] -translate-y-1/2 overflow-hidden rounded-[1.6rem] border border-cyan-300/35 bg-[#070b15] shadow-[0_25px_70px_rgba(0,0,0,.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-[8px] font-bold uppercase text-cyan-200">Nexora</span>
          <span className="h-2 w-4 rounded-full bg-white/20" />
        </div>
        <div className="p-3">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,.16),transparent_60%)]">
            <Headphones className="text-slate-300" size={48} strokeWidth={1.2} />
          </div>
          <p className="mt-3 text-[11px] font-semibold leading-4 text-white">Auriculares Inalámbricos Pro</p>
          <p className="mt-1 text-[11px] text-slate-300">$129.00</p>
          <div className="mt-2 h-2 w-16 rounded-full bg-white/35" />
          <div className="mt-3 rounded-md bg-gradient-to-r from-studio-cyan to-studio-violet px-2 py-1.5 text-center text-[8px] font-bold text-white">
            Agregar al carrito
          </div>
        </div>
      </div>

      <div className="absolute left-[24%] top-[12%] z-20 w-[620px] rotate-[-4deg] overflow-hidden rounded-[1.15rem] border border-cyan-400/45 bg-[#071021]/95 shadow-[0_36px_120px_rgba(22,84,255,.28)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded bg-gradient-to-br from-studio-cyan to-studio-violet" />
            <span className="text-sm font-bold uppercase tracking-wide text-white">Nexora</span>
          </div>
          <div className="flex gap-5 text-[10px] text-slate-300">
            <span>
              Productos <ChevronDown className="inline" size={10} />
            </span>
            <span>
              Soluciones <ChevronDown className="inline" size={10} />
            </span>
            <span>
              Recursos <ChevronDown className="inline" size={10} />
            </span>
            <span>
              Empresa <ChevronDown className="inline" size={10} />
            </span>
          </div>
        </div>

        <div className="relative min-h-[390px] p-7">
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,.4),transparent_58%)]" />
          <div className="max-w-[360px]">
            <h3 className="text-2xl font-semibold leading-tight text-white">Plataforma todo en uno para hacer crecer tu negocio</h3>
            <p className="mt-3 text-xs leading-5 text-slate-300">
              Automatizá procesos, mejorá la experiencia de tus clientes y tomá decisiones basadas en datos.
            </p>
            <div className="mt-5 flex gap-3">
              <span className="rounded-md bg-gradient-to-r from-studio-cyan to-studio-blue px-4 py-2 text-xs font-bold text-white">Solicitar demo</span>
              <span className="rounded-md border border-white/15 px-4 py-2 text-xs font-bold text-white">Conocer más</span>
            </div>
          </div>

          <div className="absolute bottom-7 right-8 w-[440px] rounded-[1.1rem] border border-white/10 bg-[#0b1224]/95 p-5 shadow-2xl">
            <div className="grid grid-cols-[44px_1fr] gap-4">
              <div className="grid gap-3">
                {[LineChart, CreditCard, Home, Users, Package].map((Icon, index) => (
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl ${
                      index === 1 ? 'bg-blue-500/20 text-studio-cyan' : 'bg-white/[0.04] text-slate-500'
                    }`}
                    key={index}
                  >
                    <Icon size={16} />
                  </span>
                ))}
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-300">Resumen</p>
                  <span className="rounded-lg border border-white/10 px-3 py-1 text-[10px] text-slate-300">Últimos 7 días</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['Ventas', '$128,950', '+8.7%'],
                    ['Pedidos', '1,246', '+9.1%'],
                    ['Clientes', '3,860', '+15.3%'],
                  ].map(([label, value, delta]) => (
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3" key={label}>
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className="mt-1 text-base font-bold text-white">{value}</p>
                      <p className="mt-1 text-[10px] text-emerald-300">{delta}</p>
                    </div>
                  ))}
                </div>
                <Chart />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MetricCard className="right-0 top-[9%] z-30" title="Rendimiento de campañas">
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-full bg-[conic-gradient(from_40deg,#35e7ff,#497cff,#8b5cf6,#35e7ff)]">
            <div className="grid size-14 place-items-center rounded-full bg-[#09101d] text-center">
              <span className="block text-[10px] text-slate-400">ROI</span>
              <strong className="block text-lg text-white">5.6x</strong>
            </div>
          </div>
          <div className="space-y-2 text-[10px] text-slate-300">
            {['Google Ads 46%', 'Meta Ads 28%', 'Email 16%', 'Otros 10%'].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </MetricCard>

      <MetricCard className="right-1 top-[43%] z-30" title="Tasa de conversión">
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold text-white">3.82%</p>
          <p className="text-sm font-semibold text-emerald-300">+24.6%</p>
        </div>
        <svg viewBox="0 0 180 42" className="mt-3 h-10 w-full">
          <path d="M0 32 18 22 30 28 44 14 60 25 76 18 91 30 108 12 128 24 148 15 166 21 180 12" fill="none" stroke="#2fa8ff" strokeWidth="2" />
        </svg>
      </MetricCard>

      <div className="absolute bottom-5 right-8 z-30 w-[210px] rotate-[5deg] overflow-hidden rounded-[1rem] border border-cyan-400/25 bg-[#09101d] p-4 shadow-[0_24px_70px_rgba(0,0,0,.5)]">
        <div className="mx-auto mb-3 flex h-28 w-24 items-center justify-center rounded-xl bg-[radial-gradient(circle,rgba(255,255,255,.18),transparent_58%)]">
          <div className="h-24 w-11 rounded-[1.2rem] bg-gradient-to-b from-slate-500 to-black shadow-2xl" />
        </div>
        <p className="text-sm font-medium text-white">Colección Élite</p>
        <p className="mt-1 text-xs text-slate-400">Edición limitada</p>
        <div className="mt-3 flex items-center justify-between">
          <strong className="text-lg text-white">$59.90</strong>
          <span className="grid size-9 place-items-center rounded-lg border border-white/15 text-white">
            <ShoppingCart size={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

function MobileMockup() {
  return (
    <div className="relative mt-12 overflow-hidden rounded-[1.35rem] border border-cyan-300/25 bg-[#071021] p-4 shadow-[0_34px_100px_rgba(53,231,255,.12)] lg:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(139,92,246,.24),transparent_32%),radial-gradient(circle_at_20%_90%,rgba(53,231,255,.2),transparent_34%)]" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded bg-gradient-to-br from-studio-cyan to-studio-violet" />
            <span className="text-xs font-bold uppercase tracking-wide text-white">Nexora</span>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-studio-magenta" />
            <span className="size-2 rounded-full bg-studio-lime" />
            <span className="size-2 rounded-full bg-studio-cyan" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-sm font-semibold text-white">Resumen comercial</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ['Consultas', '128', '+18%'],
              ['Conversión', '3.82%', '+24%'],
            ].map(([label, value, delta]) => (
              <div className="rounded-xl border border-white/10 bg-[#050a14]/80 p-3" key={label}>
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-emerald-300">{delta}</p>
              </div>
            ))}
          </div>
          <Chart compact />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
            <p className="text-xs text-cyan-100">Landing lista</p>
            <p className="mt-1 text-sm font-semibold text-white">Campaña activa</p>
          </div>
          <div className="rounded-2xl border border-violet-300/20 bg-violet-300/10 p-3">
            <p className="text-xs text-violet-100">WhatsApp</p>
            <p className="mt-1 text-sm font-semibold text-white">Consulta directa</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Chart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? 'mt-4 h-28' : 'mt-5 h-28'} rounded-xl border border-white/5 bg-[linear-gradient(180deg,rgba(73,124,255,.08),transparent)] p-3`}>
      <svg viewBox="0 0 340 92" className="h-full w-full overflow-visible">
        <path d="M0 70 C28 64, 35 45, 62 52 S100 70, 128 45 S170 35, 198 52 S238 72, 268 42 S305 20, 340 12" fill="none" stroke="#2fa8ff" strokeWidth="3" />
        <path d="M0 70 C28 64, 35 45, 62 52 S100 70, 128 45 S170 35, 198 52 S238 72, 268 42 S305 20, 340 12 L340 92 L0 92Z" fill="#35e7ff" opacity=".16" />
      </svg>
    </div>
  )
}

function MetricCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute w-[210px] rounded-[1rem] border border-cyan-400/25 bg-[#09101d]/95 p-4 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-xl ${className}`}>
      <p className="mb-4 text-xs font-medium text-slate-200">{title}</p>
      {children}
    </div>
  )
}

"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Laptop,
  Cpu,
  Server,
  MonitorCog,
  ArrowRight,
  ArrowLeft,
  Check,
  MessageCircle,
  Zap,
  HardDrive,
  MemoryStick,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Profile {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  recommendation: {
    cpu: string;
    ram: string;
    gpu: string;
    storage: string;
    notes: string;
    brands: string[];
  };
}

const profiles: Profile[] = [
  {
    id: "oficina",
    name: "Administrativo / Oficina",
    description:
      "Tareas diarias, herramientas SaaS, paquete Office y navegación fluida.",
    icon: Laptop,
    color: "#0046EA",
    recommendation: {
      cpu: "Intel Core i5 / AMD Ryzen 5 (Última generación)",
      ram: "16 GB DDR4 Dual Channel",
      gpu: "Gráficos Integrados Intel UHD / AMD Radeon",
      storage: "512 GB SSD NVMe M.2",
      notes:
        "Configuración optimizada para alta durabilidad, bajo consumo y excelente rendimiento en multitarea de oficina.",
      brands: ["Lenovo", "Dell", "HP"],
    },
  },
  {
    id: "creador-dev",
    name: "Desarrollo y Diseño",
    description:
      "Programación pesada, virtualización, diseño gráfico y edición multimedia.",
    icon: Cpu,
    color: "#7c3aed",
    recommendation: {
      cpu: "Intel Core i7 / AMD Ryzen 7 (8+ Núcleos)",
      ram: "32 GB DDR5 a 4800MHz+",
      gpu: "NVIDIA RTX 4060 o superior",
      storage: "1 TB SSD NVMe M.2 Gen4",
      notes:
        "Preparado para compilación veloz, contenedores Docker y procesamiento de imágenes y video en alta definición.",
      brands: ["Dell", "Lenovo", "ASUS"],
    },
  },
  {
    id: "workstation",
    name: "Workstation / Alto Desempeño",
    description:
      "Diseño industrial, ingeniería, renderizado 3D y cargas de alto procesamiento.",
    icon: MonitorCog,
    color: "#ff8f1f",
    recommendation: {
      cpu: "Intel Core i7 / AMD Ryzen 7 3D V-Cache",
      ram: "32 GB DDR5 Dual Channel ultra velocidad",
      gpu: "NVIDIA RTX 4070 Ti / AMD RX 7800 XT o superior",
      storage: "1 TB o 2 TB SSD NVMe Gen4",
      notes:
        "Máximo rendimiento térmico y procesamiento gráfico para workstations híbridas de desarrollo 3D y renders pesados.",
      brands: ["Gigabyte", "ASUS", "MSI", "Kingston"],
    },
  },
  {
    id: "infraestructura",
    name: "Servidores e Infraestructura",
    description:
      "Datacenters, virtualización a gran escala, almacenamiento centralizado y redes.",
    icon: Server,
    color: "#0ea5ff",
    recommendation: {
      cpu: "Intel Xeon Scalable / AMD EPYC (Multiprocesamiento)",
      ram: "64 GB a 256 GB ECC Registrada",
      gpu: "Acelerador opcional para AI (NVIDIA L4)",
      storage: "Arreglo RAID SSD SAS / NVMe Enterprise con hot-swap",
      notes:
        "Alta disponibilidad, fuentes redundantes, RAID y conectividad 10GbE / 25GbE.",
      brands: ["Dell Enterprise", "HPE", "Cisco", "Fortinet"],
    },
  },
];

const specIcons: Record<string, LucideIcon> = {
  cpu: Zap,
  ram: MemoryStick,
  storage: HardDrive,
  gpu: Monitor,
};

export default function Configurador() {
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1-5");
  const [intensity, setIntensity] = useState<string>("Moderada");
  const [transitioning, setTransitioning] = useState(false);
  const profileData = profiles.find((p) => p.id === selectedProfile);

  const changeStep = (next: number) => {
    setTransitioning(true);
    window.setTimeout(() => {
      setStep(next);
      window.setTimeout(() => setTransitioning(false), 20);
    }, 180);
  };

  const handleNext = () => {
    if (step === 1 && !selectedProfile) return;
    changeStep(step + 1);
  };

  const handleBack = () => {
    changeStep(step - 1);
  };

  const whatsappHref = profileData
    ? buildWhatsAppUrl("quote", [
        "Origen: configurador IT de la web",
        `Perfil: ${profileData.name}`,
        `Cantidad estimada: ${quantity} unidades`,
        `Nivel de exigencia: ${intensity}`,
        `CPU sugerida: ${profileData.recommendation.cpu}`,
        `RAM sugerida: ${profileData.recommendation.ram}`,
        `Almacenamiento sugerido: ${profileData.recommendation.storage}`,
        `Gráficos sugeridos: ${profileData.recommendation.gpu}`,
        `Marcas a evaluar: ${profileData.recommendation.brands.join(", ")}`,
      ])
    : buildWhatsAppUrl("quote");

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#070a16] pb-16 pt-24 text-white md:pb-20 md:pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,70,234,0.25),transparent)]" />
          <div className="relative mx-auto max-w-[900px] px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-blue-200">
              <span className="size-1.5 rounded-full bg-[#0ea5ff]" />
              Herramienta interactiva
            </span>
            <h1 className="mt-5 font-display text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Configurador de Soluciones IT
            </h1>
            <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-slate-300">
              Definí el perfil de uso, ajustá la escala y obtené una
              recomendación técnica para llevar directo a cotización.
            </p>
          </div>
        </section>

        {/* Wizard */}
        <section className="relative -mt-6 pb-20">
          <div className="mx-auto max-w-[960px] px-5">
            {/* Stepper */}
            <div className="mb-8 flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:gap-2">
              {[
                { num: 1, label: "Perfil de uso" },
                { num: 2, label: "Escala" },
                { num: 3, label: "Recomendación" },
              ].map((s) => (
                <div key={s.num} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.num < step) changeStep(s.num);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition sm:px-4 ${
                      step === s.num
                        ? "bg-[#0046EA] text-white shadow-glow"
                        : step > s.num
                          ? "bg-blue-50 text-[#0046EA] hover:bg-blue-100"
                          : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[11px] font-bold ${
                        step > s.num
                          ? "bg-[#0046EA] text-white"
                          : step === s.num
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step > s.num ? <Check size={12} /> : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {s.num < 3 && (
                    <span
                      className={`mx-1 h-px w-6 sm:w-10 ${step > s.num ? "bg-[#0046EA]" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Card */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-10 transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-[#11142a]">
                    ¿Cuál es el perfil de uso?
                  </h2>
                  <p className="mt-1.5 text-[14px] text-slate-500">
                    Seleccioná la categoría que mejor represente las tareas a
                    realizar.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {profiles.map((p) => {
                      const active = selectedProfile === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProfile(p.id)}
                          className={`group relative flex flex-col text-left rounded-xl border-2 p-5 transition-all ${
                            active
                              ? "border-[#0046EA] bg-[#0046EA]/[0.03] shadow-[0_0_0_1px_rgba(0,70,234,0.15)]"
                              : "border-slate-100 hover:border-slate-200 hover:shadow-soft"
                          }`}
                        >
                          {active && (
                            <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[#0046EA] text-white">
                              <Check size={13} />
                            </span>
                          )}
                          <span
                            className="grid size-11 place-items-center rounded-xl transition-colors"
                            style={{
                              backgroundColor: active
                                ? p.color
                                : `${p.color}15`,
                              color: active ? "#fff" : p.color,
                            }}
                          >
                            <Icon size={22} />
                          </span>
                          <span className="mt-4 block text-[16px] font-bold text-[#11142a]">
                            {p.name}
                          </span>
                          <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                            {p.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!selectedProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0046EA] px-7 py-3 text-[14px] font-bold text-white shadow-glow transition hover:bg-[#0038C4] disabled:opacity-30 disabled:shadow-none"
                    >
                      Siguiente <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-[#11142a]">
                    Volumen y nivel de exigencia
                  </h2>
                  <p className="mt-1.5 text-[14px] text-slate-500">
                    Ajustá la escala para dimensionar la solución correctamente.
                  </p>

                  <div className="mt-8 space-y-8">
                    <div>
                      <span className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Cantidad estimada
                      </span>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {["1-5", "6-20", "21-50", "50+"].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuantity(q)}
                            className={`rounded-xl border-2 py-3.5 text-center text-[14px] font-bold transition ${
                              quantity === q
                                ? "border-[#0046EA] bg-[#0046EA] text-white shadow-glow"
                                : "border-slate-100 text-slate-700 hover:border-slate-200"
                            }`}
                          >
                            {q}
                            <span className="mt-0.5 block text-[11px] font-semibold opacity-70">
                              {q === "50+" ? "unidades" : "equipos"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Nivel de exigencia
                      </span>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            name: "Estándar",
                            desc: "Tareas administrativas y uso normal.",
                            level: 1,
                          },
                          {
                            name: "Moderada",
                            desc: "Multitarea pesada y software intermedio.",
                            level: 2,
                          },
                          {
                            name: "Intensiva",
                            desc: "Rendering, datos o virtualización.",
                            level: 3,
                          },
                        ].map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setIntensity(item.name)}
                            className={`rounded-xl border-2 p-4 text-left transition ${
                              intensity === item.name
                                ? "border-[#0046EA] bg-[#0046EA]/[0.03] shadow-[0_0_0_1px_rgba(0,70,234,0.15)]"
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-[#11142a]">
                                {item.name}
                              </span>
                              <span className="flex gap-0.5">
                                {[1, 2, 3].map((i) => (
                                  <span
                                    key={i}
                                    className={`size-1.5 rounded-full ${i <= item.level ? "bg-[#0046EA]" : "bg-slate-200"}`}
                                  />
                                ))}
                              </span>
                            </div>
                            <span className="mt-1 block text-[12px] leading-relaxed text-slate-500">
                              {item.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-between">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-500 hover:text-[#11142a]"
                    >
                      <ArrowLeft size={16} /> Atrás
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0046EA] px-7 py-3 text-[14px] font-bold text-white shadow-glow transition hover:bg-[#0038C4]"
                    >
                      Generar recomendación <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && profileData && (
                <div>
                  <div className="mb-8 flex items-center gap-3">
                    <span
                      className="grid size-10 place-items-center rounded-xl"
                      style={{
                        backgroundColor: profileData.color,
                        color: "#fff",
                      }}
                    >
                      {(() => {
                        const Icon = profileData.icon;
                        return <Icon size={20} />;
                      })()}
                    </span>
                    <div>
                      <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-[#11142a]">
                        {profileData.name}
                      </h2>
                      <p className="text-[13px] text-slate-500">
                        {quantity} equipos · Exigencia {intensity.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Spec sheet */}
                    <div className="space-y-3">
                      {(
                        [
                          {
                            key: "cpu",
                            label: "Procesamiento",
                            value: profileData.recommendation.cpu,
                          },
                          {
                            key: "ram",
                            label: "Memoria RAM",
                            value: profileData.recommendation.ram,
                          },
                          {
                            key: "storage",
                            label: "Almacenamiento",
                            value: profileData.recommendation.storage,
                          },
                          {
                            key: "gpu",
                            label: "Gráficos",
                            value: profileData.recommendation.gpu,
                          },
                        ] as const
                      ).map((spec) => {
                        const Icon =
                          specIcons[spec.key as keyof typeof specIcons];
                        return (
                          <div
                            key={spec.key}
                            className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                          >
                            <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-lg bg-[#0046EA]/10 text-[#0046EA]">
                              <Icon size={18} />
                            </span>
                            <div>
                              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                {spec.label}
                              </span>
                              <span className="mt-0.5 block text-[14px] font-semibold text-[#11142a]">
                                {spec.value}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Notas de configuración
                        </span>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                          {profileData.recommendation.notes}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Marcas:
                        </span>
                        {profileData.recommendation.brands.map((b) => (
                          <span
                            key={b}
                            className="rounded-full bg-[#0046EA]/8 px-3 py-0.5 text-[12px] font-semibold text-[#0046EA]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA panel */}
                    <div className="flex flex-col justify-between rounded-2xl bg-[#070a16] p-6 text-white">
                      <div>
                        <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em]">
                          Cotizá esta configuración
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                          El mensaje de WhatsApp incluye perfil, cantidad,
                          exigencia y todas las especificaciones. Podés agregar
                          marca, presupuesto o fecha de entrega.
                        </p>
                      </div>

                      <div className="mt-6">
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track("configurator_whatsapp_started", {
                              profile: selectedProfile,
                              quantity,
                              intensity,
                            })
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5"
                        >
                          <MessageCircle size={17} /> Cotizar por WhatsApp
                        </a>

                        <div className="mt-5 space-y-2 text-[12px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <Check size={13} className="text-[#0ea5ff]" />
                            Respuesta en menos de 24 hs hábiles
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={13} className="text-[#0ea5ff]" />
                            Condiciones B2B disponibles
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={13} className="text-[#0ea5ff]" />
                            Stock confirmado antes de cotizar
                          </div>
                        </div>

                        <button
                          onClick={() => setStep(1)}
                          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-white"
                        >
                          <ArrowLeft size={14} /> Empezar de nuevo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

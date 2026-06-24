"use client";

import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { 
  Laptop, 
  Cpu, 
  Gamepad2, 
  Server, 
  Layers, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MessageCircle,
  FileText,
  type LucideIcon
} from "lucide-react";
import { track } from "../../components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Profile {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
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
    description: "Ideal para tareas diarias, herramientas SaaS, paquete Office y navegación fluida.",
    icon: Laptop,
    recommendation: {
      cpu: "Intel Core i5 / AMD Ryzen 5 (Última generación)",
      ram: "16 GB DDR4 Dual Channel",
      gpu: "Gráficos Integrados Intel UHD / AMD Radeon",
      storage: "512 GB SSD NVMe M.2 de alta velocidad",
      notes: "Configuración optimizada para alta durabilidad, bajo consumo de energía y excelente rendimiento en multitarea de oficina.",
      brands: ["Lenovo", "Dell", "HP"]
    }
  },
  {
    id: "creador-dev",
    name: "Desarrollo y Diseño",
    description: "Para programación pesada, virtualización, diseño gráfico y edición multimedia.",
    icon: Cpu,
    recommendation: {
      cpu: "Intel Core i7 / AMD Ryzen 7 (8+ Núcleos)",
      ram: "32 GB DDR5 a 4800MHz+",
      gpu: "NVIDIA RTX 4060 o superior / Gráficos integrados avanzados",
      storage: "1 TB SSD NVMe M.2 Gen4 (Lectura 5000+ MB/s)",
      notes: "Preparado para compilación veloz, ejecución de contenedores Docker y procesamiento de imágenes y video de alta definición.",
      brands: ["Dell", "Lenovo", "ASUS"]
    }
  },
  {
    id: "gamer",
    name: "Workstations y Alto Desempeño",
    description: "Estaciones para diseño, ingeniería, renderizado y cargas de alto procesamiento gráfico.",
    icon: Gamepad2,
    recommendation: {
      cpu: "Intel Core i7 / AMD Ryzen 7 3D V-Cache",
      ram: "32 GB DDR5 Dual Channel ultra velocidad",
      gpu: "NVIDIA RTX 4070 Ti / AMD RX 7800 XT o superior",
      storage: "1 TB o 2 TB SSD NVMe Gen4",
      notes: "Máximo rendimiento térmico y de procesamiento gráfico. Diseñado para workstations híbridas de desarrollo 3D, gaming y renders pesados.",
      brands: ["Gigabyte", "ASUS", "MSI", "Kingston"]
    }
  },
  {
    id: "infraestructura",
    name: "Servidores e Infraestructura IT",
    description: "Datacenters, virtualización a gran escala, almacenamiento centralizado y redes corporativas.",
    icon: Server,
    recommendation: {
      cpu: "Intel Xeon Scalable / AMD EPYC (Multiprocesamiento)",
      ram: "64 GB a 256 GB ECC Registrada (Protección contra fallos)",
      gpu: "No requerida / Acelerador opcional para AI (NVIDIA L4)",
      storage: "Arreglo RAID (SSD SAS / NVMe Enterprise) con redundancia hot-swap",
      notes: "Enfoque en alta disponibilidad, fuentes redundantes redundancia de datos (RAID) y conectividad de red de 10GbE / 25GbE.",
      brands: ["Dell Enterprise", "HPE", "Cisco", "Fortinet"]
    }
  }
];

export default function Configurador() {
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1-5");
  const [intensity, setIntensity] = useState<string>("Moderada");
  const profileData = profiles.find(p => p.id === selectedProfile);

  const handleNext = () => {
    if (step === 1 && !selectedProfile) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
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
      <main className="bg-slate-50 min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-[900px] px-6">
          
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1236d8]">
              Herramienta de Diagnóstico
            </span>
            <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-[-0.03em] text-[#11142a]">
              Configurador de Soluciones IT
            </h1>
            <p className="mt-3 text-[16px] text-slate-600 max-w-[50ch] mx-auto">
              Definí tu perfil de uso y requerimientos de volumen para obtener una configuración recomendada a medida para tu empresa.
            </p>
          </div>

          {/* Stepper bar */}
          <div className="mb-12 flex items-center justify-center gap-2">
            {[
              { num: 1, label: "Perfil" },
              { num: 2, label: "Escala" },
              { num: 3, label: "Recomendación" }
            ].map(s => (
              <div key={s.num} className="flex items-center">
                <span className={`grid size-8 place-items-center rounded-full text-[12px] font-bold border transition ${
                  step >= s.num 
                    ? "border-[#1236d8] bg-[#1236d8] text-white" 
                    : "border-slate-200 bg-white text-slate-400"
                }`}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </span>
                <span className={`ml-2 text-[13px] font-semibold ${step >= s.num ? "text-[#11142a]" : "text-slate-400"}`}>
                  {s.label}
                </span>
                {s.num < 3 && <span className={`w-12 h-px mx-3 ${step > s.num ? "bg-[#1236d8]" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {/* Wizard Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 md:p-10">
            
            {/* Paso 1: Perfiles */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-[22px] font-bold text-[#11142a]">
                  ¿Cuál es el perfil de uso de los equipos?
                </h2>
                <p className="mt-1 text-[13.5px] text-slate-500">
                  Seleccioná la categoría técnica que mejor represente las tareas a realizar.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {profiles.map(p => {
                    const active = selectedProfile === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProfile(p.id)}
                        className={`flex flex-col text-left p-5 rounded-xl border transition ${
                          active 
                            ? "border-[#1236d8] bg-blue-50/50 ring-1 ring-[#1236d8]" 
                            : "border-slate-200 hover:border-[#1236d8]/50"
                        }`}
                      >
                        <span className={`grid size-10 place-items-center rounded-lg ${
                          active ? "bg-[#1236d8] text-white" : "bg-slate-100 text-[#1236d8]"
                        }`}>
                          <Icon size={20} />
                        </span>
                        <span className="mt-4 block text-[15px] font-bold text-[#11142a]">{p.name}</span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">{p.description}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!selectedProfile}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1236d8] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0f2bb8] disabled:opacity-40"
                  >
                    Siguiente paso <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Detalles de Escala */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-[22px] font-bold text-[#11142a]">
                  Detalles de volumen y exigencia
                </h2>
                <p className="mt-1 text-[13.5px] text-slate-500">
                  Ajustá la escala para que podamos dimensionar la solución.
                </p>

                <div className="mt-8 space-y-6">
                  {/* Escala */}
                  <div>
                    <span className="flex items-center gap-2 text-[14px] font-bold text-[#11142a] mb-3">
                      <Layers size={17} className="text-[#1236d8]" /> Cantidad estimada de unidades
                    </span>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {["1-5", "6-20", "21-50", "50+"].map(q => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(q)}
                          className={`py-3 text-center text-[13.5px] font-semibold rounded-lg border transition ${
                            quantity === q 
                              ? "border-[#1236d8] bg-[#1236d8] text-white" 
                              : "border-slate-200 hover:border-[#1236d8]/50 text-slate-700 bg-white"
                          }`}
                        >
                          {q} {q === "50+" ? "unidades" : "equipos"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensidad de carga */}
                  <div>
                    <span className="flex items-center gap-2 text-[14px] font-bold text-[#11142a] mb-3">
                      <Activity size={17} className="text-[#1236d8]" /> Nivel de exigencia requerido
                    </span>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { name: "Estándar", desc: "Tareas administrativas y uso normal." },
                        { name: "Moderada", desc: "Multitarea pesada y software intermedio." },
                        { name: "Intensiva", desc: "Rendering, procesamiento de datos o virtualización." }
                      ].map(item => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setIntensity(item.name)}
                          className={`p-4 text-left rounded-lg border transition ${
                            intensity === item.name 
                              ? "border-[#1236d8] bg-blue-50/50 ring-1 ring-[#1236d8]" 
                              : "border-slate-200 hover:border-[#1236d8]/50 text-slate-700 bg-white"
                          }`}
                        >
                          <span className="block text-[13.5px] font-bold text-[#11142a]">{item.name}</span>
                          <span className="mt-0.5 block text-[11.5px] text-slate-500 leading-normal">{item.desc}</span>
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
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1236d8] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0f2bb8]"
                  >
                    Generar configuración <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Propuesta técnica & Formulario de Cotización */}
            {step === 3 && profileData && (
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                
                {/* Propuesta técnica */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 md:p-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
                    <FileText className="text-[#1236d8] size-5" />
                    <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                      Especificación Propuesta
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-[19px] font-bold text-[#11142a]">
                    Equipamiento sugerido para {profileData.name}
                  </h3>
                  
                  <div className="mt-5 space-y-3.5 text-[13.5px]">
                    <div>
                      <span className="block font-bold text-slate-600">Procesamiento (CPU):</span>
                      <span className="text-slate-800 font-medium">{profileData.recommendation.cpu}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-600">Memoria RAM:</span>
                      <span className="text-slate-800 font-medium">{profileData.recommendation.ram}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-600">Almacenamiento (SSD):</span>
                      <span className="text-slate-800 font-medium">{profileData.recommendation.storage}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-600">Gráficos (GPU):</span>
                      <span className="text-slate-800 font-medium">{profileData.recommendation.gpu}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="block font-bold text-slate-600">Notas de configuración:</span>
                      <p className="text-[12.5px] leading-relaxed text-slate-500 mt-1">
                        {profileData.recommendation.notes}
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="block font-bold text-slate-600 mb-1.5">Marcas recomendadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profileData.recommendation.brands.map(b => (
                          <span key={b} className="rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-semibold text-slate-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center rounded-xl border border-[#1236d8]/20 bg-[#1236d8]/5 p-6">
                  <h3 className="font-display text-[20px] font-bold text-[#11142a]">Cotizá esta recomendación</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                    Enviaremos el perfil, la cantidad y las especificaciones sugeridas en un mensaje de WhatsApp. Allí podés sumar marca, presupuesto o fecha de entrega.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("configurator_whatsapp_started", { profile: selectedProfile, quantity, intensity })}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1236d8] px-5 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#0f2bb8]"
                  >
                    <MessageCircle size={17} /> Cotizar por WhatsApp
                  </a>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-[#11142a]"
                    >
                      <ArrowLeft size={15} /> Cambiar especificación
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

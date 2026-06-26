// ---------------------------------------------------------------------------
// Lead scoring heurístico — sin IA, basado en señales del lead
// Score 0-100. Más alto = más caliente.
// ---------------------------------------------------------------------------

type ScoredLead = {
  status: string;
  value?: number | string | null;
  source?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_SCORE: Record<string, number> = {
  calificado: 40,
  propuesta: 35,
  contactado: 20,
  nuevo: 10,
  perdido: 0,
  cerrado: 0,
};

const SOURCE_BONUS: Record<string, number> = {
  whatsapp: 8,
  referido: 12,
  llamada: 10,
  formulario: 5,
  web: 4,
};

export function scoreLeadHeuristic(lead: ScoredLead): { score: number; label: string; color: string } {
  let score = STATUS_SCORE[lead.status] ?? 10;

  // Valor económico
  const value = Number(lead.value || 0);
  if (value > 100_000) score += 20;
  else if (value > 20_000) score += 12;
  else if (value > 5_000) score += 6;

  // Fuente
  const srcKey = (lead.source || "").toLowerCase();
  for (const [key, bonus] of Object.entries(SOURCE_BONUS)) {
    if (srcKey.includes(key)) { score += bonus; break; }
  }

  // Recencia (cuánto tiempo sin actualización)
  const daysSinceUpdate = (Date.now() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 1) score += 10;
  else if (daysSinceUpdate < 3) score += 6;
  else if (daysSinceUpdate < 7) score += 2;
  else if (daysSinceUpdate > 14) score -= 10;
  else if (daysSinceUpdate > 30) score -= 20;

  // Antigüedad del lead (leads nuevos recientes tienen más potencial)
  const daysSinceCreated = (Date.now() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 2) score += 8;
  else if (daysSinceCreated > 60) score -= 5;

  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: clamped,
    label: clamped >= 70 ? "Caliente" : clamped >= 40 ? "Tibio" : "Frío",
    color: clamped >= 70 ? "red" : clamped >= 40 ? "amber" : "slate",
  };
}

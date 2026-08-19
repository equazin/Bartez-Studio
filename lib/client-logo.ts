import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * El logo real de un cliente puede no haber llegado todavía (ver
 * lib/success-cases.ts). Server-only: chequeamos en disco en cada
 * render y devolvemos null si el archivo no existe — el componente que
 * llama decide el fallback (wordmark, iniciales, etc). En cuanto se
 * sube el logo con el nombre esperado, aparece solo sin tocar código.
 */
export function resolveClientLogo(logoUrl: string | null | undefined): string | null {
  if (!logoUrl) return null;
  const onDisk = existsSync(join(process.cwd(), "public", logoUrl));
  return onDisk ? logoUrl : null;
}

// Paleta determinística por id de caso — el mismo caso siempre cae en el
// mismo acento entre el listado y el detalle.
const accentPalette = [
  { solid: "#0f766e", tint: "#ecfdf5", text: "#0f766e" },
  { solid: "#7c3aed", tint: "#f3ecff", text: "#7c3aed" },
  { solid: "#c2410c", tint: "#fff4ec", text: "#c2410c" },
  { solid: "#0046EA", tint: "#eef4ff", text: "#0046EA" },
];

export function accentFor(id: number) {
  return accentPalette[id % accentPalette.length];
}

export function wordmarkInitials(clientName: string): string {
  const words = clientName.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

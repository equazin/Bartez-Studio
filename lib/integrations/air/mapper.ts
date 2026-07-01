/**
 * Normalización de objetos crudos de la API de AIR a nuestro shape interno.
 *
 * ⚠️ La doc de AIR NO especifica los nombres de campos de la respuesta. Este
 * mapper es tolerante a variantes (español/inglés, snake/camel) y es el ÚNICO
 * lugar a ajustar cuando veamos un payload real. Los tests fijan el contrato.
 */

export interface AirProductNormalized {
  codiart: string;
  name: string;
  rubro: string | null;
  grupo: string | null;
  categoria: string | null;
  price: number | null;
  stockDisp: number;
  stockFisico: number;
  stockEntrante: number;
  active: boolean;
  airUpdatedAt: Date | null;
}

type Raw = Record<string, unknown>;

/** Devuelve el primer valor no vacío entre varias claves candidatas (case-insensitive). */
function pick(obj: Raw, keys: readonly string[]): unknown {
  const lowerMap = new Map<string, unknown>();
  for (const k of Object.keys(obj)) lowerMap.set(k.toLowerCase(), obj[k]);
  for (const k of keys) {
    const v = lowerMap.get(k.toLowerCase());
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function toStr(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function toNum(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  // Soporta "1.234,56" (es-AR) y "1234.56".
  let s = String(v).trim().replace(/[^\d.,-]/g, "");
  if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function toInt(v: unknown): number {
  const n = toNum(v);
  return n === null ? 0 : Math.trunc(n);
}

function toDate(v: unknown): Date | null {
  const s = toStr(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const KEYS = {
  codiart: ["codiart", "codigo", "cod", "id", "articulo", "idarticulo"],
  name: ["descripcion", "nombre", "detalle", "desc", "name", "title"],
  rubro: ["rubro"],
  grupo: ["grupo"],
  categoria: ["categoria", "category"],
  price: ["precio", "precio_lista", "preciolista", "precioLista", "pvp", "price", "importe"],
  stockDisp: ["disponible", "stock_d", "stockd", "stockDisponible", "stock_disponible", "d"],
  stockFisico: ["fisico", "físico", "stock_f", "stockf", "stockFisico", "stock_fisico", "f"],
  stockEntrante: ["entrante", "stock_e", "stocke", "stockEntrante", "stock_entrante", "e", "pedido"],
  stockGeneric: ["stock", "existencia", "cantidad"],
  estado: ["estado", "activo", "active", "status"],
  updated: ["fecha_mod", "fechamod", "modificado", "updated", "updatedAt", "fecha_modificacion"],
} as const;

/** true salvo que el estado indique explícitamente baja/inactivo. */
function parseActive(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return true;
  const s = String(v).trim().toLowerCase();
  if (["0", "false", "no", "inactivo", "baja", "b", "i"].includes(s)) return false;
  return true;
}

/**
 * Mapea un objeto crudo de AIR. Devuelve null si no tiene código (no se puede
 * indexar). El stock disponible cae al campo genérico `stock` si no viene D/F/E.
 */
export function mapAirProduct(raw: unknown): AirProductNormalized | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Raw;

  const codiart = toStr(pick(o, KEYS.codiart));
  if (!codiart) return null;

  const name = toStr(pick(o, KEYS.name)) ?? codiart;
  const generic = pick(o, KEYS.stockGeneric);
  const disp = pick(o, KEYS.stockDisp);

  return {
    codiart,
    name,
    rubro: toStr(pick(o, KEYS.rubro)),
    grupo: toStr(pick(o, KEYS.grupo)),
    categoria: toStr(pick(o, KEYS.categoria)),
    price: toNum(pick(o, KEYS.price)),
    stockDisp: toInt(disp !== undefined ? disp : generic),
    stockFisico: toInt(pick(o, KEYS.stockFisico)),
    stockEntrante: toInt(pick(o, KEYS.stockEntrante)),
    active: parseActive(pick(o, KEYS.estado)),
    airUpdatedAt: toDate(pick(o, KEYS.updated)),
  };
}

/** Normaliza un array crudo (descarta items sin código). */
export function mapAirProducts(rows: readonly unknown[]): AirProductNormalized[] {
  const out: AirProductNormalized[] = [];
  for (const r of rows) {
    const p = mapAirProduct(r);
    if (p) out.push(p);
  }
  return out;
}

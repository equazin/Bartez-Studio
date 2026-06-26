/**
 * Generador del contenido del QR fiscal AFIP (RG 4291/E).
 *
 * El QR debe codificar la URL:
 *   https://www.afip.gob.ar/fe/qr/?p=<base64Url(JSON)>
 *
 * donde JSON tiene los campos:
 *   ver, fecha, cuit, ptoVta, tipoCmp, nroCmp, importe, moneda, ctz,
 *   tipoDocRec, nroDocRec, tipoCodAut ("E" para CAE), codAut
 */

export interface AfipQrData {
  fecha: string; // YYYY-MM-DD
  cuit: string;
  ptoVta: number;
  tipoCmp: number;
  nroCmp: number;
  importe: number;
  moneda: string; // PES | DOL
  ctz: number;
  tipoDocRec: number;
  nroDocRec: string;
  codAut: string; // CAE
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function buildAfipQrUrl(data: AfipQrData): string {
  const payload = {
    ver: 1,
    fecha: data.fecha,
    cuit: Number(data.cuit) || data.cuit,
    ptoVta: data.ptoVta,
    tipoCmp: data.tipoCmp,
    nroCmp: data.nroCmp,
    importe: Number(data.importe.toFixed(2)),
    moneda: data.moneda,
    ctz: data.ctz,
    tipoDocRec: data.tipoDocRec,
    nroDocRec: Number(data.nroDocRec) || 0,
    tipoCodAut: "E",
    codAut: Number(data.codAut) || data.codAut,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `https://www.afip.gob.ar/fe/qr/?p=${encoded}`;
}

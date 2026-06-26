import { XMLParser } from "fast-xml-parser";
import { getTa } from "./wsaa.ts";
import { endpointsFor, getAfipConfig } from "./config.ts";
import { logger } from "../../logger.ts";

/**
 * Cliente del WSFEv1 — emisión de comprobantes electrónicos.
 *
 * En modo simulación (sin certs configurados) devuelve respuestas falsas
 * con CAE generado por hash, manteniendo el flujo end-to-end del módulo
 * billing operativo en desarrollo y testing.
 */

export interface InvoiceRequest {
  organizationId: string;
  pointOfSale: number;
  docTypeCode: number; // CbteTipo
  concept: 1 | 2 | 3; // 1=Productos, 2=Servicios, 3=Mixto
  receiver: {
    docType: number; // 80 CUIT, 86 CUIL, 96 DNI, 99 CF
    docNumber: string;
  };
  issueDate: Date; // CbteFch
  serviceFrom?: Date | null;
  serviceTo?: Date | null;
  paymentDueDate?: Date | null;
  currency: "PES" | "DOL";
  exchangeRate: number;
  totals: {
    netNoTaxed: number; // ImpTotConc
    netTaxed: number; // ImpNeto
    exempt: number; // ImpOpEx
    tax: number; // ImpIVA
    nonTaxedOther: number; // ImpTrib
    total: number; // ImpTotal
  };
  ivaItems: Array<{
    code: number; // AFIP_IVA_CODES
    baseImp: number;
    importe: number;
  }>;
  associated?: Array<{ docTypeCode: number; pointOfSale: number; afipNumber: number }>;
}

export interface InvoiceResponse {
  cae: string;
  caeExpiresAt: Date;
  afipNumber: number;
  rawObservations: unknown[];
  resultado: "A" | "P" | "R";
  simulated: boolean;
}

function soapAuth(token: string, sign: string, cuit: string) {
  return `<Auth><Token>${token}</Token><Sign>${sign}</Sign><Cuit>${cuit}</Cuit></Auth>`;
}

function afipDate(d: Date): string {
  // YYYYMMDD
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function parseAfipDate(s: string): Date {
  // YYYYMMDD → Date (UTC)
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6)) - 1;
  const d = Number(s.slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

async function callSoap(endpoint: string, soapAction: string, soap: string): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": soapAction,
    },
    body: soap,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WSFE HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

function simulatedResponse(request: InvoiceRequest): InvoiceResponse {
  // Generar un CAE pseudo-determinístico para demo/testing.
  const seed = `${request.organizationId}|${request.pointOfSale}|${request.docTypeCode}|${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  const cae = String(Math.abs(hash)).padStart(14, "0").slice(0, 14);
  const expires = new Date(Date.now() + 10 * 24 * 3600_000);
  const afipNumber = Math.floor(Date.now() / 1000) % 99999999;
  return {
    cae,
    caeExpiresAt: expires,
    afipNumber,
    rawObservations: [],
    resultado: "A",
    simulated: true,
  };
}

/**
 * Consulta el último comprobante autorizado para un punto de venta y tipo.
 * Devuelve el número siguiente (último + 1) o 1 si no hay comprobantes.
 */
export async function getNextAfipNumber(organizationId: string, pointOfSale: number, docTypeCode: number): Promise<number> {
  const cfg = getAfipConfig();
  if (cfg.simulated) {
    return 1;
  }
  const ta = await getTa(organizationId);
  const endpoints = endpointsFor(cfg.mode);
  const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Body>
    <ar:FECompUltimoAutorizado>
      ${soapAuth(ta.token, ta.sign, cfg.cuit)}
      <ar:PtoVta>${pointOfSale}</ar:PtoVta>
      <ar:CbteTipo>${docTypeCode}</ar:CbteTipo>
    </ar:FECompUltimoAutorizado>
  </soapenv:Body>
</soapenv:Envelope>`;
  const xml = await callSoap(endpoints.wsfe, "http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado", soap);
  const parser = new XMLParser({ removeNSPrefix: true });
  const parsed = parser.parse(xml) as { Envelope?: { Body?: { FECompUltimoAutorizadoResponse?: { FECompUltimoAutorizadoResult?: { CbteNro?: number } } } } };
  const last = parsed.Envelope?.Body?.FECompUltimoAutorizadoResponse?.FECompUltimoAutorizadoResult?.CbteNro ?? 0;
  return Number(last) + 1;
}

function buildSolicitarSoap(request: InvoiceRequest, ta: { token: string; sign: string }, cuit: string, cbteNro: number): string {
  const ivaXml = request.ivaItems.map((iva) => `
        <ar:AlicIva>
          <ar:Id>${iva.code}</ar:Id>
          <ar:BaseImp>${iva.baseImp.toFixed(2)}</ar:BaseImp>
          <ar:Importe>${iva.importe.toFixed(2)}</ar:Importe>
        </ar:AlicIva>`).join("");
  const assocXml = (request.associated ?? []).map((a) => `
        <ar:CbteAsoc>
          <ar:Tipo>${a.docTypeCode}</ar:Tipo>
          <ar:PtoVta>${a.pointOfSale}</ar:PtoVta>
          <ar:Nro>${a.afipNumber}</ar:Nro>
        </ar:CbteAsoc>`).join("");

  const serviceDates = request.concept !== 1
    ? `<ar:FchServDesde>${afipDate(request.serviceFrom ?? request.issueDate)}</ar:FchServDesde>
       <ar:FchServHasta>${afipDate(request.serviceTo ?? request.issueDate)}</ar:FchServHasta>
       <ar:FchVtoPago>${afipDate(request.paymentDueDate ?? request.issueDate)}</ar:FchVtoPago>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Body>
    <ar:FECAESolicitar>
      ${soapAuth(ta.token, ta.sign, cuit)}
      <ar:FeCAEReq>
        <ar:FeCabReq>
          <ar:CantReg>1</ar:CantReg>
          <ar:PtoVta>${request.pointOfSale}</ar:PtoVta>
          <ar:CbteTipo>${request.docTypeCode}</ar:CbteTipo>
        </ar:FeCabReq>
        <ar:FeDetReq>
          <ar:FECAEDetRequest>
            <ar:Concepto>${request.concept}</ar:Concepto>
            <ar:DocTipo>${request.receiver.docType}</ar:DocTipo>
            <ar:DocNro>${request.receiver.docNumber.replace(/\D/g, "")}</ar:DocNro>
            <ar:CbteDesde>${cbteNro}</ar:CbteDesde>
            <ar:CbteHasta>${cbteNro}</ar:CbteHasta>
            <ar:CbteFch>${afipDate(request.issueDate)}</ar:CbteFch>
            <ar:ImpTotal>${request.totals.total.toFixed(2)}</ar:ImpTotal>
            <ar:ImpTotConc>${request.totals.netNoTaxed.toFixed(2)}</ar:ImpTotConc>
            <ar:ImpNeto>${request.totals.netTaxed.toFixed(2)}</ar:ImpNeto>
            <ar:ImpOpEx>${request.totals.exempt.toFixed(2)}</ar:ImpOpEx>
            <ar:ImpTrib>${request.totals.nonTaxedOther.toFixed(2)}</ar:ImpTrib>
            <ar:ImpIVA>${request.totals.tax.toFixed(2)}</ar:ImpIVA>
            ${serviceDates}
            <ar:MonId>${request.currency}</ar:MonId>
            <ar:MonCotiz>${request.exchangeRate.toFixed(6)}</ar:MonCotiz>
            ${request.ivaItems.length > 0 ? `<ar:Iva>${ivaXml}\n        </ar:Iva>` : ""}
            ${assocXml ? `<ar:CbtesAsoc>${assocXml}\n        </ar:CbtesAsoc>` : ""}
          </ar:FECAEDetRequest>
        </ar:FeDetReq>
      </ar:FeCAEReq>
    </ar:FECAESolicitar>
  </soapenv:Body>
</soapenv:Envelope>`;
}

interface FeDetResp {
  CAE?: string;
  CAEFchVto?: string;
  CbteDesde?: number;
  Resultado?: string;
  Observaciones?: { Obs?: unknown | unknown[] };
}

function parseSolicitarResponse(xml: string): InvoiceResponse {
  const parser = new XMLParser({ removeNSPrefix: true });
  const parsed = parser.parse(xml) as { Envelope?: { Body?: { FECAESolicitarResponse?: { FECAESolicitarResult?: { FeDetResp?: { FECAEDetResponse?: FeDetResp | FeDetResp[] }; Errors?: unknown } } } } };
  const result = parsed.Envelope?.Body?.FECAESolicitarResponse?.FECAESolicitarResult;
  if (!result) throw new Error("WSFE: respuesta sin FECAESolicitarResult");
  if (result.Errors) {
    throw new Error(`WSFE Errors: ${JSON.stringify(result.Errors).slice(0, 500)}`);
  }
  const detResp = result.FeDetResp?.FECAEDetResponse;
  const det = Array.isArray(detResp) ? detResp[0] : detResp;
  if (!det) throw new Error("WSFE: FECAEDetResponse vacío");
  const resultado = (det.Resultado === "A" || det.Resultado === "R" || det.Resultado === "P") ? det.Resultado : "R";
  if (resultado === "R") {
    throw new Error(`WSFE rechazó el comprobante: ${JSON.stringify(det.Observaciones ?? det)}`);
  }
  if (!det.CAE || !det.CAEFchVto || !det.CbteDesde) {
    throw new Error(`WSFE: respuesta incompleta — ${JSON.stringify(det)}`);
  }
  const observations = det.Observaciones?.Obs
    ? (Array.isArray(det.Observaciones.Obs) ? det.Observaciones.Obs : [det.Observaciones.Obs])
    : [];
  return {
    cae: String(det.CAE),
    caeExpiresAt: parseAfipDate(String(det.CAEFchVto)),
    afipNumber: Number(det.CbteDesde),
    rawObservations: observations,
    resultado,
    simulated: false,
  };
}

/**
 * Solicita CAE para un comprobante. Maneja la obtención del TA, el número
 * siguiente y el envío SOAP. En modo simulación devuelve una respuesta
 * inventada pero válida para el resto del flujo.
 */
export async function solicitarCae(request: InvoiceRequest): Promise<InvoiceResponse> {
  const cfg = getAfipConfig();
  if (cfg.simulated) {
    logger.info("afip.wsfe.simulated", { ptoVta: request.pointOfSale, docType: request.docTypeCode });
    return simulatedResponse(request);
  }
  const ta = await getTa(request.organizationId);
  const next = await getNextAfipNumber(request.organizationId, request.pointOfSale, request.docTypeCode);
  const soap = buildSolicitarSoap(request, ta, cfg.cuit, next);
  const endpoints = endpointsFor(cfg.mode);
  const xml = await callSoap(endpoints.wsfe, "http://ar.gov.afip.dif.FEV1/FECAESolicitar", soap);
  return parseSolicitarResponse(xml);
}

import { randomBytes } from "node:crypto";
import forge from "node-forge";
import { XMLParser } from "fast-xml-parser";
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { endpointsFor, getAfipConfig, type AfipMode } from "./config.ts";

/**
 * Cliente del WSAA de AFIP.
 *
 * Flujo:
 *  1. Si hay un TA cacheado vigente (con margen de 5 min), lo devuelve.
 *  2. Genera un LoginTicketRequest XML (uniqueId, generationTime,
 *     expirationTime y service).
 *  3. Lo firma PKCS#7 con el cert+key del emisor, lo codifica base64.
 *  4. Lo envía al WSAA por SOAP.
 *  5. Parsea el `loginCmsReturn` (otro XML) → extrae Token + Sign.
 *  6. Lo guarda en AfipTaCache y lo devuelve.
 *
 * En modo `simulated` (sin cert configurado) devuelve un TA dummy para
 * mantener el flujo de la app funcionando en desarrollo.
 */

export interface TokenSign {
  token: string;
  sign: string;
  generationTime: Date;
  expirationTime: Date;
}

const SERVICE = "wsfe";
const CACHE_MARGIN_MS = 5 * 60 * 1000;

function loginTicketRequestXml(service: string): { xml: string; uniqueId: number; generationTime: Date; expirationTime: Date } {
  const uniqueId = Number(randomBytes(4).readUInt32BE(0));
  const generationTime = new Date(Date.now() - 60_000);
  const expirationTime = new Date(Date.now() + 10 * 60_000);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>${uniqueId}</uniqueId>
    <generationTime>${generationTime.toISOString()}</generationTime>
    <expirationTime>${expirationTime.toISOString()}</expirationTime>
  </header>
  <service>${service}</service>
</loginTicketRequest>`;

  return { xml, uniqueId, generationTime, expirationTime };
}

function signPkcs7(content: string, certPem: string, keyPem: string): string {
  // node-forge espera el contenido como PEM ya cargado. PKCS#7 SignedData,
  // detached=false (incluimos el contenido) — es lo que pide AFIP.
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(content, "utf8");
  const cert = forge.pki.certificateFromPem(certPem);
  const privateKey = forge.pki.privateKeyFromPem(keyPem);
  p7.addCertificate(cert);
  p7.addSigner({
    key: privateKey,
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date() as unknown as string },
    ] as { type: string; value?: string }[],
  });
  p7.sign({ detached: false });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return forge.util.encode64(der);
}

function soapEnvelopeLoginCms(cmsBase64: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://wsaa.view.sua.dvadac.desein.afip.gov">
  <soapenv:Header/>
  <soapenv:Body>
    <wsa:loginCms>
      <wsa:in0>${cmsBase64}</wsa:in0>
    </wsa:loginCms>
  </soapenv:Body>
</soapenv:Envelope>`;
}

async function callWsaa(endpoint: string, soap: string): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": "",
    },
    body: soap,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WSAA HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

function extractLoginCmsReturn(soapResponse: string): string {
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const parsed = parser.parse(soapResponse) as Record<string, unknown>;
  // Estructura esperada: Envelope.Body.loginCmsResponse.loginCmsReturn
  const env = (parsed.Envelope ?? parsed["soapenv:Envelope"]) as { Body?: { loginCmsResponse?: { loginCmsReturn?: string }; Fault?: unknown } } | undefined;
  const body = env?.Body;
  if (body?.Fault) {
    throw new Error(`WSAA Fault: ${JSON.stringify(body.Fault).slice(0, 500)}`);
  }
  const inner = body?.loginCmsResponse?.loginCmsReturn;
  if (typeof inner !== "string") {
    throw new Error("WSAA: respuesta sin loginCmsReturn");
  }
  return inner;
}

function parseTokenSign(loginCmsReturn: string): { token: string; sign: string; generationTime: Date; expirationTime: Date } {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(loginCmsReturn) as { loginTicketResponse?: { header?: { generationTime?: string; expirationTime?: string }; credentials?: { token?: string; sign?: string } } };
  const ltr = parsed.loginTicketResponse;
  if (!ltr?.credentials?.token || !ltr.credentials.sign) {
    throw new Error("WSAA: loginTicketResponse sin credenciales");
  }
  return {
    token: String(ltr.credentials.token),
    sign: String(ltr.credentials.sign),
    generationTime: new Date(ltr.header?.generationTime ?? Date.now()),
    expirationTime: new Date(ltr.header?.expirationTime ?? Date.now() + 12 * 3600_000),
  };
}

/**
 * Obtiene un TA (Token+Sign) válido. Lo cachea por (org, cuit, service, mode).
 */
export async function getTa(organizationId: string): Promise<TokenSign> {
  const cfg = getAfipConfig();
  return getOrRefreshTa(organizationId, cfg.cuit, cfg.mode, cfg);
}

async function getOrRefreshTa(organizationId: string, cuit: string, mode: AfipMode, cfg: ReturnType<typeof getAfipConfig>): Promise<TokenSign> {
  const db = getDb();
  const now = new Date();

  // Buscar TA cacheado.
  const cached = await db.afipTaCache.findUnique({
    where: { organizationId_cuit_service_mode: { organizationId, cuit, service: SERVICE, mode } },
  });
  if (cached && cached.expirationTime.getTime() > now.getTime() + CACHE_MARGIN_MS) {
    return {
      token: cached.token,
      sign: cached.sign,
      generationTime: cached.generationTime,
      expirationTime: cached.expirationTime,
    };
  }

  if (cfg.simulated) {
    // En modo simulación devolvemos un TA dummy con 12h de vida.
    const sim: TokenSign = {
      token: "SIMULATED-TOKEN",
      sign: "SIMULATED-SIGN",
      generationTime: now,
      expirationTime: new Date(now.getTime() + 12 * 3600_000),
    };
    await db.afipTaCache.upsert({
      where: { organizationId_cuit_service_mode: { organizationId, cuit: cuit || "00000000000", service: SERVICE, mode } },
      create: { organizationId, cuit: cuit || "00000000000", service: SERVICE, mode, token: sim.token, sign: sim.sign, generationTime: sim.generationTime, expirationTime: sim.expirationTime },
      update: { token: sim.token, sign: sim.sign, generationTime: sim.generationTime, expirationTime: sim.expirationTime },
    });
    return sim;
  }

  // Generar request real.
  const { xml } = loginTicketRequestXml(SERVICE);
  const cms = signPkcs7(xml, cfg.cert, cfg.key);
  const endpoints = endpointsFor(mode);
  const soap = soapEnvelopeLoginCms(cms);
  const response = await callWsaa(endpoints.wsaa, soap);
  const inner = extractLoginCmsReturn(response);
  const parsed = parseTokenSign(inner);

  await db.afipTaCache.upsert({
    where: { organizationId_cuit_service_mode: { organizationId, cuit, service: SERVICE, mode } },
    create: { organizationId, cuit, service: SERVICE, mode, token: parsed.token, sign: parsed.sign, generationTime: parsed.generationTime, expirationTime: parsed.expirationTime },
    update: { token: parsed.token, sign: parsed.sign, generationTime: parsed.generationTime, expirationTime: parsed.expirationTime },
  });

  logger.info("afip.wsaa.refresh", { mode, cuit, expiration: parsed.expirationTime.toISOString() });
  return parsed;
}

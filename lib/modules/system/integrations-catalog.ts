/**
 * Catálogo de integraciones disponibles en el ERP.
 *
 * Cada entrada define: id (provider), label, descripción, campos y env fallback.
 * La UI y el endpoint de status usan esto como única fuente de verdad.
 */

export interface IntegrationField {
  /** Clave dentro del provider (ej: "access_token") */
  key: string;
  /** Label visible para el usuario */
  label: string;
  /** Variable de entorno de fallback (para compat. con setup actual) */
  env?: string;
  /** Si es secret se enmascara siempre; si no, se muestra plano (ej: phone number ID) */
  secret?: boolean;
  /** Texto largo (cert PEM, etc.) → textarea en vez de input */
  multiline?: boolean;
  /** Hint visible bajo el campo */
  hint?: string;
  /** Required para marcar el provider como "configurado" */
  required?: boolean;
}

export interface IntegrationDef {
  id: string; // provider id
  label: string;
  description: string;
  docsUrl?: string;
  fields: IntegrationField[];
  /** Si está en standby (esperando que el usuario obtenga credenciales) */
  standby?: boolean;
  /** Categoría para agrupar en la UI */
  category: "facturacion" | "cobros" | "comunicacion" | "ia" | "marketing" | "api" | "proveedores";
  /**
   * true: el reader del lib/ usa getCredential() → guardar desde la UI tiene efecto inmediato.
   * false: el reader sigue leyendo de env → guardar desde la UI NO se aplica hasta migrar
   * el reader (próxima fase). La UI muestra un badge "Aún desde env" cuando es false.
   */
  readerMigrated: boolean;
}

export const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "afip",
    label: "AFIP — Factura electrónica",
    description: "Habilita facturación legal con CAE. Sin esto las facturas se emiten en modo simulado.",
    docsUrl: "https://www.afip.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf",
    standby: true,
    category: "facturacion",
    readerMigrated: false,
    fields: [
      { key: "cuit", label: "CUIT (sin guiones)", env: "AFIP_CUIT", required: true, hint: "11 dígitos" },
      { key: "cert", label: "Certificado (.crt en PEM)", env: "AFIP_CERT", secret: true, multiline: true, required: true, hint: "Pegá el contenido completo, incluyendo BEGIN/END CERTIFICATE" },
      { key: "key", label: "Clave privada (PEM)", env: "AFIP_KEY", secret: true, multiline: true, required: true, hint: "Pegá el contenido completo, incluyendo BEGIN/END PRIVATE KEY" },
      { key: "mode", label: "Modo (homo o prod)", env: "AFIP_MODE", hint: "Empezá con 'homo' para probar" },
    ],
  },
  {
    id: "mercadopago",
    label: "MercadoPago — Cobros online",
    description: "Genera links de pago en facturas. Sin esto los links son simulados.",
    docsUrl: "https://www.mercadopago.com.ar/developers/es/docs",
    standby: true,
    category: "cobros",
    readerMigrated: true,
    fields: [
      { key: "access_token", label: "Access Token", env: "MP_ACCESS_TOKEN", secret: true, required: true, hint: "APP_USR-... (de tu app en MP Developers)" },
      { key: "notification_url", label: "Notification URL", env: "MP_NOTIFICATION_URL", hint: "Generalmente https://tudominio.com/api/webhooks/mercadopago" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Cloud API",
    description: "Bot de WhatsApp + notificaciones automáticas de alertas.",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    category: "comunicacion",
    readerMigrated: false,
    fields: [
      { key: "api_token", label: "API Token", env: "WHATSAPP_API_TOKEN", secret: true, required: true, hint: "Token de System User de Meta Business" },
      { key: "phone_number_id", label: "Phone Number ID", env: "WHATSAPP_PHONE_NUMBER_ID", required: true, hint: "ID numérico del número registrado en Meta" },
      { key: "app_secret", label: "App Secret", env: "WHATSAPP_APP_SECRET", secret: true, required: true, hint: "Para validar webhooks (Settings > Basic > App Secret)" },
      { key: "webhook_verify_token", label: "Webhook Verify Token", env: "WEBHOOK_VERIFY_TOKEN", required: true, hint: "Cualquier string random que pongas también en Meta" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    description: "Copilot del admin (Claude vía AI Gateway de Vercel) + transcripción de audios de WhatsApp.",
    docsUrl: "https://platform.openai.com/api-keys",
    category: "ia",
    readerMigrated: true,
    fields: [
      { key: "api_key", label: "API Key", env: "OPENAI_API_KEY", secret: true, hint: "sk-..." },
    ],
  },
  {
    id: "resend",
    label: "Resend — Email transaccional",
    description: "Envío de emails de notificaciones (alertas, leads). Alternativa: Brevo.",
    docsUrl: "https://resend.com/api-keys",
    category: "comunicacion",
    readerMigrated: true,
    fields: [
      { key: "api_key", label: "API Key", env: "RESEND_API_KEY", secret: true, hint: "re_..." },
      { key: "from", label: "Remitente (From)", env: "MAIL_FROM", hint: "Ej: \"Bartez <ventas@bartez.com.ar>\"" },
      { key: "to", label: "Destinatario interno", env: "MAIL_TO", hint: "Email donde llegan notificaciones de leads" },
    ],
  },
  {
    id: "brevo",
    label: "Brevo (ex Sendinblue) — Email alternativo",
    description: "Alternativa a Resend. Usá uno u otro, no los dos.",
    docsUrl: "https://app.brevo.com/settings/keys/api",
    category: "comunicacion",
    readerMigrated: true,
    fields: [
      { key: "api_key", label: "API Key", env: "BREVO_API_KEY", secret: true },
    ],
  },
  {
    id: "monday",
    label: "monday.com — Pipeline de leads (opcional)",
    description: "Sincroniza leads del sitio web hacia un board de monday.com.",
    docsUrl: "https://developer.monday.com/api-reference/",
    category: "marketing",
    readerMigrated: false,
    fields: [
      { key: "api_token", label: "API Token", env: "MONDAY_API_TOKEN", secret: true },
      { key: "board_id", label: "Board ID", env: "MONDAY_BOARD_ID" },
      { key: "group_id", label: "Group ID", env: "MONDAY_GROUP_ID" },
    ],
  },
  {
    id: "apollo",
    label: "Apollo — Enriquecimiento de leads",
    description: "Auto-completa datos de empresa (industria, tamaño, web) cuando entra un lead.",
    docsUrl: "https://docs.apollo.io/",
    category: "marketing",
    readerMigrated: false,
    fields: [
      { key: "api_key", label: "API Key", env: "APOLLO_API_KEY", secret: true },
    ],
  },
  {
    id: "google_ads",
    label: "Google Ads — Atribución y conversiones",
    description: "Mide qué campañas generan leads/ventas y envía conversiones offline para optimizar el gasto. Requiere cuenta con acceso a la API.",
    docsUrl: "https://developers.google.com/google-ads/api/docs/start",
    standby: true,
    category: "marketing",
    readerMigrated: true,
    fields: [
      { key: "developer_token", label: "Developer Token", env: "GOOGLE_ADS_DEVELOPER_TOKEN", secret: true, required: true, hint: "Desde tu Manager Account (MCC) → API Center" },
      { key: "client_id", label: "OAuth Client ID", env: "GOOGLE_ADS_CLIENT_ID", required: true, hint: "De Google Cloud Console (OAuth 2.0)" },
      { key: "client_secret", label: "OAuth Client Secret", env: "GOOGLE_ADS_CLIENT_SECRET", secret: true, required: true },
      { key: "refresh_token", label: "Refresh Token", env: "GOOGLE_ADS_REFRESH_TOKEN", secret: true, required: true, hint: "Generado con el flujo OAuth offline" },
      { key: "customer_id", label: "Customer ID (sin guiones)", env: "GOOGLE_ADS_CUSTOMER_ID", required: true, hint: "10 dígitos de la cuenta de anuncios" },
      { key: "login_customer_id", label: "Login Customer ID (MCC, opcional)", env: "GOOGLE_ADS_LOGIN_CUSTOMER_ID", hint: "ID del Manager Account si operás vía MCC" },
      { key: "conversion_action_id", label: "Conversion Action ID", env: "GOOGLE_ADS_CONVERSION_ACTION_ID", hint: "ID de la acción de conversión 'offline' a impactar" },
    ],
  },
  {
    id: "meta_app",
    label: "Meta App — Facebook + Instagram (publicación)",
    description: "App de Meta for Developers usada para conectar páginas de FB e IG Business y publicar desde /admin/marketing. Distinta de Meta Ads (que solo atribuye conversiones).",
    docsUrl: "https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived",
    standby: true,
    category: "marketing",
    readerMigrated: true,
    fields: [
      { key: "app_id", label: "App ID", env: "META_APP_ID", required: true, hint: "Settings → Basic → App ID" },
      { key: "app_secret", label: "App Secret", env: "META_APP_SECRET", secret: true, required: true, hint: "Settings → Basic → App Secret" },
      { key: "redirect_uri", label: "OAuth Redirect URI", env: "META_APP_REDIRECT_URI", required: true, hint: "Debe estar autorizada en Facebook Login for Business. Ej: https://<dominio>/api/admin/marketing/oauth/meta/callback" },
    ],
  },
  {
    id: "meta_ads",
    label: "Meta Ads — Atribución y conversiones (CAPI)",
    description: "Atribuye leads/ventas a campañas de Facebook/Instagram y envía eventos de compra por Conversions API.",
    docsUrl: "https://developers.facebook.com/docs/marketing-api/conversions-api",
    standby: true,
    category: "marketing",
    readerMigrated: true,
    fields: [
      { key: "access_token", label: "Access Token (System User)", env: "META_ADS_ACCESS_TOKEN", secret: true, required: true, hint: "Token de System User con permisos de ads_management" },
      { key: "pixel_id", label: "Pixel / Dataset ID", env: "META_ADS_PIXEL_ID", required: true, hint: "ID del Pixel o Dataset de Conversions API" },
      { key: "ad_account_id", label: "Ad Account ID", env: "META_ADS_AD_ACCOUNT_ID", required: true, hint: "act_XXXXXXXX (para reporting de gasto)" },
      { key: "app_secret", label: "App Secret", env: "META_ADS_APP_SECRET", secret: true, hint: "Para firmar llamadas a la API (opcional pero recomendado)" },
      { key: "test_event_code", label: "Test Event Code (opcional)", env: "META_ADS_TEST_EVENT_CODE", hint: "Para validar eventos en el Events Manager antes de producción" },
    ],
  },
  {
    id: "api_v1",
    label: "API v1 — Acceso programático",
    description: "Tu propia API REST para que clientes/sistemas externos consuman datos.",
    category: "api",
    readerMigrated: true,
    fields: [
      { key: "token", label: "Bearer Token", env: "API_V1_TOKEN", secret: true, hint: "Compartilo con cada cliente que consuma tu API" },
    ],
  },
  {
    id: "air",
    label: "AIR S.R.L. — Catálogo y stock",
    description: "Sincroniza stock y precios del proveedor AIR S.R.L. cada 15 minutos e integra el selector de productos en los pedidos de venta.",
    docsUrl: "https://api.air-intra.com/v2",
    category: "proveedores",
    readerMigrated: true,
    fields: [
      { key: "username", label: "Usuario API", env: "AIR_USERNAME", required: true },
      { key: "password", label: "Contraseña API", env: "AIR_PASSWORD", secret: true, required: true },
      { key: "enabled", label: "Habilitar (true/false)", env: "AIR_INTEGRATION_ENABLED", hint: "Escribí 'true' para encender la sincronización y el picker" },
      { key: "base_url", label: "Base URL de la API", env: "AIR_BASE_URL", hint: "Default: https://api.air-intra.com/v2" },
      { key: "sync_interval", label: "Intervalo de sincronización (minutos)", env: "AIR_SYNC_INTERVAL_MINUTES", hint: "Default: 15" },
      { key: "cron_secret", label: "Cron Secret", env: "AIR_CRON_SECRET", secret: true, hint: "Token para validar el endpoint cron" },
    ],
  },
];

export function findIntegration(id: string): IntegrationDef | undefined {
  return INTEGRATIONS.find((i) => i.id === id);
}

export const INTEGRATION_CATEGORIES: { id: IntegrationDef["category"]; label: string }[] = [
  { id: "facturacion", label: "Facturación" },
  { id: "cobros", label: "Cobros online" },
  { id: "comunicacion", label: "Comunicación" },
  { id: "ia", label: "Inteligencia artificial" },
  { id: "marketing", label: "Marketing y leads" },
  { id: "proveedores", label: "Proveedores y catálogos" },
  { id: "api", label: "API propia" },
];

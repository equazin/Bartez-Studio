import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { getCredential } from "../system/credentials-service.ts";

export type AdPlatform = "google_ads" | "meta_ads";

export interface CampaignAttribution {
  platform: AdPlatform;
  campaignKey: string;
  campaignName: string;
}

export interface AdPerformanceRow {
  id: string;
  platform: AdPlatform;
  externalCampaignId: string;
  name: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  roas: number | null;
  cac: number | null;
  cpl: number | null;
  conversionRate: number | null;
  series: number[];
}

export interface AdPerformanceDashboard {
  days: number;
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    leads: number;
    conversions: number;
    revenue: number;
    roas: number | null;
    cac: number | null;
    cpl: number | null;
  };
  rows: AdPerformanceRow[];
  lastSyncedAt: string | null;
}

interface AttributionMetric {
  leads: number;
  conversions: number;
  revenue: number;
}

interface SpendMetric {
  platform: AdPlatform;
  externalCampaignId: string;
  campaignName: string;
  status?: string;
  dailyBudget?: number | null;
  date: Date;
  spend: number;
  impressions: number;
  clicks: number;
}

const DAY_MS = 86_400_000;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

function campaignKey(platform: AdPlatform, campaign: string): string {
  return `${platform}:${campaign.trim().toLowerCase() || "sin-campana"}`;
}

function campaignIdFromName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sin-campana";
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function ratio(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 100) / 100;
}

function formatDate(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function attributeCampaign(input: {
  utmSource?: string | null;
  utmCampaign?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}): CampaignAttribution | null {
  const source = (input.utmSource ?? "").toLowerCase();
  const campaignName = input.utmCampaign?.trim() || "Sin campaña";

  if (input.gclid || source.includes("google")) {
    return {
      platform: "google_ads",
      campaignKey: campaignKey("google_ads", campaignName),
      campaignName,
    };
  }

  if (input.fbclid || source.includes("facebook") || source.includes("instagram") || source.includes("meta")) {
    return {
      platform: "meta_ads",
      campaignKey: campaignKey("meta_ads", campaignName),
      campaignName,
    };
  }

  return null;
}

function addMetric(
  metrics: Map<string, AttributionMetric>,
  key: string,
  patch: Partial<AttributionMetric>,
): void {
  const current = metrics.get(key) ?? { leads: 0, conversions: 0, revenue: 0 };
  metrics.set(key, {
    leads: current.leads + (patch.leads ?? 0),
    conversions: current.conversions + (patch.conversions ?? 0),
    revenue: roundMoney(current.revenue + (patch.revenue ?? 0)),
  });
}

async function buildAttributionSnapshot(organizationId: string, from: Date, to: Date) {
  const db = getDb();
  const leads = await db.lead.findMany({
    where: {
      organizationId,
      createdAt: { gte: from, lte: to },
      OR: [
        { gclid: { not: null } },
        { fbclid: { not: null } },
        { utmSource: { not: null } },
      ],
    },
    select: {
      id: true,
      accountId: true,
      createdAt: true,
      utmSource: true,
      utmCampaign: true,
      gclid: true,
      fbclid: true,
    },
  });

  const campaigns = new Map<string, CampaignAttribution>();
  const daily = new Map<string, AttributionMetric>();

  for (const lead of leads) {
    const attr = attributeCampaign(lead);
    if (!attr) continue;
    campaigns.set(attr.campaignKey, attr);
    addMetric(daily, `${attr.campaignKey}:${dateKey(lead.createdAt)}`, { leads: 1 });
  }

  const accountIds = [...new Set(leads.map((lead) => lead.accountId).filter((id): id is string => Boolean(id)))];
  if (accountIds.length > 0) {
    const invoices = await db.invoice.findMany({
      where: {
        organizationId,
        status: "issued",
        deletedAt: null,
        issueDate: { gte: from, lte: to },
        accountId: { in: accountIds },
      },
      select: { accountId: true, issueDate: true, total: true },
    });

    const leadsByAccount = new Map<string, typeof leads>();
    for (const lead of leads) {
      if (!lead.accountId) continue;
      const current = leadsByAccount.get(lead.accountId) ?? [];
      current.push(lead);
      leadsByAccount.set(lead.accountId, current);
    }

    for (const invoice of invoices) {
      if (!invoice.accountId) continue;
      const sourceLead = (leadsByAccount.get(invoice.accountId) ?? [])
        .filter((lead) => lead.createdAt <= invoice.issueDate)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      if (!sourceLead) continue;
      const attr = attributeCampaign(sourceLead);
      if (!attr) continue;
      campaigns.set(attr.campaignKey, attr);
      addMetric(daily, `${attr.campaignKey}:${dateKey(invoice.issueDate)}`, {
        conversions: 1,
        revenue: Number(invoice.total),
      });
    }
  }

  return { campaigns, daily };
}

async function loadGoogleAdsCreds(organizationId: string) {
  const [developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId] = await Promise.all([
    getCredential(organizationId, "google_ads", "developer_token", "GOOGLE_ADS_DEVELOPER_TOKEN"),
    getCredential(organizationId, "google_ads", "client_id", "GOOGLE_ADS_CLIENT_ID"),
    getCredential(organizationId, "google_ads", "client_secret", "GOOGLE_ADS_CLIENT_SECRET"),
    getCredential(organizationId, "google_ads", "refresh_token", "GOOGLE_ADS_REFRESH_TOKEN"),
    getCredential(organizationId, "google_ads", "customer_id", "GOOGLE_ADS_CUSTOMER_ID"),
    getCredential(organizationId, "google_ads", "login_customer_id", "GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
  ]);
  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) return null;
  return { developerToken, clientId, clientSecret, refreshToken, customerId: customerId.replace(/\D/g, ""), loginCustomerId: loginCustomerId?.replace(/\D/g, "") };
}

async function googleAccessToken(creds: NonNullable<Awaited<ReturnType<typeof loadGoogleAdsCreds>>>): Promise<string> {
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Google OAuth HTTP ${res.status}`);
  const json = await res.json() as { access_token?: string };
  if (!json.access_token) throw new Error("Google OAuth sin access_token");
  return json.access_token;
}

async function fetchGoogleSpendMetrics(organizationId: string, from: Date, to: Date): Promise<SpendMetric[]> {
  const creds = await loadGoogleAdsCreds(organizationId);
  if (!creds) return [];

  const token = await googleAccessToken(creds);
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros,
      segments.date,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks
    FROM campaign
    WHERE segments.date BETWEEN '${formatDate(from)}' AND '${formatDate(to)}'
  `;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": creds.developerToken,
    "Content-Type": "application/json",
  };
  if (creds.loginCustomerId) headers["login-customer-id"] = creds.loginCustomerId;

  const res = await fetch(`https://googleads.googleapis.com/v18/customers/${creds.customerId}/googleAds:searchStream`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Ads metrics HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const chunks = await res.json() as Array<{ results?: Array<{
    campaign?: { id?: string; name?: string; status?: string };
    campaignBudget?: { amountMicros?: string | number };
    segments?: { date?: string };
    metrics?: { costMicros?: string | number; impressions?: string | number; clicks?: string | number };
  }> }>;

  return chunks.flatMap((chunk) => (chunk.results ?? []).map((row) => ({
    platform: "google_ads" as const,
    externalCampaignId: String(row.campaign?.id ?? "unknown"),
    campaignName: row.campaign?.name ?? "Sin campaña",
    status: row.campaign?.status?.toLowerCase(),
    dailyBudget: row.campaignBudget?.amountMicros != null ? Number(row.campaignBudget.amountMicros) / 1_000_000 : null,
    date: new Date(`${row.segments?.date ?? formatDate(to)}T00:00:00.000Z`),
    spend: Number(row.metrics?.costMicros ?? 0) / 1_000_000,
    impressions: Number(row.metrics?.impressions ?? 0),
    clicks: Number(row.metrics?.clicks ?? 0),
  })));
}

async function fetchMetaSpendMetrics(organizationId: string, from: Date, to: Date): Promise<SpendMetric[]> {
  const [accessToken, adAccountId] = await Promise.all([
    getCredential(organizationId, "meta_ads", "access_token", "META_ADS_ACCESS_TOKEN"),
    getCredential(organizationId, "meta_ads", "ad_account_id", "META_ADS_AD_ACCOUNT_ID"),
  ]);
  if (!accessToken || !adAccountId) return [];

  const account = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  const fields = "campaign_id,campaign_name,spend,impressions,clicks,date_start";
  const timeRange = encodeURIComponent(JSON.stringify({ since: formatDate(from), until: formatDate(to) }));
  let url: string | null = `https://graph.facebook.com/v21.0/${account}/insights?level=campaign&time_increment=1&fields=${fields}&time_range=${timeRange}&access_token=${encodeURIComponent(accessToken)}`;
  const rows: SpendMetric[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meta Ads insights HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = await res.json() as {
      data?: Array<{ campaign_id?: string; campaign_name?: string; spend?: string; impressions?: string; clicks?: string; date_start?: string }>;
      paging?: { next?: string };
    };
    for (const row of json.data ?? []) {
      rows.push({
        platform: "meta_ads",
        externalCampaignId: row.campaign_id ?? "unknown",
        campaignName: row.campaign_name ?? "Sin campaña",
        status: "active",
        date: new Date(`${row.date_start ?? formatDate(to)}T00:00:00.000Z`),
        spend: Number(row.spend ?? 0),
        impressions: Number(row.impressions ?? 0),
        clicks: Number(row.clicks ?? 0),
      });
    }
    url = json.paging?.next ?? null;
  }

  return rows;
}

async function upsertSpendMetrics(organizationId: string, rows: SpendMetric[]): Promise<number> {
  const db = getDb();
  let count = 0;
  for (const row of rows) {
    const campaign = await db.adCampaign.upsert({
      where: {
        organizationId_platform_externalCampaignId: {
          organizationId,
          platform: row.platform,
          externalCampaignId: row.externalCampaignId,
        },
      },
      create: {
        organizationId,
        platform: row.platform,
        externalCampaignId: row.externalCampaignId,
        name: row.campaignName,
        status: row.status ?? "unknown",
        dailyBudget: row.dailyBudget ?? undefined,
        lastSyncedAt: new Date(),
      },
      update: {
        name: row.campaignName,
        status: row.status ?? "unknown",
        dailyBudget: row.dailyBudget ?? undefined,
        lastSyncedAt: new Date(),
      },
      select: { id: true },
    });

    await db.adMetricDaily.upsert({
      where: { campaignId_date: { campaignId: campaign.id, date: startOfDay(row.date) } },
      create: {
        campaignId: campaign.id,
        date: startOfDay(row.date),
        spend: roundMoney(row.spend),
        impressions: row.impressions,
        clicks: row.clicks,
      },
      update: {
        spend: roundMoney(row.spend),
        impressions: row.impressions,
        clicks: row.clicks,
      },
    });
    count++;
  }
  return count;
}

async function syncExternalSpendMetrics(organizationId: string, from: Date, to: Date): Promise<number> {
  const results = await Promise.allSettled([
    fetchGoogleSpendMetrics(organizationId, from, to),
    fetchMetaSpendMetrics(organizationId, from, to),
  ]);
  const rows: SpendMetric[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") rows.push(...result.value);
    else logger.error("ads.performance.sync", result.reason);
  }
  return upsertSpendMetrics(organizationId, rows);
}

export async function syncAdAttributionMetrics(organizationId: string, days = 30): Promise<{ campaigns: number; metrics: number }> {
  const db = getDb();
  const to = new Date();
  const from = startOfDay(new Date(to.getTime() - (days - 1) * DAY_MS));
  const spendMetrics = await syncExternalSpendMetrics(organizationId, from, to);
  const { campaigns, daily } = await buildAttributionSnapshot(organizationId, from, to);

  const campaignIds = new Map<string, string>();
  for (const attr of campaigns.values()) {
    const campaign = await db.adCampaign.upsert({
      where: {
        organizationId_platform_externalCampaignId: {
          organizationId,
          platform: attr.platform,
          externalCampaignId: campaignIdFromName(attr.campaignName),
        },
      },
      create: {
        organizationId,
        platform: attr.platform,
        externalCampaignId: campaignIdFromName(attr.campaignName),
        name: attr.campaignName,
        status: "active",
        lastSyncedAt: new Date(),
      },
      update: {
        name: attr.campaignName,
        lastSyncedAt: new Date(),
      },
      select: { id: true },
    });
    campaignIds.set(attr.campaignKey, campaign.id);
  }

  await db.adMetricDaily.updateMany({
    where: {
      campaign: { organizationId },
      date: { gte: from, lte: to },
    },
    data: { leads: 0, conversions: 0, revenue: 0 },
  });

  let metrics = 0;
  for (const [key, value] of daily.entries()) {
    const [platform, campaignName, date] = key.split(":");
    const campaignId = campaignIds.get(`${platform}:${campaignName}`);
    if (!campaignId) continue;
    await db.adMetricDaily.upsert({
      where: { campaignId_date: { campaignId, date: new Date(`${date}T00:00:00.000Z`) } },
      create: {
        campaignId,
        date: new Date(`${date}T00:00:00.000Z`),
        leads: value.leads,
        conversions: value.conversions,
        revenue: value.revenue,
      },
      update: {
        leads: value.leads,
        conversions: value.conversions,
        revenue: value.revenue,
      },
    });
    metrics++;
  }

  return { campaigns: campaignIds.size, metrics: metrics + spendMetrics };
}

export async function getAdPerformanceDashboard(organizationId: string, days = 30): Promise<AdPerformanceDashboard> {
  const db = getDb();
  const to = new Date();
  const from = startOfDay(new Date(to.getTime() - (days - 1) * DAY_MS));
  const campaigns = await db.adCampaign.findMany({
    where: { organizationId },
    include: {
      metrics: {
        where: { date: { gte: from, lte: to } },
        orderBy: { date: "asc" },
      },
    },
    orderBy: [{ platform: "asc" }, { name: "asc" }],
  });

  const storedCampaignKeys = new Set(campaigns.map((campaign) => campaignKey(campaign.platform as AdPlatform, campaign.name)));
  const snapshot = await buildAttributionSnapshot(organizationId, from, to);

  const virtualCampaigns = [...snapshot.campaigns.values()].filter((campaign) => !storedCampaignKeys.has(campaign.campaignKey));
  const rows: AdPerformanceRow[] = [];

  for (const campaign of campaigns) {
    const platform = campaign.platform as AdPlatform;
    const key = campaignKey(platform, campaign.name);
    const liveTotals = { leads: 0, conversions: 0, revenue: 0 };
    const series = Array.from({ length: days }, (_, index) => {
      const day = dateKey(new Date(from.getTime() + index * DAY_MS));
      const stored = campaign.metrics.find((metric) => dateKey(metric.date) === day);
      const live = snapshot.daily.get(`${key}:${day}`);
      liveTotals.leads += live?.leads ?? 0;
      liveTotals.conversions += live?.conversions ?? 0;
      liveTotals.revenue += live?.revenue ?? 0;
      return Math.max(Number(stored?.revenue ?? 0), live?.revenue ?? 0);
    });

    const merged = campaign.metrics.reduce(
      (acc, metric) => ({
        spend: acc.spend + Number(metric.spend),
        impressions: acc.impressions + metric.impressions,
        clicks: acc.clicks + metric.clicks,
        leads: acc.leads + metric.leads,
        conversions: acc.conversions + metric.conversions,
        revenue: acc.revenue + Number(metric.revenue),
      }),
      { spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, revenue: 0 },
    );

    merged.leads = Math.max(merged.leads, liveTotals.leads);
    merged.conversions = Math.max(merged.conversions, liveTotals.conversions);
    merged.revenue = Math.max(merged.revenue, liveTotals.revenue);

    rows.push({
      id: campaign.id,
      platform,
      externalCampaignId: campaign.externalCampaignId,
      name: campaign.name,
      status: campaign.status,
      spend: roundMoney(merged.spend),
      impressions: merged.impressions,
      clicks: merged.clicks,
      leads: merged.leads,
      conversions: merged.conversions,
      revenue: roundMoney(merged.revenue),
      roas: ratio(merged.revenue, merged.spend),
      cac: ratio(merged.spend, merged.conversions),
      cpl: ratio(merged.spend, merged.leads),
      conversionRate: ratio(merged.conversions * 100, merged.clicks),
      series,
    });
  }

  for (const campaign of virtualCampaigns) {
    let leads = 0;
    let conversions = 0;
    let revenue = 0;
    const series = Array.from({ length: days }, (_, index) => {
      const day = dateKey(new Date(from.getTime() + index * DAY_MS));
      const metric = snapshot.daily.get(`${campaign.campaignKey}:${day}`);
      leads += metric?.leads ?? 0;
      conversions += metric?.conversions ?? 0;
      revenue += metric?.revenue ?? 0;
      return metric?.revenue ?? 0;
    });
    rows.push({
      id: campaign.campaignKey,
      platform: campaign.platform,
      externalCampaignId: campaignIdFromName(campaign.campaignName),
      name: campaign.campaignName,
      status: "attributed",
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads,
      conversions,
      revenue: roundMoney(revenue),
      roas: null,
      cac: null,
      cpl: null,
      conversionRate: null,
      series,
    });
  }

  rows.sort((a, b) => b.revenue - a.revenue || b.spend - a.spend || a.name.localeCompare(b.name));

  const totals = rows.reduce(
    (acc, row) => ({
      spend: acc.spend + row.spend,
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      leads: acc.leads + row.leads,
      conversions: acc.conversions + row.conversions,
      revenue: acc.revenue + row.revenue,
    }),
    { spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, revenue: 0 },
  );

  return {
    days,
    totals: {
      ...totals,
      spend: roundMoney(totals.spend),
      revenue: roundMoney(totals.revenue),
      roas: ratio(totals.revenue, totals.spend),
      cac: ratio(totals.spend, totals.conversions),
      cpl: ratio(totals.spend, totals.leads),
    },
    rows,
    lastSyncedAt: campaigns
      .map((campaign) => campaign.lastSyncedAt)
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString() ?? null,
  };
}

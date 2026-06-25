import { NextRequest, NextResponse } from "next/server";
import { verifyToken, tokenFromCookieHeader } from "../../../../lib/auth-token";
import { getDb } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const days = Math.min(365, Math.max(1, Number(url.searchParams.get("days")) || 30));

  const db = getDb();
  const now = new Date();
  const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const prevPeriodStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    leadsThisPeriod,
    leadsPrevPeriod,
    leadsByStatus,
    totalConversations,
    activeConversations,
    convsThisPeriod,
    convsPrevPeriod,
    totalPosts,
    publishedPosts,
    totalClients,
    totalCases,
    recentLeads,
    recentAudit,
    leadsByDay,
    pipelineValue,
  ] = await Promise.all([
    db.lead.count().catch(() => 0),
    db.lead.count({ where: { createdAt: { gte: periodStart } } }).catch(() => 0),
    db.lead.count({ where: { createdAt: { gte: prevPeriodStart, lt: periodStart } } }).catch(() => 0),
    db.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM "Lead"
      GROUP BY status
      ORDER BY count DESC
    `.catch(() => []),
    db.waConversation.count().catch(() => 0),
    db.waConversation.count({ where: { status: "active" } }).catch(() => 0),
    db.waConversation.count({ where: { createdAt: { gte: periodStart } } }).catch(() => 0),
    db.waConversation.count({ where: { createdAt: { gte: prevPeriodStart, lt: periodStart } } }).catch(() => 0),
    db.post.count().catch(() => 0),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.clientLogo.count({ where: { active: true } }).catch(() => 0),
    db.successCase.count({ where: { active: true } }).catch(() => 0),
    db.lead.findMany({ take: 5, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "Lead"
      WHERE "createdAt" >= ${periodStart}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `.catch(() => []),
    db.lead.aggregate({ _sum: { value: true }, where: { status: { notIn: ["perdido"] } } }).catch(() => ({ _sum: { value: null } })),
  ]);

  const trend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return NextResponse.json({
    period: { days, from: periodStart.toISOString(), to: now.toISOString() },
    overview: {
      totalLeads,
      leadsThisPeriod,
      leadsTrend: trend(leadsThisPeriod, leadsPrevPeriod),
      totalConversations,
      convsThisPeriod,
      convsTrend: trend(convsThisPeriod, convsPrevPeriod),
      activeConversations,
      totalPosts,
      publishedPosts,
      totalClients,
      totalCases,
      pipelineValue: (pipelineValue as { _sum: { value: number | null } })._sum.value ?? 0,
    },
    leadsByStatus,
    leadsByDay,
    recentLeads,
    recentAudit,
  });
}

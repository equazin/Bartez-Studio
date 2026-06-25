import { NextRequest, NextResponse } from "next/server";
import { verifyToken, tokenFromCookieHeader } from "../../../../lib/auth-token";
import { getDb } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  const [
    totalLeads,
    leadsByStatus,
    totalConversations,
    activeConversations,
    totalPosts,
    publishedPosts,
    totalClients,
    totalCases,
    recentLeads,
    recentAudit,
  ] = await Promise.all([
    db.lead.count().catch(() => 0),
    db.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM "Lead"
      GROUP BY status
      ORDER BY count DESC
    `.catch(() => []),
    db.waConversation.count().catch(() => 0),
    db.waConversation.count({ where: { status: "active" } }).catch(() => 0),
    db.post.count().catch(() => 0),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.clientLogo.count({ where: { active: true } }).catch(() => 0),
    db.successCase.count({ where: { active: true } }).catch(() => 0),
    db.lead.findMany({ take: 5, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [leadsThisMonth, conversationsThisMonth] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }).catch(() => 0),
    db.waConversation.count({ where: { createdAt: { gte: thirtyDaysAgo } } }).catch(() => 0),
  ]);

  return NextResponse.json({
    overview: {
      totalLeads,
      leadsThisMonth,
      totalConversations,
      conversationsThisMonth,
      activeConversations,
      totalPosts,
      publishedPosts,
      totalClients,
      totalCases,
    },
    leadsByStatus,
    recentLeads,
    recentAudit,
  });
}

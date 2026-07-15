import { NextResponse } from "next/server.js";
import { z } from "zod";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { createPost, listPosts, type SocialPostStatus } from "../../../../../lib/modules/marketing/social-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const createSchema = z.object({
  socialAccountId: z.string().min(1),
  caption: z.string().max(4000).default(""),
  mediaUrls: z.array(z.string().url()).max(10).default([]),
  linkUrl: z.string().url().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "marketing:social:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const status = (url.searchParams.get("status") ?? undefined) as SocialPostStatus | undefined;
  const posts = await listPosts(auth.orgId, { status });
  return NextResponse.json({ ok: true, posts }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "marketing:social:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Payload inválido", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const post = await createPost(auth.orgId, {
      socialAccountId: parsed.data.socialAccountId,
      caption: parsed.data.caption,
      mediaUrls: parsed.data.mediaUrls,
      linkUrl: parsed.data.linkUrl,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
      createdById: auth.session.userId,
    });
    return NextResponse.json({ ok: true, post }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}

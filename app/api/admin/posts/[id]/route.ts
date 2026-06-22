import type { Prisma } from "@prisma/client";
import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../../lib/admin-content.ts";
import { adminIdSchema, postUpdateSchema } from "../../../../../lib/admin-schema.ts";
import { getDb } from "../../../../../lib/db.ts";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const id = adminIdSchema.safeParse((await params).id);
  if (!id.success) return invalidAdminInput(id.error.issues);
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = postUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const { bodyContent, ...fields } = parsed.data;
    const data: Prisma.PostUpdateInput = { ...fields };
    if (bodyContent) data.body = bodyContent;
    const post = await getDb().post.update({ where: { id: id.data }, data });
    invalidatePublicContent("posts", post.slug);
    return adminOk({ post });
  } catch (error) {
    return adminServerError("actualizar artículo", error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const id = adminIdSchema.safeParse((await params).id);
  if (!id.success) return invalidAdminInput(id.error.issues);
  try {
    const post = await getDb().post.delete({ where: { id: id.data } });
    invalidatePublicContent("posts", post.slug);
    return adminOk();
  } catch (error) {
    return adminServerError("eliminar artículo", error);
  }
}

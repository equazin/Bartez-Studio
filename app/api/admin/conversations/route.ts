import { adminOk, adminServerError, authorizeAdminRequest } from "../../../../lib/admin-api.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;

  try {
    const db = getDb();
    // Retrieve conversations with their last message
    const conversations = await db.waConversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return adminOk({ conversations });
  } catch (error) {
    return adminServerError("listar conversaciones de whatsapp", error);
  }
}

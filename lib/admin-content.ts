import { revalidatePath } from "next/cache";

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "articulo";
}

export function invalidatePublicContent(kind: "posts" | "clients" | "cases", slug?: string) {
  if (kind === "posts") {
    revalidatePath("/recursos");
    if (slug) revalidatePath(`/recursos/${slug}`);
    revalidatePath("/sitemap.xml");
  } else {
    revalidatePath("/");
  }
}

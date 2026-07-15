"use client";

import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export type Provider = "facebook" | "instagram";

export const CAPTION_LIMITS: Record<Provider, number> = {
  facebook: 63206,
  instagram: 2200,
};

interface PostPreviewProps {
  provider: Provider;
  accountName: string;
  avatarUrl?: string | null;
  caption: string;
  mediaUrls: readonly string[];
  linkUrl?: string;
}

/**
 * Previsualización de cómo se verá el post publicado, aproximando el layout
 * real de cada red. No pretende ser pixel-perfect: sirve al operador para
 * validar contenido antes de mandar.
 */
export function PostPreview({ provider, accountName, avatarUrl, caption, mediaUrls, linkUrl }: PostPreviewProps) {
  if (provider === "instagram") {
    return <InstagramPreview accountName={accountName} avatarUrl={avatarUrl} caption={caption} mediaUrls={mediaUrls} />;
  }
  return <FacebookPreview accountName={accountName} avatarUrl={avatarUrl} caption={caption} mediaUrls={mediaUrls} linkUrl={linkUrl} />;
}

function Avatar({ url, name, provider }: { url?: string | null; name: string; provider: Provider }) {
  const Icon = provider === "instagram" ? Instagram : Facebook;
  return url ? (
    <span className="relative grid size-9 flex-none overflow-hidden rounded-full border border-slate-300">
      <Image src={url} alt={name} fill sizes="36px" className="object-cover" />
    </span>
  ) : (
    <span className="grid size-9 flex-none place-items-center rounded-full border border-slate-300 bg-slate-100 text-slate-600">
      <Icon className="size-4" />
    </span>
  );
}

function InstagramPreview({ accountName, avatarUrl, caption, mediaUrls }: Omit<PostPreviewProps, "provider" | "linkUrl">) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar url={avatarUrl} name={accountName} provider="instagram" />
        <span className="text-[13px] font-bold text-slate-950">{accountName}</span>
      </div>
      <div className="relative aspect-square w-full bg-slate-100">
        {mediaUrls[0] ? (
          <Image src={mediaUrls[0]} alt="preview" fill sizes="480px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-[12px] text-slate-500">Agregá una imagen o video</div>
        )}
        {mediaUrls.length > 1 ? (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10.5px] font-bold text-white">
            1 / {mediaUrls.length}
          </span>
        ) : null}
      </div>
      <div className="px-3 py-2.5 text-[13px] text-slate-800">
        <span className="font-bold">{accountName}</span>{" "}
        <span className="whitespace-pre-wrap">{caption || <em className="text-slate-400 not-italic">Escribí el pie de foto…</em>}</span>
      </div>
    </div>
  );
}

function FacebookPreview({ accountName, avatarUrl, caption, mediaUrls, linkUrl }: Omit<PostPreviewProps, "provider">) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar url={avatarUrl} name={accountName} provider="facebook" />
        <div>
          <p className="text-[13px] font-bold text-slate-950">{accountName}</p>
          <p className="text-[11px] text-slate-500">Hace instantes · 🌎</p>
        </div>
      </div>
      <div className="px-3 pb-3 text-[13px] text-slate-800 whitespace-pre-wrap">
        {caption || <em className="text-slate-400 not-italic">Escribí el post…</em>}
      </div>
      {mediaUrls[0] ? (
        <div className="relative aspect-video w-full bg-slate-100">
          <Image src={mediaUrls[0]} alt="preview" fill sizes="480px" className="object-cover" />
        </div>
      ) : linkUrl ? (
        <div className="border-t border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] uppercase text-slate-500">{safeHost(linkUrl)}</p>
          <p className="mt-1 truncate text-[13px] font-bold text-slate-950">{linkUrl}</p>
        </div>
      ) : null}
    </div>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

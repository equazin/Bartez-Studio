"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, Facebook, Instagram, Loader2, Plus, Send } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminTextarea } from "../AdminUI";
import { MediaUploader } from "./MediaUploader";
import { CAPTION_LIMITS, PostPreview, type Provider } from "./PostPreview";

export interface ComposerAccount {
  id: string;
  provider: Provider;
  name: string;
  avatarUrl: string | null;
}

interface ComposerProps {
  accounts: readonly ComposerAccount[];
  onSaved: () => void;
}

/**
 * Composer visual con:
 *  - Selector multi-cuenta (cross-post: 1 SocialPost por cuenta seleccionada)
 *  - Uploader de imágenes
 *  - Preview live estilo IG/FB por cuenta seleccionada
 *  - Contador de caracteres con el límite de la red más restrictiva de la selección
 *  - Programar o publicar ahora
 */
export function Composer({ accounts, onSaved }: ComposerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (selected.size === 0 && accounts.length > 0) {
      setSelected(new Set([accounts[0].id]));
    }
  }, [accounts, selected.size]);

  const selectedAccounts = useMemo(
    () => accounts.filter((a) => selected.has(a.id)),
    [accounts, selected],
  );

  const hasInstagram = selectedAccounts.some((a) => a.provider === "instagram");
  const captionLimit = Math.min(
    ...selectedAccounts.map((a) => CAPTION_LIMITS[a.provider]),
    CAPTION_LIMITS.facebook,
  );
  const overLimit = caption.length > captionLimit;

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function submit(action: "save" | "publish_now") {
    setError(""); setNotice("");
    if (selectedAccounts.length === 0) { setError("Elegí al menos una cuenta."); return; }
    if (hasInstagram && mediaUrls.length === 0) { setError("Instagram requiere al menos una imagen."); return; }
    if (overLimit) { setError(`El texto supera el límite (${captionLimit} caracteres).`); return; }

    if (action === "publish_now") setPublishing(true); else setSaving(true);
    try {
      const createdIds: string[] = [];
      for (const account of selectedAccounts) {
        const res = await fetch("/api/admin/marketing/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            socialAccountId: account.id,
            caption,
            mediaUrls,
            linkUrl: linkUrl && account.provider === "facebook" ? linkUrl : undefined,
            scheduledAt: action === "publish_now" ? null : (scheduledAt ? new Date(scheduledAt).toISOString() : null),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(`${account.name}: ${data.error || "no se pudo guardar"}`);
        createdIds.push(data.post.id);
      }
      if (action === "publish_now") {
        let failed = 0;
        for (const id of createdIds) {
          const res = await fetch(`/api/admin/marketing/posts/${id}/publish`, { method: "POST" });
          const data = await res.json();
          if (!res.ok || !data.ok) failed++;
        }
        setNotice(failed === 0 ? `Publicado en ${createdIds.length} cuenta(s).` : `Se publicó en ${createdIds.length - failed} de ${createdIds.length}. Revisá historial.`);
      } else {
        setNotice(scheduledAt ? `Programado en ${createdIds.length} cuenta(s).` : `Guardado como borrador en ${createdIds.length}.`);
      }
      setCaption(""); setMediaUrls([]); setLinkUrl(""); setScheduledAt("");
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false); setPublishing(false);
    }
  }

  if (accounts.length === 0) return null;

  return (
    <AdminPanel className="p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[12.5px] font-bold text-slate-700">Publicar en</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {accounts.map((account) => {
                const Icon = account.provider === "instagram" ? Instagram : Facebook;
                const active = selected.has(account.id);
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => toggle(account.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-bold transition-colors ${
                      active
                        ? "border-brand bg-brand/10 text-brand-bright"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {account.name}
                    {active ? <Check className="size-3.5" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <AdminField label="Texto" htmlFor="post-caption" hint={`${caption.length} / ${captionLimit.toLocaleString("es-AR")}${overLimit ? " · límite superado" : ""}`}>
            <AdminTextarea
              id="post-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={6}
              placeholder="Escribí el post…"
              className={overLimit ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}
            />
          </AdminField>

          <AdminField label="Imágenes" htmlFor="post-media" hint="IG requiere al menos una imagen. FB puede ir solo texto.">
            <MediaUploader value={mediaUrls} onChange={setMediaUrls} />
          </AdminField>

          {selectedAccounts.some((a) => a.provider === "facebook") ? (
            <AdminField label="Link (opcional, solo Facebook)" htmlFor="post-link">
              <AdminInput id="post-link" type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" />
            </AdminField>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[12.5px] font-bold text-slate-700">Vista previa</p>
          <div className="flex flex-col gap-3">
            {selectedAccounts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12.5px] text-slate-500">
                Elegí al menos una cuenta.
              </p>
            ) : (
              selectedAccounts.map((account) => (
                <PostPreview
                  key={account.id}
                  provider={account.provider}
                  accountName={account.name}
                  avatarUrl={account.avatarUrl}
                  caption={caption}
                  mediaUrls={mediaUrls}
                  linkUrl={account.provider === "facebook" ? linkUrl || undefined : undefined}
                />
              ))
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-4">
            <AdminField label="Programar (opcional)" htmlFor="post-scheduled" hint="Vacío = borrador para publicar manual.">
              <AdminInput id="post-scheduled" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </AdminField>
            <AdminButton onClick={() => void submit("publish_now")} disabled={publishing || saving || overLimit}>
              {publishing ? <><Loader2 className="animate-spin" />Publicando…</> : <><Send />Publicar ahora</>}
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => void submit("save")} disabled={publishing || saving || overLimit}>
              {scheduledAt ? <><CalendarClock />Programar</> : <><Plus />Guardar borrador</>}
            </AdminButton>
            {error ? <AdminAlert>{error}</AdminAlert> : null}
            {notice ? <AdminAlert tone="success">{notice}</AdminAlert> : null}
          </div>
        </div>
      </div>
    </AdminPanel>
  );
}

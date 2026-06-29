"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, UserCheck, X } from "lucide-react";
import { cn } from "../../lib/utils";

type Toast = {
  id: string;
  title: string;
  body: string;
  icon?: "lead" | "info";
  at: number;
};

let addToastGlobal: ((toast: Omit<Toast, "id" | "at">) => void) | null = null;

export function showToast(toast: Omit<Toast, "id" | "at">) {
  addToastGlobal?.(toast);
  if (typeof window !== "undefined" && window.bartezDesktop?.isDesktop) {
    void window.bartezDesktop.notify({ title: toast.title, body: toast.body });
  }
}

export function AdminToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((toast: Omit<Toast, "id" | "at">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id, at: Date.now() }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000);
  }, []);

  useEffect(() => {
    addToastGlobal = add;
    return () => { addToastGlobal = null; };
  }, [add]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right flex w-[340px] items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
        >
          <span className={cn(
            "grid size-9 flex-none place-items-center rounded-lg",
            toast.icon === "lead" ? "bg-blue-50 text-brand" : "bg-slate-100 text-slate-600",
          )}>
            {toast.icon === "lead" ? <UserCheck className="size-4" /> : <Bell className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-slate-950">{toast.title}</p>
            <p className="mt-0.5 truncate text-[12px] text-slate-600">{toast.body}</p>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="grid size-6 flex-none place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function LeadNotificationPoller() {
  const lastCheckRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch("/api/admin/leads?limit=1&page=1");
        if (!res.ok) return;
        const json = await res.json();
        const latest = json.data?.[0];
        if (!latest) return;

        const key = `${latest.id}-${latest.createdAt}`;
        if (lastCheckRef.current && lastCheckRef.current !== key) {
          showToast({
            title: "Nuevo lead",
            body: `${latest.name}${latest.company ? ` · ${latest.company}` : ""} — ${latest.source}`,
            icon: "lead",
          });
        }
        lastCheckRef.current = key;
      } catch {
        // silent
      }
    }

    void poll();
    const interval = setInterval(() => { if (active) void poll(); }, 30_000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  return null;
}

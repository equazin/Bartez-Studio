"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Facebook, Instagram } from "lucide-react";
import { AdminButton, AdminPanel } from "../AdminUI";

interface CalendarPost {
  id: string;
  accountName: string;
  accountProvider: "facebook" | "instagram";
  caption: string;
  status: "draft" | "scheduled" | "publishing" | "published" | "failed" | "canceled";
  scheduledAt: string | null;
  publishedAt: string | null;
  permalink: string | null;
}

interface CalendarProps {
  posts: readonly CalendarPost[];
}

const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];

function statusDot(status: CalendarPost["status"]): string {
  switch (status) {
    case "published": return "bg-emerald-500";
    case "failed": return "bg-red-500";
    case "scheduled": return "bg-blue-500";
    case "publishing": return "bg-amber-500";
    case "canceled": return "bg-slate-400";
    default: return "bg-slate-300";
  }
}

function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Calendario mensual con puntos por post. Click en un día abre el detalle. */
export function Calendar({ posts }: CalendarProps) {
  const [anchor, setAnchor] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const grid = useMemo(() => buildMonthGrid(anchor), [anchor]);
  const postsByDay = useMemo(() => {
    const map = new Map<string, CalendarPost[]>();
    for (const post of posts) {
      const when = post.scheduledAt ?? post.publishedAt;
      if (!when) continue;
      const key = ymd(new Date(when));
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return map;
  }, [posts]);

  const monthLabel = anchor.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const selectedPosts = selected ? postsByDay.get(selected) ?? [] : [];

  function shift(months: number) {
    const next = new Date(anchor);
    next.setDate(1);
    next.setMonth(next.getMonth() + months);
    setAnchor(next);
    setSelected(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <AdminPanel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-3">
          <h2 className="font-display text-[16px] font-bold capitalize text-slate-950">{monthLabel}</h2>
          <div className="flex gap-1">
            <AdminButton variant="ghost" size="icon" onClick={() => shift(-1)} aria-label="Mes anterior"><ChevronLeft /></AdminButton>
            <AdminButton variant="ghost" size="sm" onClick={() => { setAnchor(new Date()); setSelected(null); }}>Hoy</AdminButton>
            <AdminButton variant="ghost" size="icon" onClick={() => shift(1)} aria-label="Mes siguiente"><ChevronRight /></AdminButton>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[11px] font-bold text-slate-600">
          {DAY_NAMES.map((d, i) => <div key={i} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {grid.map((cell) => {
            const key = ymd(cell.date);
            const dayPosts = postsByDay.get(key) ?? [];
            const isSelected = selected === key;
            const isToday = key === ymd(new Date());
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(isSelected ? null : key)}
                className={`min-h-20 border-b border-r border-slate-200 p-1.5 text-left transition-colors ${
                  cell.currentMonth ? "bg-white" : "bg-slate-50 text-slate-400"
                } ${isSelected ? "ring-2 ring-inset ring-brand" : "hover:bg-slate-50"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11.5px] font-bold ${isToday ? "grid size-6 place-items-center rounded-full bg-brand text-white" : ""}`}>
                    {cell.date.getDate()}
                  </span>
                  {dayPosts.length > 0 ? (
                    <span className="text-[10px] font-bold text-slate-500">{dayPosts.length}</span>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {dayPosts.slice(0, 4).map((post) => (
                    <span key={post.id} className={`inline-block size-2 rounded-full ${statusDot(post.status)}`} title={post.accountName} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </AdminPanel>

      <AdminPanel className="p-4">
        <h3 className="text-[13px] font-bold text-slate-950">
          {selected ? new Date(selected + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }) : "Elegí un día"}
        </h3>
        {selectedPosts.length === 0 ? (
          <p className="mt-3 text-[12.5px] text-slate-600">
            {selected ? "Sin posts programados o publicados este día." : "Los puntos indican posts. Verde: publicado, azul: programado, rojo: falló."}
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {selectedPosts.map((post) => {
              const Icon = post.accountProvider === "instagram" ? Instagram : Facebook;
              const when = post.scheduledAt ?? post.publishedAt;
              return (
                <div key={post.id} className="rounded-lg border border-slate-200 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block size-2 rounded-full ${statusDot(post.status)}`} />
                    <Icon className="size-3.5 text-slate-600" />
                    <span className="truncate text-[12px] font-bold text-slate-950">{post.accountName}</span>
                    <span className="ml-auto text-[11px] text-slate-500">{when ? new Date(when).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12px] text-slate-700 whitespace-pre-wrap">{post.caption || "(sin texto)"}</p>
                  {post.permalink ? (
                    <a href={post.permalink} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-[11px] font-bold text-brand hover:text-brand-bright">
                      Ver publicado ↗
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

interface DayCell {
  date: Date;
  currentMonth: boolean;
}

/** Genera un grid 7xN (con lunes primero) que cubre el mes de `anchor`. */
function buildMonthGrid(anchor: Date): DayCell[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Lunes = 0, Domingo = 6 (ajuste para semana ES)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstWeekday);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({ date, currentMonth: date.getMonth() === month });
  }
  // Trim última semana si es toda del siguiente mes
  while (cells.length > 35 && !cells[cells.length - 1].currentMonth && !cells[cells.length - 7].currentMonth) {
    cells.length -= 7;
  }
  return cells;
}

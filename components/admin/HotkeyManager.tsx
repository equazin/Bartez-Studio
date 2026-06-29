"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Keyboard, X } from "lucide-react";

interface Hotkey {
  key: string;
  label: string;
  description: string;
  route?: string;
  action?: () => void;
}

function buildHotkeys(actions: { openCheatsheet: () => void }): Hotkey[] {
  return [
    { key: "F1", label: "F1", description: "Inicio / Dashboard", route: "/admin" },
    { key: "F2", label: "F2", description: "Productos", route: "/admin/products" },
    { key: "F3", label: "F3", description: "Nuevo presupuesto", route: "/admin/quotes/new" },
    { key: "F4", label: "F4", description: "Cuentas (clientes)", route: "/admin/accounts" },
    { key: "F5", label: "F5", description: "Leads", route: "/admin/leads" },
    { key: "F6", label: "F6", description: "Presupuestos", route: "/admin/quotes" },
    { key: "F7", label: "F7", description: "Pedidos de venta", route: "/admin/orders" },
    { key: "F8", label: "F8", description: "Nuevo pedido de venta", route: "/admin/orders/new" },
    { key: "F9", label: "F9", description: "Órdenes de compra", route: "/admin/purchase-orders" },
    { key: "F10", label: "F10", description: "Stock", route: "/admin/stock" },
    { key: "F11", label: "F11", description: "Facturas", route: "/admin/invoices" },
    { key: "F12", label: "F12", description: "Nueva factura", route: "/admin/invoices/new" },
    { key: "?", label: "?", description: "Atajos de teclado", action: actions.openCheatsheet },
  ];
}

const GROUPS = [
  {
    title: "Navegación rápida",
    keys: ["F1", "F2", "F4", "F5", "F6", "F7", "F9", "F10", "F11"],
  },
  {
    title: "Crear nuevo",
    keys: ["F3", "F8", "F12"],
  },
  {
    title: "Sistema",
    keys: ["?"],
  },
];

export function HotkeyManager() {
  const router = useRouter();
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const hotkeys = buildHotkeys({
    openCheatsheet: () => setShowCheatsheet(true),
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if ((e.target as HTMLElement)?.isContentEditable) return;

      const hotkey = hotkeys.find((h) => {
        if (h.key === "?") return e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey;
        return e.key === h.key && !e.ctrlKey && !e.metaKey && !e.altKey;
      });

      if (!hotkey) return;

      e.preventDefault();
      e.stopPropagation();

      if (hotkey.action) {
        hotkey.action();
      } else if (hotkey.route) {
        router.push(hotkey.route);
      }
    },
    [hotkeys, router],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Escape cierra el cheatsheet
  useEffect(() => {
    if (!showCheatsheet) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCheatsheet(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showCheatsheet]);

  if (!showCheatsheet) return null;

  const hotkeyMap = new Map(hotkeys.map((h) => [h.key, h]));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowCheatsheet(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-100">
              <Keyboard className="size-4.5 text-slate-600" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Atajos de teclado</h2>
              <p className="text-xs text-slate-500">Accesos rápidos desde cualquier pantalla</p>
            </div>
          </div>
          <button
            onClick={() => setShowCheatsheet(false)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.keys.map((key) => {
                  const hk = hotkeyMap.get(key);
                  if (!hk) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setShowCheatsheet(false);
                        if (hk.route) router.push(hk.route);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50"
                    >
                      <kbd className="inline-flex h-7 min-w-[40px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 font-mono text-xs font-semibold text-slate-600">
                        {hk.label}
                      </kbd>
                      <span className="text-sm text-slate-700">{hk.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
          Presioná <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold">Esc</kbd> para cerrar
          {" · "}Los atajos se desactivan al escribir en un campo
        </div>
      </div>
    </div>
  );
}

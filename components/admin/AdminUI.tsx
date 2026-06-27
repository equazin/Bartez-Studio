"use client";

import * as React from "react";
import { AlertDialog, Slot, Switch } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border text-[13.5px] font-bold transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "border-brand bg-brand text-white shadow-sm hover:border-brand-bright hover:bg-brand-bright",
        secondary: "border-slate-300 bg-white text-slate-900 hover:border-brand hover:bg-blue-50 hover:text-brand",
        ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        danger: "border-red-300 bg-white text-red-800 hover:border-red-400 hover:bg-red-50",
      },
      size: { sm: "h-9 px-3.5", md: "h-10 px-4", icon: "size-10 p-0" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function AdminButton({ asChild, className, variant, size, ...props }: AdminButtonProps) {
  const Component = asChild ? Slot.Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export const AdminInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(
      "h-11 w-full rounded-lg border border-slate-400 bg-white px-3.5 text-[14px] font-medium text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-600 hover:border-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-slate-100 disabled:text-slate-600",
      className,
    )} {...props} />
  ),
);
AdminInput.displayName = "AdminInput";

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(
      "min-h-28 w-full resize-y rounded-lg border border-slate-400 bg-white px-3.5 py-3 text-[14px] font-medium leading-relaxed text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-600 hover:border-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:bg-slate-100 disabled:text-slate-600",
      className,
    )} {...props} />
  ),
);
AdminTextarea.displayName = "AdminTextarea";

export function AdminField({ label, htmlFor, hint, error, children }: {
  label: string; htmlFor: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2" data-invalid={Boolean(error) || undefined}>
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-slate-900">{label}</label>
      {children}
      {error ? <p className="text-[12px] font-medium text-red-800">{error}</p> : hint ? <p className="text-[12px] leading-relaxed text-slate-600">{hint}</p> : null}
    </div>
  );
}

export function AdminPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-xl border border-slate-300 bg-white", className)}>{children}</section>;
}

export function StatusBadge({ active, activeLabel = "Publicado", inactiveLabel = "Borrador" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-bold",
      active ? "border-green-300 bg-green-50 text-green-900" : "border-amber-300 bg-amber-50 text-amber-900",
    )}>
      <span className={cn("size-1.5 rounded-full", active ? "bg-green-700" : "bg-amber-600")} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function AdminToggle({ checked, onCheckedChange, label, id }: { checked: boolean; onCheckedChange: (value: boolean) => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-300 bg-white px-3.5 py-3 hover:border-slate-400">
      <span className="text-[13.5px] font-bold text-slate-900">{label}</span>
      <Switch.Root id={id} checked={checked} onCheckedChange={onCheckedChange} className="relative h-6 w-11 rounded-full bg-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 data-[state=checked]:bg-brand">
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </label>
  );
}

export function AdminAlert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? AlertTriangle : CheckCircle2;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn(
      "flex items-start gap-3 rounded-lg border px-4 py-3 text-[13px] font-medium",
      tone === "error" ? "border-red-300 bg-red-50 text-red-900" : "border-green-300 bg-green-50 text-green-900",
    )}>
      <Icon className="mt-0.5 size-4 flex-none" /><span>{children}</span>
    </div>
  );
}

export function AdminSpinner({ label = "Cargando" }: { label?: string }) {
  return <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Loader2 className="size-4 animate-spin" />{label}</span>;
}

export interface AdminPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, limit, total, onPageChange }: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row">
      <p className="text-[12px] font-medium text-slate-600">
        Mostrando <span className="font-bold text-slate-900">{from}-{to}</span> de <span className="font-bold text-slate-900">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <AdminButton variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft />Anterior
        </AdminButton>
        <span className="text-[12.5px] font-semibold text-slate-700">{page} / {totalPages}</span>
        <AdminButton variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Siguiente<ChevronRight />
        </AdminButton>
      </div>
    </div>
  );
}

export interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AdminSearch({ value, onChange, placeholder = "Buscar..." }: AdminSearchProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      <AdminInput value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-10" />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
          aria-label="Limpiar búsqueda"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState<T>(value);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-300 bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-5">
            <div>
              <AlertDialog.Title className="font-display text-[20px] font-bold text-slate-950">{title}</AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-[13.5px] leading-relaxed text-slate-700">{description}</AlertDialog.Description>
            </div>
            <AlertDialog.Cancel className="grid size-8 place-items-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label="Cerrar"><X className="size-4" /></AlertDialog.Cancel>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild><AdminButton variant="secondary">Cancelar</AdminButton></AlertDialog.Cancel>
            <AlertDialog.Action asChild><AdminButton variant="danger" onClick={onConfirm}>Eliminar</AdminButton></AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

"use client";

import * as React from "react";
import { AlertDialog, Slot, Switch } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-bright",
        secondary: "border border-slate-300 bg-white text-ink hover:border-brand/45 hover:text-brand",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
        danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        icon: "size-9 p-0",
      },
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
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[10px] border border-slate-300 bg-white px-3.5 text-[14px] text-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:bg-slate-100 disabled:text-slate-500",
        className,
      )}
      {...props}
    />
  ),
);
AdminInput.displayName = "AdminInput";

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full resize-y rounded-[10px] border border-slate-300 bg-white px-3.5 py-3 text-[14px] leading-relaxed text-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:bg-slate-100 disabled:text-slate-500",
        className,
      )}
      {...props}
    />
  ),
);
AdminTextarea.displayName = "AdminTextarea";

export function AdminField({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2" data-invalid={Boolean(error) || undefined}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-semibold text-slate-700">{label}</label>
      {children}
      {error ? <p className="text-[12px] text-red-700">{error}</p> : hint ? <p className="text-[12px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function AdminPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-xl border border-slate-200 bg-white", className)}>{children}</section>;
}

export function StatusBadge({ active, activeLabel = "Publicado", inactiveLabel = "Borrador" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold",
      active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800",
    )}>
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-600" : "bg-amber-500")} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function AdminToggle({ checked, onCheckedChange, label, id }: { checked: boolean; onCheckedChange: (value: boolean) => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border border-slate-200 px-3.5 py-3">
      <span className="text-[13px] font-medium text-slate-700">{label}</span>
      <Switch.Root id={id} checked={checked} onCheckedChange={onCheckedChange} className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors data-[state=checked]:bg-brand">
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </label>
  );
}

export function AdminAlert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? AlertTriangle : CheckCircle2;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn(
      "flex items-start gap-3 rounded-[10px] border px-4 py-3 text-[13px]",
      tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800",
    )}>
      <Icon className="mt-0.5 size-4 flex-none" />
      <span>{children}</span>
    </div>
  );
}

export function AdminSpinner({ label = "Cargando" }: { label?: string }) {
  return <span className="inline-flex items-center gap-2 text-[13px] text-slate-500"><Loader2 className="size-4 animate-spin" />{label}</span>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-ink/45 backdrop-blur-[2px]" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-5">
            <div>
              <AlertDialog.Title className="font-display text-[20px] font-bold text-ink">{title}</AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{description}</AlertDialog.Description>
            </div>
            <AlertDialog.Cancel className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Cerrar"><X className="size-4" /></AlertDialog.Cancel>
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

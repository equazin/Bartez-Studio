"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { BriefcaseBusiness, ExternalLink, FileText, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminUI";

const navigation = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Artículos", icon: FileText },
  { href: "/admin/clients", label: "Logos", icon: ShieldCheck },
  { href: "/admin/cases", label: "Casos de éxito", icon: BriefcaseBusiness },
];

function Navigation({ pathname, close }: { pathname: string; close?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} onClick={close} className={cn(
            "flex h-11 items-center gap-3 rounded-[10px] px-3 text-[13.5px] font-semibold transition-colors",
            active ? "bg-white/12 text-white" : "text-emerald-50/70 hover:bg-white/7 hover:text-white",
          )}>
            <item.icon className="size-[18px]" strokeWidth={1.7} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="inline-flex items-center">
      <Image src="/brand/bartez-logo.png" alt="Bartez Tecnología" width={170} height={52} className="h-8 w-auto brightness-0 invert" priority />
    </Link>
  );
}

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col bg-[#073b2a] p-5 lg:flex">
        <div className="flex h-14 items-center px-2"><Brand /></div>
        <div className="mt-10 flex-1"><Navigation pathname={pathname} /></div>
        <div className="border-t border-white/15 pt-5">
          <p className="px-3 text-[11px] uppercase tracking-[0.12em] text-emerald-100/50">Sesión</p>
          <p className="mt-1 truncate px-3 text-[13px] font-semibold text-white">{username}</p>
          <button onClick={() => void logout()} className="mt-4 flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] font-semibold text-emerald-50/70 hover:bg-white/7 hover:text-white">
            <LogOut className="size-[18px]" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[248px]">
        <header className="sticky top-0 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <AdminButton variant="ghost" size="icon" aria-label="Abrir navegación"><Menu /></AdminButton>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-ink/35" />
                <Dialog.Content className="fixed inset-y-0 left-0 flex w-[min(310px,88vw)] flex-col bg-[#073b2a] p-5 shadow-2xl">
                  <Dialog.Title className="sr-only">Navegación del administrador</Dialog.Title>
                  <div className="flex h-12 items-center justify-between">
                    <Brand />
                    <Dialog.Close asChild><AdminButton variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label="Cerrar navegación"><X /></AdminButton></Dialog.Close>
                  </div>
                  <div className="mt-9 flex-1"><Navigation pathname={pathname} /></div>
                  <button onClick={() => void logout()} className="flex h-11 items-center gap-3 border-t border-white/15 px-3 pt-4 text-[13px] font-semibold text-white">
                    <LogOut className="size-[18px]" /> Cerrar sesión
                  </button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="hidden lg:block">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">Administración de contenidos</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-600 hover:text-brand">
            Ver sitio <ExternalLink className="size-4" />
          </a>
        </header>
        <main className="px-4 py-7 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { BriefcaseBusiness, ExternalLink, FileText, LayoutDashboard, LogOut, Menu, MessageSquare, UsersRound, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminUI";

const navigation = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Artículos", icon: FileText },
  { href: "/admin/clients", label: "Clientes", icon: UsersRound },
  { href: "/admin/cases", label: "Casos de éxito", icon: BriefcaseBusiness },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageSquare },
];

function Navigation({ pathname, close }: { pathname: string; close?: () => void }) {
  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-1.5">
      {navigation.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} onClick={close} className={cn(
            "flex h-11 items-center gap-3 rounded-lg border px-3 text-[14px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            active ? "border-green-400 bg-green-700 text-white" : "border-transparent text-white hover:border-white/20 hover:bg-green-900",
          )}>
            <item.icon className="size-[18px]" strokeWidth={1.8} />{item.label}
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

  const secondaryNavigation = (
    <a href="/" target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-[14px] font-bold text-white hover:border-white/20 hover:bg-green-900">
      <ExternalLink className="size-[18px]" strokeWidth={1.8} />Ver sitio
    </a>
  );

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] flex-col border-r border-green-950 bg-[#064e3b] p-5 lg:flex">
        <div className="flex h-14 items-center px-2"><Brand /></div>
        <div className="mt-9 flex-1">
          <Navigation pathname={pathname} />
          <div className="my-5 border-t border-white/20" />
          {secondaryNavigation}
        </div>
        <div className="border-t border-white/20 pt-5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-green-100">Sesión activa</p>
          <p className="mt-1 truncate px-3 text-[13.5px] font-bold text-white">{username}</p>
          <button onClick={() => void logout()} className="mt-4 flex h-10 w-full items-center gap-3 rounded-lg border border-transparent px-3 text-[13.5px] font-bold text-white hover:border-white/20 hover:bg-green-900">
            <LogOut className="size-[18px]" />Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[256px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-300 bg-[#064e3b] px-4 lg:hidden">
          <Dialog.Root>
            <Dialog.Trigger asChild><AdminButton variant="ghost" size="icon" className="text-white hover:bg-green-900 hover:text-white" aria-label="Abrir navegación"><Menu /></AdminButton></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/60" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(310px,88vw)] flex-col border-r border-green-950 bg-[#064e3b] p-5 shadow-2xl">
                <Dialog.Title className="sr-only">Navegación del administrador</Dialog.Title>
                <div className="flex h-12 items-center justify-between"><Brand /><Dialog.Close asChild><AdminButton variant="ghost" size="icon" className="text-white hover:bg-green-900 hover:text-white" aria-label="Cerrar navegación"><X /></AdminButton></Dialog.Close></div>
                <div className="mt-9 flex-1"><Navigation pathname={pathname} /><div className="my-5 border-t border-white/20" />{secondaryNavigation}</div>
                <button onClick={() => void logout()} className="flex h-11 items-center gap-3 border-t border-white/20 px-3 pt-4 text-[13.5px] font-bold text-white"><LogOut className="size-[18px]" />Cerrar sesión</button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Brand />
          <span className="text-[12px] font-bold text-white">Admin</span>
        </header>
        <main className="px-4 py-7 sm:px-6 lg:px-10 lg:py-9 xl:px-12">{children}</main>
      </div>
    </div>
  );
}

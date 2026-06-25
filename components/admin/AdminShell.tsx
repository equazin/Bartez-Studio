"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { BarChart3, BriefcaseBusiness, ExternalLink, FileText, LayoutDashboard, LogOut, Menu, MessageSquare, ScrollText, UserCheck, UsersRound, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminButton } from "./AdminUI";

const navigation = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, group: "main" },
  { href: "/admin/leads", label: "CRM", icon: UserCheck, group: "main" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "main" },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageSquare, group: "main" },
  { href: "/admin/posts", label: "Artículos", icon: FileText, group: "content" },
  { href: "/admin/clients", label: "Clientes", icon: UsersRound, group: "content" },
  { href: "/admin/cases", label: "Casos de éxito", icon: BriefcaseBusiness, group: "content" },
  { href: "/admin/audit", label: "Auditoría", icon: ScrollText, group: "system" },
];

function NavGroup({ label, items, pathname, close }: { label: string; items: typeof navigation; pathname: string; close?: () => void }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={close} className={cn(
              "flex h-10 items-center gap-3 rounded-lg border px-3 text-[13.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              active
                ? "border-brand/40 bg-brand/15 text-white"
                : "border-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
            )}>
              <item.icon className="size-[17px]" strokeWidth={1.8} />{item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Navigation({ pathname, close }: { pathname: string; close?: () => void }) {
  const main = navigation.filter((n) => n.group === "main");
  const content = navigation.filter((n) => n.group === "content");
  const system = navigation.filter((n) => n.group === "system");
  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-6">
      <NavGroup label="Operaciones" items={main} pathname={pathname} close={close} />
      <NavGroup label="Contenido" items={content} pathname={pathname} close={close} />
      <NavGroup label="Sistema" items={system} pathname={pathname} close={close} />
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="inline-flex items-center gap-2.5">
      <Image src="/brand/bartez-logo.png" alt="Bartez Tecnología" width={170} height={52} className="h-7 w-auto brightness-0 invert" priority />
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

  const secondaryNav = (
    <a href="/" target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-3 rounded-lg border border-transparent px-3 text-[13px] font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white">
      <ExternalLink className="size-[17px]" strokeWidth={1.8} />Ver sitio
    </a>
  );

  const userSection = (
    <div className="border-t border-white/10 pt-4">
      <div className="flex items-center gap-3 px-3">
        <span className="grid size-8 flex-none place-items-center rounded-full bg-brand/20 text-[12px] font-bold text-sky-300">
          {username.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">{username}</p>
          <p className="text-[10.5px] font-medium text-slate-500">Administrador</p>
        </div>
      </div>
      <button onClick={() => void logout()} className="mt-3 flex h-9 w-full items-center gap-3 rounded-lg border border-transparent px-3 text-[13px] font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white">
        <LogOut className="size-[16px]" />Cerrar sesión
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-white/[0.06] bg-[#070a16] p-4 lg:flex">
        <div className="flex h-12 items-center px-2"><Brand /></div>
        <div className="mt-7 flex-1 overflow-y-auto">
          <Navigation pathname={pathname} />
          <div className="mt-5">{secondaryNav}</div>
        </div>
        {userSection}
      </aside>

      <div className="min-w-0 lg:pl-[250px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#070a16] px-4 lg:hidden">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <AdminButton variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Abrir navegación"><Menu /></AdminButton>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(300px,85vw)] flex-col border-r border-white/[0.06] bg-[#070a16] p-4 shadow-2xl">
                <Dialog.Title className="sr-only">Navegación del administrador</Dialog.Title>
                <div className="flex h-12 items-center justify-between">
                  <Brand />
                  <Dialog.Close asChild><AdminButton variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Cerrar navegación"><X /></AdminButton></Dialog.Close>
                </div>
                <div className="mt-7 flex-1 overflow-y-auto">
                  <Navigation pathname={pathname} />
                  <div className="mt-5">{secondaryNav}</div>
                </div>
                {userSection}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Brand />
          <span className="rounded-md bg-brand/20 px-2 py-1 text-[11px] font-bold text-sky-300">Admin</span>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-8 xl:px-10">{children}</main>
      </div>
    </div>
  );
}

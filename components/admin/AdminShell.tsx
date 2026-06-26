"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  BarChart3, BookOpen, Boxes, Building2, BriefcaseBusiness, CalendarCheck,
  ChevronDown, ExternalLink, FileSpreadsheet, FileText, Hash, LayoutDashboard,
  LifeBuoy, LogOut, Menu, MessageSquare, Package, PackageOpen, Receipt,
  ScrollText, ShieldCheck, ShoppingCart, Tag, Target, Truck, UserCheck,
  UsersRound, Wallet, Warehouse, Wrench, X,
} from "lucide-react";
import { Copilot } from "./Copilot";
import { OnboardingTour } from "./OnboardingTour";
import { cn } from "../../lib/utils";
import { AdminToastProvider, LeadNotificationPoller } from "./AdminToast";

type NavItem = { href: string; label: string; icon: React.ElementType; group: string };

const navigation: NavItem[] = [
  { href: "/admin",                    label: "Inicio",              icon: LayoutDashboard,  group: "ops" },
  { href: "/admin/leads",              label: "Leads",               icon: UserCheck,        group: "ops" },
  { href: "/admin/accounts",           label: "Cuentas",             icon: Building2,        group: "ops" },
  { href: "/admin/opportunities",      label: "Oportunidades",       icon: Target,           group: "ops" },
  { href: "/admin/activities",         label: "Actividades",         icon: CalendarCheck,    group: "ops" },
  { href: "/admin/analytics",          label: "Analytics",           icon: BarChart3,        group: "ops" },
  { href: "/admin/conversations",      label: "WhatsApp",            icon: MessageSquare,    group: "ops" },
  { href: "/admin/quotes",             label: "Presupuestos",        icon: FileSpreadsheet,  group: "sales" },
  { href: "/admin/orders",             label: "Pedidos",             icon: ShoppingCart,     group: "sales" },
  { href: "/admin/delivery-notes",     label: "Remitos",             icon: Truck,            group: "sales" },
  { href: "/admin/products",           label: "Productos",           icon: Package,          group: "sales" },
  { href: "/admin/price-lists",        label: "Listas de precios",   icon: Tag,              group: "sales" },
  { href: "/admin/suppliers",          label: "Proveedores",         icon: Building2,        group: "purchases" },
  { href: "/admin/purchase-orders",    label: "Órdenes de compra",   icon: FileSpreadsheet,  group: "purchases" },
  { href: "/admin/goods-receipts",     label: "Recepciones",         icon: PackageOpen,      group: "purchases" },
  { href: "/admin/warehouses",         label: "Depósitos",           icon: Warehouse,        group: "inventory" },
  { href: "/admin/stock",              label: "Stock",               icon: Boxes,            group: "inventory" },
  { href: "/admin/stock-movements",    label: "Movimientos",         icon: PackageOpen,      group: "inventory" },
  { href: "/admin/invoices",           label: "Facturas",            icon: Receipt,          group: "finance" },
  { href: "/admin/receipts",           label: "Recibos",             icon: FileText,         group: "finance" },
  { href: "/admin/customer-accounts",  label: "Cta. Cte. Clientes",  icon: Wallet,           group: "finance" },
  { href: "/admin/supplier-accounts",  label: "Cta. Cte. Proveedores",icon: Wallet,          group: "finance" },
  { href: "/admin/cash-accounts",      label: "Caja y bancos",       icon: Building2,        group: "finance" },
  { href: "/admin/accounting-export",  label: "Export contable",     icon: FileSpreadsheet,  group: "finance" },
  { href: "/admin/tickets",            label: "Tickets",             icon: LifeBuoy,         group: "support" },
  { href: "/admin/work-orders",        label: "Órdenes de trabajo",  icon: Wrench,           group: "support" },
  { href: "/admin/serial-numbers",     label: "N° de serie",         icon: Hash,             group: "support" },
  { href: "/admin/warranty-terms",     label: "Garantías",           icon: ShieldCheck,      group: "support" },
  { href: "/admin/knowledge",          label: "Base de conocimiento",icon: BookOpen,         group: "support" },
  { href: "/admin/reports",            label: "Reportes",            icon: BarChart3,        group: "bi" },
  { href: "/admin/posts",              label: "Artículos",           icon: FileText,         group: "content" },
  { href: "/admin/clients",            label: "Clientes",            icon: UsersRound,       group: "content" },
  { href: "/admin/cases",              label: "Casos de éxito",      icon: BriefcaseBusiness,group: "content" },
  { href: "/admin/audit",              label: "Auditoría",           icon: ScrollText,       group: "system" },
];

const groups: { key: string; label: string }[] = [
  { key: "ops",       label: "Operaciones" },
  { key: "sales",     label: "Ventas" },
  { key: "purchases", label: "Compras" },
  { key: "inventory", label: "Inventario" },
  { key: "finance",   label: "Finanzas" },
  { key: "support",   label: "Postventa" },
  { key: "bi",        label: "BI" },
  { key: "content",   label: "Contenido" },
  { key: "system",    label: "Sistema" },
];

function DropdownMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-b-lg border border-white/10 bg-[#0d1120] py-1 shadow-xl">
      {items.map((item) => {
        const active = item.href === "/admin"
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors",
              active
                ? "bg-brand/20 text-white"
                : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
            )}
          >
            <item.icon className="size-[14px] flex-none" strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function TopNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter(key: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(key);
  }

  function leave() {
    timeoutRef.current = setTimeout(() => setOpen(null), 120);
  }

  return (
    <nav className="flex items-center gap-0.5" aria-label="Navegación principal">
      {groups.map(({ key, label }) => {
        const items = navigation.filter((n) => n.group === key);
        const isGroupActive = items.some((item) =>
          item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
        );
        return (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => enter(key)}
            onMouseLeave={leave}
          >
            <button
              className={cn(
                "flex h-9 items-center gap-1 rounded-md px-3 text-[13px] font-semibold transition-colors",
                isGroupActive || open === key
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
              )}
            >
              {label}
              <ChevronDown
                className={cn("size-3.5 transition-transform", open === key ? "rotate-180" : "")}
                strokeWidth={2}
              />
            </button>
            {open === key && <DropdownMenu items={items} pathname={pathname} />}
          </div>
        );
      })}
    </nav>
  );
}

/* Mobile flat navigation used inside the drawer */
function MobileNav({ pathname, close }: { pathname: string; close: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
      {groups.map(({ key, label }) => {
        const items = navigation.filter((n) => n.group === key);
        const isOpen = openGroup === key;
        return (
          <div key={key}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : key)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-bold text-slate-300 uppercase tracking-wide hover:bg-white/[0.06] hover:text-white"
            >
              {label}
              <ChevronDown className={cn("size-3.5 transition-transform", isOpen ? "rotate-180" : "")} strokeWidth={2} />
            </button>
            {isOpen && (
              <div className="mb-2 flex flex-col gap-0.5 pl-3">
                {items.map((item) => {
                  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-brand/20 text-white"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      <item.icon className="size-[15px] flex-none" strokeWidth={1.8} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="inline-flex items-center gap-2 flex-none">
      <Image src="/brand/bartez-logo.png" alt="Bartez Tecnología" width={170} height={52} className="h-7 w-auto" priority />
    </Link>
  );
}

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center border-b border-white/[0.07] bg-[#070a16]">
        <div className="flex h-full w-full items-center gap-4 px-4">
          {/* Logo */}
          <Brand />

          {/* Separator */}
          <div className="hidden h-5 w-px bg-white/10 lg:block" />

          {/* Desktop nav */}
          <div className="hidden flex-1 lg:block">
            <TopNav pathname={pathname} />
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <Copilot />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-semibold text-slate-400 hover:bg-white/[0.07] hover:text-white sm:flex"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.8} />
              Ver sitio
            </a>

            {/* User chip */}
            <div className="flex items-center gap-2 rounded-md px-2 py-1">
              <span className="grid size-6 flex-none place-items-center rounded-full bg-brand/20 text-[11px] font-bold text-sky-300">
                {username.charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-[12px] font-semibold text-slate-300 sm:block">{username}</span>
            </div>

            <button
              onClick={() => void logout()}
              title="Cerrar sesión"
              className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[12px] font-semibold text-slate-400 hover:bg-white/[0.07] hover:text-white"
            >
              <LogOut className="size-3.5" strokeWidth={1.8} />
              <span className="hidden sm:inline">Salir</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(300px,85vw)] flex-col border-r border-white/[0.06] bg-[#070a16] p-4 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between pb-4">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MobileNav pathname={pathname} close={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="grid size-7 flex-none place-items-center rounded-full bg-brand/20 text-[11px] font-bold text-sky-300">
                  {username.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-white">{username}</p>
                  <p className="text-[10.5px] font-medium text-slate-500">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => void logout()}
                className="mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <LogOut className="size-4" />Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <main className="pt-12">
        <div className="px-4 py-7 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          {children}
        </div>
      </main>

      <OnboardingTour pathname={pathname} />
      <AdminToastProvider />
      <LeadNotificationPoller />
    </div>
  );
}

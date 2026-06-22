"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Briefcase, 
  LogOut, 
  ExternalLink 
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Artículos", icon: FileText },
    { href: "/admin/clients", label: "Logos Clientes", icon: ImageIcon },
    { href: "/admin/cases", label: "Casos de Éxito", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-[#050F0A] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A2215] border-r border-white/5 flex flex-col">
        {/* Sidebar brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/admin" className="font-display text-[16.5px] font-bold text-white tracking-wide">
            BARTEZ <span className="text-bronce">ADMIN</span>
          </Link>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                  isActive
                    ? "bg-accent/15 text-sky border-l-2 border-accent"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> Ver sitio web
            </span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[14px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar header */}
        <header className="h-16 border-b border-white/5 bg-[#071E12] flex items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-[13.5px] font-medium text-slate-400">
              Sesión activa
            </span>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-5xl animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

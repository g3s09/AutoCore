"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CarFront,
  ClipboardList,
  Gauge,
  Menu,
  PackageSearch,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/vehiculos", label: "Vehiculos", icon: CarFront },
  { href: "/ordenes", label: "Ordenes", icon: ClipboardList },
  { href: "/diagnosticos", label: "Diagnosticos", icon: Stethoscope },
  { href: "/inventario", label: "Inventario", icon: PackageSearch },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/usuarios", label: "Usuarios", icon: ShieldCheck },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavigationLink({
  item,
  active,
  onNavigate,
}: {
  item: NavigationItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cx(
        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
        active
          ? "bg-white text-[#080b10] shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
          : "text-[#9aa4b5] hover:bg-white/[0.06] hover:text-[#eef2f7]",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/[0.08] bg-[#090c11]/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-5">
        <div className="flex size-9 items-center justify-center rounded-md border border-white/[0.12] bg-white text-[#080b10]">
          <Wrench className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-5 text-[#f8fafc]">
            AutoCore
          </p>
          <p className="text-xs text-[#8b95a7]">Workspace inicial</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavigationLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <div className="rounded-md border border-white/[0.08] bg-white/[0.04] p-3">
          <p className="text-sm font-medium text-[#eef2f7]">Estado inicial</p>
          <p className="mt-1 text-xs leading-5 text-[#8b95a7]">
            0 usuarios activos - API base preparada
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090d] text-[#eef2f7]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar navegacion"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[min(21rem,86vw)] shadow-2xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.08] bg-[#07090d]/82 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            aria-label="Abrir navegacion"
            className="flex size-9 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.04] text-[#eef2f7] lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-[#8b95a7] md:flex">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <input
              className="h-9 w-full bg-transparent text-sm text-[#eef2f7] outline-none placeholder:text-[#667085]"
              placeholder="Buscar orden, cliente o vehiculo"
              aria-label="Buscar"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notificaciones"
              className="flex size-9 items-center justify-center rounded-md border border-white/[0.10] bg-white/[0.04] text-[#eef2f7] transition hover:bg-white/[0.08]"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <Link
              href="/ordenes"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-[#080b10] transition hover:bg-[#dbe4ee]"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nueva orden</span>
            </Link>
            <button
              type="button"
              aria-label="Cerrar menu movil"
              className={cx(
                "hidden size-9 items-center justify-center rounded-md border border-white/[0.10] bg-white/[0.04] text-[#eef2f7]",
                mobileOpen && "flex",
              )}
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

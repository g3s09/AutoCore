import {
  Activity,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  PackageMinus,
} from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { serviceColumns, workshopStats } from "../../_data/autocore";

export const metadata = {
  title: "Dashboard",
};

const statIcons = [
  <Activity key="orders" className="size-4" aria-hidden="true" />,
  <CalendarCheck key="appointments" className="size-4" aria-hidden="true" />,
  <PackageMinus key="inventory" className="size-4" aria-hidden="true" />,
  <CircleDollarSign key="income" className="size-4" aria-hidden="true" />,
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operacion"
        title="Dashboard del taller"
        description="Panel inicial en cero, listo para recibir datos reales desde el backend local de AutoCore."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workshopStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.detail}
            tone={stat.tone}
            icon={statIcons[index]}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Ordenes recientes
            </h2>
            <StatusPill label="0 registros" tone="neutral" />
          </div>
          <div className="p-4">
            <EmptyState
              icon={<ClipboardList className="size-4" aria-hidden="true" />}
              title="Sin ordenes registradas"
              description="Cuando cierres una orden, aqui aparecera su avance, subtotal, impuestos y total final."
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Agenda de hoy
            </h2>
            <div className="mt-4">
              <EmptyState
                icon={<CalendarCheck className="size-4" aria-hidden="true" />}
                title="Sin citas para hoy"
                description="La agenda queda preparada para reservar horarios y evitar cruces."
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Inventario critico
            </h2>
            <div className="mt-4">
              <EmptyState
                icon={<PackageMinus className="size-4" aria-hidden="true" />}
                title="Sin alertas"
                description="Las piezas bajo minimo apareceran despues de registrar inventario."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {serviceColumns.map((column) => (
          <div
            key={column.title}
            className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#eef2f7]">
                {column.title}
              </h2>
              <StatusPill label={column.count} tone={column.tone} />
            </div>
            <div className="mt-4 rounded-md border border-dashed border-white/[0.12] bg-white/[0.025] px-3 py-6 text-center text-sm text-[#8b95a7]">
              Sin ordenes
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

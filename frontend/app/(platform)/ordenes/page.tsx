import { ClipboardPlus, TimerReset, Wrench } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { recentOrders, serviceColumns } from "../../_data/autocore";

export const metadata = {
  title: "Ordenes",
};

export default function OrdenesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Produccion"
        title="Ordenes de servicio"
        description="Control del ciclo completo de trabajo: recepcion, diagnostico, autorizacion, reparacion, control de calidad y entrega."
        action={{
          label: "Nueva orden",
          href: "/ordenes",
          icon: <ClipboardPlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Tiempo promedio"
          value="2.8 dias"
          detail="Desde recepcion hasta entrega"
          tone="blue"
          icon={<TimerReset className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Ordenes abiertas"
          value="18"
          detail="6 en reparacion"
          tone="amber"
          icon={<Wrench className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Autorizacion pendiente"
          value="4"
          detail="Esperando aprobacion"
          tone="rose"
          icon={<ClipboardPlus className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-4">
        {serviceColumns.map((column) => (
          <div
            key={column.title}
            className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#15171c]">
                {column.title}
              </h2>
              <StatusPill label={column.count} tone={column.tone} />
            </div>
            <div className="mt-4 space-y-3">
              {recentOrders.slice(0, 3).map((order) => (
                <article
                  key={`${column.title}-${order.code}`}
                  className="rounded-md border border-black/[0.06] bg-[#f6f7f9] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-[#687083]">
                      {order.code}
                    </p>
                    <StatusPill label={order.status} tone={order.tone} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#15171c]">
                    {order.vehicle}
                  </p>
                  <p className="mt-1 text-xs text-[#687083]">
                    {order.service}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

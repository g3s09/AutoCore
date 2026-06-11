import { Calculator, ClipboardPlus, ReceiptText, TimerReset, Wrench } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { serviceColumns } from "../../_data/autocore";

export const metadata = {
  title: "Ordenes",
};

export default function OrdenesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Produccion"
        title="Ordenes de servicio"
        description="Flujo preparado para capturar trabajos, calcular subtotal, IVA, total final, descontar inventario y generar ticket."
        action={{
          label: "Nueva orden",
          href: "/ordenes",
          icon: <ClipboardPlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Ordenes abiertas"
          value="0"
          detail="Sin trabajos activos"
          tone="amber"
          icon={<Wrench className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Autorizacion pendiente"
          value="0"
          detail="Sin cotizaciones"
          tone="rose"
          icon={<ClipboardPlus className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Tiempo promedio"
          value="0 dias"
          detail="Sin historial cerrado"
          tone="blue"
          icon={<TimerReset className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Captura de orden
          </h2>
          <div className="mt-4 grid gap-3">
            {["Cliente", "Vehiculo", "Servicio solicitado"].map((label) => (
              <label key={label} className="grid gap-2 text-sm">
                <span className="text-[#8b95a7]">{label}</span>
                <input className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40" />
              </label>
            ))}
            <label className="grid gap-2 text-sm">
              <span className="text-[#8b95a7]">Notas de recepcion</span>
              <textarea className="min-h-24 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-[#eef2f7] outline-none focus:border-sky-300/40" />
            </label>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10]"
          >
            Abrir orden
          </button>
        </form>

        <div className="grid gap-4">
          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2">
              <Calculator className="size-4 text-[#7dd3fc]" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-[#eef2f7]">
                Calculo final
              </h2>
            </div>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              {[
                ["Subtotal", "$0"],
                ["IVA", "$0"],
                ["Total", "$0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-white/[0.08] bg-white/[0.035] p-3"
                >
                  <dt className="text-[#8b95a7]">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-[#eef2f7]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-4 text-[#7dd3fc]" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-[#eef2f7]">
                Ticket
              </h2>
            </div>
            <div className="mt-4">
              <EmptyState
                icon={<ReceiptText className="size-4" aria-hidden="true" />}
                title="Sin ticket generado"
                description="El backend ya quedara preparado para emitir tickets de orden cerrada."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-4">
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

import { BarChart3, Download, TrendingUp } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { reportMetrics } from "../../_data/autocore";

export const metadata = {
  title: "Reportes",
};

const revenueBars = [
  { label: "Ene", value: 0 },
  { label: "Feb", value: 0 },
  { label: "Mar", value: 0 },
  { label: "Abr", value: 0 },
  { label: "May", value: 0 },
  { label: "Jun", value: 0 },
];

export default function ReportesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Inteligencia del negocio"
        title="Reportes"
        description="Indicadores en cero listos para calcular ventas, ticket promedio, impuestos, ordenes cerradas y retencion."
        action={{
          label: "Exportar",
          href: "/reportes",
          icon: <Download className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportMetrics.map((metric, index) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.change}
            tone={index === 0 ? "green" : index === 1 ? "blue" : "neutral"}
            icon={<TrendingUp className="size-4" aria-hidden="true" />}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Ingresos por mes
            </h2>
            <BarChart3 className="size-4 text-[#8b95a7]" aria-hidden="true" />
          </div>
          <div className="mt-6 flex h-64 items-end gap-3">
            {revenueBars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-white/[0.08]"
                  style={{ height: `${Math.max(bar.value, 4)}%` }}
                />
                <span className="mt-2 text-xs font-medium text-[#8b95a7]">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Indicadores operativos
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<TrendingUp className="size-4" aria-hidden="true" />}
              title="Sin datos para reportar"
              description="Los reportes se alimentaran de ordenes cerradas, tickets generados y movimientos de inventario."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

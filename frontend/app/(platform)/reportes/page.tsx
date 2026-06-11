import { BarChart3, Download, TrendingUp } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { reportMetrics } from "../../_data/autocore";

export const metadata = {
  title: "Reportes",
};

const revenueBars = [
  { label: "Ene", value: 54 },
  { label: "Feb", value: 62 },
  { label: "Mar", value: 71 },
  { label: "Abr", value: 68 },
  { label: "May", value: 79 },
  { label: "Jun", value: 88 },
];

export default function ReportesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Inteligencia del negocio"
        title="Reportes"
        description="Indicadores financieros y operativos para entender ingresos, productividad, retencion, ordenes cerradas y uso del taller."
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
        <div className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#15171c]">
              Ingresos por mes
            </h2>
            <BarChart3 className="size-4 text-[#687083]" aria-hidden="true" />
          </div>
          <div className="mt-6 flex h-64 items-end gap-3">
            {revenueBars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-[#111827]"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="mt-2 text-xs font-medium text-[#687083]">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#15171c]">
            Indicadores operativos
          </h2>
          <div className="mt-5 space-y-4">
            {[
              ["Productividad tecnica", "81%"],
              ["Ordenes a tiempo", "89%"],
              ["Cotizaciones aprobadas", "63%"],
              ["Reingresos", "4%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#15171c]">{label}</span>
                  <span className="text-[#687083]">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#edf0f3]">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { BrainCircuit, ClipboardCheck, ScanLine } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

export const metadata = {
  title: "Diagnosticos",
};

export default function DiagnosticosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Analisis tecnico"
        title="Diagnosticos"
        description="Captura estructurada para sintomas, pruebas, hallazgos, prioridad, evidencia y recomendaciones tecnicas."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Diagnosticos abiertos"
          value="0"
          detail="Sin revision activa"
          tone="amber"
          icon={<ScanLine className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Checklist completados"
          value="0%"
          detail="Sin inspecciones"
          tone="green"
          icon={<ClipboardCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Base IA"
          value="0 casos"
          detail="Lista para historial futuro"
          tone="blue"
          icon={<BrainCircuit className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Captura de diagnostico
          </h2>
          <div className="mt-4 grid gap-3">
            {["Orden", "Sintoma reportado", "Prioridad"].map((label) => (
              <label key={label} className="grid gap-2 text-sm">
                <span className="text-[#8b95a7]">{label}</span>
                <input className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40" />
              </label>
            ))}
            <label className="grid gap-2 text-sm">
              <span className="text-[#8b95a7]">Hallazgo tecnico</span>
              <textarea className="min-h-24 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-[#eef2f7] outline-none focus:border-sky-300/40" />
            </label>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10]"
          >
            Guardar diagnostico
          </button>
        </form>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Historial tecnico
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<ScanLine className="size-4" aria-hidden="true" />}
              title="Sin diagnosticos"
              description="Los diagnosticos guardados alimentaran el historial del vehiculo y futuras recomendaciones."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

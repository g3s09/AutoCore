import { BrainCircuit, ClipboardCheck, ScanLine } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { diagnostics } from "../../_data/autocore";

export const metadata = {
  title: "Diagnosticos",
};

export default function DiagnosticosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Analisis tecnico"
        title="Diagnosticos"
        description="Registro estructurado de sintomas, inspecciones, hallazgos, codigos, evidencia y recomendaciones tecnicas."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Diagnosticos abiertos"
          value="9"
          detail="3 con prioridad alta"
          tone="amber"
          icon={<ScanLine className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Checklist completados"
          value="86%"
          detail="Ultimos 30 dias"
          tone="green"
          icon={<ClipboardCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="IA futura"
          value="Preparado"
          detail="Datos listos para entrenar modelos"
          tone="blue"
          icon={<BrainCircuit className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {diagnostics.map((diagnostic) => (
          <article
            key={diagnostic.code}
            className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-[#687083]">
                  {diagnostic.code}
                </p>
                <h2 className="mt-2 text-base font-semibold text-[#15171c]">
                  {diagnostic.vehicle}
                </h2>
              </div>
              <StatusPill
                label={`Prioridad ${diagnostic.priority}`}
                tone={diagnostic.tone}
              />
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#687083]">
                  Sintoma
                </p>
                <p className="mt-1 text-sm leading-6 text-[#15171c]">
                  {diagnostic.symptom}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#687083]">
                  Hallazgo
                </p>
                <p className="mt-1 text-sm leading-6 text-[#15171c]">
                  {diagnostic.finding}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#15171c]">
          Base tecnica inicial
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["OBD-II", "Prueba ruta", "Inspeccion visual", "Evidencia"].map(
            (item) => (
              <div
                key={item}
                className="rounded-md border border-black/[0.06] bg-[#f6f7f9] px-3 py-3 text-sm font-medium text-[#15171c]"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

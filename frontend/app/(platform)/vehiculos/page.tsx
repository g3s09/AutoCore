import { Car, GaugeCircle, Plus, ShieldCheck } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

export const metadata = {
  title: "Vehiculos",
};

export default function VehiculosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Flota y unidades"
        title="Vehiculos"
        description="Base lista para registrar placas, VIN, kilometraje, propietario e historial tecnico."
        action={{
          label: "Registrar vehiculo",
          href: "/vehiculos",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Vehiculos activos"
          value="0"
          detail="Sin unidades registradas"
          tone="blue"
          icon={<Car className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Kilometraje promedio"
          value="0 km"
          detail="Esperando lecturas"
          tone="neutral"
          icon={<GaugeCircle className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Con historial completo"
          value="0%"
          detail="Sin servicios asociados"
          tone="green"
          icon={<ShieldCheck className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Alta de vehiculo
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Placa", "Marca y modelo", "VIN", "Kilometraje"].map((label) => (
              <label key={label} className="grid gap-2 text-sm">
                <span className="text-[#8b95a7]">{label}</span>
                <input className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40" />
              </label>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10]"
          >
            Guardar vehiculo
          </button>
        </form>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Unidades registradas
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<Car className="size-4" aria-hidden="true" />}
              title="Sin vehiculos"
              description="Cuando registres una unidad podras asociarla a citas, diagnosticos y ordenes."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

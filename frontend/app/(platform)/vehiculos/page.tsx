import { Car, GaugeCircle, Plus, ShieldCheck } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { vehicles } from "../../_data/autocore";

export const metadata = {
  title: "Vehiculos",
};

export default function VehiculosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Flota y unidades"
        title="Vehiculos"
        description="Registro tecnico para consultar placas, kilometraje, propietarios, VIN, estado de servicio e historial por unidad."
        action={{
          label: "Registrar vehiculo",
          href: "/vehiculos",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Vehiculos activos"
          value="391"
          detail="Incluye flotillas"
          tone="blue"
          icon={<Car className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Kilometraje promedio"
          value="67,820"
          detail="Base registrada"
          tone="neutral"
          icon={<GaugeCircle className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Con historial completo"
          value="82%"
          detail="Servicios documentados"
          tone="green"
          icon={<ShieldCheck className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle) => (
          <article
            key={vehicle.vin}
            className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-[#687083]">
                  {vehicle.plate}
                </p>
                <h2 className="mt-2 text-base font-semibold text-[#15171c]">
                  {vehicle.model}
                </h2>
              </div>
              <StatusPill label={vehicle.status} tone={vehicle.tone} />
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[#687083]">
                  Propietario
                </dt>
                <dd className="mt-1 text-[#15171c]">{vehicle.owner}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[#687083]">
                  Kilometraje
                </dt>
                <dd className="mt-1 text-[#15171c]">{vehicle.mileage}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[#687083]">
                  VIN
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-[#15171c]">
                  {vehicle.vin}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

import { CalendarClock, Clock3, Plus, UserRoundCheck } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { weeklyAppointments } from "../../_data/autocore";

export const metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Planeacion"
        title="Agenda de citas"
        description="Modulo preparado para reservar horarios, validar cruces y convertir citas en ordenes de servicio."
        action={{
          label: "Nueva cita",
          href: "/agenda",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Citas hoy"
          value="0"
          detail="Sin reservas"
          tone="blue"
          icon={<CalendarClock className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Ocupacion"
          value="0%"
          detail="Capacidad libre"
          tone="green"
          icon={<UserRoundCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Retrasos"
          value="0"
          detail="Sin reprogramaciones"
          tone="amber"
          icon={<Clock3 className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Programar cita
          </h2>
          <div className="mt-4 grid gap-3">
            {["Cliente", "Vehiculo", "Fecha", "Hora", "Motivo"].map((label) => (
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
            Agendar cita
          </button>
        </form>

        <div className="grid gap-6">
          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Semana operativa
            </h2>
            <div className="mt-5 space-y-4">
              {weeklyAppointments.map((day) => {
                const width = `${Math.round((day.booked / day.total) * 100)}%`;
                return (
                  <div key={day.day}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#eef2f7]">
                        {day.day}
                      </span>
                      <span className="text-[#8b95a7]">
                        {day.booked}/{day.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.08]">
                      <div
                        className="h-2 rounded-full bg-sky-300"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <h2 className="text-sm font-semibold text-[#eef2f7]">
              Proximas citas
            </h2>
            <div className="mt-4">
              <EmptyState
                icon={<CalendarClock className="size-4" aria-hidden="true" />}
                title="Sin citas agendadas"
                description="Las citas guardadas apareceran aqui con su hora, cliente, vehiculo y motivo."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { CalendarClock, Clock3, Plus, UserRoundCheck } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { appointmentsToday, weeklyAppointments } from "../../_data/autocore";

export const metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Planeacion"
        title="Agenda de citas"
        description="Calendario operativo para recepcion, diagnosticos, entregas, cargas de trabajo y disponibilidad del equipo tecnico."
        action={{
          label: "Nueva cita",
          href: "/agenda",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Citas hoy"
          value="11"
          detail="9 confirmadas"
          tone="blue"
          icon={<CalendarClock className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Ocupacion"
          value="78%"
          detail="Capacidad tecnica"
          tone="green"
          icon={<UserRoundCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Retrasos"
          value="2"
          detail="Ordenes reprogramadas"
          tone="amber"
          icon={<Clock3 className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#15171c]">
            Semana operativa
          </h2>
          <div className="mt-5 space-y-4">
            {weeklyAppointments.map((day) => {
              const width = `${Math.round((day.booked / day.total) * 100)}%`;
              return (
                <div key={day.day}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#15171c]">
                      {day.day}
                    </span>
                    <span className="text-[#687083]">
                      {day.booked}/{day.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#edf0f3]">
                    <div
                      className="h-2 rounded-full bg-[#111827]"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.06] bg-white shadow-sm">
          <div className="border-b border-black/[0.06] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#15171c]">
              Proximas citas
            </h2>
          </div>
          <div className="divide-y divide-black/[0.06]">
            {appointmentsToday.map((item) => (
              <div
                key={`${item.time}-${item.customer}`}
                className="grid gap-3 px-4 py-4 md:grid-cols-[72px_1fr_auto] md:items-center"
              >
                <div className="rounded-md bg-[#f6f7f9] px-3 py-2 text-center text-sm font-semibold text-[#15171c]">
                  {item.time}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#15171c]">
                    {item.customer}
                  </p>
                  <p className="mt-1 text-xs text-[#687083]">
                    {item.vehicle}
                  </p>
                </div>
                <p className="text-sm text-[#687083]">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

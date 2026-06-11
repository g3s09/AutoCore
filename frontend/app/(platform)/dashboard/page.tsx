import {
  Activity,
  CalendarCheck,
  CircleDollarSign,
  PackageMinus,
} from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import {
  appointmentsToday,
  inventoryAlerts,
  recentOrders,
  serviceColumns,
  workshopStats,
} from "../../_data/autocore";

export const metadata = {
  title: "Dashboard",
};

const statIcons = [
  <Activity key="orders" className="size-4" aria-hidden="true" />,
  <CalendarCheck key="appointments" className="size-4" aria-hidden="true" />,
  <PackageMinus key="inventory" className="size-4" aria-hidden="true" />,
  <CircleDollarSign key="income" className="size-4" aria-hidden="true" />,
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operacion"
        title="Dashboard del taller"
        description="Vista ejecutiva de ordenes, citas, inventario y flujo operativo para tomar decisiones rapidas durante el dia."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workshopStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.detail}
            tone={stat.tone}
            icon={statIcons[index]}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-black/[0.06] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#15171c]">
              Ordenes recientes
            </h2>
            <span className="text-xs font-medium text-[#687083]">
              Actualizado hoy
            </span>
          </div>
          <div className="divide-y divide-black/[0.06]">
            {recentOrders.map((order) => (
              <div
                key={order.code}
                className="grid gap-3 px-4 py-4 md:grid-cols-[0.8fr_1.1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-mono text-xs text-[#687083]">
                    {order.code}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#15171c]">
                    {order.customer}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#15171c]">{order.vehicle}</p>
                  <p className="mt-1 text-xs text-[#687083]">
                    {order.service}
                  </p>
                </div>
                <StatusPill label={order.status} tone={order.tone} />
                <p className="text-sm font-semibold text-[#15171c]">
                  {order.total}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#15171c]">
              Agenda de hoy
            </h2>
            <div className="mt-4 space-y-4">
              {appointmentsToday.map((item) => (
                <div key={`${item.time}-${item.customer}`} className="flex gap-3">
                  <div className="w-14 shrink-0 rounded-md bg-[#f6f7f9] px-2 py-1 text-center text-xs font-semibold text-[#15171c]">
                    {item.time}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#15171c]">
                      {item.customer}
                    </p>
                    <p className="mt-1 text-xs text-[#687083]">
                      {item.vehicle} - {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-black/[0.06] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#15171c]">
              Inventario critico
            </h2>
            <div className="mt-4 space-y-3">
              {inventoryAlerts.map((item) => (
                <div
                  key={item.part}
                  className="flex items-center justify-between gap-3"
                >
                  <p className="text-sm text-[#15171c]">{item.part}</p>
                  <p className="text-xs font-medium text-amber-700">
                    {item.stock}/{item.minimum}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              <div className="mt-4 space-y-2">
                {column.orders.map((order) => (
                  <div
                    key={order}
                    className="rounded-md border border-black/[0.06] bg-[#f6f7f9] px-3 py-2 text-sm text-[#15171c]"
                  >
                    {order}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

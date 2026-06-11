import { Plus, UserRoundCheck, UsersRound, WalletCards } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { customers } from "../../_data/autocore";

export const metadata = {
  title: "Clientes",
};

export default function ClientesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="CRM del taller"
        title="Clientes"
        description="Directorio operativo para administrar datos de contacto, historial, vehiculos asociados y seguimiento comercial."
        action={{
          label: "Nuevo cliente",
          href: "/clientes",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Clientes registrados"
          value="284"
          detail="19 nuevos este mes"
          tone="blue"
          icon={<UsersRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Clientes recurrentes"
          value="74%"
          detail="Visitaron mas de una vez"
          tone="green"
          icon={<UserRoundCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Cuentas por cobrar"
          value="$38,900"
          detail="5 clientes con saldo"
          tone="amber"
          icon={<WalletCards className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-sm">
        <div className="border-b border-black/[0.06] px-4 py-3">
          <h2 className="text-sm font-semibold text-[#15171c]">
            Directorio principal
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f6f7f9] text-xs uppercase tracking-[0.12em] text-[#687083]">
              <tr>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Vehiculos</th>
                <th className="px-4 py-3 font-semibold">Ultima visita</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {customers.map((customer) => (
                <tr key={customer.email}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#15171c]">{customer.name}</p>
                    <p className="mt-1 text-xs text-[#687083]">
                      {customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-[#687083]">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-4 text-[#15171c]">
                    {customer.vehicles}
                  </td>
                  <td className="px-4 py-4 text-[#687083]">
                    {customer.lastVisit}
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill label={customer.status} tone={customer.tone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

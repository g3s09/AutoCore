import { Plus, UserRoundCheck, UsersRound, WalletCards } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

export const metadata = {
  title: "Clientes",
};

export default function ClientesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="CRM del taller"
        title="Clientes"
        description="Registro inicial para guardar clientes, contacto, saldos e historial cuando el backend empiece a recibir datos."
        action={{
          label: "Nuevo cliente",
          href: "/clientes",
          icon: <Plus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Clientes registrados"
          value="0"
          detail="Base lista para almacenar"
          tone="blue"
          icon={<UsersRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Clientes recurrentes"
          value="0%"
          detail="Sin historial todavia"
          tone="green"
          icon={<UserRoundCheck className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Cuentas por cobrar"
          value="$0"
          detail="Sin saldos pendientes"
          tone="amber"
          icon={<WalletCards className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Alta de cliente
          </h2>
          <div className="mt-4 grid gap-3">
            {["Nombre completo", "Telefono", "Correo", "RFC opcional"].map(
              (label) => (
                <label key={label} className="grid gap-2 text-sm">
                  <span className="text-[#8b95a7]">{label}</span>
                  <input className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none placeholder:text-[#667085] focus:border-sky-300/40" />
                </label>
              ),
            )}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10]"
          >
            Guardar cliente
          </button>
        </form>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Directorio principal
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<UsersRound className="size-4" aria-hidden="true" />}
              title="Aun no hay clientes"
              description="El primer registro quedara disponible para asociar vehiculos, citas y ordenes de servicio."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

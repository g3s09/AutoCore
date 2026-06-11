import { KeyRound, ShieldPlus, UsersRound } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

export const metadata = {
  title: "Usuarios",
};

export default function UsuariosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Seguridad"
        title="Usuarios y roles"
        description="Base preparada para perfiles, permisos por modulo y separacion de responsabilidades del equipo."
        action={{
          label: "Invitar usuario",
          href: "/usuarios",
          icon: <ShieldPlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Usuarios activos"
          value="0"
          detail="Sin cuentas creadas"
          tone="green"
          icon={<UsersRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Roles configurados"
          value="0"
          detail="Pendiente de permisos"
          tone="amber"
          icon={<KeyRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Invitaciones"
          value="0"
          detail="Sin invitaciones"
          tone="blue"
          icon={<ShieldPlus className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Alta de usuario
          </h2>
          <div className="mt-4 grid gap-3">
            {["Nombre", "Correo", "Rol"].map((label) => (
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
            Guardar usuario
          </button>
        </form>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Equipo del taller
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<UsersRound className="size-4" aria-hidden="true" />}
              title="Sin usuarios"
              description="Los usuarios registrados podran operar modulos segun su rol."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

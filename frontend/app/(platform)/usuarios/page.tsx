import { KeyRound, ShieldPlus, UsersRound } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { users } from "../../_data/autocore";

export const metadata = {
  title: "Usuarios",
};

export default function UsuariosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Seguridad"
        title="Usuarios y roles"
        description="Administracion de accesos, perfiles operativos, permisos por modulo y control basico para equipos de taller."
        action={{
          label: "Invitar usuario",
          href: "/usuarios",
          icon: <ShieldPlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Usuarios activos"
          value="8"
          detail="4 roles configurados"
          tone="green"
          icon={<UsersRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Permisos sensibles"
          value="3"
          detail="Inventario, reportes, usuarios"
          tone="amber"
          icon={<KeyRound className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Invitaciones"
          value="1"
          detail="Pendiente de aceptar"
          tone="blue"
          icon={<ShieldPlus className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-sm">
        <div className="border-b border-black/[0.06] px-4 py-3">
          <h2 className="text-sm font-semibold text-[#15171c]">
            Equipo del taller
          </h2>
        </div>
        <div className="divide-y divide-black/[0.06]">
          {users.map((user) => (
            <div
              key={user.email}
              className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_220px_160px] md:items-center"
            >
              <div>
                <p className="text-sm font-medium text-[#15171c]">
                  {user.name}
                </p>
                <p className="mt-1 text-xs text-[#687083]">{user.email}</p>
              </div>
              <p className="text-sm text-[#687083]">{user.role}</p>
              <StatusPill label={user.status} tone={user.tone} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

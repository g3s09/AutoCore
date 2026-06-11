import { Boxes, PackagePlus, TriangleAlert } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

export const metadata = {
  title: "Inventario",
};

export default function InventarioPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Almacen"
        title="Inventario"
        description="Control inicial para registrar piezas, existencias, minimos, costos y descuentos automaticos al cerrar ordenes."
        action={{
          label: "Agregar pieza",
          href: "/inventario",
          icon: <PackagePlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="SKU registrados"
          value="0"
          detail="Sin refacciones"
          tone="blue"
          icon={<Boxes className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Bajo minimo"
          value="0"
          detail="Sin alertas"
          tone="amber"
          icon={<TriangleAlert className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Valor almacen"
          value="$0"
          detail="Esperando entradas"
          tone="green"
          icon={<Boxes className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Alta de pieza
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["SKU", "Nombre", "Stock inicial", "Stock minimo", "Costo", "Precio"].map(
              (label) => (
                <label key={label} className="grid gap-2 text-sm">
                  <span className="text-[#8b95a7]">{label}</span>
                  <input className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40" />
                </label>
              ),
            )}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10]"
          >
            Guardar pieza
          </button>
        </form>

        <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
          <h2 className="text-sm font-semibold text-[#eef2f7]">
            Existencias
          </h2>
          <div className="mt-4">
            <EmptyState
              icon={<Boxes className="size-4" aria-hidden="true" />}
              title="Sin inventario"
              description="Las piezas registradas quedaran disponibles para ordenes y calculo de tickets."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

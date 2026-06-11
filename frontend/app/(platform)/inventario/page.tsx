import { Boxes, PackagePlus, TriangleAlert } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { StatusPill } from "../../_components/status-pill";
import { inventoryItems } from "../../_data/autocore";

export const metadata = {
  title: "Inventario",
};

export default function InventarioPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Almacen"
        title="Inventario"
        description="Control de refacciones, consumibles, existencias minimas, categorias, alertas y disponibilidad para ordenes de servicio."
        action={{
          label: "Agregar pieza",
          href: "/inventario",
          icon: <PackagePlus className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="SKU registrados"
          value="1,248"
          detail="Refacciones y consumibles"
          tone="blue"
          icon={<Boxes className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Bajo minimo"
          value="7"
          detail="Requieren reposicion"
          tone="amber"
          icon={<TriangleAlert className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Valor almacen"
          value="$426,900"
          detail="Costo estimado actual"
          tone="green"
          icon={<Boxes className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-sm">
        <div className="border-b border-black/[0.06] px-4 py-3">
          <h2 className="text-sm font-semibold text-[#15171c]">
            Existencias principales
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f6f7f9] text-xs uppercase tracking-[0.12em] text-[#687083]">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Minimo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {inventoryItems.map((item) => (
                <tr key={item.sku}>
                  <td className="px-4 py-4 font-mono text-xs text-[#687083]">
                    {item.sku}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#15171c]">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-[#687083]">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-[#15171c]">{item.stock}</td>
                  <td className="px-4 py-4 text-[#687083]">{item.minimum}</td>
                  <td className="px-4 py-4">
                    <StatusPill label={item.status} tone={item.tone} />
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

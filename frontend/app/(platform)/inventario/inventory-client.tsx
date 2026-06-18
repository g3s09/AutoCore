"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Boxes,
  Factory,
  Hammer,
  MapPin,
  PackagePlus,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { apiRequest } from "../../_lib/autocore-api";
import { EmptyState } from "../../_components/empty-state";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";

type InventoryCategory = "refaccion" | "herramienta" | "maquinaria";
type AssetStatus = "disponible" | "en_uso" | "mantenimiento";
type ActiveRole = "admin" | "empleado1" | "empleado2" | "empleado3";

type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  location: string;
  stock: number;
  minStock?: number;
  costCents?: number;
  priceCents?: number;
  status?: AssetStatus;
  assignedTo?: string;
};

type InventoryForm = {
  sku: string;
  name: string;
  category: InventoryCategory;
  location: string;
  stock: string;
  minStock: string;
  cost: string;
  price: string;
  status: AssetStatus;
  assignedTo: string;
};

const initialForm: InventoryForm = {
  sku: "",
  name: "",
  category: "refaccion",
  location: "",
  stock: "0",
  minStock: "0",
  cost: "0",
  price: "0",
  status: "disponible",
  assignedTo: "",
};

const categoryLabels: Record<InventoryCategory, string> = {
  refaccion: "Refaccion/Consumible",
  herramienta: "Herramienta",
  maquinaria: "Maquinaria",
};

const categoryPrefixes: Record<InventoryCategory, string> = {
  refaccion: "REF",
  herramienta: "HER",
  maquinaria: "MAQ",
};

const statusLabels: Record<AssetStatus, string> = {
  disponible: "Disponible",
  en_uso: "En Uso",
  mantenimiento: "En Mantenimiento",
};

const statusStyles: Record<AssetStatus, string> = {
  disponible: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  en_uso: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  mantenimiento: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

const roleLabels: Record<ActiveRole, string> = {
  admin: "Administrador",
  empleado1: "Empleado 1",
  empleado2: "Empleado 2",
  empleado3: "Empleado 3",
};

const consumableFields: Array<{
  key: "stock" | "minStock" | "cost" | "price";
  label: string;
  money: boolean;
}> = [
  { key: "stock", label: "Stock inicial", money: false },
  { key: "minStock", label: "Stock minimo", money: false },
  { key: "cost", label: "Costo", money: true },
  { key: "price", label: "Precio", money: true },
];

function formatMoney(cents = 0) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cents / 100);
}

function normalizeSkuWord(value: string) {
  const firstWord = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)[0];

  return (firstWord || "ITEM").slice(0, 3).toUpperCase().padEnd(3, "X");
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildPayload(form: InventoryForm, isAdmin: boolean) {
  if (form.category === "refaccion") {
    return {
      sku: form.sku,
      name: form.name,
      category: form.category,
      location: form.location,
      stock: toNumber(form.stock),
      minStock: toNumber(form.minStock),
      cost: isAdmin ? toNumber(form.cost) : 0,
      price: isAdmin ? toNumber(form.price) : 0,
    };
  }

  return {
    sku: form.sku,
    name: form.name,
    category: form.category,
    location: form.location,
    stock: 1,
    cost: isAdmin ? toNumber(form.cost) : 0,
    status: form.status,
    assignedTo: form.assignedTo || undefined,
  };
}

function itemToForm(item: InventoryItem): InventoryForm {
  return {
    sku: item.sku,
    name: item.name,
    category: item.category,
    location: item.location,
    stock: String(item.stock ?? 0),
    minStock: String(item.minStock ?? 0),
    cost: String((item.costCents ?? 0) / 100),
    price: String((item.priceCents ?? 0) / 100),
    status: item.status ?? "disponible",
    assignedTo: item.assignedTo ?? "",
  };
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
      <h2 className="text-sm font-semibold text-[#eef2f7]">{title}</h2>
      {children}
    </section>
  );
}

export function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState<InventoryForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [role, setRole] = useState<ActiveRole>("admin");
  const [message, setMessage] = useState("Listo para conectar con API local.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = role === "admin";
  const isConsumable = form.category === "refaccion";

  const stats = useMemo(() => {
    const consumables = items.filter((item) => item.category === "refaccion");
    const warehouseValue = consumables.reduce(
      (sum, item) => sum + item.stock * (item.costCents ?? 0),
      0,
    );
    const lowStock = consumables.filter(
      (item) => item.stock <= (item.minStock ?? 0),
    ).length;

    return {
      total: items.length,
      lowStock,
      warehouseValue,
      assets: items.length - consumables.length,
    };
  }, [items]);

  async function loadInventory() {
    setLoading(true);
    try {
      const data = await apiRequest<InventoryItem[]>("/inventory");
      setItems(data);
      setMessage("Inventario sincronizado con backend local.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "API local no disponible.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialInventory() {
      try {
        const data = await apiRequest<InventoryItem[]>("/inventory");
        if (cancelled) return;
        setItems(data);
        setMessage("Inventario sincronizado con backend local.");
      } catch (error) {
        if (cancelled) return;
        setMessage(error instanceof Error ? error.message : "API local no disponible.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateForm<K extends keyof InventoryForm>(
    key: K,
    value: InventoryForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "category" && value !== "refaccion"
        ? { minStock: "0", price: "0", stock: "1" }
        : {}),
    }));
  }

  function generateSku() {
    const prefix = categoryPrefixes[form.category];
    const word = normalizeSkuWord(form.name);
    const existing = items.filter((item) => item.sku.startsWith(`${prefix}-${word}`));
    const next = String(existing.length + 1).padStart(3, "0");
    updateForm("sku", `${prefix}-${word}-${next}`);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload(form, isAdmin);
      if (editingId) {
        await apiRequest<InventoryItem>(`/inventory/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setMessage("Item actualizado correctamente.");
      } else {
        await apiRequest<InventoryItem>("/inventory", {
          method: "POST",
          body: payload,
        });
        setMessage("Item guardado correctamente.");
      }
      setForm(initialForm);
      setEditingId(null);
      await loadInventory();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function adjustStock(item: InventoryItem) {
    const raw = window.prompt("Cantidad a ajustar. Usa negativo para salida.", "1");
    if (!raw) return;

    try {
      await apiRequest<InventoryItem>(`/inventory/${item.id}/stock`, {
        method: "PATCH",
        body: {
          quantity: Number(raw),
          reason: "Ajuste desde inventario",
        },
      });
      setMessage("Stock ajustado correctamente.");
      await loadInventory();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo ajustar.");
    }
  }

  async function deleteItem(item: InventoryItem) {
    const confirmed = window.confirm(`Eliminar ${item.name}?`);
    if (!confirmed) return;

    try {
      await apiRequest<void>(`/inventory/${item.id}`, { method: "DELETE" });
      setMessage("Item eliminado correctamente.");
      await loadInventory();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  function startEditing(item: InventoryItem) {
    setEditingId(item.id);
    setForm(itemToForm(item));
    setMessage(`Editando ${item.sku}.`);
  }

  return (
    <div>
      <div className="autocore-entrance mb-6 overflow-hidden rounded-lg border border-sky-300/15 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.18),transparent_36%),#0d1117] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              AutoCore Inventory
            </p>
            <h1 className="autocore-shine mt-2 bg-gradient-to-r from-white via-sky-200 to-slate-400 bg-clip-text text-3xl font-semibold text-transparent">
              Inventario inteligente del taller
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9aa4b5]">
              Control separado de refacciones, herramientas y maquinaria con permisos por rol, ubicacion fisica y SKU automatico.
            </p>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-[#9aa4b5]">
            {message}
          </div>
        </div>
      </div>

      <PageHeader
        eyebrow="Almacen"
        title="Inventario"
        description="Modulo listo para persistencia local via API, SQLite o cualquier base conectada posteriormente."
        action={{
          label: "Recargar",
          href: "/inventario",
          icon: <RefreshCw className="size-4" aria-hidden="true" />,
        }}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Items registrados"
          value={String(stats.total)}
          detail="Refacciones, herramientas y maquinaria"
          tone="blue"
          icon={<Boxes className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Bajo minimo"
          value={String(stats.lowStock)}
          detail="Solo refacciones/consumibles"
          tone="amber"
          icon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Valor almacen"
          value={isAdmin ? formatMoney(stats.warehouseValue) : "****"}
          detail="Costo x stock de refacciones"
          tone="green"
          icon={<PackagePlus className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Activos del taller"
          value={String(stats.assets)}
          detail="Herramientas y maquinaria"
          tone="neutral"
          icon={<Factory className="size-4" aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <Panel title={editingId ? "Actualizar item" : "Alta de pieza"}>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.035] p-2">
            <ShieldCheck className="size-4 text-sky-300" aria-hidden="true" />
            <span className="text-xs font-medium text-[#9aa4b5]">Rol activo</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as ActiveRole)}
              className="h-9 rounded-md border border-white/[0.10] bg-[#111722] px-3 text-sm text-[#eef2f7] outline-none"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {!isAdmin ? (
              <span className="text-xs text-amber-300">
                Modo empleado: costos, precios y acciones sensibles ocultos.
              </span>
            ) : null}
          </div>

          <form onSubmit={saveItem} className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="text-[#8b95a7]">Categoria</span>
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value as InventoryCategory)
                  }
                  className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[#8b95a7]">Ubicacion fisica</span>
                <input
                  required
                  value={form.location}
                  onChange={(event) => updateForm("location", event.target.value)}
                  placeholder="Estante A, Caja 3"
                  className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none placeholder:text-[#667085] focus:border-sky-300/40"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="text-[#8b95a7]">Nombre</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Filtro de gasolina, Multimetro, Elevador"
                className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none placeholder:text-[#667085] focus:border-sky-300/40"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-[#8b95a7]">SKU</span>
              <div className="flex gap-2">
                <input
                  required
                  value={form.sku}
                  onChange={(event) => updateForm("sku", event.target.value.toUpperCase())}
                  placeholder="REF-FIL-001"
                  className="h-10 min-w-0 flex-1 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none placeholder:text-[#667085] focus:border-sky-300/40"
                />
                <button
                  type="button"
                  onClick={generateSku}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-sky-300/20 bg-sky-300/10 px-3 text-sm font-medium text-sky-200 transition hover:bg-sky-300/15"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  Generar
                </button>
              </div>
            </label>

            {isConsumable ? (
              <div className="grid gap-3 md:grid-cols-2">
                {consumableFields.map(({ key, label, money }) => {
                  return (
                    <label key={key} className="grid gap-2 text-sm">
                      <span className="text-[#8b95a7]">{label}</span>
                      <input
                        required
                        disabled={money && !isAdmin}
                        type={money && !isAdmin ? "text" : "number"}
                        min="0"
                        step={money ? "0.01" : "1"}
                        value={money && !isAdmin ? "****" : form[key]}
                        onChange={(event) =>
                          updateForm(key, event.target.value)
                        }
                        className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none disabled:text-[#667085] focus:border-sky-300/40"
                      />
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-[#8b95a7]">Estado actual</span>
                  <select
                    required
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as AssetStatus)
                    }
                    className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none focus:border-sky-300/40"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-[#8b95a7]">Asignado a</span>
                  <input
                    value={form.assignedTo}
                    onChange={(event) => updateForm("assignedTo", event.target.value)}
                    placeholder="Empleado responsable"
                    className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none placeholder:text-[#667085] focus:border-sky-300/40"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-[#8b95a7]">Costo</span>
                  <input
                    disabled={!isAdmin}
                    type={!isAdmin ? "text" : "number"}
                    min="0"
                    step="0.01"
                    value={!isAdmin ? "****" : form.cost}
                    onChange={(event) => updateForm("cost", event.target.value)}
                    className="h-10 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 text-[#eef2f7] outline-none disabled:text-[#667085] focus:border-sky-300/40"
                  />
                </label>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#080b10] transition hover:bg-[#dbe4ee] disabled:opacity-60"
              >
                {saving ? "Guardando..." : editingId ? "Actualizar item" : "Guardar item"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-white/[0.10] bg-white/[0.04] px-4 text-sm font-medium text-[#eef2f7]"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </Panel>

        <Panel title="Existencias">
          <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.08]">
            {loading ? (
              <div className="p-4 text-sm text-[#9aa4b5]">Cargando inventario...</div>
            ) : items.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<Boxes className="size-4" aria-hidden="true" />}
                  title="Sin inventario"
                  description="Agrega refacciones, herramientas o maquinaria para empezar a controlar el taller."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-[#8b95a7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">SKU</th>
                      <th className="px-4 py-3 font-semibold">Nombre</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Stock / Estado</th>
                      <th className="px-4 py-3 font-semibold">Ubicacion</th>
                      <th className="px-4 py-3 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.08]">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 font-mono text-xs text-sky-200">
                          {item.sku}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#eef2f7]">{item.name}</p>
                          {isAdmin ? (
                            <p className="mt-1 text-xs text-[#8b95a7]">
                              Costo {formatMoney(item.costCents ?? 0)}
                              {item.category === "refaccion"
                                ? ` - Precio ${formatMoney(item.priceCents ?? 0)}`
                                : ""}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-[#8b95a7]">
                              Costo **** {item.category === "refaccion" ? "- Precio ****" : ""}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[#cbd5e1]">
                          {categoryLabels[item.category]}
                        </td>
                        <td className="px-4 py-4">
                          {item.category === "refaccion" ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs font-medium text-slate-300">
                              {item.stock} / min {item.minStock ?? 0}
                            </span>
                          ) : (
                            <span
                              className={`rounded-full border px-2 py-1 text-xs font-medium ${
                                statusStyles[item.status ?? "disponible"]
                              }`}
                            >
                              {statusLabels[item.status ?? "disponible"]}
                            </span>
                          )}
                          {item.assignedTo ? (
                            <p className="mt-2 text-xs text-[#8b95a7]">
                              Asignado a {item.assignedTo}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 text-[#cbd5e1]">
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="size-3.5 text-[#8b95a7]" aria-hidden="true" />
                            {item.location || "Sin ubicacion"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className="inline-flex h-8 items-center rounded-md border border-white/[0.10] bg-white/[0.04] px-2 text-xs font-medium text-[#eef2f7]"
                            >
                              Editar
                            </button>
                            {isAdmin && item.category === "refaccion" ? (
                              <button
                                type="button"
                                onClick={() => adjustStock(item)}
                                className="inline-flex h-8 items-center gap-1 rounded-md border border-sky-300/20 bg-sky-300/10 px-2 text-xs font-medium text-sky-200"
                              >
                                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                                Ajustar
                              </button>
                            ) : null}
                            {isAdmin ? (
                              <button
                                type="button"
                                onClick={() => deleteItem(item)}
                                className="inline-flex h-8 items-center gap-1 rounded-md border border-rose-300/20 bg-rose-300/10 px-2 text-xs font-medium text-rose-200"
                              >
                                <Trash2 className="size-3.5" aria-hidden="true" />
                                Eliminar
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Refacciones/Consumibles",
            detail: "Controlan stock, costo, precio y minimo.",
            icon: Boxes,
          },
          {
            title: "Herramientas",
            detail: "Controlan estado, ubicacion y responsable.",
            icon: Hammer,
          },
          {
            title: "Maquinaria",
            detail: "Controla disponibilidad y mantenimiento.",
            icon: Wrench,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4"
            >
              <Icon className="size-5 text-sky-300" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-[#eef2f7]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8b95a7]">
                {item.detail}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

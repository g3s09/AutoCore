export type Tone = "green" | "blue" | "amber" | "rose" | "neutral";

export type Order = {
  code: string;
  customer: string;
  vehicle: string;
  service: string;
  status: string;
  tone: Tone;
  total: string;
};

export type Appointment = {
  time: string;
  customer: string;
  vehicle: string;
  reason: string;
};

export type InventoryAlert = {
  part: string;
  stock: string;
  minimum: string;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  vehicles: string;
  lastVisit: string;
  status: string;
  tone: Tone;
};

export type Vehicle = {
  plate: string;
  model: string;
  owner: string;
  vin: string;
  mileage: string;
  status: string;
  tone: Tone;
};

export type Diagnostic = {
  code: string;
  vehicle: string;
  symptom: string;
  finding: string;
  priority: string;
  tone: Tone;
};

export type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  stock: string;
  minimum: string;
  status: string;
  tone: Tone;
};

export type User = {
  name: string;
  role: string;
  email: string;
  status: string;
  tone: Tone;
};

export const workshopStats = [
  {
    label: "Ordenes activas",
    value: "0",
    detail: "Sin ordenes registradas",
    tone: "blue" as const,
  },
  {
    label: "Citas de hoy",
    value: "0",
    detail: "Agenda lista para usar",
    tone: "green" as const,
  },
  {
    label: "Inventario critico",
    value: "0",
    detail: "Sin alertas registradas",
    tone: "amber" as const,
  },
  {
    label: "Ingresos estimados",
    value: "$0",
    detail: "Esperando ordenes cerradas",
    tone: "neutral" as const,
  },
];

export const recentOrders: Order[] = [];

export const appointmentsToday: Appointment[] = [];

export const inventoryAlerts: InventoryAlert[] = [];

export const customers: Customer[] = [];

export const vehicles: Vehicle[] = [];

export const serviceColumns = [
  {
    title: "Recepcion",
    count: "0",
    tone: "neutral" as const,
    orders: [] as string[],
  },
  {
    title: "Diagnostico",
    count: "0",
    tone: "blue" as const,
    orders: [] as string[],
  },
  {
    title: "Reparacion",
    count: "0",
    tone: "amber" as const,
    orders: [] as string[],
  },
  {
    title: "Entrega",
    count: "0",
    tone: "green" as const,
    orders: [] as string[],
  },
];

export const diagnostics: Diagnostic[] = [];

export const inventoryItems: InventoryItem[] = [];

export const weeklyAppointments = [
  { day: "Lun", total: 8, booked: 0 },
  { day: "Mar", total: 8, booked: 0 },
  { day: "Mie", total: 8, booked: 0 },
  { day: "Jue", total: 8, booked: 0 },
  { day: "Vie", total: 8, booked: 0 },
  { day: "Sab", total: 4, booked: 0 },
];

export const reportMetrics = [
  { label: "Ventas del mes", value: "$0", change: "0%" },
  { label: "Ticket promedio", value: "$0", change: "0%" },
  { label: "Ordenes cerradas", value: "0", change: "0%" },
  { label: "Retencion clientes", value: "0%", change: "0%" },
];

export const users: User[] = [];

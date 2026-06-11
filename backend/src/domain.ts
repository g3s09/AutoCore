import { randomUUID } from "node:crypto";
import { z } from "zod";

export const TAX_RATE = 0.16;

export type OrderStatus =
  | "reception"
  | "diagnosis"
  | "repair"
  | "ready"
  | "closed"
  | "cancelled";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";
export type OrderItemType = "labor" | "part";

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  taxId?: string;
  balanceCents: number;
  createdAt: string;
  updatedAt: string;
};

export type Vehicle = {
  id: string;
  customerId?: string;
  plate: string;
  makeModel: string;
  vin?: string;
  mileageKm: number;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  customerId?: string;
  vehicleId?: string;
  scheduledAt: string;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category?: string;
  stock: number;
  minStock: number;
  costCents: number;
  priceCents: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  type: OrderItemType;
  description: string;
  quantity: number;
  unitPriceCents: number;
  inventoryItemId?: string;
  lineTotalCents: number;
};

export type ServiceOrder = {
  id: string;
  code: string;
  customerId?: string;
  vehicleId?: string;
  status: OrderStatus;
  concern: string;
  notes?: string;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
};

export type Diagnostic = {
  id: string;
  orderId?: string;
  vehicleId?: string;
  symptom: string;
  finding: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "advisor" | "technician";
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InventoryMovement = {
  id: string;
  inventoryItemId: string;
  serviceOrderId?: string;
  quantity: number;
  reason: string;
  createdAt: string;
};

export type StoreData = {
  customers: Customer[];
  vehicles: Vehicle[];
  appointments: Appointment[];
  inventoryItems: InventoryItem[];
  serviceOrders: ServiceOrder[];
  diagnostics: Diagnostic[];
  users: User[];
  inventoryMovements: InventoryMovement[];
};

export const emptyStore = (): StoreData => ({
  customers: [],
  vehicles: [],
  appointments: [],
  inventoryItems: [],
  serviceOrders: [],
  diagnostics: [],
  users: [],
  inventoryMovements: [],
});

const optionalText = z.string().trim().min(1).optional();
const money = z.coerce.number().min(0).default(0);

export const customerSchema = z.object({
  name: z.string().trim().min(2),
  phone: optionalText,
  email: z.string().trim().email().optional(),
  taxId: optionalText,
});

export const vehicleSchema = z.object({
  customerId: optionalText,
  plate: z.string().trim().min(3),
  makeModel: z.string().trim().min(2),
  vin: optionalText,
  mileageKm: z.coerce.number().int().min(0).default(0),
});

export const appointmentSchema = z.object({
  customerId: optionalText,
  vehicleId: optionalText,
  scheduledAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(15).max(480).default(60),
  reason: z.string().trim().min(2),
});

export const inventoryItemSchema = z.object({
  sku: z.string().trim().min(2),
  name: z.string().trim().min(2),
  category: optionalText,
  stock: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
  cost: money,
  price: money,
});

export const serviceOrderSchema = z.object({
  customerId: optionalText,
  vehicleId: optionalText,
  concern: z.string().trim().min(2),
  notes: optionalText,
});

export const orderItemSchema = z.object({
  type: z.enum(["labor", "part"]),
  description: z.string().trim().min(2),
  quantity: z.coerce.number().positive(),
  unitPrice: money,
  inventoryItemId: optionalText,
});

export const closeOrderSchema = z.object({
  discount: money,
});

export const diagnosticSchema = z.object({
  orderId: optionalText,
  vehicleId: optionalText,
  symptom: z.string().trim().min(2),
  finding: z.string().trim().min(2),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const userSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  role: z.enum(["owner", "admin", "advisor", "technician"]),
});

export function now() {
  return new Date().toISOString();
}

export function newId() {
  return randomUUID();
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cents / 100);
}

export function calculateOrderTotals(
  items: OrderItem[],
  discountCents = 0,
) {
  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const taxCents = Math.round(Math.max(subtotalCents - discountCents, 0) * TAX_RATE);
  const totalCents = Math.max(subtotalCents - discountCents, 0) + taxCents;

  return {
    subtotalCents,
    taxCents,
    discountCents,
    totalCents,
  };
}

export function makeOrderCode(existingCount: number) {
  return `OS-${String(existingCount + 1).padStart(5, "0")}`;
}

export function createOrderItem(input: z.infer<typeof orderItemSchema>): OrderItem {
  const unitPriceCents = toCents(input.unitPrice);
  const lineTotalCents = Math.round(unitPriceCents * input.quantity);

  return {
    id: newId(),
    type: input.type,
    description: input.description,
    quantity: input.quantity,
    unitPriceCents,
    inventoryItemId: input.inventoryItemId,
    lineTotalCents,
  };
}

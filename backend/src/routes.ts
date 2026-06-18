import { Router } from "express";
import { z } from "zod";
import {
  appointmentSchema,
  calculateOrderTotals,
  closeOrderSchema,
  createOrderItem,
  customerSchema,
  diagnosticSchema,
  inventoryItemSchema,
  makeOrderCode,
  newId,
  now,
  orderItemSchema,
  serviceOrderSchema,
  toCents,
  userSchema,
  vehicleSchema,
} from "./domain.js";
import { readStore, updateStore } from "./store.js";
import { buildTicket } from "./ticket.js";

export const routes = Router();

function parseBody<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> {
  return schema.parse(body);
}

function required<T>(item: T | undefined, label: string): T {
  if (!item) {
    throw new Error(`${label} no encontrado`);
  }

  return item;
}

const customerUpdateSchema = customerSchema.partial().extend({
  balance: z.coerce.number().min(0).optional(),
});

const vehicleUpdateSchema = vehicleSchema.partial();

const appointmentUpdateSchema = appointmentSchema.partial().extend({
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
});

const inventoryUpdateSchema = z.object({
  sku: z.string().trim().min(2).optional(),
  name: z.string().trim().min(2).optional(),
  category: z.enum(["refaccion", "herramienta", "maquinaria"]).optional(),
  location: z.string().trim().min(2).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  minStock: z.coerce.number().int().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  status: z.enum(["disponible", "en_uso", "mantenimiento"]).optional(),
  assignedTo: z.string().trim().min(1).optional(),
});

const stockAdjustmentSchema = z.object({
  quantity: z.coerce.number().int(),
  reason: z.string().trim().min(2).default("Ajuste manual"),
});

const diagnosticUpdateSchema = diagnosticSchema.partial();

const userUpdateSchema = userSchema.partial().extend({
  active: z.boolean().optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(["reception", "diagnosis", "repair", "ready", "cancelled"]),
});

function overlap(
  aStart: string,
  aMinutes: number,
  bStart: string,
  bMinutes: number,
) {
  const aFrom = new Date(aStart).getTime();
  const aTo = aFrom + aMinutes * 60_000;
  const bFrom = new Date(bStart).getTime();
  const bTo = bFrom + bMinutes * 60_000;

  return aFrom < bTo && bFrom < aTo;
}

routes.get("/health", (_request, response) => {
  response.json({ ok: true, service: "autocore-backend", timestamp: now() });
});

routes.get("/summary", async (_request, response) => {
  const data = await readStore();
  const closedOrders = data.serviceOrders.filter((order) => order.status === "closed");
  const monthlyRevenueCents = closedOrders.reduce(
    (sum, order) => sum + order.totalCents,
    0,
  );
  const inventoryValueCents = data.inventoryItems.reduce(
    (sum, item) =>
      item.category === "refaccion"
        ? sum + item.stock * (item.costCents ?? 0)
        : sum,
    0,
  );

  response.json({
    customers: data.customers.length,
    vehicles: data.vehicles.length,
    appointments: data.appointments.length,
    openOrders: data.serviceOrders.filter((order) => order.status !== "closed").length,
    closedOrders: closedOrders.length,
    monthlyRevenueCents,
    inventoryValueCents,
    lowStockItems: data.inventoryItems.filter(
      (item) => item.category === "refaccion" && item.stock <= (item.minStock ?? 0),
    )
      .length,
  });
});

routes.get("/customers", async (_request, response) => {
  response.json((await readStore()).customers);
});

routes.post("/customers", async (request, response) => {
  const input = parseBody(customerSchema, request.body);
  const item = await updateStore((data) => {
    const customer = {
      id: newId(),
      ...input,
      balanceCents: 0,
      createdAt: now(),
      updatedAt: now(),
    };
    data.customers.push(customer);
    return customer;
  });

  response.status(201).json(item);
});

routes.patch("/customers/:id", async (request, response) => {
  const input = parseBody(customerUpdateSchema, request.body);
  const item = await updateStore((data) => {
    const customer = required(
      data.customers.find((storedCustomer) => storedCustomer.id === request.params.id),
      "Cliente",
    );

    if (input.name !== undefined) customer.name = input.name;
    if (input.phone !== undefined) customer.phone = input.phone;
    if (input.email !== undefined) customer.email = input.email;
    if (input.taxId !== undefined) customer.taxId = input.taxId;
    if (input.balance !== undefined) customer.balanceCents = toCents(input.balance);
    customer.updatedAt = now();
    return customer;
  });

  response.json(item);
});

routes.get("/vehicles", async (_request, response) => {
  response.json((await readStore()).vehicles);
});

routes.post("/vehicles", async (request, response) => {
  const input = parseBody(vehicleSchema, request.body);
  const item = await updateStore((data) => {
    if (input.customerId && !data.customers.some((customer) => customer.id === input.customerId)) {
      throw new Error("Cliente no encontrado");
    }

    const vehicle = {
      id: newId(),
      ...input,
      createdAt: now(),
      updatedAt: now(),
    };
    data.vehicles.push(vehicle);
    return vehicle;
  });

  response.status(201).json(item);
});

routes.patch("/vehicles/:id", async (request, response) => {
  const input = parseBody(vehicleUpdateSchema, request.body);
  const item = await updateStore((data) => {
    if (input.customerId && !data.customers.some((customer) => customer.id === input.customerId)) {
      throw new Error("Cliente no encontrado");
    }

    const vehicle = required(
      data.vehicles.find((storedVehicle) => storedVehicle.id === request.params.id),
      "Vehiculo",
    );

    if (input.customerId !== undefined) vehicle.customerId = input.customerId;
    if (input.plate !== undefined) vehicle.plate = input.plate;
    if (input.makeModel !== undefined) vehicle.makeModel = input.makeModel;
    if (input.vin !== undefined) vehicle.vin = input.vin;
    if (input.mileageKm !== undefined) vehicle.mileageKm = input.mileageKm;
    vehicle.updatedAt = now();
    return vehicle;
  });

  response.json(item);
});

routes.get("/appointments", async (_request, response) => {
  response.json((await readStore()).appointments);
});

routes.post("/appointments", async (request, response) => {
  const input = parseBody(appointmentSchema, request.body);
  const item = await updateStore((data) => {
    const hasOverlap = data.appointments.some(
      (appointment) =>
        appointment.status === "scheduled" &&
        overlap(
          appointment.scheduledAt,
          appointment.durationMinutes,
          input.scheduledAt,
          input.durationMinutes,
        ),
    );

    if (hasOverlap) {
      throw new Error("Ya existe una cita en ese horario");
    }

    const appointment = {
      id: newId(),
      ...input,
      status: "scheduled" as const,
      createdAt: now(),
      updatedAt: now(),
    };
    data.appointments.push(appointment);
    return appointment;
  });

  response.status(201).json(item);
});

routes.patch("/appointments/:id", async (request, response) => {
  const input = parseBody(appointmentUpdateSchema, request.body);
  const item = await updateStore((data) => {
    const appointment = required(
      data.appointments.find((storedAppointment) => storedAppointment.id === request.params.id),
      "Cita",
    );
    const scheduledAt = input.scheduledAt ?? appointment.scheduledAt;
    const durationMinutes = input.durationMinutes ?? appointment.durationMinutes;

    const hasOverlap = data.appointments.some(
      (storedAppointment) =>
        storedAppointment.id !== appointment.id &&
        storedAppointment.status === "scheduled" &&
        overlap(
          storedAppointment.scheduledAt,
          storedAppointment.durationMinutes,
          scheduledAt,
          durationMinutes,
        ),
    );

    if (hasOverlap) {
      throw new Error("Ya existe una cita en ese horario");
    }

    if (input.customerId !== undefined) appointment.customerId = input.customerId;
    if (input.vehicleId !== undefined) appointment.vehicleId = input.vehicleId;
    if (input.scheduledAt !== undefined) appointment.scheduledAt = input.scheduledAt;
    if (input.durationMinutes !== undefined) appointment.durationMinutes = input.durationMinutes;
    if (input.reason !== undefined) appointment.reason = input.reason;
    if (input.status !== undefined) appointment.status = input.status;
    appointment.updatedAt = now();
    return appointment;
  });

  response.json(item);
});

routes.get("/inventory", async (_request, response) => {
  response.json((await readStore()).inventoryItems);
});

routes.post("/inventory", async (request, response) => {
  const input = parseBody(inventoryItemSchema, request.body);
  const item = await updateStore((data) => {
    if (data.inventoryItems.some((inventoryItem) => inventoryItem.sku === input.sku)) {
      throw new Error("SKU duplicado");
    }

    const inventoryItem =
      input.category === "refaccion"
        ? {
            id: newId(),
            sku: input.sku,
            name: input.name,
            category: input.category,
            location: input.location,
            stock: input.stock,
            minStock: input.minStock,
            costCents: toCents(input.cost),
            priceCents: toCents(input.price),
            createdAt: now(),
            updatedAt: now(),
          }
        : {
            id: newId(),
            sku: input.sku,
            name: input.name,
            category: input.category,
            location: input.location,
            stock: input.stock,
            costCents: toCents(input.cost),
            status: input.status,
            assignedTo: input.assignedTo,
            createdAt: now(),
            updatedAt: now(),
          };
    data.inventoryItems.push(inventoryItem);
    return inventoryItem;
  });

  response.status(201).json(item);
});

routes.patch("/inventory/:id", async (request, response) => {
  const input = parseBody(inventoryUpdateSchema, request.body);
  const item = await updateStore((data) => {
    const inventoryItem = required(
      data.inventoryItems.find((storedItem) => storedItem.id === request.params.id),
      "Pieza",
    );

    if (
      input.sku !== undefined &&
      data.inventoryItems.some(
        (storedItem) => storedItem.id !== inventoryItem.id && storedItem.sku === input.sku,
      )
    ) {
      throw new Error("SKU duplicado");
    }

    if (input.sku !== undefined) inventoryItem.sku = input.sku;
    if (input.name !== undefined) inventoryItem.name = input.name;
    if (input.category !== undefined) inventoryItem.category = input.category;
    if (input.location !== undefined) inventoryItem.location = input.location;
    if (input.stock !== undefined) inventoryItem.stock = input.stock;
    if (input.minStock !== undefined) inventoryItem.minStock = input.minStock;
    if (input.cost !== undefined) inventoryItem.costCents = toCents(input.cost);
    if (input.price !== undefined) inventoryItem.priceCents = toCents(input.price);
    if (input.status !== undefined) inventoryItem.status = input.status;
    if (input.assignedTo !== undefined) inventoryItem.assignedTo = input.assignedTo;

    if (inventoryItem.category !== "refaccion") {
      inventoryItem.minStock = undefined;
      inventoryItem.priceCents = undefined;
      inventoryItem.stock = Math.max(inventoryItem.stock, 1);
    }

    inventoryItem.updatedAt = now();
    return inventoryItem;
  });

  response.json(item);
});

routes.patch("/inventory/:id/stock", async (request, response) => {
  const input = parseBody(stockAdjustmentSchema, request.body);
  const item = await updateStore((data) => {
    const inventoryItem = required(
      data.inventoryItems.find((storedItem) => storedItem.id === request.params.id),
      "Pieza",
    );

    if (inventoryItem.category !== "refaccion") {
      throw new Error("Solo las refacciones y consumibles manejan ajuste de stock");
    }

    const nextStock = inventoryItem.stock + input.quantity;
    if (nextStock < 0) {
      throw new Error("El stock no puede quedar negativo");
    }

    inventoryItem.stock = nextStock;
    inventoryItem.updatedAt = now();
    data.inventoryMovements.push({
      id: newId(),
      inventoryItemId: inventoryItem.id,
      quantity: input.quantity,
      reason: input.reason,
      createdAt: now(),
    });
    return inventoryItem;
  });

  response.json(item);
});

routes.delete("/inventory/:id", async (request, response) => {
  await updateStore((data) => {
    const isUsed = data.serviceOrders.some((order) =>
      order.items.some((item) => item.inventoryItemId === request.params.id),
    );
    if (isUsed) {
      throw new Error("No puedes eliminar una pieza usada en una orden");
    }

    data.inventoryItems = data.inventoryItems.filter(
      (item) => item.id !== request.params.id,
    );
  });

  response.status(204).send();
});

routes.get("/orders", async (_request, response) => {
  response.json((await readStore()).serviceOrders);
});

routes.post("/orders", async (request, response) => {
  const input = parseBody(serviceOrderSchema, request.body);
  const item = await updateStore((data) => {
    const totals = calculateOrderTotals([]);
    const serviceOrder = {
      id: newId(),
      code: makeOrderCode(data.serviceOrders.length),
      ...input,
      status: "reception" as const,
      items: [],
      ...totals,
      createdAt: now(),
      updatedAt: now(),
    };
    data.serviceOrders.push(serviceOrder);
    return serviceOrder;
  });

  response.status(201).json(item);
});

routes.patch("/orders/:id/status", async (request, response) => {
  const input = parseBody(orderStatusSchema, request.body);
  const item = await updateStore((data) => {
    const order = required(
      data.serviceOrders.find((serviceOrder) => serviceOrder.id === request.params.id),
      "Orden",
    );
    if (order.status === "closed") {
      throw new Error("No puedes cambiar el estado de una orden cerrada");
    }

    order.status = input.status;
    order.updatedAt = now();
    return order;
  });

  response.json(item);
});

routes.post("/orders/:id/items", async (request, response) => {
  const orderItem = createOrderItem(parseBody(orderItemSchema, request.body));

  const item = await updateStore((data) => {
    const order = data.serviceOrders.find((serviceOrder) => serviceOrder.id === request.params.id);
    if (!order) {
      throw new Error("Orden no encontrada");
    }
    if (order.status === "closed") {
      throw new Error("No puedes modificar una orden cerrada");
    }
    if (orderItem.type === "part" && orderItem.inventoryItemId) {
      const inventoryItem = data.inventoryItems.find(
        (storedItem) => storedItem.id === orderItem.inventoryItemId,
      );
      if (!inventoryItem) {
        throw new Error("Pieza de inventario no encontrada");
      }
      if (inventoryItem.category !== "refaccion") {
        throw new Error("Solo las refacciones y consumibles pueden agregarse como pieza de orden");
      }
    }

    order.items.push(orderItem);
    Object.assign(order, calculateOrderTotals(order.items, order.discountCents));
    order.updatedAt = now();
    return order;
  });

  response.status(201).json(item);
});

routes.post("/orders/:id/close", async (request, response) => {
  const input = parseBody(closeOrderSchema, request.body);
  const item = await updateStore((data) => {
    const order = data.serviceOrders.find((serviceOrder) => serviceOrder.id === request.params.id);
    if (!order) {
      throw new Error("Orden no encontrada");
    }
    if (order.status === "closed") {
      return order;
    }

    for (const orderItem of order.items) {
      if (orderItem.type !== "part" || !orderItem.inventoryItemId) {
        continue;
      }

      const inventoryItem = data.inventoryItems.find(
        (storedItem) => storedItem.id === orderItem.inventoryItemId,
      );
      if (!inventoryItem) {
        throw new Error(`Pieza no encontrada: ${orderItem.description}`);
      }
      if (inventoryItem.stock < orderItem.quantity) {
        throw new Error(`Stock insuficiente: ${inventoryItem.name}`);
      }
    }

    for (const orderItem of order.items) {
      if (orderItem.type !== "part" || !orderItem.inventoryItemId) {
        continue;
      }

      const inventoryItem = data.inventoryItems.find(
        (storedItem) => storedItem.id === orderItem.inventoryItemId,
      );
      if (!inventoryItem) {
        continue;
      }

      inventoryItem.stock -= orderItem.quantity;
      inventoryItem.updatedAt = now();
      data.inventoryMovements.push({
        id: newId(),
        inventoryItemId: inventoryItem.id,
        serviceOrderId: order.id,
        quantity: -orderItem.quantity,
        reason: `Salida por orden ${order.code}`,
        createdAt: now(),
      });
    }

    Object.assign(order, calculateOrderTotals(order.items, toCents(input.discount)));
    order.status = "closed";
    order.closedAt = now();
    order.updatedAt = now();
    return order;
  });

  response.json(item);
});

routes.get("/orders/:id/ticket", async (request, response) => {
  const data = await readStore();
  const order = data.serviceOrders.find((serviceOrder) => serviceOrder.id === request.params.id);
  if (!order) {
    response.status(404).json({ error: "Orden no encontrada" });
    return;
  }

  const customer = data.customers.find((item) => item.id === order.customerId);
  const vehicle = data.vehicles.find((item) => item.id === order.vehicleId);
  response.type("text/plain").send(buildTicket({ order, customer, vehicle }));
});

routes.get("/diagnostics", async (_request, response) => {
  response.json((await readStore()).diagnostics);
});

routes.post("/diagnostics", async (request, response) => {
  const input = parseBody(diagnosticSchema, request.body);
  const item = await updateStore((data) => {
    const diagnostic = {
      id: newId(),
      ...input,
      createdAt: now(),
      updatedAt: now(),
    };
    data.diagnostics.push(diagnostic);
    return diagnostic;
  });

  response.status(201).json(item);
});

routes.patch("/diagnostics/:id", async (request, response) => {
  const input = parseBody(diagnosticUpdateSchema, request.body);
  const item = await updateStore((data) => {
    const diagnostic = required(
      data.diagnostics.find((storedDiagnostic) => storedDiagnostic.id === request.params.id),
      "Diagnostico",
    );

    if (input.orderId !== undefined) diagnostic.orderId = input.orderId;
    if (input.vehicleId !== undefined) diagnostic.vehicleId = input.vehicleId;
    if (input.symptom !== undefined) diagnostic.symptom = input.symptom;
    if (input.finding !== undefined) diagnostic.finding = input.finding;
    if (input.priority !== undefined) diagnostic.priority = input.priority;
    diagnostic.updatedAt = now();
    return diagnostic;
  });

  response.json(item);
});

routes.get("/users", async (_request, response) => {
  response.json((await readStore()).users);
});

routes.post("/users", async (request, response) => {
  const input = parseBody(userSchema, request.body);
  const item = await updateStore((data) => {
    const user = {
      id: newId(),
      ...input,
      active: true,
      createdAt: now(),
      updatedAt: now(),
    };
    data.users.push(user);
    return user;
  });

  response.status(201).json(item);
});

routes.patch("/users/:id", async (request, response) => {
  const input = parseBody(userUpdateSchema, request.body);
  const item = await updateStore((data) => {
    const user = required(
      data.users.find((storedUser) => storedUser.id === request.params.id),
      "Usuario",
    );

    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;
    if (input.role !== undefined) user.role = input.role;
    if (input.active !== undefined) user.active = input.active;
    user.updatedAt = now();
    return user;
  });

  response.json(item);
});

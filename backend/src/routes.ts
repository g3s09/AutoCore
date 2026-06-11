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
    (sum, item) => sum + item.stock * item.costCents,
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
    lowStockItems: data.inventoryItems.filter((item) => item.stock <= item.minStock)
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

routes.get("/inventory", async (_request, response) => {
  response.json((await readStore()).inventoryItems);
});

routes.post("/inventory", async (request, response) => {
  const input = parseBody(inventoryItemSchema, request.body);
  const item = await updateStore((data) => {
    if (data.inventoryItems.some((inventoryItem) => inventoryItem.sku === input.sku)) {
      throw new Error("SKU duplicado");
    }

    const inventoryItem = {
      id: newId(),
      sku: input.sku,
      name: input.name,
      category: input.category,
      stock: input.stock,
      minStock: input.minStock,
      costCents: toCents(input.cost),
      priceCents: toCents(input.price),
      createdAt: now(),
      updatedAt: now(),
    };
    data.inventoryItems.push(inventoryItem);
    return inventoryItem;
  });

  response.status(201).json(item);
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

import { formatMoney, type Customer, type ServiceOrder, type Vehicle } from "./domain.js";

export function buildTicket({
  order,
  customer,
  vehicle,
}: {
  order: ServiceOrder;
  customer?: Customer;
  vehicle?: Vehicle;
}) {
  const lines = [
    "AUTOCORE",
    "Ticket de servicio",
    "------------------------------",
    `Orden: ${order.code}`,
    `Fecha: ${order.closedAt ?? order.updatedAt}`,
    `Cliente: ${customer?.name ?? "Publico general"}`,
    `Vehiculo: ${vehicle?.makeModel ?? "No especificado"}`,
    "------------------------------",
    ...order.items.map(
      (item) =>
        `${item.quantity} x ${item.description} - ${formatMoney(
          item.lineTotalCents,
        )}`,
    ),
    "------------------------------",
    `Subtotal: ${formatMoney(order.subtotalCents)}`,
    `Descuento: ${formatMoney(order.discountCents)}`,
    `IVA: ${formatMoney(order.taxCents)}`,
    `Total: ${formatMoney(order.totalCents)}`,
    "------------------------------",
    "Gracias por confiar en AutoCore.",
  ];

  return lines.join("\n");
}

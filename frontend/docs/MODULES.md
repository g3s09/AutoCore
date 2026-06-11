# Modulos de AutoCore

## Dashboard

Muestra metricas operativas en cero y se alimentara de `GET /api/summary`.

## Clientes

Administra datos de contacto, historial, vehiculos relacionados y seguimiento comercial. Backend: `GET|POST /api/customers`.

## Vehiculos

Registra placa, modelo, propietario, VIN, kilometraje e historial tecnico. Backend: `GET|POST /api/vehicles`.

## Ordenes de servicio

Controla recepcion, diagnostico, reparacion, entrega, calculo final y ticket. Backend: `GET|POST /api/orders`, `POST /api/orders/:id/items`, `POST /api/orders/:id/close`, `GET /api/orders/:id/ticket`.

## Diagnosticos

Estructura sintomas, hallazgos, evidencia, prioridad y recomendaciones tecnicas. Backend: `GET|POST /api/diagnostics`.

## Inventario

Gestiona refacciones, consumibles, existencias, minimos, costos, precios y salidas por orden cerrada. Backend: `GET|POST /api/inventory`.

## Agenda

Organiza citas, disponibilidad del taller y validacion de cruces de horario. Backend: `GET|POST /api/appointments`.

## Reportes

Resume ventas, productividad, ticket promedio, retencion y desempeno operativo. Backend inicial: `GET /api/summary`.

## Usuarios y roles

Define accesos, permisos por modulo y responsabilidades del equipo. Backend: `GET|POST /api/users`.

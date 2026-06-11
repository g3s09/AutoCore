# AutoCore Backend

Backend local de AutoCore construido con Node.js, Express, TypeScript y Zod.

## Scripts

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## API base

Servidor por defecto: `http://127.0.0.1:4000/api`

- `GET /health`
- `GET /summary`
- `GET|POST /customers`
- `GET|POST /vehicles`
- `GET|POST /appointments`
- `GET|POST /inventory`
- `GET|POST /orders`
- `POST /orders/:id/items`
- `POST /orders/:id/close`
- `GET /orders/:id/ticket`
- `GET|POST /diagnostics`
- `GET|POST /users`

## Persistencia local

Los datos se guardan en `data/autocore.store.json`. Esta persistencia es suficiente para trabajar localmente y validar flujo de negocio antes de migrar a PostgreSQL/Prisma.

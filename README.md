# AutoCore

AutoCore es una plataforma web profesional para la gestion integral de talleres automotrices.

## Objetivo

Construir un sistema escalable, limpio y mantenible para administrar clientes, vehiculos, ordenes de servicio, diagnosticos, inventario, agenda, reportes, usuarios y roles.

## Estructura actual

- `frontend/`: aplicacion web con Next.js, React, TypeScript, Tailwind CSS y tema gris oscuro.
- `backend/`: API REST local con Node.js, Express, TypeScript, Zod y almacenamiento JSON.

## Scripts desde la raiz

En PowerShell usa `npm.cmd`:

```powershell
npm.cmd run dev:frontend
npm.cmd run dev:backend
npm.cmd run lint:frontend
npm.cmd run typecheck:backend
npm.cmd run build:frontend
npm.cmd run build:backend
```

## URLs locales

- Frontend: `http://127.0.0.1:3000/dashboard`
- Backend: `http://127.0.0.1:4000/api/health`

## Modo local tipo escritorio

En Windows puedes ejecutar:

```powershell
.\scripts\start-local.bat
```

Esto abre backend, frontend y una ventana de navegador en modo app para usar AutoCore localmente en tu PC.

## Estado

Base frontend en cero y backend local preparado para almacenar clientes, vehiculos, citas, inventario, ordenes, diagnosticos, usuarios, calculos finales y tickets.

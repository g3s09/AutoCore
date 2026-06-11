# AutoCore Frontend

Aplicacion web de AutoCore construida con Next.js, React, TypeScript y Tailwind CSS.

## Scripts

En PowerShell de Windows usa `npm.cmd`:

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

## Rutas principales

- `/dashboard`
- `/clientes`
- `/vehiculos`
- `/ordenes`
- `/diagnosticos`
- `/inventario`
- `/agenda`
- `/reportes`
- `/usuarios`

## Arquitectura actual

- `app/(platform)/`: rutas principales de la plataforma.
- `app/_components/`: componentes compartidos de UI.
- `app/_data/`: estado inicial en cero para el MVP visual.

## Backend esperado

La API local queda en `http://127.0.0.1:4000/api`. La siguiente fase natural es conectar los formularios del frontend a los endpoints REST del backend.

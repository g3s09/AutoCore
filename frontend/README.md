# AutoCore Frontend

Aplicacion web de AutoCore construida con Next.js, React, TypeScript y Tailwind CSS.

## Scripts

En PowerShell de Windows usa `npm.cmd` para evitar bloqueos por politica de ejecucion:

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
- `app/_data/`: datos mock centralizados para el MVP visual.

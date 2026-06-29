# Bartez ERP — App de escritorio (Electron)

App nativa de Windows que carga el ERP web (`https://<servidor>/admin`) en una
ventana propia, con sesión persistente, impresión nativa, notificaciones del SO,
selección de servidor multi-cliente y auto-actualización.

> **Arquitectura:** la app **no** empaqueta el frontend. Carga la web remota del
> ERP y comparte el mismo backend y base de datos que la versión web (fuente única
> de verdad). Cada deploy de la web actualiza la app al instante. Ver el roadmap
> completo en `~/.claude/plans/whimsical-wobbling-zebra.md`.

## Desarrollo

```bash
cd desktop
npm install
npm run dev      # compila TS y abre Electron en modo desarrollo
```

En el primer arranque se abre el **selector de servidor**. Para desarrollo podés
ingresar `http://localhost:3000` (si corrés la web local) o `https://bartez.com.ar`.

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run build` | Compila TypeScript (`src/` → `dist/`) y copia assets. |
| `npm run dev` | Build + abre Electron con DevTools habilitado. |
| `npm run start` | Build + abre Electron en modo normal. |
| `npm run dist` | Genera el instalador NSIS (`.exe`) en `release/`. |
| `npm run dist:dir` | Empaqueta sin instalador (carpeta, para pruebas). |

## Estructura

```
desktop/
├── src/
│   ├── main.ts            Proceso principal (ventanas, sesión, navegación)
│   ├── ipc.ts             Handlers IPC (servidor, impresión, notificaciones)
│   ├── menu.ts            Menú nativo
│   ├── updater.ts         Auto-actualización (electron-updater)
│   ├── config.ts          Configuración local persistente (electron-store)
│   ├── preload.ts         Puente seguro para la ventana del ERP
│   ├── picker-preload.ts  Puente para el selector de servidor
│   └── picker.html        UI del primer arranque
├── scripts/copy-assets.js Copia picker.html a dist/
├── electron-builder.yml   Config de empaquetado/instalador
└── package.json
```

## API nativa expuesta a la web

La web puede detectar el desktop y usar capacidades nativas vía `window.bartezDesktop`:

```js
if (window.bartezDesktop?.isDesktop) {
  await window.bartezDesktop.print({ silent: true });      // imprimir factura
  await window.bartezDesktop.notify({ title, body });       // notificación SO
  const printers = await window.bartezDesktop.listPrinters();
}
```

## Pendiente antes de distribuir comercialmente

- [ ] Agregar `build/icon.ico` (256×256) y descomentar `win.icon` en `electron-builder.yml`.
- [ ] Configurar `publish:` (GitHub Releases o S3) para auto-update.
- [ ] **Firma de código** (certificado EV/OV) para evitar el bloqueo de Windows SmartScreen.
- [ ] Probar el instalador en una VM Windows limpia.

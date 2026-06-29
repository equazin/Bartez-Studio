/**
 * Menú nativo de la aplicación.
 *
 * Minimalista y orientado al operador del ERP: recargar, zoom, impresión,
 * cambio de servidor y accesos de ayuda. DevTools sólo en modo desarrollo.
 */
import { app, BrowserWindow, Menu, shell, type MenuItemConstructorOptions } from "electron";
import { clearServerUrl } from "./config";

function focusedContents() {
  return BrowserWindow.getFocusedWindow()?.webContents;
}

interface MenuDeps {
  isDev: boolean;
  onServerChanged: () => void;
}

export function buildAppMenu(deps: MenuDeps): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Archivo",
      submenu: [
        {
          label: "Imprimir…",
          accelerator: "CmdOrCtrl+P",
          click: () => focusedContents()?.print({ printBackground: true }),
        },
        { type: "separator" },
        {
          label: "Cambiar de servidor…",
          click: () => {
            clearServerUrl();
            deps.onServerChanged();
          },
        },
        { type: "separator" },
        { role: "quit", label: "Salir" },
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Deshacer" },
        { role: "redo", label: "Rehacer" },
        { type: "separator" },
        { role: "cut", label: "Cortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Pegar" },
        { role: "selectAll", label: "Seleccionar todo" },
      ],
    },
    {
      label: "Ver",
      submenu: [
        {
          label: "Recargar",
          accelerator: "CmdOrCtrl+R",
          click: () => focusedContents()?.reload(),
        },
        {
          label: "Forzar recarga",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => focusedContents()?.reloadIgnoringCache(),
        },
        { type: "separator" },
        { role: "resetZoom", label: "Zoom normal" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Pantalla completa" },
        ...(deps.isDev
          ? ([{ role: "toggleDevTools", label: "Herramientas de desarrollo" }] as MenuItemConstructorOptions[])
          : []),
      ],
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Sitio web de Bartez",
          click: () => void shell.openExternal("https://bartez.com.ar"),
        },
        {
          label: "Soporte por WhatsApp",
          click: () => void shell.openExternal("https://wa.me/5493416684350"),
        },
        { type: "separator" },
        { label: `Versión ${app.getVersion()}`, enabled: false },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

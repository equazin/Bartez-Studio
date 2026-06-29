/**
 * Proceso principal de Bartez ERP Desktop.
 *
 * Estrategia (ver roadmap): la app NO empaqueta el frontend. Carga la web
 * remota del ERP (`${serverUrl}/admin`) dentro de una ventana nativa con sesión
 * persistente, de modo que la cookie de sesión sobreviva reinicios y el deploy
 * de la web actualice la app al instante. Encima se agrega la capa nativa
 * (impresión, notificaciones, multi-servidor, auto-update).
 *
 * Flujo de ventanas:
 *  - Primer arranque (sin servidor) → ventana "picker" para elegir servidor.
 *  - Con servidor configurado → ventana principal cargando el ERP remoto.
 */
import { app, BrowserWindow, session, shell } from "electron";
import * as path from "node:path";
import {
  getServerUrl,
  getWindowBounds,
  setWindowBounds,
  type WindowBounds,
} from "./config";
import { buildAppMenu } from "./menu";
import { registerIpcHandlers } from "./ipc";
import { initAutoUpdater } from "./updater";

const SESSION_PARTITION = "persist:bartez";
const PICKER_FILE = path.join(__dirname, "picker.html");

let mainWindow: BrowserWindow | null = null;
let pickerWindow: BrowserWindow | null = null;

function isDev(): boolean {
  return process.env.BARTEZ_DEV === "1" || !app.isPackaged;
}

/** Origen del servidor configurado (para la whitelist de navegación). */
function currentOrigin(): string | null {
  const url = getServerUrl();
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * Navegación segura: dentro del origen del servidor se permite; cualquier otro
 * destino (links externos, target=_blank) se abre en el navegador del sistema.
 */
function hardenNavigation(window: BrowserWindow): void {
  window.webContents.on("will-navigate", (event, navUrl) => {
    const allowedOrigin = currentOrigin();
    if (allowedOrigin && navUrl.startsWith(allowedOrigin)) return;
    event.preventDefault();
    void shell.openExternal(navUrl);
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
}

function persistBounds(window: BrowserWindow): void {
  if (window.isDestroyed()) return;
  const bounds = window.getBounds();
  const next: WindowBounds = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    maximized: window.isMaximized(),
  };
  setWindowBounds(next);
}

function createMainWindow(): BrowserWindow {
  const saved = getWindowBounds();

  const window = new BrowserWindow({
    width: saved.width,
    height: saved.height,
    x: saved.x,
    y: saved.y,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    backgroundColor: "#070a16",
    title: "Bartez ERP",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: SESSION_PARTITION,
      spellcheck: true,
    },
  });

  if (saved.maximized) window.maximize();
  window.once("ready-to-show", () => window.show());

  let saveTimer: NodeJS.Timeout | null = null;
  const scheduleSave = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => persistBounds(window), 400);
  };
  window.on("resize", scheduleSave);
  window.on("move", scheduleSave);
  window.on("close", () => persistBounds(window));

  hardenNavigation(window);
  window.on("closed", () => {
    mainWindow = null;
  });

  void window.loadURL(`${getServerUrl()}/admin`);
  return window;
}

function createPickerWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 520,
    height: 580,
    resizable: false,
    show: false,
    backgroundColor: "#070a16",
    title: "Bartez ERP — Configuración",
    webPreferences: {
      preload: path.join(__dirname, "picker-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once("ready-to-show", () => window.show());
  window.on("closed", () => {
    pickerWindow = null;
  });

  void window.loadFile(PICKER_FILE);
  return window;
}

/** Decide qué ventana mostrar según haya o no servidor configurado. */
function openAppropriateWindow(): void {
  if (getServerUrl()) {
    if (!mainWindow) mainWindow = createMainWindow();
    else mainWindow.focus();
  } else {
    if (!pickerWindow) pickerWindow = createPickerWindow();
    else pickerWindow.focus();
  }
}

/**
 * Transición tras cambiar la configuración de servidor:
 *  - Si ahora hay servidor → abrir app y cerrar picker.
 *  - Si se limpió el servidor → abrir picker y cerrar app.
 */
function onServerChanged(): void {
  if (getServerUrl()) {
    if (!mainWindow) mainWindow = createMainWindow();
    else void mainWindow.loadURL(`${getServerUrl()}/admin`);
    if (pickerWindow) {
      pickerWindow.close();
      pickerWindow = null;
    }
  } else {
    if (!pickerWindow) pickerWindow = createPickerWindow();
    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }
  }
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

// ---------------------------------------------------------------------------
// Single-instance lock.
// ---------------------------------------------------------------------------
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const target = mainWindow ?? pickerWindow;
    if (target) {
      if (target.isMinimized()) target.restore();
      target.focus();
    }
  });

  app.whenReady().then(() => {
    const persistentSession = session.fromPartition(SESSION_PARTITION);
    persistentSession.setUserAgent(
      `${persistentSession.getUserAgent()} BartezDesktop/${app.getVersion()}`,
    );

    registerIpcHandlers({ onServerChanged, getMainWindow });
    buildAppMenu({ isDev: isDev(), onServerChanged });

    openAppropriateWindow();

    if (!isDev()) initAutoUpdater();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) openAppropriateWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

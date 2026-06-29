/**
 * Proceso principal de Bartez ERP Desktop.
 *
 * Estrategia: la app NO empaqueta el frontend. Carga la web remota del ERP
 * (`${serverUrl}/admin`) dentro de una ventana nativa con sesión persistente.
 *
 * Flujo de ventanas:
 *  - Sin servidor configurado → ventana "picker" para elegir servidor.
 *  - Con servidor → splash screen → carga web → ventana principal o pantalla offline.
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
import { registerIpcHandlers, probeServer } from "./ipc";
import { initAutoUpdater } from "./updater";

const SESSION_PARTITION = "persist:bartez";

const PICKER_FILE = path.join(__dirname, "picker.html");
const SPLASH_FILE = path.join(__dirname, "splash.html");
const OFFLINE_FILE = path.join(__dirname, "offline.html");

let mainWindow: BrowserWindow | null = null;
let pickerWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

function isDev(): boolean {
  return process.env.BARTEZ_DEV === "1" || !app.isPackaged;
}

function currentOrigin(): string | null {
  const url = getServerUrl();
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

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

// ---------------------------------------------------------------------------
// Splash screen
// ---------------------------------------------------------------------------

function createSplashWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 420,
    height: 320,
    resizable: false,
    frame: false,
    transparent: false,
    show: false,
    backgroundColor: "#070a16",
    title: "Bartez ERP",
    webPreferences: {
      preload: path.join(__dirname, "splash-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once("ready-to-show", () => window.show());
  window.on("closed", () => {
    splashWindow = null;
  });

  void window.loadFile(SPLASH_FILE);
  return window;
}

function sendSplashProgress(pct: number, msg: string): void {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send("splash:progress", pct, msg);
  }
}

function closeSplash(): void {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
    splashWindow = null;
  }
}

// ---------------------------------------------------------------------------
// Main window
// ---------------------------------------------------------------------------

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

  return window;
}

/**
 * Loads the ERP with splash screen flow:
 * 1. Show splash
 * 2. Probe server
 * 3. If OK → load ERP in main window, close splash when ready
 * 4. If fail → show offline screen in main window, close splash
 */
async function loadWithSplash(): Promise<void> {
  const serverUrl = getServerUrl();
  if (!serverUrl) return;

  splashWindow = createSplashWindow();
  sendSplashProgress(10, "Verificando servidor…");

  const probe = await probeServer(serverUrl);
  sendSplashProgress(40, "Servidor encontrado");

  if (!mainWindow) mainWindow = createMainWindow();

  if (probe.ok) {
    sendSplashProgress(60, "Cargando el ERP…");

    mainWindow.webContents.once("did-finish-load", () => {
      sendSplashProgress(100, "Listo");
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
        closeSplash();
      }, 300);
    });

    mainWindow.webContents.once("did-fail-load", () => {
      showOffline();
    });

    void mainWindow.loadURL(`${serverUrl}/admin`);
  } else {
    showOffline();
  }
}

function showOffline(): void {
  closeSplash();
  if (!mainWindow) mainWindow = createMainWindow();

  const offlinePreload = path.join(__dirname, "offline-preload.js");
  const offlineWindow = new BrowserWindow({
    width: 520,
    height: 480,
    resizable: false,
    show: false,
    backgroundColor: "#070a16",
    title: "Bartez ERP — Sin conexión",
    webPreferences: {
      preload: offlinePreload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  offlineWindow.once("ready-to-show", () => offlineWindow.show());
  void offlineWindow.loadFile(OFFLINE_FILE);

  // Hide main window while offline is shown
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide();
  }

  offlineWindow.on("closed", () => {
    // If main window still has no content, close it too
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.close();
      mainWindow = null;
    }
  });
}

// ---------------------------------------------------------------------------
// Picker (server selection)
// ---------------------------------------------------------------------------

function createPickerWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 520,
    height: 620,
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

// ---------------------------------------------------------------------------
// Window orchestration
// ---------------------------------------------------------------------------

function openAppropriateWindow(): void {
  if (getServerUrl()) {
    void loadWithSplash();
  } else {
    if (!pickerWindow) pickerWindow = createPickerWindow();
    else pickerWindow.focus();
  }
}

function onServerChanged(): void {
  if (getServerUrl()) {
    if (pickerWindow) {
      pickerWindow.close();
      pickerWindow = null;
    }
    void loadWithSplash();
  } else {
    closeSplash();
    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }
    if (!pickerWindow) pickerWindow = createPickerWindow();
  }
}

function onRetry(): void {
  // Close all windows and restart the splash flow
  BrowserWindow.getAllWindows().forEach((w) => {
    if (w !== mainWindow) w.close();
  });
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
  void loadWithSplash();
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

// ---------------------------------------------------------------------------
// Single-instance lock
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

    registerIpcHandlers({ onServerChanged, getMainWindow, onRetry });
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

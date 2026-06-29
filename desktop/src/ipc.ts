/**
 * Handlers IPC del proceso principal.
 *
 * Exponen al renderer (vía preload/contextBridge) sólo lo necesario:
 *  - configuración de servidor (multi-cliente)
 *  - impresión nativa
 *  - notificaciones del SO
 * Todo input que cruza el puente se valida acá; nunca se confía en el renderer.
 */
import { BrowserWindow, ipcMain, net, Notification } from "electron";
import {
  getServerUrl,
  setServerUrl,
  clearServerUrl,
  normalizeServerUrl,
} from "./config";

interface IpcDeps {
  onServerChanged: () => void;
  getMainWindow: () => BrowserWindow | null;
}

export interface ServerValidationResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Verifica que la URL responda y parezca un servidor BARTEZ.
 * Hace un GET liviano al origen con timeout; no exige status 200 exacto
 * (algunas rutas redirigen), sólo que el host conteste por HTTP.
 */
function probeServer(url: string): Promise<ServerValidationResult> {
  return new Promise((resolve) => {
    const request = net.request({ method: "GET", url });
    const timeout = setTimeout(() => {
      request.abort();
      resolve({ ok: false, error: "El servidor no respondió a tiempo." });
    }, 8000);

    request.on("response", (response) => {
      clearTimeout(timeout);
      const status = response.statusCode;
      // Consumir y descartar el cuerpo para liberar el socket.
      response.on("data", () => {});
      response.on("end", () => {
        if (status >= 200 && status < 500) {
          resolve({ ok: true, url });
        } else {
          resolve({ ok: false, error: `El servidor respondió ${status}.` });
        }
      });
    });

    request.on("error", () => {
      clearTimeout(timeout);
      resolve({ ok: false, error: "No se pudo conectar con el servidor." });
    });

    request.end();
  });
}

export function registerIpcHandlers(deps: IpcDeps): void {
  // --- Configuración de servidor ---------------------------------------
  ipcMain.handle("server:get", () => getServerUrl());

  ipcMain.handle("server:validate", async (_event, raw: unknown) => {
    const normalized = normalizeServerUrl(String(raw ?? ""));
    if (!normalized) {
      return { ok: false, error: "URL inválida. Ej: https://bartez.com.ar" } satisfies ServerValidationResult;
    }
    return probeServer(normalized);
  });

  ipcMain.handle("server:set", async (_event, raw: unknown) => {
    const normalized = normalizeServerUrl(String(raw ?? ""));
    if (!normalized) {
      return { ok: false, error: "URL inválida." } satisfies ServerValidationResult;
    }
    const probe = await probeServer(normalized);
    if (!probe.ok) return probe;
    setServerUrl(normalized);
    deps.onServerChanged();
    return { ok: true, url: normalized } satisfies ServerValidationResult;
  });

  ipcMain.handle("server:change", () => {
    clearServerUrl();
    deps.onServerChanged();
    return { ok: true } satisfies ServerValidationResult;
  });

  // --- Impresión nativa -------------------------------------------------
  // Imprime el contenido actual de la ventana. Si silent=true usa la
  // impresora por defecto sin diálogo (útil para facturas/remitos en serie).
  ipcMain.handle("print:current", async (_event, opts: unknown) => {
    const window = deps.getMainWindow();
    if (!window) return { ok: false, error: "No hay ventana activa." };
    const options = (opts ?? {}) as { silent?: boolean; deviceName?: string };
    return new Promise((resolve) => {
      window.webContents.print(
        {
          silent: Boolean(options.silent),
          deviceName: options.deviceName,
          printBackground: true,
        },
        (success, failureReason) => {
          resolve(success ? { ok: true } : { ok: false, error: failureReason });
        },
      );
    });
  });

  // Lista de impresoras disponibles (para que la UI permita elegir).
  ipcMain.handle("print:list", async () => {
    const window = deps.getMainWindow();
    if (!window) return [];
    try {
      return await window.webContents.getPrintersAsync();
    } catch {
      return [];
    }
  });

  // --- Notificaciones del SO -------------------------------------------
  ipcMain.handle("notify:show", (_event, payload: unknown) => {
    if (!Notification.isSupported()) return { ok: false };
    const data = (payload ?? {}) as { title?: string; body?: string };
    const notification = new Notification({
      title: data.title ?? "Bartez ERP",
      body: data.body ?? "",
    });
    notification.on("click", () => {
      const window = deps.getMainWindow();
      if (window) {
        if (window.isMinimized()) window.restore();
        window.focus();
      }
    });
    notification.show();
    return { ok: true };
  });
}

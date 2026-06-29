/**
 * Preload del selector de servidor (pantalla de primer arranque).
 * Expone sólo las operaciones de configuración de servidor.
 */
import { contextBridge, ipcRenderer } from "electron";

const api = {
  validate: (url: string) => ipcRenderer.invoke("server:validate", url),
  set: (url: string) => ipcRenderer.invoke("server:set", url),
  getCurrent: () => ipcRenderer.invoke("server:get"),
};

contextBridge.exposeInMainWorld("bartezSetup", api);

export type BartezSetupApi = typeof api;

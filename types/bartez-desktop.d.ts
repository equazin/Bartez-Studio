interface BartezDesktopApi {
  isDesktop: true;
  version: string;
  print: (options?: { silent?: boolean; deviceName?: string }) => Promise<{ ok: boolean; error?: string }>;
  listPrinters: () => Promise<unknown[]>;
  notify: (payload: { title?: string; body?: string }) => Promise<{ ok: boolean }>;
  getServerUrl: () => Promise<string>;
  changeServer: () => Promise<{ ok: boolean }>;
}

declare global {
  interface Window {
    bartezDesktop?: BartezDesktopApi;
  }
}

export {};

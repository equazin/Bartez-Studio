type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  context: string;
  data?: unknown;
  error?: string;
  ts: string;
}

function emit(level: LogLevel, context: string, payload?: unknown): void {
  const entry: LogEntry = { level, context, ts: new Date().toISOString() };
  if (payload !== undefined) {
    if (level === "error") {
      entry.error = payload instanceof Error ? payload.message : String(payload);
    } else {
      entry.data = payload;
    }
  }
  const serialized = JSON.stringify(entry);
  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(serialized);
  } else if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(serialized);
  } else {
    // eslint-disable-next-line no-console
    console.log(serialized);
  }
}

export const logger = {
  info: (context: string, data?: unknown) => emit("info", context, data),
  warn: (context: string, data?: unknown) => emit("warn", context, data),
  error: (context: string, error?: unknown) => emit("error", context, error),
};

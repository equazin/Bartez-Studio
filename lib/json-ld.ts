/**
 * Serializa un objeto JSON-LD para inyectarlo en un <script type="application/ld+json">
 * de forma segura.
 *
 * JSON.stringify no escapa `<`, `>` ni `&`, asi que un valor que contenga
 * `</script>` (p. ej. proveniente de contenido editable) podria romper el tag
 * y derivar en XSS. Escapamos esos tres caracteres a secuencias unicode:
 * siguen siendo JSON valido pero no pueden cerrar el script.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

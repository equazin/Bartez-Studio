import { company } from "../constants";

/**
 * Mapa embebido (OpenStreetMap) — sin API key, lazy loaded.
 * Para Google Maps, reemplazar el src por el embed con NEXT_PUBLIC_MAPS_KEY.
 */
export function Map() {
  const { lat, lng } = company.geo;
  const d = 0.01;
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <iframe
      title={`Ubicación de ${company.name} — ${company.address}`}
      src={src}
      loading="lazy"
      className="h-[200px] w-full border-0"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

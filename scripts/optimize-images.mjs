#!/usr/bin/env node
/**
 * Optimiza imágenes pesadas del sitio público sin cambiar sus URLs.
 *
 * Estrategia:
 *  - PNG con transparencia (barpos/*, home/hero-it-equipment-transparent.png)
 *    → PNG palletizado + comprimido con quality/effort altos, manteniendo alpha.
 *  - PNG opaco (home/warehouse-hero.png) → convierte a JPEG con calidad 82.
 *    NOTA: solo funciona si la imagen NO tiene transparencia real y el
 *    consumidor no depende de PNG específicamente. Warehouse-hero se usa
 *    detrás de un gradient, así que JPEG está bien.
 *  - JPEG existentes → recomprime con mozjpeg quality 82 si excede budget.
 *
 * Idempotente: si el archivo ya está bajo el budget, no lo toca.
 * Sobrescribe in-place (usa git para diff/rollback si algo sale mal).
 *
 * Uso: node scripts/optimize-images.mjs [--dry]
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/photos");
const DRY = process.argv.includes("--dry");

// Budget máximo en KB por tipo. Todo lo que exceda se recomprime.
const BUDGETS = {
  png: 200,
  jpg: 150,
  webp: 150,
};

// Casos especiales: PNGs que en realidad no necesitan alpha y podemos
// convertir a JPEG. Se listan por ruta relativa desde public/photos.
const CONVERT_TO_JPG = new Set(["home/warehouse-hero.png"]);

async function optimizeFile(fullPath, relPath) {
  const ext = path.extname(fullPath).toLowerCase().slice(1);
  if (!["png", "jpg", "jpeg", "webp"].includes(ext)) return null;

  const stat = await fs.stat(fullPath);
  const sizeKB = stat.size / 1024;
  const budget = BUDGETS[ext === "jpeg" ? "jpg" : ext] ?? 200;

  if (sizeKB <= budget && !CONVERT_TO_JPG.has(relPath)) {
    return { relPath, status: "skip", before: sizeKB, after: sizeKB };
  }

  const buffer = await fs.readFile(fullPath);
  const image = sharp(buffer);
  const meta = await image.metadata();

  // Redimensiono si supera 1920px de ancho (más que suficiente para hero).
  const maxWidth = 1920;
  const pipeline = (meta.width ?? 0) > maxWidth ? image.resize({ width: maxWidth, withoutEnlargement: true }) : image;

  let output;
  let outPath = fullPath;

  if (CONVERT_TO_JPG.has(relPath)) {
    output = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    outPath = fullPath.replace(/\.png$/i, ".jpg");
  } else if (ext === "png") {
    // PNG con alpha: usa palette + quality alto.
    output = await pipeline.png({ compressionLevel: 9, effort: 10, palette: true, quality: 85 }).toBuffer();
  } else if (ext === "jpg" || ext === "jpeg") {
    output = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else if (ext === "webp") {
    output = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
  } else {
    return null;
  }

  const afterKB = output.length / 1024;

  if (!DRY) {
    await fs.writeFile(outPath, output);
    if (outPath !== fullPath) {
      await fs.unlink(fullPath); // borra el PNG original si convertimos a JPG
    }
  }

  return {
    relPath: outPath.replace(fullPath.slice(0, -path.basename(fullPath).length), path.dirname(relPath) + "/").replace(/^\/+/, ""),
    status: afterKB < sizeKB ? "ok" : "no-gain",
    before: sizeKB,
    after: afterKB,
    converted: outPath !== fullPath,
  };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full)));
    } else {
      results.push(full);
    }
  }
  return results;
}

const files = await walk(ROOT);
console.log(`Escaneando ${files.length} archivos en public/photos (${DRY ? "DRY RUN" : "APLICA CAMBIOS"})\n`);

const results = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  try {
    const r = await optimizeFile(file, rel);
    if (r) results.push(r);
  } catch (err) {
    console.error(`ERROR ${rel}:`, err.message);
  }
}

const changed = results.filter((r) => r.status === "ok");
const noGain = results.filter((r) => r.status === "no-gain");

console.log("\nOptimizados:");
for (const r of changed) {
  const savedKB = (r.before - r.after).toFixed(1);
  const pct = ((1 - r.after / r.before) * 100).toFixed(0);
  const arrow = r.converted ? " → JPG" : "";
  console.log(`  ${r.relPath}${arrow}: ${r.before.toFixed(0)} KB → ${r.after.toFixed(0)} KB (-${savedKB} KB, -${pct}%)`);
}

if (noGain.length) {
  console.log("\nSin ganancia (dejamos el original):");
  for (const r of noGain) {
    console.log(`  ${r.relPath}: ${r.before.toFixed(0)} KB (comprimido daría ${r.after.toFixed(0)} KB)`);
  }
}

const totalBefore = changed.reduce((s, r) => s + r.before, 0);
const totalAfter = changed.reduce((s, r) => s + r.after, 0);
console.log(`\nAhorro total: ${(totalBefore - totalAfter).toFixed(0)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);

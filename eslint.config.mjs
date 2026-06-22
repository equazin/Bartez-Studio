import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { rules: { "react-hooks/refs": "off" } },
  globalIgnores([".next/**", "legacy/**", "next-env.d.ts"]),
]);

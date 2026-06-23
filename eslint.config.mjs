import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { rules: { "react-hooks/refs": "off", "react-hooks/set-state-in-effect": "off", "@typescript-eslint/no-explicit-any": "off", "@typescript-eslint/no-unused-vars": "off" } },
  globalIgnores([".next/**", "legacy/**", "next-env.d.ts"]),
]);

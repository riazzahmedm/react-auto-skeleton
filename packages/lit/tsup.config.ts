import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: ["lit", "@auto-skeleton/core"],
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" })
});

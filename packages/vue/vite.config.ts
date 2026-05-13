import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ["src"], tsconfigPath: "./tsconfig.json" }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AutoSkeletonVue",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js"),
    },
    rollupOptions: {
      external: ["vue", "@auto-skeleton/core"],
      output: {
        globals: {
          vue: "Vue",
          "@auto-skeleton/core": "AutoSkeletonCore",
        },
      },
    },
    cssCodeSplit: false,
  },
});

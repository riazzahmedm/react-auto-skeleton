import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // CSS alias must come before the JS alias (more specific first)
      "@auto-skeleton/vue/styles.css": path.resolve(__dirname, "../../packages/vue/src/styles.css"),
      "@auto-skeleton/vue": path.resolve(__dirname, "../../packages/vue/src/index.ts"),
      "@auto-skeleton/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
    },
  },
});

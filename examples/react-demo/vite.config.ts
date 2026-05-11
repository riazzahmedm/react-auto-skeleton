import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/react-auto-skeleton/",
  plugins: [react()],
  resolve: {
    alias: {
      "@auto-skeleton/react": path.resolve(__dirname, "../../packages/react/src/index.ts"),
      "@auto-skeleton/core": path.resolve(__dirname, "../../packages/core/src/index.ts")
    }
  }
});

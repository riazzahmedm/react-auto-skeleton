import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/*.test.ts", "packages/**/*.test.tsx"],
    coverage: {
      reporter: ["text", "html"],
      include: ["packages/core/src/**/*.ts", "packages/react/src/**/*.ts", "packages/react/src/**/*.tsx", "packages/lit/src/**/*.ts"]
    }
  }
});

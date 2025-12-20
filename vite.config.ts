import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: "src/handler.ts",
      formats: ["es"],
      fileName: () => "handler.js",
    },
    rollupOptions: {
      external: [
        "aws-sdk", // already provided by Lambda
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: true,
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";
import path from "path";

export default defineConfig({
  plugins: [react(), mockDevServerPlugin()],
  server: {
    port: 8080,
    proxy: {
      "^/api": "http://example.com/",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

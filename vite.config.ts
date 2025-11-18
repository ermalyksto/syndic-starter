import { defineConfig } from "vite";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";
import path from "path";

export default defineConfig({
  plugins: [mockDevServerPlugin()],
  server: {
    proxy: {
      "^/api": "http://example.com/",
    },
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

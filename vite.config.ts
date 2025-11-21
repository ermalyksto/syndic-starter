import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";
import { componentTagger } from "lovable-tagger";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mockDevServerPlugin(),
    componentTagger(),
    // mode === "development" && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
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
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Plugin cleanup: removed external tagging plugin

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // Use relative paths for assets
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

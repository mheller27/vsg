import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: "apps/public-site",
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/public-site/src"),
      "@shared-ui": path.resolve(__dirname, "packages/shared-ui"),
      "@shared-lib": path.resolve(__dirname, "packages/shared-lib"),
      "@shared-hooks": path.resolve(__dirname, "packages/shared-hooks"),
      "@shared-types": path.resolve(__dirname, "packages/shared-types"),
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    tsconfigPaths(), // still included in case you want future tsconfig sync
  ].filter(Boolean),
}));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The agent sandbox serves live previews from an *.e2b.app subdomain — its
  // hostname must be allowed or Vite answers 403 and the preview stays blank.
  preview: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app"],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this matches your port
    host: true, // Make sure Vite is accessible from all network interfaces
  },
  build: {
    outDir: "build",
  },
});

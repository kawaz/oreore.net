// vite.config.ts example for using oreore.net certs
// Fetches cert bundle at dev server startup to avoid key/cert mismatch
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    https: async () => {
      const { cert, key } = await fetch("https://oreore.net/all.pem.json").then(r => r.json());
      return { cert, key };
    },
    host: "myapp.oreore.net",
  },
});

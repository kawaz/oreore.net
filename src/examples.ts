export const examples: Record<string, string> = {
  "bun-serve.ts": `\
// Bun.serve() with TLS - the simplest modern HTTPS server
const { cert, key } = await fetch("https://oreore.net/all.pem.json").then(r => r.json());
Bun.serve({
  port: 8443,
  tls: { cert, key },
  fetch(req) {
    return new Response(\`Hello from \${new URL(req.url).hostname}!\`);
  },
});
console.log("Listening on https://localhost.oreore.net:8443");
`,
  "deno-serve.ts": `\
// Deno.serve() with TLS
const { cert, key } = await (await fetch("https://oreore.net/all.pem.json")).json();
Deno.serve({
  port: 8443,
  cert,
  key,
}, (req) => new Response(\`Hello from \${new URL(req.url).hostname}!\`));
`,
  "vite.config.ts": `\
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
`,
  "node-hono.mjs": `\
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text(\`Hello from \${c.req.header("host")}!\`));

const { cert, key } = await fetch("https://oreore.net/all.pem.json").then(r => r.json());
serve({
  fetch: app.fetch,
  port: 8443,
  createServer: (await import("node:https")).createServer,
  serverOptions: { key, cert },
});
console.log("Listening on https://localhost.oreore.net:8443");
`,
  "caddy.txt": `\
# Caddyfile example - reverse proxy with oreore.net certs
# Download cert bundle and split:
#   json=$(curl -s https://oreore.net/all.pem.json)
#   echo "$json" | jq -r '.key' > key.pem
#   echo "$json" | jq -r '.cert' > crt.pem

myapp.oreore.net:8443 {
    tls crt.pem key.pem
    reverse_proxy localhost:3000
}
`,
};

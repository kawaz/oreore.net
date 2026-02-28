import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text(`Hello from ${c.req.header("host")}!`));

const { cert, key } = await fetch("https://oreore.net/all.pem.json").then(r => r.json());
serve({
  fetch: app.fetch,
  port: 8443,
  createServer: (await import("node:https")).createServer,
  serverOptions: { key, cert },
});
console.log("Listening on https://localhost.oreore.net:8443");

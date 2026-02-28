import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import type { Env } from "../src/env";

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function fetchWorker(path: string): Promise<Response> {
  const request = new IncomingRequest(`https://oreore.net${path}`);
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

describe("GET /", () => {
  it("returns HTML with correct title", async () => {
    const response = await fetchWorker("/");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
    const body = await response.text();
    expect(body).toContain("oreore.net | Free certificate for localhost");
  });

  it("includes CORS header", async () => {
    const response = await fetchWorker("/");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("includes DNS record information", async () => {
    const response = await fetchWorker("/");
    const body = await response.text();
    expect(body).toContain("*.oreore.net");
    expect(body).toContain("*.lo.oreore.net");
    expect(body).toContain("*.localhost.oreore.net");
    expect(body).toContain("127.0.0.1");
    expect(body).toContain("::1");
  });

  it("includes certificate download links", async () => {
    const response = await fetchWorker("/");
    const body = await response.text();
    expect(body).toContain('href="/key.pem"');
    expect(body).toContain('href="/crt.pem"');
    expect(body).toContain('href="/all.pem"');
    expect(body).toContain('href="/all.pem.json"');
  });

  it("includes example links", async () => {
    const response = await fetchWorker("/");
    const body = await response.text();
    expect(body).toContain('href="/examples/bun-serve.ts"');
    expect(body).toContain('href="/examples/deno-serve.ts"');
    expect(body).toContain('href="/examples/vite.config.ts"');
    expect(body).toContain('href="/examples/node-hono.mjs"');
    expect(body).toContain('href="/examples/caddy.txt"');
  });

  it("includes curl usage examples", async () => {
    const response = await fetchWorker("/");
    const body = await response.text();
    expect(body).toContain("curl");
    expect(body).toContain("https://oreore.net/all.pem.json");
  });
});

describe("certificate endpoints", () => {
  const certData = { key: "fake-key-content", cert: "fake-cert-content" };

  beforeEach(async () => {
    await env.CERTS.put("all.pem.json", JSON.stringify(certData));
  });

  it("GET /all.pem.json returns JSON from R2", async () => {
    const response = await fetchWorker("/all.pem.json");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const body = await response.json();
    expect(body).toEqual(certData);
  });

  it("GET /key.pem returns key generated from all.pem.json", async () => {
    const response = await fetchWorker("/key.pem");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const body = await response.text();
    expect(body).toBe(certData.key);
  });

  it("GET /crt.pem returns cert generated from all.pem.json", async () => {
    const response = await fetchWorker("/crt.pem");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    const body = await response.text();
    expect(body).toBe(certData.cert);
  });

  it("GET /all.pem returns cert+key concatenated from all.pem.json", async () => {
    const response = await fetchWorker("/all.pem");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    const body = await response.text();
    expect(body).toBe(certData.cert + "\n" + certData.key);
  });
});

describe("certificate endpoints when R2 is empty", () => {
  it("GET /key.pem returns 503 when not available", async () => {
    const response = await fetchWorker("/key.pem");
    expect(response.status).toBe(503);
    const body = await response.text();
    expect(body).toBe("Certificate not yet available. Please try again later.");
  });

  it("GET /crt.pem returns 503 when not available", async () => {
    const response = await fetchWorker("/crt.pem");
    expect(response.status).toBe(503);
  });

  it("GET /all.pem returns 503 when not available", async () => {
    const response = await fetchWorker("/all.pem");
    expect(response.status).toBe(503);
  });

  it("GET /all.pem.json returns 503 when not available", async () => {
    const response = await fetchWorker("/all.pem.json");
    expect(response.status).toBe(503);
  });
});

describe("example endpoints", () => {
  it("GET /examples/bun-serve.ts returns TypeScript content", async () => {
    const response = await fetchWorker("/examples/bun-serve.ts");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/typescript");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const body = await response.text();
    expect(body).toContain("Bun.serve");
  });

  it("GET /examples/deno-serve.ts returns TypeScript content", async () => {
    const response = await fetchWorker("/examples/deno-serve.ts");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/typescript");
    const body = await response.text();
    expect(body).toContain("Deno.serve");
  });

  it("GET /examples/vite.config.ts returns TypeScript content", async () => {
    const response = await fetchWorker("/examples/vite.config.ts");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/typescript");
    const body = await response.text();
    expect(body).toContain("defineConfig");
  });

  it("GET /examples/node-hono.mjs returns JavaScript content", async () => {
    const response = await fetchWorker("/examples/node-hono.mjs");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/javascript");
    const body = await response.text();
    expect(body).toContain("Hono");
  });

  it("GET /examples/caddy.txt returns plain text content", async () => {
    const response = await fetchWorker("/examples/caddy.txt");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    const body = await response.text();
    expect(body).toContain("reverse_proxy");
  });

  it("GET /examples/unknown.mjs returns 404", async () => {
    const response = await fetchWorker("/examples/unknown.mjs");
    expect(response.status).toBe(404);
  });
});

describe("404 handling", () => {
  it("returns 404 for unknown paths", async () => {
    const response = await fetchWorker("/unknown");
    expect(response.status).toBe(404);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("returns 404 for POST /", async () => {
    const request = new IncomingRequest("https://oreore.net/", { method: "POST" });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });
});

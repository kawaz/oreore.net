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

async function fetchWorker(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const request = new IncomingRequest(`https://oreore.net${path}`, init);
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

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

describe("404 handling", () => {
  it("returns 404 for unknown paths", async () => {
    const response = await fetchWorker("/unknown");
    expect(response.status).toBe(404);
  });

  it("returns 404 for POST /all.pem.json", async () => {
    const response = await fetchWorker("/all.pem.json", { method: "POST" });
    expect(response.status).toBe(404);
  });
});

import { Env } from "./env";

export type { Env };

// Design rationale: CORS is fully open because this service distributes
// shared localhost development certificates. The certificates are not secret
// (they only work for *.oreore.net which resolves to 127.0.0.1) and must be
// fetchable from any origin (e.g., dev servers, CI pipelines).
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
};

const CERT_ENDPOINTS = new Set(["/all.pem.json", "/key.pem", "/crt.pem", "/all.pem"]);

async function getCertData(
  env: Env
): Promise<{ cert: string; key: string } | null> {
  const obj = await env.CERTS.get("all.pem.json");
  if (obj === null) return null;
  return await obj.json();
}

function corsResponse(body: string, contentType: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": contentType, ...CORS_HEADERS },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method !== "GET" || !CERT_ENDPOINTS.has(pathname)) {
      // Static assets (/, /examples/*, etc.) are handled by Workers Static Assets.
      // Only cert endpoints reach this Worker code.
      return new Response("Not Found", { status: 404 });
    }

    const certData = await getCertData(env);
    if (certData === null) {
      return corsResponse(
        "Certificate not yet available. Please try again later.",
        "text/plain",
        503
      );
    }

    switch (pathname) {
      case "/all.pem.json":
        return corsResponse(JSON.stringify(certData), "application/json");
      case "/key.pem":
        return corsResponse(certData.key, "text/plain");
      case "/crt.pem":
        return corsResponse(certData.cert, "text/plain");
      case "/all.pem":
        return corsResponse(certData.cert + "\n" + certData.key, "text/plain");
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
};

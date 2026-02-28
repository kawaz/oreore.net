import { Env } from "./env";
import { siteResponse } from "./site";
import { examples } from "./examples";

export type { Env };

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
};

function unavailableResponse(): Response {
  return new Response(
    "Certificate not yet available. Please try again later.",
    { status: 503, headers: CORS_HEADERS }
  );
}

async function getCertData(
  env: Env
): Promise<{ cert: string; key: string } | null> {
  const obj = await env.CERTS.get("all.pem.json");
  if (obj === null) return null;
  return await obj.json();
}

function textResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "text/plain", ...CORS_HEADERS },
  });
}

function jsonResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (method !== "GET") {
      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    }

    if (pathname === "/") {
      return siteResponse();
    }

    if (
      pathname === "/all.pem.json" ||
      pathname === "/key.pem" ||
      pathname === "/crt.pem" ||
      pathname === "/all.pem"
    ) {
      const certData = await getCertData(env);
      if (certData === null) return unavailableResponse();

      switch (pathname) {
        case "/all.pem.json":
          return jsonResponse(JSON.stringify(certData));
        case "/key.pem":
          return textResponse(certData.key);
        case "/crt.pem":
          return textResponse(certData.cert);
        case "/all.pem":
          return textResponse(certData.cert + "\n" + certData.key);
      }
    }

    const exampleMatch = pathname.match(/^\/examples\/(.+)$/);
    if (exampleMatch) {
      const name = exampleMatch[1];
      if (name in examples) {
        return new Response(examples[name], {
          headers: {
            "Content-Type": "text/javascript; charset=utf-8",
            ...CORS_HEADERS,
          },
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
};

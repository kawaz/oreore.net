import { Env } from "./env";
import { siteResponse } from "./site";
import { siteResponse as darkTerminalResponse } from "./site-dark-terminal";
import { siteResponse as minimalGradientResponse } from "./site-minimal-gradient";
import { siteResponse as retroNeonResponse } from "./site-retro-neon";
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

    // Design rationale: Temporary preview routes for comparing design candidates.
    // These will be removed once a design is chosen.
    if (pathname === "/preview/current") {
      return siteResponse();
    }
    if (pathname === "/preview/dark-terminal") {
      return darkTerminalResponse();
    }
    if (pathname === "/preview/minimal-gradient") {
      return minimalGradientResponse();
    }
    if (pathname === "/preview/retro-neon") {
      return retroNeonResponse();
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
        let contentType = "text/plain; charset=utf-8";
        if (name.endsWith(".ts")) {
          contentType = "text/typescript; charset=utf-8";
        } else if (name.endsWith(".mjs") || name.endsWith(".js")) {
          contentType = "text/javascript; charset=utf-8";
        }
        return new Response(examples[name], {
          headers: {
            "Content-Type": contentType,
            ...CORS_HEADERS,
          },
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
};

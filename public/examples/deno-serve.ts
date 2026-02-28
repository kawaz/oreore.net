// Deno.serve() with TLS
const { cert, key } = await (await fetch("https://oreore.net/all.pem.json")).json();
Deno.serve({
  port: 8443,
  cert,
  key,
}, (req) => new Response(`Hello from ${new URL(req.url).hostname}!`));

// Bun.serve() with TLS - the simplest modern HTTPS server
const { cert, key } = await fetch("https://oreore.net/all.pem.json").then(r => r.json());
Bun.serve({
  port: 8443,
  tls: { cert, key },
  fetch(req) {
    return new Response(`Hello from ${new URL(req.url).hostname}!`);
  },
});
console.log("Listening on https://localhost.oreore.net:8443");

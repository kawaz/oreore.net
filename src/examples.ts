export const nodeHttps = `\
import https from "node:https";

const port = parseInt(process.argv[2] || "8443", 10);

const certUrl = "https://oreore.net/all.pem.json";
const { key, cert } = await fetch(certUrl).then((r) => r.json());

const server = https.createServer({ key, cert }, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from HTTPS server\\n");
});

server.listen(port, () => {
  console.log(\`HTTPS server listening on https://localhost:\${port}/\`);
});
`;

export const nodeHttp2 = `\
import http2 from "node:http2";

const port = parseInt(process.argv[2] || "8443", 10);

const certUrl = "https://oreore.net/all.pem.json";
const { key, cert } = await fetch(certUrl).then((r) => r.json());

const server = http2.createSecureServer({ key, cert, allowHTTP1: true });

server.on("stream", (stream, headers) => {
  stream.respond({ ":status": 200, "content-type": "text/plain" });
  stream.end("Hello from HTTP/2 server\\n");
});

server.listen(port, () => {
  console.log(\`HTTP/2 server listening on https://localhost:\${port}/\`);
});
`;

export const nodeHttp2Compatibility = `\
import http2 from "node:http2";

const port = parseInt(process.argv[2] || "8443", 10);

const certUrl = "https://oreore.net/all.pem.json";
const { key, cert } = await fetch(certUrl).then((r) => r.json());

const server = http2.createSecureServer({ key, cert, allowHTTP1: true });

server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(\`Hello from HTTP/2 compatibility server (HTTP/\${req.httpVersion})\\n\`);
});

server.listen(port, () => {
  console.log(\`HTTP/2 compatibility server listening on https://localhost:\${port}/\`);
});
`;

export const examples: Record<string, string> = {
  "node-https.mjs": nodeHttps,
  "node-http2.mjs": nodeHttp2,
  "node-http2-compatibility.mjs": nodeHttp2Compatibility,
};

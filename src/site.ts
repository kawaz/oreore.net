import { examples } from "./examples";

export function buildIndexHtml(): string {
  const exampleLinks = Object.keys(examples)
    .map((name) => `<li><a href="/examples/${name}">${name}</a></li>`)
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>oreore.net | Free certificate for localhost</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.3rem; }
    p { margin-bottom: 1rem; }
    code { background: #f4f4f4; padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    ul { padding-left: 1.5rem; margin-bottom: 1rem; }
    li { margin-bottom: 0.3rem; }
    a { color: #0066cc; }
    table { border-collapse: collapse; margin-bottom: 1rem; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f4f4f4; }
    .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 1.5rem; }
  </style>
</head>
<body>
  <h1>oreore.net</h1>
  <p class="subtitle">Free TLS certificate for localhost development</p>

  <h2>What is this?</h2>
  <p>
    <strong>oreore.net</strong> provides wildcard DNS records that resolve to localhost
    and a free TLS certificate, so you can use HTTPS on your local development server
    without any configuration.
  </p>

  <h2>DNS Records</h2>
  <table>
    <thead>
      <tr><th>Domain pattern</th><th>Resolves to</th></tr>
    </thead>
    <tbody>
      <tr><td><code>*.oreore.net</code></td><td><code>127.0.0.1</code> / <code>::1</code></td></tr>
      <tr><td><code>*.lo.oreore.net</code></td><td><code>127.0.0.1</code> / <code>::1</code></td></tr>
      <tr><td><code>*.localhost.oreore.net</code></td><td><code>127.0.0.1</code> / <code>::1</code></td></tr>
    </tbody>
  </table>
  <p>Any subdomain under these patterns (e.g. <code>myapp.oreore.net</code>) points to your machine.</p>

  <h2>Certificate Download</h2>
  <ul>
    <li><strong><a href="/all.pem.json">all.pem.json</a></strong> &mdash; JSON format <code>{"cert":"...","key":"..."}</code> (primary)</li>
    <li><a href="/key.pem">key.pem</a> &mdash; Private key (generated from all.pem.json)</li>
    <li><a href="/crt.pem">crt.pem</a> &mdash; Certificate chain (generated from all.pem.json)</li>
    <li><a href="/all.pem">all.pem</a> &mdash; Cert + key concatenated (generated from all.pem.json)</li>
  </ul>

  <h2>Quick Start</h2>
  <pre><code>json=$(curl -s https://oreore.net/all.pem.json)
echo "$json" | jq -r '.key' > key.pem
echo "$json" | jq -r '.cert' > crt.pem</code></pre>

  <h2>Examples</h2>
  <ul>
    ${exampleLinks}
  </ul>
  <p>Run an example directly:</p>
  <pre><code>bun run &lt;(curl -s https://oreore.net/examples/bun-serve.ts)</code></pre>
</body>
</html>`;
}

export function siteResponse(): Response {
  return new Response(buildIndexHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

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
    @keyframes neonFlicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        text-shadow:
          0 0 7px #ff00ff,
          0 0 10px #ff00ff,
          0 0 21px #ff00ff,
          0 0 42px #ff00ff,
          0 0 82px #ff00ff,
          0 0 92px #ff00ff;
      }
      20%, 24%, 55% {
        text-shadow: none;
      }
    }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes glowPulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", "Monaco", monospace;
      line-height: 1.7;
      color: #e0d0ff;
      background: #0a0a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
      position: relative;
    }

    /* Grid background */
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: -2;
    }

    /* Scanline overlay */
    body::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(0, 255, 255, 0.08);
      animation: scanline 8s linear infinite;
      pointer-events: none;
      z-index: 1000;
    }

    h1 {
      font-size: 2.4rem;
      margin-bottom: 0.5rem;
      color: #ff00ff;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      animation: neonFlicker 4s infinite alternate;
      text-shadow:
        0 0 7px #ff00ff,
        0 0 10px #ff00ff,
        0 0 21px #ff00ff,
        0 0 42px #ff00ff,
        0 0 82px #ff00ff;
    }

    h2 {
      font-size: 1.3rem;
      margin-top: 2.5rem;
      margin-bottom: 0.7rem;
      color: #00ffff;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
      padding-bottom: 0.4rem;
      text-shadow:
        0 0 5px #00ffff,
        0 0 10px #00ffff,
        0 0 20px rgba(0, 255, 255, 0.5);
    }

    p { margin-bottom: 1rem; }

    strong {
      color: #ff00ff;
      text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
    }

    code {
      background: rgba(179, 71, 255, 0.15);
      padding: 0.15rem 0.5rem;
      border-radius: 3px;
      font-size: 0.9em;
      color: #00ffff;
      border: 1px solid rgba(179, 71, 255, 0.3);
      font-family: inherit;
    }

    pre {
      background: rgba(10, 10, 26, 0.85);
      padding: 1.2rem;
      border-radius: 5px;
      overflow-x: auto;
      margin-bottom: 1rem;
      border: 1px solid rgba(179, 71, 255, 0.4);
      box-shadow:
        0 0 10px rgba(179, 71, 255, 0.15),
        inset 0 0 20px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    pre::before {
      content: ">";
      position: absolute;
      top: 1.2rem;
      left: 0.5rem;
      color: #ff00ff;
      opacity: 0.6;
      animation: glowPulse 2s ease-in-out infinite;
    }

    pre code {
      background: none;
      padding: 0;
      border: none;
      color: #b347ff;
      text-shadow: 0 0 3px rgba(179, 71, 255, 0.3);
      padding-left: 0.8rem;
      display: block;
    }

    ul { padding-left: 1.5rem; margin-bottom: 1rem; list-style: none; }

    li {
      margin-bottom: 0.4rem;
      position: relative;
      padding-left: 1.2rem;
    }

    li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: #ff00ff;
      text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
    }

    a {
      color: #00ffff;
      text-decoration: none;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
      transition: text-shadow 0.3s ease, color 0.3s ease;
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    }

    a:hover {
      color: #fff;
      text-shadow:
        0 0 7px #00ffff,
        0 0 10px #00ffff,
        0 0 21px #00ffff,
        0 0 42px rgba(0, 255, 255, 0.5);
      border-bottom-color: #00ffff;
    }

    table {
      border-collapse: collapse;
      margin-bottom: 1rem;
      width: 100%;
    }

    th, td {
      border: 1px solid rgba(179, 71, 255, 0.35);
      padding: 0.6rem 0.85rem;
      text-align: left;
    }

    th {
      background: rgba(179, 71, 255, 0.12);
      color: #ff00ff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.85em;
      text-shadow: 0 0 5px rgba(255, 0, 255, 0.4);
    }

    td {
      background: rgba(10, 10, 26, 0.6);
    }

    tr:hover td {
      background: rgba(179, 71, 255, 0.08);
      box-shadow: inset 0 0 15px rgba(179, 71, 255, 0.05);
    }

    .subtitle {
      color: #b347ff;
      font-size: 1rem;
      margin-bottom: 2rem;
      letter-spacing: 0.05em;
      text-shadow: 0 0 8px rgba(179, 71, 255, 0.4);
    }

    /* Decorative horizontal rule between sections */
    h2::after {
      content: "";
      display: block;
      margin-top: 0.3rem;
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      h1 { font-size: 1.6rem; letter-spacing: 0.08em; }
      h2 { font-size: 1.1rem; }
      body { padding: 1.2rem 0.8rem; }
      pre { padding: 0.8rem; font-size: 0.85em; }
      table { font-size: 0.85em; }
      th, td { padding: 0.4rem 0.5rem; }
    }

    /* Selection color */
    ::selection {
      background: rgba(255, 0, 255, 0.35);
      color: #fff;
    }

    /* Scrollbar styling for webkit */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #0a0a1a; }
    ::-webkit-scrollbar-thumb { background: rgba(179, 71, 255, 0.4); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(179, 71, 255, 0.7); }
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

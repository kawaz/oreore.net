import { examples } from "./examples";

export function buildIndexHtml(): string {
  const exampleLinks = Object.keys(examples)
    .map((name) => `<li><a href="/examples/${name}">${name}</a></li>`)
    .join("\n            ");

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
      line-height: 1.7;
      color: #334155;
      background: #ffffff;
      min-height: 100vh;
    }

    .hero {
      text-align: center;
      padding: 5rem 1.5rem 3rem;
      background: linear-gradient(135deg, rgba(168, 130, 255, 0.08) 0%, rgba(96, 165, 250, 0.08) 100%);
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .hero .subtitle {
      font-size: 1.2rem;
      color: #64748b;
      font-weight: 400;
      max-width: 500px;
      margin: 0 auto;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem;
    }

    .description {
      text-align: center;
      font-size: 1.05rem;
      color: #475569;
      max-width: 640px;
      margin: 0 auto 3rem;
      line-height: 1.8;
    }

    .cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
      transition: box-shadow 0.2s ease;
    }

    .card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03);
    }

    .card h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card h2 .icon {
      font-size: 1.4rem;
    }

    p {
      margin-bottom: 0.75rem;
      color: #475569;
    }

    code {
      font-family: "SF Mono", "Cascadia Code", "Fira Code", "Consolas", monospace;
      background: #f1f5f9;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.88em;
      color: #7c3aed;
    }

    pre {
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 1.25rem 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
      line-height: 1.6;
    }

    pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 0.85rem;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5rem 0;
    }

    th, td {
      padding: 0.65rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      font-weight: 600;
      color: #64748b;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      color: #334155;
    }

    .note {
      font-size: 0.92rem;
      color: #64748b;
      margin-top: 0.75rem;
    }

    .download-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .download-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.2s ease;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-outline {
      display: inline-block;
      padding: 0.45rem 1.1rem;
      border: 1.5px solid #cbd5e1;
      color: #475569;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.88rem;
      transition: border-color 0.2s ease, color 0.2s ease;
    }

    .btn-outline:hover {
      border-color: #8b5cf6;
      color: #8b5cf6;
    }

    .download-desc {
      font-size: 0.88rem;
      color: #64748b;
    }

    .examples-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .examples-list li a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .examples-list li a:hover {
      color: #8b5cf6;
      text-decoration: underline;
    }

    a {
      color: #6366f1;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (min-width: 640px) {
      .hero h1 {
        font-size: 3.5rem;
      }

      .cards {
        gap: 2.5rem;
      }
    }
  </style>
</head>
<body>

  <section class="hero">
    <h1>oreore.net</h1>
    <p class="subtitle">Free TLS certificate for localhost development</p>
  </section>

  <div class="container">
    <p class="description">
      <strong>oreore.net</strong> provides wildcard DNS records that resolve to localhost
      and a free TLS certificate, so you can use HTTPS on your local development server
      without any configuration.
    </p>

    <div class="cards">

      <div class="card">
        <h2><span class="icon">&#x1F310;</span> DNS Records</h2>
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
        <p class="note">Any subdomain under these patterns (e.g. <code>myapp.oreore.net</code>) points to your machine.</p>
      </div>

      <div class="card">
        <h2><span class="icon">&#x1F4E5;</span> Certificate Download</h2>
        <ul class="download-list">
          <li>
            <a href="/all.pem.json" class="btn-primary">all.pem.json</a>
            <span class="download-desc">JSON format <code>{"cert":"...","key":"..."}</code> (primary)</span>
          </li>
          <li>
            <a href="/key.pem" class="btn-outline">key.pem</a>
            <span class="download-desc">Private key</span>
          </li>
          <li>
            <a href="/crt.pem" class="btn-outline">crt.pem</a>
            <span class="download-desc">Certificate chain</span>
          </li>
          <li>
            <a href="/all.pem" class="btn-outline">all.pem</a>
            <span class="download-desc">Cert + key concatenated</span>
          </li>
        </ul>
      </div>

      <div class="card">
        <h2><span class="icon">&#x26A1;</span> Quick Start</h2>
        <pre><code>json=$(curl -s https://oreore.net/all.pem.json)
echo "$json" | jq -r '.key' &gt; key.pem
echo "$json" | jq -r '.cert' &gt; crt.pem</code></pre>
      </div>

      <div class="card">
        <h2><span class="icon">&#x1F4BB;</span> Examples</h2>
        <ul class="examples-list">
            ${exampleLinks}
        </ul>
        <p style="margin-top: 1rem;">Run an example directly:</p>
        <pre><code>bun run &lt;(curl -s https://oreore.net/examples/bun-serve.ts)</code></pre>
      </div>

    </div>
  </div>

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

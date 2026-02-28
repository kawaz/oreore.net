import { examples } from "./examples";

export function buildIndexHtml(): string {
  const exampleLinks = Object.keys(examples)
    .map(
      (name) =>
        `<li><span class="prompt">$</span> <a href="/examples/${name}">${name}</a></li>`,
    )
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
      font-family: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, "Liberation Mono", monospace;
      line-height: 1.7;
      color: #c9d1d9;
      background: #0d1117;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h1 {
      font-size: 1.8rem;
      color: #58a6ff;
      margin-bottom: 0.3rem;
      font-weight: 700;
    }

    h2 {
      font-size: 1.2rem;
      color: #79c0ff;
      margin-top: 2.5rem;
      margin-bottom: 0.8rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid #21262d;
    }
    h2::before {
      content: "## ";
      color: #484f58;
    }

    p { margin-bottom: 1rem; color: #8b949e; }
    p strong { color: #c9d1d9; }

    code {
      background: #161b22;
      color: #79c0ff;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: inherit;
    }

    /* Terminal window */
    .terminal {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      margin-bottom: 1.2rem;
      overflow: hidden;
    }
    .terminal-bar {
      background: #21262d;
      padding: 0.4rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid #30363d;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .terminal-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    .terminal-dots .dot-red { background: #ff5f57; }
    .terminal-dots .dot-yellow { background: #febc2e; }
    .terminal-dots .dot-green { background: #28c840; }
    .terminal-title {
      color: #484f58;
      font-size: 0.8rem;
      flex: 1;
      text-align: center;
    }
    .terminal-body {
      padding: 1rem;
      overflow-x: auto;
    }
    .terminal-body code {
      background: none;
      padding: 0;
      color: #c9d1d9;
      display: block;
      white-space: pre;
      line-height: 1.6;
    }

    /* Syntax colors */
    .prompt { color: #3fb950; font-weight: 700; }
    .cmd { color: #c9d1d9; }
    .flag { color: #d2a8ff; }
    .url { color: #58a6ff; }
    .string { color: #a5d6ff; }
    .comment { color: #484f58; font-style: italic; }
    .pipe { color: #ff7b72; }

    /* Lists */
    ul {
      list-style: none;
      padding-left: 0;
      margin-bottom: 1rem;
    }
    li {
      margin-bottom: 0.4rem;
      padding-left: 1.5rem;
      position: relative;
    }
    li .prompt {
      position: absolute;
      left: 0;
    }

    /* Links */
    a {
      color: #58a6ff;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    a:hover {
      border-bottom-color: #58a6ff;
    }

    /* Table */
    table {
      border-collapse: collapse;
      margin-bottom: 1rem;
      width: 100%;
    }
    th, td {
      border: none;
      padding: 0.5rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid #21262d;
    }
    th {
      color: #58a6ff;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td { color: #8b949e; }
    td code { color: #3fb950; }

    /* Subtitle */
    .subtitle {
      color: #8b949e;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    /* Header lock icon */
    .lock { margin-right: 0.5rem; }

    /* Download links */
    .dl-list li { padding-left: 2rem; }
    .dl-list li::before {
      content: ">";
      color: #3fb950;
      position: absolute;
      left: 0.5rem;
      font-weight: 700;
    }
    .dl-list .dl-primary a {
      color: #3fb950;
      font-weight: 700;
    }

    /* Cursor blink */
    .cursor {
      display: inline-block;
      width: 0.6em;
      height: 1.1em;
      background: #3fb950;
      vertical-align: text-bottom;
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Responsive */
    @media (max-width: 600px) {
      body { padding: 1rem 0.75rem; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.05rem; }
      .terminal-body { padding: 0.75rem; font-size: 0.85rem; }
      table { font-size: 0.85rem; }
      th, td { padding: 0.4rem 0.5rem; }
    }
  </style>
</head>
<body>
  <h1><span class="lock">\u{1F512}</span>oreore.net</h1>
  <p class="subtitle"><span class="prompt">$</span> <span class="cmd">Free TLS certificate for localhost development</span><span class="cursor"></span></p>

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
  <ul class="dl-list">
    <li class="dl-primary"><strong><a href="/all.pem.json">all.pem.json</a></strong> &mdash; <span class="comment">JSON format {"cert":"...","key":"..."} (primary)</span></li>
    <li><a href="/key.pem">key.pem</a> &mdash; <span class="comment">Private key (generated from all.pem.json)</span></li>
    <li><a href="/crt.pem">crt.pem</a> &mdash; <span class="comment">Certificate chain (generated from all.pem.json)</span></li>
    <li><a href="/all.pem">all.pem</a> &mdash; <span class="comment">Cert + key concatenated (generated from all.pem.json)</span></li>
  </ul>

  <h2>Quick Start</h2>
  <div class="terminal">
    <div class="terminal-bar">
      <div class="terminal-dots">
        <span class="dot-red"></span>
        <span class="dot-yellow"></span>
        <span class="dot-green"></span>
      </div>
      <span class="terminal-title">bash</span>
      <div style="width: 54px;"></div>
    </div>
    <div class="terminal-body">
      <code><span class="comment"># Download cert and key from JSON endpoint</span>
<span class="prompt">$</span> <span class="cmd">json</span><span class="pipe">=$(</span><span class="cmd">curl</span> <span class="flag">-s</span> <span class="url">https://oreore.net/all.pem.json</span><span class="pipe">)</span>
<span class="prompt">$</span> <span class="cmd">echo</span> <span class="string">"$json"</span> <span class="pipe">|</span> <span class="cmd">jq</span> <span class="flag">-r</span> <span class="string">'.key'</span> <span class="pipe">&gt;</span> key.pem
<span class="prompt">$</span> <span class="cmd">echo</span> <span class="string">"$json"</span> <span class="pipe">|</span> <span class="cmd">jq</span> <span class="flag">-r</span> <span class="string">'.cert'</span> <span class="pipe">&gt;</span> crt.pem</code>
    </div>
  </div>

  <h2>Examples</h2>
  <ul>
    ${exampleLinks}
  </ul>
  <p>Run an example directly:</p>
  <div class="terminal">
    <div class="terminal-bar">
      <div class="terminal-dots">
        <span class="dot-red"></span>
        <span class="dot-yellow"></span>
        <span class="dot-green"></span>
      </div>
      <span class="terminal-title">bash</span>
      <div style="width: 54px;"></div>
    </div>
    <div class="terminal-body">
      <code><span class="prompt">$</span> <span class="cmd">bun</span> <span class="cmd">run</span> <span class="pipe">&lt;(</span><span class="cmd">curl</span> <span class="flag">-s</span> <span class="url">https://oreore.net/examples/bun-serve.ts</span><span class="pipe">)</span></code>
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

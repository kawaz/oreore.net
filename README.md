# oreore.net

Free TLS certificate for localhost development.

https://oreore.net

## What is this?

oreore.net provides wildcard DNS records that resolve to `127.0.0.1` / `::1` and a free TLS certificate, so you can use HTTPS on your local development server without any configuration.

### DNS Records

| Domain pattern | Resolves to |
|---|---|
| `*.oreore.net` | `127.0.0.1` / `::1` |
| `*.lo.oreore.net` | `127.0.0.1` / `::1` |
| `*.localhost.oreore.net` | `127.0.0.1` / `::1` |

### Certificate Endpoints

| Path | Description |
|---|---|
| `/all.pem.json` | JSON bundle `{"cert":"...","key":"..."}` (recommended) |
| `/key.pem` | Private key |
| `/crt.pem` | Certificate chain |
| `/all.pem` | Cert + key concatenated |

## Quick Start

```bash
json=$(curl -s https://oreore.net/all.pem.json)
echo "$json" | jq -r '.cert' > oreore.net.crt.pem
echo "$json" | jq -r '.key'  > oreore.net.key.pem
```

## Architecture

```
Cloudflare Workers (HTTP) + R2 (cert storage) + GitHub Actions (ACME renewal)
```

- **HTTP requests**: Worker reads certificate from R2 and serves it
- **Certificate renewal**: GitHub Actions runs daily, uses Let's Encrypt (DNS-01 via Cloudflare DNS API)
- **Storage**: R2 stores `all.pem.json` only; other endpoints are derived dynamically

## Development

```bash
bun install
bun run dev      # Start local dev server
bun run test     # Run tests
bun run deploy   # Deploy to Cloudflare Workers
```

## License

MIT

# DR-001: プロジェクト整理・ドキュメント整備

## 背景

oreore.net を Cloudflare Workers + R2 + GitHub Actions に移行完了した。
ACME 処理は当初 Worker の Cron Trigger で行う計画だったが、Let's Encrypt の 525 エラー問題で GitHub Actions に移行した。
その結果、Worker 側に不要な設定・コード・secrets が残っている。
また README.md, LICENSE, GitHub リンク等のドキュメントが未整備。

## 変更一覧

### 1. 不要コード・設定の削除

| 対象 | 理由 | アクション |
|---|---|---|
| `src/site-dark-terminal.ts` | デザイン候補の残骸 | 削除 |
| `src/site-minimal-gradient.ts` | デザイン候補の残骸 | 削除 |
| `src/site-retro-neon.ts` | デザイン候補の残骸 | 削除 |
| `src/index.ts` プレビュールート | 上記のimportと `/preview/*` ルート | 削除 |
| `wrangler.toml` の `nodejs_compat` | Worker本体で node: モジュール未使用 | 削除 |
| Worker secrets `CF_API_TOKEN`, `CF_ZONE_ID` | Worker では不使用 (GitHub Actions で使用) | `wrangler secret delete` |
| `src/cloudflare-dns.ts` | Worker 本体で未使用、scripts/ からのみ import | `scripts/` に移動 |

### 2. 設定ファイル修正

| 対象 | 問題 | アクション |
|---|---|---|
| `tsconfig.json` の `@cloudflare/workers-types/2023-07-01` | wrangler.toml の compatibility_date 2025-01-01 と不整合 | 最新に更新 |
| `tsconfig.json` の `jsx: "react-jsx"` | JSX 未使用 | 削除 |
| `package.json` の `latest` 指定 | バージョン固定なし | `bun.lock` から実際のバージョンを取得して固定 |
| `package.json` の `@aws-sdk/client-s3`, `@fishballpkg/acme` | Worker ランタイムでは不使用 | `devDependencies` に移動 |

### 3. ドキュメント作成

| 対象 | アクション |
|---|---|
| `README.md` | プロジェクト概要、構成、セットアップ、デプロイ手順 |
| `LICENSE` | MIT License (Yoshiaki Kawazu) |
| サイト HTML | GitHub リポジトリへのリンクをフッターに追加 |

### 4. セキュリティ・整合性

| 対象 | アクション |
|---|---|
| CORS `*` | Design rationale コメント追加 |
| `.envrc` (リポジトリルート) | 旧方式のクレデンシャル。移行完了後に整理（本DRのスコープ外、ユーザー判断） |

### 5. テスト・スクリプト修正

- プレビュールート削除に伴い、テストからプレビュー関連のテストケースがあれば削除
- `cloudflare-dns.ts` の `src/` → `scripts/` 移動に伴い:
  - `test/cloudflare-dns.test.ts` の import パスを `../scripts/cloudflare-dns` に更新
  - `scripts/renew-cert.ts` の import パスを `./cloudflare-dns` に更新

## スコープ外

- `.envrc` の旧クレデンシャル整理（ユーザー判断が必要）
- デザイン変更（現在の site.ts をそのまま使用）
- CI/CD の lint/format 追加

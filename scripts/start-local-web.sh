#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8080}"

echo "[local-web] repo: ${ROOT_DIR}"
echo "[local-web] port: ${PORT}"

cd "${ROOT_DIR}"
echo "[local-web] rebuilding _site/data/materials.json from backend/data"
node scripts/prepare-github-pages.js
node scripts/sync-site-from-workflow.js
node scripts/local-web-server.js "${PORT}"

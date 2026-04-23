#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8080}"
CLOUD_ORIGIN="${CLOUD_ORIGIN:-https://weiqichen77.github.io/jkw-7element-alloy-database/}"

echo "[cloud-shell] repo: ${ROOT_DIR}"
echo "[cloud-shell] port: ${PORT}"
echo "[cloud-shell] upstream: ${CLOUD_ORIGIN}"

cd "${ROOT_DIR}"
CLOUD_PROXY=1 CLOUD_ORIGIN="${CLOUD_ORIGIN}" node scripts/local-web-server.js "${PORT}"

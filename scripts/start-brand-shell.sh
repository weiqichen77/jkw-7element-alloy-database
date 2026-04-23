#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8080}"
CLOUD_ORIGIN="${CLOUD_ORIGIN:-https://weiqichen77.github.io/jkw-7element-alloy-database/}"
BRAND_TITLE="${BRAND_TITLE:-7-Element Alloy Data Platform}"
BRAND_H1="${BRAND_H1:-7-Element Alloy Data Platform}"
BRAND_SUBTITLE="${BRAND_SUBTITLE:-Local Branded Access Gateway}"
BRAND_PRIMARY_LINK_TEXT="${BRAND_PRIMARY_LINK_TEXT:-Platform Home}"
BRAND_DOCS_LINK_TEXT="${BRAND_DOCS_LINK_TEXT:-User Guide}"

echo "[brand-shell] repo: ${ROOT_DIR}"
echo "[brand-shell] port: ${PORT}"
echo "[brand-shell] upstream: ${CLOUD_ORIGIN}"
echo "[brand-shell] title: ${BRAND_TITLE}"

cd "${ROOT_DIR}"
CLOUD_PROXY=1 \
BRAND_SHELL=1 \
CLOUD_ORIGIN="${CLOUD_ORIGIN}" \
BRAND_TITLE="${BRAND_TITLE}" \
BRAND_H1="${BRAND_H1}" \
BRAND_SUBTITLE="${BRAND_SUBTITLE}" \
BRAND_PRIMARY_LINK_TEXT="${BRAND_PRIMARY_LINK_TEXT}" \
BRAND_DOCS_LINK_TEXT="${BRAND_DOCS_LINK_TEXT}" \
node scripts/local-web-server.js "${PORT}"

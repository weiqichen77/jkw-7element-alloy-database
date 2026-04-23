#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

const repoRoot = path.resolve(__dirname, '..');
const backendDataDir = path.join(repoRoot, 'backend', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');
const CLOUD_PROXY = process.env.CLOUD_PROXY === '1';
const CLOUD_ORIGIN = process.env.CLOUD_ORIGIN || 'https://weiqichen77.github.io/jkw-7element-alloy-database/';
const BRAND_SHELL = process.env.BRAND_SHELL === '1';
const BRAND_TITLE = process.env.BRAND_TITLE || 'Alloy Materials Database';
const BRAND_H1 = process.env.BRAND_H1 || BRAND_TITLE;
const BRAND_SUBTITLE = process.env.BRAND_SUBTITLE || 'Material Properties Platform';
const BRAND_PRIMARY_LINK_TEXT = process.env.BRAND_PRIMARY_LINK_TEXT || 'Data Platform';
const BRAND_DOCS_LINK_TEXT = process.env.BRAND_DOCS_LINK_TEXT || 'Documentation';

const PORT = Number(process.env.PORT || process.argv[2] || 8080);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv; charset=utf-8',
  '.wasm': 'application/wasm',
  '.map': 'application/json; charset=utf-8',
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function resolveFilePath(urlPathname) {
  let cleanPath = decodeURIComponent(urlPathname.split('?')[0]);
  if (cleanPath === '/') cleanPath = '/index.html';

  const candidateRoots = [
    path.join(repoRoot, '_site'),
    repoRoot,
  ];

  for (const root of candidateRoots) {
    const requested = path.normalize(path.join(root, cleanPath));
    if (!requested.startsWith(root)) continue;

    let stat;
    try {
      stat = fs.statSync(requested);
    } catch (_err) {
      continue;
    }

    if (stat.isDirectory()) {
      const indexFile = path.join(requested, 'index.html');
      if (fs.existsSync(indexFile)) return indexFile;
      continue;
    }

    return requested;
  }

  return null;
}

function normalizeType(type) {
  return type === 'solid-element' ? 'element' : type;
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (_err) {
    return [];
  }
}

function normalizeMaterial(material) {
  const copy = { ...material };
  if (!Array.isArray(copy.data)) copy.data = [];
  if (!copy.properties) copy.properties = {};
  if (!copy.density && copy.data.length > 0) {
    const first = copy.data[0];
    const structure = first && first.properties && first.properties.structure;
    if (structure && structure.density) copy.density = structure.density;
  }
  return copy;
}

function loadMaterials() {
  const base = safeReadJson(materialsPath).map(normalizeMaterial);
  const inter = safeReadJson(intermetallicPath).map(normalizeMaterial);
  return base.concat(inter);
}

function routeMaterialsApi(req, res, parsedUrl) {
  const query = Object.fromEntries(parsedUrl.searchParams.entries());
  const method = (req.method || 'GET').toUpperCase();

  if (method !== 'GET') {
    sendJson(res, 405, { error: 'method not allowed' });
    return;
  }

  const raw = loadMaterials();
  const q = String(query.q || '').toLowerCase();
  const element = query.element || '';
  const type = normalizeType(query.type || '');
  const page = Math.max(1, Number(query.page || 1));
  const perPage = Math.max(1, Number(query.per_page || 25));

  const typeOrder = {
    'solid-solution': 0,
    intermetallic: 1,
    amorphous: 2,
    interface: 3,
    element: 4,
  };

  let results = raw.filter((item) => {
    const itemType = normalizeType(item.type || '');
    const elements = Array.isArray(item.elements) ? item.elements : [];
    const haystack = [
      item.name || '',
      item.id || '',
      item.composition || '',
      elements.join(' '),
      item.source || '',
    ].join(' ').toLowerCase();

    const typeOk = !type || itemType === type;
    const elementOk = !element || elements.includes(element);
    const queryOk = !q || haystack.includes(q);

    return typeOk && elementOk && queryOk;
  });

  results = results.sort((a, b) => {
    const ta = typeOrder[normalizeType(a.type || '')] ?? Number.MAX_SAFE_INTEGER;
    const tb = typeOrder[normalizeType(b.type || '')] ?? Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });

  const total = results.length;
  const start = (page - 1) * perPage;
  const paged = results.slice(start, start + perPage);

  sendJson(res, 200, {
    total,
    page,
    per_page: perPage,
    results: paged,
  });
}

function routeStatic(res, pathname) {
  const filePath = resolveFilePath(pathname);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': ext === '.json' ? 'no-store' : 'public, max-age=600',
  });

  fs.createReadStream(filePath).pipe(res);
}

function sanitizeUpstreamHeaders(headers) {
  const out = {};
  for (const [key, value] of headers.entries()) {
    const k = key.toLowerCase();
    if (k === 'content-length' || k === 'content-encoding' || k === 'transfer-encoding') {
      continue;
    }
    out[key] = value;
  }
  return out;
}

function rewriteUpstreamText(text) {
  const normalized = CLOUD_ORIGIN.endsWith('/') ? CLOUD_ORIGIN.slice(0, -1) : CLOUD_ORIGIN;
  let rewritten = String(text)
    .replaceAll(normalized, '')
    .replaceAll(`${normalized}/`, '/');

  if (BRAND_SHELL) {
    rewritten = rewritten
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${BRAND_TITLE}</title>`)
      .replace(/<h1 id="title">[\s\S]*?<\/h1>/i, `<h1 id="title">${BRAND_H1}</h1>`)
      .replace(/<p class="subtitle" id="subtitle">[\s\S]*?<\/p>/i, `<p class="subtitle" id="subtitle">${BRAND_SUBTITLE}</p>`)
      .replace(/>\s*GitHub Repository\s*</gi, `>${BRAND_PRIMARY_LINK_TEXT}<`)
      .replace(/>\s*Documentation\s*</gi, `>${BRAND_DOCS_LINK_TEXT}<`)
      .replace(/https:\/\/github\.com\/[^"'\s<]+/gi, '#')
      .replace(/github/gi, '');
  }

  return rewritten;
}

async function routeCloudProxy(req, res, parsedUrl) {
  const method = (req.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD'].includes(method)) {
    sendJson(res, 405, { error: 'method not allowed in cloud proxy mode' });
    return;
  }

  const base = CLOUD_ORIGIN.endsWith('/') ? CLOUD_ORIGIN : `${CLOUD_ORIGIN}/`;
  const pathWithQuery = `${parsedUrl.pathname}${parsedUrl.search || ''}`;
  const upstreamUrl = new URL(pathWithQuery.replace(/^\//, ''), base);

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method,
      headers: {
        accept: req.headers.accept || '*/*',
        'user-agent': req.headers['user-agent'] || 'local-web-shell',
      },
      redirect: 'follow',
    });

    const headers = sanitizeUpstreamHeaders(upstreamRes.headers);
    const contentType = String(upstreamRes.headers.get('content-type') || '').toLowerCase();
    const isText = contentType.includes('text/') || contentType.includes('javascript') || contentType.includes('json') || contentType.includes('xml');

    if (method === 'HEAD') {
      res.writeHead(upstreamRes.status, headers);
      res.end();
      return;
    }

    if (isText) {
      const text = await upstreamRes.text();
      const rewritten = rewriteUpstreamText(text);
      res.writeHead(upstreamRes.status, headers);
      res.end(rewritten);
      return;
    }

    const data = Buffer.from(await upstreamRes.arrayBuffer());
    res.writeHead(upstreamRes.status, headers);
    res.end(data);
  } catch (error) {
    sendJson(res, 502, { error: 'cloud proxy failed', detail: String(error && error.message || error) });
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (CLOUD_PROXY) {
    await routeCloudProxy(req, res, parsedUrl);
    return;
  }

  if (pathname.startsWith('/api/materials')) {
    routeMaterialsApi(req, res, parsedUrl);
    return;
  }

  routeStatic(res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`[local-web] running at http://localhost:${PORT}`);
  if (CLOUD_PROXY) {
    console.log(`[local-web] mode: cloud shell proxy`);
    console.log(`[local-web] upstream: ${CLOUD_ORIGIN}`);
    if (BRAND_SHELL) {
      console.log(`[local-web] brand shell: enabled`);
      console.log(`[local-web] brand title: ${BRAND_TITLE}`);
    }
  }
  console.log(`[local-web] default page: http://localhost:${PORT}/`);
  console.log(`[local-web] github-pages parity page: http://localhost:${PORT}/index.html`);
  console.log(`[local-web] alternative page: http://localhost:${PORT}/frontend/index.html`);
});

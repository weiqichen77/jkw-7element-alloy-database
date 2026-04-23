#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const workflowPath = path.join(repoRoot, '.github', 'workflows', 'deploy-pages.yml');

const targets = [
  { label: 'api-mock', marker: "cat > _site/api-mock.js << 'EOF'", out: path.join(repoRoot, '_site', 'api-mock.js') },
  { label: 'js', marker: "cat > _site/js/app.js << 'EOF'", out: path.join(repoRoot, '_site', 'js', 'app.js') },
  { label: 'html', marker: "cat > _site/index.html << 'EOF'", out: path.join(repoRoot, '_site', 'index.html') },
  { label: 'css', marker: "cat > _site/css/style.css << 'EOF'", out: path.join(repoRoot, '_site', 'css', 'style.css') },
];

function extractBlock(text, marker) {
  const start = text.indexOf(marker);
  if (start === -1) return null;
  const afterMarker = text.indexOf('\n', start + marker.length);
  if (afterMarker === -1) return null;

  const endToken = '\n          EOF';
  const end = text.indexOf(endToken, afterMarker + 1);
  if (end === -1) return null;

  const rawBlock = text.slice(afterMarker + 1, end);
  const lines = rawBlock.split('\n');
  const deindented = lines
    .map((line) => line.startsWith('          ') ? line.slice(10) : line)
    .join('\n');

  return deindented;
}

function main() {
  if (!fs.existsSync(workflowPath)) {
    console.error('[sync-site] workflow file not found:', workflowPath);
    process.exit(1);
  }

  const workflowText = fs.readFileSync(workflowPath, 'utf8');

  for (const t of targets) {
    const content = extractBlock(workflowText, t.marker);
    if (!content) {
      console.error(`[sync-site] failed to extract ${t.label} block from workflow`);
      process.exit(1);
    }

    fs.mkdirSync(path.dirname(t.out), { recursive: true });
    fs.writeFileSync(t.out, content);
    console.log(`[sync-site] wrote ${t.out}`);
  }

  console.log('[sync-site] _site UI files synced from workflow templates');
}

main();

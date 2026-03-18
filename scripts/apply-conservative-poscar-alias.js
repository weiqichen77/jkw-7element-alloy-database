#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MATERIALS_PATH = path.join(ROOT, 'backend', 'data', 'materials.json');
const INTERMETALLIC_PATH = path.join(ROOT, 'backend', 'data', 'materials_intermetallic.json');
const SYNC_MATERIALS_PATH = path.join(ROOT, 'data', 'materials.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'conservative-poscar-alias-20260318');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function rel(p) {
  return String(p || '').replace(/^\/+/, '').replace(/\\/g, '/');
}

function existsPath(p) {
  const rp = rel(p);
  if (!rp) return false;
  return fs.existsSync(path.join(ROOT, rp));
}

function aliasMapForSource(source) {
  const s = source || '';
  return [
    s,
    s.replace('DPA3_7ele_cryfinal', 'DPA3'),
    s.replace('DPA3_final', 'DPA3'),
    s.replace('DPA1_260109', 'DPA1_251208'),
    s.replace('DPA1_7ele_cry260226', 'DPA1_251208')
  ].filter(Boolean);
}

function conservativeCandidate(material, entry) {
  const source = entry.source || '';
  const aliases = [...new Set(aliasMapForSource(source))];

  if (material.type === 'intermetallic') {
    const base = `data/intermetallic/${material.source}`;
    for (const a of aliases) {
      const c = `${base}/${a}/POSCAR`;
      if (existsPath(c)) return c;
    }
    return null;
  }

  if (material.type === 'solid-solution') {
    const sid = material.source || material.ori_source;
    if (!sid) return null;
    const base = `data/solid_solution/${sid}`;
    for (const a of aliases) {
      const c = `${base}/${a}/POSCAR`;
      if (existsPath(c)) return c;
    }
    return null;
  }

  // Conservative mode intentionally avoids element/amorphous heuristics.
  return null;
}

function applyToList(list, label) {
  const stats = {
    label,
    totalEntries: 0,
    alreadyValid: 0,
    unresolvedBefore: 0,
    updated: 0,
    unresolvedAfter: 0,
    byType: {},
    examples: []
  };

  function ensureType(type) {
    if (!stats.byType[type]) {
      stats.byType[type] = {
        unresolvedBefore: 0,
        updated: 0,
        unresolvedAfter: 0
      };
    }
  }

  for (const material of list) {
    const type = material.type || 'unknown';
    const entries = Array.isArray(material.data) ? material.data : [];

    for (const entry of entries) {
      stats.totalEntries += 1;

      if (typeof entry.poscar === 'string' && entry.poscar && existsPath(entry.poscar)) {
        stats.alreadyValid += 1;
        continue;
      }

      stats.unresolvedBefore += 1;
      ensureType(type);
      stats.byType[type].unresolvedBefore += 1;

      const candidate = conservativeCandidate(material, entry);
      if (candidate) {
        const oldPoscar = entry.poscar || null;
        entry.poscar = candidate;
        stats.updated += 1;
        stats.byType[type].updated += 1;

        if (stats.examples.length < 12) {
          stats.examples.push({
            id: material.id || null,
            name: material.name || null,
            type,
            source: entry.source || null,
            temperature: entry.temperature ?? null,
            oldPoscar,
            newPoscar: candidate
          });
        }
      } else {
        stats.unresolvedAfter += 1;
        stats.byType[type].unresolvedAfter += 1;
      }
    }
  }

  return stats;
}

function main() {
  const materials = readJSON(MATERIALS_PATH);
  const intermetallic = readJSON(INTERMETALLIC_PATH);

  const s1 = applyToList(materials, 'materials');
  const s2 = applyToList(intermetallic, 'intermetallic');

  writeJSON(MATERIALS_PATH, materials);
  writeJSON(INTERMETALLIC_PATH, intermetallic);
  writeJSON(SYNC_MATERIALS_PATH, materials);

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const summary = {
    generatedAt: new Date().toISOString(),
    mode: 'conservative-alias-only',
    materials: s1,
    intermetallic: s2,
    totalUpdated: s1.updated + s2.updated,
    totalUnresolvedAfter: s1.unresolvedAfter + s2.unresolvedAfter
  };

  writeJSON(path.join(REPORT_DIR, 'summary.json'), summary);
  writeJSON(path.join(REPORT_DIR, 'materials_examples.json'), s1.examples);
  writeJSON(path.join(REPORT_DIR, 'intermetallic_examples.json'), s2.examples);

  console.log(JSON.stringify(summary, null, 2));
}

main();

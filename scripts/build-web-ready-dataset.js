#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'reports', 'web-ready-20260318');

const MATERIALS_PATH = path.join(ROOT, 'backend', 'data', 'materials.json');
const INTERMETALLIC_PATH = path.join(ROOT, 'backend', 'data', 'materials_intermetallic.json');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function normalizePath(p) {
  if (typeof p !== 'string') return '';
  return p.replace(/^\/+/, '').replace(/\\/g, '/');
}

function existsRel(p) {
  const rel = normalizePath(p);
  if (!rel) return false;
  return Boolean(fs.existsSync(path.join(ROOT, rel)));
}

function walkFiles(dirPath, callback) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, callback);
    } else {
      callback(full);
    }
  }
}

function preferStressFile(currentPath, candidatePath) {
  if (!currentPath) return candidatePath;

  const current = path.basename(currentPath);
  const candidate = path.basename(candidatePath);

  const score = (name) => {
    if (name.includes('5.0e10')) return 30;
    if (name.includes('5.0e9')) return 20;
    return 10;
  };

  if (score(candidate) > score(current)) return candidatePath;
  if (score(candidate) < score(current)) return currentPath;
  return candidate < current ? candidatePath : currentPath;
}

function buildStressStrainMapping() {
  const mapping = [];
  const byKey = new Map();
  const seenFiles = [];

  const elementRoot = path.join(ROOT, 'data', 'element');
  if (!fs.existsSync(elementRoot)) {
    return { mapping, seenFiles, stats: { matchedFiles: 0 } };
  }

  walkFiles(elementRoot, (fullPath) => {
    const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (!rel.includes('/strain/')) return;
    if (!/\.(dat|txt|csv)$/i.test(rel)) return;

    const parts = rel.split('/');
    // data/element/{el}/{phase}/{source}/{tempDir}/strain/{direction}/{file}
    if (parts.length < 9) return;

    const el = parts[2];
    const phase = parts[3];
    const source = parts[4];
    const tempDir = parts[5];
    const direction = parts[7];

    const tempMatch = tempDir.match(/^(\d+)k$/i);
    if (!tempMatch) return;

    const temperature = Number(tempMatch[1]);
    if (!Number.isFinite(temperature)) return;

    const materialName = `${el}-${phase}`;
    const key = `${materialName}||${source}||${temperature}`;

    if (!byKey.has(key)) {
      byKey.set(key, {
        materialName,
        materialType: 'element',
        source,
        temperature,
        stressStrain: {}
      });
    }

    const rec = byKey.get(key);
    rec.stressStrain[direction] = preferStressFile(rec.stressStrain[direction], rel);
    seenFiles.push(rel);
  });

  for (const rec of byKey.values()) {
    mapping.push(rec);
  }

  mapping.sort((a, b) => {
    if (a.materialName !== b.materialName) return a.materialName.localeCompare(b.materialName);
    if (a.source !== b.source) return a.source.localeCompare(b.source);
    return a.temperature - b.temperature;
  });

  return {
    mapping,
    seenFiles,
    stats: {
      matchedFiles: seenFiles.length,
      mappingRows: mapping.length
    }
  };
}

function buildWebReady() {
  const materials = readJSON(MATERIALS_PATH);
  const intermetallic = readJSON(INTERMETALLIC_PATH);
  const all = [...materials, ...intermetallic];

  const stressBuild = buildStressStrainMapping();
  const stressLookup = new Map();
  for (const row of stressBuild.mapping) {
    const key = `${row.materialName}||${row.source}||${row.temperature}`;
    stressLookup.set(key, row.stressStrain);
  }

  const stats = {
    inputMaterials: all.length,
    inputDataEntries: 0,
    keptDataEntries: 0,
    droppedMissingPoscar: 0,
    keptRdf: 0,
    droppedMissingRdf: 0,
    stressMappingApplied: 0,
    stressMappingCandidates: stressBuild.stats.mappingRows,
    filesMatchedForStressMapping: stressBuild.stats.matchedFiles
  };

  const output = [];

  all.forEach((material) => {
    const clone = JSON.parse(JSON.stringify(material));
    const inData = Array.isArray(clone.data) ? clone.data : [];
    stats.inputDataEntries += inData.length;

    const outData = [];

    inData.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;

      // Keep only entries with resolvable POSCAR for web-ready dataset.
      if (!entry.poscar || !existsRel(entry.poscar)) {
        stats.droppedMissingPoscar += 1;
        return;
      }

      const e = JSON.parse(JSON.stringify(entry));

      // Keep RDF only if file exists; otherwise remove broken pointer.
      if (e.properties && e.properties.structure && typeof e.properties.structure.rdf === 'string' && e.properties.structure.rdf) {
        if (existsRel(e.properties.structure.rdf)) {
          stats.keptRdf += 1;
        } else {
          delete e.properties.structure.rdf;
          stats.droppedMissingRdf += 1;
        }
      }

      const k = `${clone.name}||${e.source}||${e.temperature}`;
      const mapped = stressLookup.get(k);
      if (mapped) {
        if (!e.properties) e.properties = {};
        if (!e.properties.mechanics || typeof e.properties.mechanics !== 'object') e.properties.mechanics = {};
        e.properties.mechanics.stressStrain = mapped;
        stats.stressMappingApplied += 1;
      }

      outData.push(e);
      stats.keptDataEntries += 1;
    });

    if (outData.length > 0) {
      clone.data = outData;
      output.push(clone);
    }
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    ...stats,
    outputMaterials: output.length,
    outputDataEntries: output.reduce((n, m) => n + (Array.isArray(m.data) ? m.data.length : 0), 0)
  };

  writeJSON(path.join(OUT_DIR, 'web_ready_materials.json'), output);
  writeJSON(path.join(OUT_DIR, 'stress_strain_mapping_preview.json'), stressBuild.mapping);
  writeJSON(path.join(OUT_DIR, 'summary.json'), summary);

  fs.writeFileSync(
    path.join(OUT_DIR, 'README.txt'),
    [
      'Web-ready dataset artifacts:',
      '- web_ready_materials.json: only data entries with existing POSCAR; existing RDF kept; stressStrain mapping injected when available',
      '- stress_strain_mapping_preview.json: inferred mapping from data/element/*/*/DPA3_7ele_cryfinal/298k/strain/*/*.dat',
      '- summary.json: build statistics'
    ].join('\n') + '\n',
    'utf8'
  );

  return summary;
}

const summary = buildWebReady();
console.log(JSON.stringify(summary, null, 2));

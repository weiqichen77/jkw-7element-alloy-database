#!/usr/bin/env node

/**
 * Import batch data (0317/0318) into database with user-defined rules:
 * 1. Auto convert atomFraction -> atomCount when atomCount is missing
 * 2. Split thermodynamics.specificHeat into specificHeat_v and specificHeat_p
 * 3. Keep poscar as-is (do not auto fill)
 * 4. Ignore unknown fields during validation (preserve them in data)
 * 5. Replace existing material entry when matched, otherwise append as new
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const INPUTS = [
  path.join(__dirname, 'materials_element_0317.json'),
  path.join(__dirname, 'materials_solid_solution_0317.json'),
  path.join(__dirname, 'materials_amorphous_0318.json')
];

const INPUT_INTERMETALLIC = path.join(__dirname, 'materials_intermetallic_0317.json');

const MATERIALS_PATH = path.join(ROOT, 'backend', 'data', 'materials.json');
const INTERMETALLIC_PATH = path.join(ROOT, 'backend', 'data', 'materials_intermetallic.json');
const SYNC_MATERIALS_PATH = path.join(ROOT, 'data', 'materials.json');

const TYPE_MAP = {
  'solid-element': 'element',
  'solid_solution': 'solid-solution'
};

const TYPE_CODE = {
  element: 'E',
  'solid-solution': 'SS',
  intermetallic: 'IM',
  amorphous: 'AM',
  interface: 'IF'
};

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeMaterial(raw) {
  const m = clone(raw);

  m.type = TYPE_MAP[m.type] || m.type;

  if (!m.source || m.source === '') {
    if (m.ori_source && m.ori_source !== '') {
      m.source = m.ori_source;
    } else if (m.name && m.name !== '') {
      m.source = m.name;
    }
  }

  if (m.type === 'solid-solution') {
    if (!m.ori_source && m.source) {
      m.ori_source = m.source;
    }
    if (!m.source && m.ori_source) {
      m.source = m.ori_source;
    }
  }

  if ((!m.atomCount || typeof m.atomCount !== 'object') && m.atomFraction && typeof m.atomFraction === 'object') {
    const atomCount = {};
    Object.entries(m.atomFraction).forEach(([el, val]) => {
      const n = toNum(val);
      if (n !== null) {
        atomCount[el] = Math.round(n);
      }
    });
    if (Object.keys(atomCount).length > 0) {
      m.atomCount = atomCount;
    }
  }

  if (Array.isArray(m.data)) {
    m.data.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      if (!entry.properties || typeof entry.properties !== 'object') return;
      const thermo = entry.properties.thermodynamics;
      if (!thermo || typeof thermo !== 'object') return;

      if ('specificHeat' in thermo) {
        if (!('specificHeat_v' in thermo)) {
          thermo.specificHeat_v = thermo.specificHeat;
        }
        if (!('specificHeat_p' in thermo)) {
          thermo.specificHeat_p = thermo.specificHeat;
        }
      }
    });
  }

  return m;
}

function materialMatches(a, b) {
  const aType = (a.type || '').toLowerCase();
  const bType = (b.type || '').toLowerCase();
  if (aType !== bType) return false;

  const aSource = (a.source || '').trim();
  const bSource = (b.source || '').trim();
  if (aSource && bSource && aSource === bSource) return true;

  const aOri = (a.ori_source || '').trim();
  const bOri = (b.ori_source || '').trim();
  if (aOri && bOri && aOri === bOri) return true;

  if (aSource && bOri && aSource === bOri) return true;
  if (aOri && bSource && aOri === bSource) return true;

  const aName = (a.name || '').trim().toLowerCase();
  const bName = (b.name || '').trim().toLowerCase();
  const aComp = (a.composition || '').replace(/\s+/g, '').toLowerCase();
  const bComp = (b.composition || '').replace(/\s+/g, '').toLowerCase();

  if (aName && bName && aComp && bComp && aName === bName && aComp === bComp) return true;
  if (aName && bName && aName === bName) return true;

  return false;
}

function getMaxIdByType(data, type) {
  const code = TYPE_CODE[type];
  if (!code) return 0;

  let maxNum = 0;
  data.forEach((m) => {
    if ((m.type || '') !== type) return;
    const id = String(m.id || '');
    const regex = new RegExp(`^Alloy-${code}-(\\d+)$`);
    const match = id.match(regex);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > maxNum) maxNum = n;
    }
  });

  return maxNum;
}

function nextId(type, counters) {
  const code = TYPE_CODE[type] || 'XX';
  counters[type] = (counters[type] || 0) + 1;
  return `Alloy-${code}-${String(counters[type]).padStart(5, '0')}`;
}

function upsertBatch(existing, incoming, label) {
  const counters = {};
  Object.keys(TYPE_CODE).forEach((t) => {
    counters[t] = getMaxIdByType(existing, t);
  });

  let replaced = 0;
  let added = 0;

  incoming.forEach((rawMat) => {
    const mat = normalizeMaterial(rawMat);

    const idx = existing.findIndex((oldMat) => materialMatches(oldMat, mat));
    if (idx >= 0) {
      const oldId = existing[idx].id;
      const next = clone(mat);
      if (oldId) next.id = oldId;
      else if (!next.id) next.id = nextId(next.type, counters);
      existing[idx] = next;
      replaced += 1;
    } else {
      const next = clone(mat);
      if (!next.id) {
        next.id = nextId(next.type, counters);
      }
      existing.push(next);
      added += 1;
    }
  });

  console.log(`\n${label}: replaced ${replaced}, added ${added}, total ${existing.length}`);
  return { replaced, added };
}

function main() {
  const materials = readJSON(MATERIALS_PATH);
  const intermetallic = readJSON(INTERMETALLIC_PATH);

  const inputMaterials = [];
  INPUTS.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing input file: ${filePath}`);
    }
    const arr = readJSON(filePath);
    if (!Array.isArray(arr)) {
      throw new Error(`Input is not array: ${filePath}`);
    }
    inputMaterials.push(...arr);
  });

  if (!fs.existsSync(INPUT_INTERMETALLIC)) {
    throw new Error(`Missing input file: ${INPUT_INTERMETALLIC}`);
  }
  const inputIntermetallic = readJSON(INPUT_INTERMETALLIC);
  if (!Array.isArray(inputIntermetallic)) {
    throw new Error(`Input is not array: ${INPUT_INTERMETALLIC}`);
  }

  console.log('Importing updated batch data...');
  console.log(`materials input count: ${inputMaterials.length}`);
  console.log(`intermetallic input count: ${inputIntermetallic.length}`);

  const summaryMaterials = upsertBatch(materials, inputMaterials, 'materials.json');
  const summaryInter = upsertBatch(intermetallic, inputIntermetallic, 'materials_intermetallic.json');

  writeJSON(MATERIALS_PATH, materials);
  writeJSON(INTERMETALLIC_PATH, intermetallic);
  writeJSON(SYNC_MATERIALS_PATH, materials);

  console.log('\nSaved files:');
  console.log(`- ${MATERIALS_PATH}`);
  console.log(`- ${INTERMETALLIC_PATH}`);
  console.log(`- ${SYNC_MATERIALS_PATH}`);

  console.log('\nSummary:');
  console.log(`- materials replaced: ${summaryMaterials.replaced}`);
  console.log(`- materials added: ${summaryMaterials.added}`);
  console.log(`- intermetallic replaced: ${summaryInter.replaced}`);
  console.log(`- intermetallic added: ${summaryInter.added}`);
}

main();

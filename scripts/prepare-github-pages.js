#!/usr/bin/env node

/**
 * 脚本：为 GitHub Pages 构建准备合并的数据文件
 * 将 materials.json 和 materials_intermetallic.json 合并为一个文件供网页使用
 */

const fs = require('fs');
const path = require('path');

console.log('Preparing data for GitHub Pages deployment...\n');

const dataDir = path.join(__dirname, '..', 'backend', 'data');
const materialsPath = path.join(dataDir, 'materials.json');
const intermetallicPath = path.join(dataDir, 'materials_intermetallic.json');
const outputPath = path.join(__dirname, '..', '_site', 'data', 'materials.json');

function normalizeDataSourceLabel(source) {
  if (!source) return '';
  const raw = String(source).trim();
  const lower = raw.toLowerCase();
  if (lower === 'init') return '';
  if (/^dpa[-_ ]?3/i.test(raw) || /^dpa[-_ ]?1/i.test(raw)) return 'DPA_alloy';
  return raw;
}

function countPropertyFields(dataEntry) {
  const props = (dataEntry && dataEntry.properties) || {};
  const sections = ['structure', 'thermodynamics', 'mechanics', 'defects'];
  let count = 0;
  for (const section of sections) {
    const obj = props[section];
    if (!obj || typeof obj !== 'object') continue;
    for (const v of Object.values(obj)) {
      if (v === null || v === undefined || v === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
      count++;
    }
  }
  return count;
}

function sourcePriority(source) {
  const raw = String(source || '');
  if (/^dpa[-_ ]?3/i.test(raw)) return 3;
  if (/^dpa[-_ ]?1/i.test(raw)) return 2;
  return 1;
}

function isMissingValue(v) {
  if (v === null || v === undefined || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

function deepFillMissing(primary, fallback) {
  if (isMissingValue(primary) && !isMissingValue(fallback)) return fallback;
  if (typeof primary !== 'object' || primary === null || Array.isArray(primary)) return primary;
  if (typeof fallback !== 'object' || fallback === null || Array.isArray(fallback)) return primary;

  const merged = { ...primary };
  for (const [k, v] of Object.entries(fallback)) {
    if (!(k in merged)) {
      merged[k] = v;
      continue;
    }
    merged[k] = deepFillMissing(merged[k], v);
  }
  return merged;
}

function mergeMissingProperties(primaryEntry, fallbackEntry) {
  const primaryProps = (primaryEntry && primaryEntry.properties) || {};
  const fallbackProps = (fallbackEntry && fallbackEntry.properties) || {};
  return {
    ...primaryEntry,
    properties: deepFillMissing(primaryProps, fallbackProps),
  };
}

function normalizeAndDedupeMaterialData(material) {
  if (!Array.isArray(material.data) || material.data.length === 0) return material;

  const deduped = new Map();
  for (const entry of material.data) {
    if (!entry || typeof entry !== 'object') continue;
    const originalSource = entry.source || '';
    const normalizedSource = normalizeDataSourceLabel(originalSource);
    if (!normalizedSource) continue;

    const temperature = (typeof entry.temperature === 'number' || typeof entry.temperature === 'string')
      ? entry.temperature
      : 'NA';
    const key = `${temperature}__${normalizedSource}`;

    const normalizedEntry = {
      ...entry,
      source: normalizedSource,
      original_source: entry.original_source || originalSource || normalizedSource,
    };

    if (!deduped.has(key)) {
      deduped.set(key, normalizedEntry);
      continue;
    }

    const current = deduped.get(key);
    const pCurrent = sourcePriority(current.original_source || current.source);
    const pCandidate = sourcePriority(normalizedEntry.original_source || normalizedEntry.source);

    if (pCandidate > pCurrent) {
      deduped.set(key, mergeMissingProperties(normalizedEntry, current));
      continue;
    }

    if (pCurrent > pCandidate) {
      deduped.set(key, mergeMissingProperties(current, normalizedEntry));
      continue;
    }

    if (countPropertyFields(normalizedEntry) > countPropertyFields(current)) {
      deduped.set(key, mergeMissingProperties(normalizedEntry, current));
    } else {
      deduped.set(key, mergeMissingProperties(current, normalizedEntry));
    }
  }

  material.data = Array.from(deduped.values());
  return material;
}

try {
  let allMaterials = [];
  
  // Load materials.json
  if (fs.existsSync(materialsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
      allMaterials = allMaterials.concat(data.map(normalizeAndDedupeMaterialData));
      console.log(`✓ Loaded ${data.length} materials from materials.json`);
    } catch (e) {
      console.error('✗ Error parsing materials.json:', e.message);
    }
  } else {
    console.log('! materials.json not found');
  }
  
  // Load and merge materials_intermetallic.json
  if (fs.existsSync(intermetallicPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));
      // Normalize intermetallic materials
      const normalized = data.map(material => {
        normalizeAndDedupeMaterialData(material);
        if (!material.density && material.data && material.data.length > 0) {
          const firstData = material.data[0];
          if (firstData.properties && firstData.properties.structure) {
            material.density = firstData.properties.structure.density;
          }
        }
        return material;
      });
      allMaterials = allMaterials.concat(normalized);
      console.log(`✓ Loaded ${data.length} materials from materials_intermetallic.json`);
    } catch (e) {
      console.error('✗ Error parsing materials_intermetallic.json:', e.message);
    }
  } else {
    console.log('! materials_intermetallic.json not found');
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write combined data
  fs.writeFileSync(outputPath, JSON.stringify(allMaterials, null, 2));
  console.log(`\n✓ Successfully merged data into: ${outputPath}`);
  console.log(`✓ Total materials: ${allMaterials.length}`);
  
} catch (e) {
  console.error('✗ Error:', e.message);
  process.exit(1);
}

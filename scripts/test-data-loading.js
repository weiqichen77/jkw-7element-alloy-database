#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'backend', 'data');
const DATA_PATH = path.join(DATA_DIR, 'materials.json');
const INTERMETALLIC_PATH = path.join(DATA_DIR, 'materials_intermetallic.json');

function normalizeIntermetallic(material) {
  if (!material.data) {
    material.data = [];
  }
  
  if (!material.density && material.data.length > 0) {
    const firstData = material.data[0];
    if (firstData.properties && firstData.properties.structure && firstData.properties.structure.density) {
      material.density = firstData.properties.structure.density;
    }
  }
  
  if (!material.properties) {
    material.properties = {};
  }
  
  return material;
}

function load(){
  let data = [];
  
  // Load materials.json
  if(fs.existsSync(DATA_PATH)){
    try{
      const materials = JSON.parse(fs.readFileSync(DATA_PATH));
      data = data.concat(materials);
      console.log(`✓ Loaded ${materials.length} materials from materials.json`);
    }catch(e){
      console.error('✗ Error loading materials.json:', e.message);
    }
  } else {
    console.log('! materials.json not found');
  }
  
  // Load and merge materials_intermetallic.json
  if(fs.existsSync(INTERMETALLIC_PATH)){
    try{
      const intermetallic = JSON.parse(fs.readFileSync(INTERMETALLIC_PATH));
      if(Array.isArray(intermetallic)){
        const normalized = intermetallic.map(normalizeIntermetallic);
        data = data.concat(normalized);
        console.log(`✓ Loaded ${normalized.length} intermetallic materials from materials_intermetallic.json`);
      }
    }catch(e){
      console.error('✗ Error loading materials_intermetallic.json:', e.message);
    }
  } else {
    console.log('! materials_intermetallic.json not found');
  }
  
  return data;
}

console.log('Testing data loading...\n');
const allData = load();

console.log(`\n✓ Total materials loaded: ${allData.length}`);

if (allData.length > 0) {
  console.log('\nFirst 5 materials:');
  allData.slice(0, 5).forEach((m, i) => {
    const dataPoints = m.data ? m.data.length : 0;
    const density = m.density ? ` (density: ${m.density})` : '';
    const elements = m.elements ? m.elements.join(',') : 'N/A';
    console.log(`  ${i+1}. ${m.id} - ${m.name} [${m.type}] - ${elements}${density} (${dataPoints} data points)`);
  });
}

// Test search functionality
console.log('\n\nTesting search...');
const searchTerm = 'Al';
const results = allData.filter(x => {
  const name = x.name || '';
  const elements = x.elements ? x.elements.join() : '';
  const props = x.properties ? JSON.stringify(x.properties) : '';
  return (name + elements + ' ' + props).toLowerCase().includes(searchTerm.toLowerCase());
});
console.log(`Search for "${searchTerm}": ${results.length} results`);
console.log('First 5 results:');
results.slice(0, 5).forEach((m, i) => {
  console.log(`  ${i+1}. ${m.id} - ${m.name}`);
});

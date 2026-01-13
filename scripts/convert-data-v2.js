#!/usr/bin/env node

/**
 * Enhanced Data Conversion Tool for Alloy Materials Database V2
 * Supports: temperature dimension, data sources, expanded properties
 */

const fs = require('fs');
const path = require('path');

// Valid material types
const VALID_TYPES = ['element', 'solid-solution', 'intermetallic', 'amorphous', 'interface'];

// Valid data sources
const VALID_SOURCES = ['DFT', 'DPA-1', 'DPA-3'];

// Primary elements (warnings for others)
const PRIMARY_ELEMENTS = ['Al', 'Ni', 'Cu', 'Zr', 'Nb', 'Ta', 'W'];

/**
 * Parse composition string to get element counts
 * Example: "Al2Cu4Ni1" -> {Al: 2, Cu: 4, Ni: 1}
 */
function parseComposition(composition) {
  const regex = /([A-Z][a-z]?)(\d*)/g;
  const atomCount = {};
  const elements = [];
  
  let match;
  while ((match = regex.exec(composition)) !== null) {
    const element = match[1];
    const count = match[2] ? parseInt(match[2]) : 1;
    
    if (element) {
      atomCount[element] = count;
      if (!elements.includes(element)) {
        elements.push(element);
      }
    }
  }
  
  return { elements, atomCount };
}

/**
 * Parse elastic constants matrix from string
 */
function parseElasticConstants(str) {
  if (!str) return null;
  
  try {
    // Handle JSON array format
    const matrix = JSON.parse(str);
    if (Array.isArray(matrix) && matrix.length === 6) {
      return matrix;
    }
  } catch (e) {
    // Try other formats if needed
  }
  
  return null;
}

/**
 * Parse interstitial formation energy (can be single value or object)
 */
function parseInterstitialEnergy(row) {
  const sites = {};
  let hasSites = false;
  
  // Check for different interstitial site columns
  const siteColumns = [
    'interstitial_formation_energy_dumbbell111',
    'interstitial_formation_energy_dumbbell100',
    'interstitial_formation_energy_crowdion111',
    'interstitial_formation_energy_octahedral',
    'interstitial_formation_energy_tetrahedral'
  ];
  
  siteColumns.forEach(col => {
    if (row[col] && row[col] !== '') {
      const siteName = col.replace('interstitial_formation_energy_', '');
      sites[siteName] = parseFloat(row[col]);
      hasSites = true;
    }
  });
  
  // If no specific sites, check for generic column
  if (!hasSites && row.interstitial_formation_energy && row.interstitial_formation_energy !== '') {
    return parseFloat(row.interstitial_formation_energy);
  }
  
  return hasSites ? sites : null;
}

/**
 * Parse CSV file
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : '';
    });
    rows.push(row);
  }
  
  return rows;
}

/**
 * Group rows by material (name + source combination)
 */
function groupByMaterial(rows) {
  const materials = {};
  
  rows.forEach(row => {
    // Use name + source as unique identifier
    const key = `${row.name}|||${row.source || 'Unknown'}`;
    if (!materials[key]) {
      materials[key] = [];
    }
    materials[key].push(row);
  });
  
  return Object.values(materials);
}

/**
 * Convert grouped rows to material object
 */
function convertToMaterial(rows) {
  // Use first row for basic info
  const firstRow = rows[0];
  
  const { elements, atomCount } = parseComposition(firstRow.composition);
  
  // Check for non-primary elements
  elements.forEach(element => {
    if (!PRIMARY_ELEMENTS.includes(element)) {
      console.warn(`Warning: Material "${firstRow.name}" contains non-primary element: ${element}`);
    }
  });
  
  const material = {
    // id will be assigned later
    name: firstRow.name,
    source: firstRow.source || 'Unknown',  // Material-level source
    type: firstRow.type,
    composition: firstRow.composition,
    elements: elements,
    atomCount: atomCount,
    data: []
  };
  
  // Add POSCAR if provided
  if (firstRow.poscar && firstRow.poscar !== '') {
    material.poscar = firstRow.poscar;
  }
  
  // Process each row as a temperature/data_source data point
  rows.forEach(row => {
    const dataPoint = {
      temperature: parseFloat(row.temperature) || 0,
      source: row.data_source || row.source || 'DFT',  // Use data_source column, fallback to source
      properties: {}
    };
    
    // Structure properties
    const structure = {};
    if (row.density) structure.density = parseFloat(row.density);
    
    if (row.lattice_a || row.point_group) {
      structure.latticeParameters = {};
      if (row.lattice_a) structure.latticeParameters.a = parseFloat(row.lattice_a);
      if (row.lattice_b) structure.latticeParameters.b = parseFloat(row.lattice_b);
      if (row.lattice_c) structure.latticeParameters.c = parseFloat(row.lattice_c);
      if (row.lattice_alpha) structure.latticeParameters.alpha = parseFloat(row.lattice_alpha);
      if (row.lattice_beta) structure.latticeParameters.beta = parseFloat(row.lattice_beta);
      if (row.lattice_gamma) structure.latticeParameters.gamma = parseFloat(row.lattice_gamma);
      if (row.point_group) structure.latticeParameters.pointGroup = row.point_group;
    }
    
    if (row.rdf) structure.rdf = row.rdf;
    
    if (Object.keys(structure).length > 0) {
      dataPoint.properties.structure = structure;
    }
    
    // Thermodynamics properties
    const thermodynamics = {};
    if (row.specific_heat) thermodynamics.specificHeat = parseFloat(row.specific_heat);
    if (row.mixing_enthalpy) thermodynamics.mixingEnthalpy = parseFloat(row.mixing_enthalpy);
    if (row.diffusion_coefficient) thermodynamics.diffusionCoefficient = parseFloat(row.diffusion_coefficient);
    if (row.thermal_expansion) thermodynamics.thermalExpansion = parseFloat(row.thermal_expansion);
    
    if (Object.keys(thermodynamics).length > 0) {
      dataPoint.properties.thermodynamics = thermodynamics;
    }
    
    // Mechanics properties
    const mechanics = {};
    if (row.youngs_modulus) mechanics.youngsModulus = parseFloat(row.youngs_modulus);
    if (row.bulk_modulus) mechanics.bulkModulus = parseFloat(row.bulk_modulus);
    if (row.shear_modulus) mechanics.shearModulus = parseFloat(row.shear_modulus);
    if (row.poissons_ratio) mechanics.poissonsRatio = parseFloat(row.poissons_ratio);
    
    const elasticConstants = parseElasticConstants(row.elastic_constants);
    if (elasticConstants) mechanics.elasticConstants = elasticConstants;
    
    if (row.stress_strain) mechanics.stressStrain = row.stress_strain;
    
    if (Object.keys(mechanics).length > 0) {
      dataPoint.properties.mechanics = mechanics;
    }
    
    // Defects properties
    const defects = {};
    if (row.vacancy_formation_energy) defects.vacancyFormationEnergy = parseFloat(row.vacancy_formation_energy);
    
    const interstitialEnergy = parseInterstitialEnergy(row);
    if (interstitialEnergy !== null) {
      defects.interstitialFormationEnergy = interstitialEnergy;
    }
    
    if (row.stacking_fault_energy) defects.stackingFaultEnergy = parseFloat(row.stacking_fault_energy);
    
    if (Object.keys(defects).length > 0) {
      dataPoint.properties.defects = defects;
    }
    
    // Only add data point if it has properties
    if (Object.keys(dataPoint.properties).length > 0) {
      material.data.push(dataPoint);
    }
  });
  
  // Sort data by temperature, then source
  material.data.sort((a, b) => {
    if (a.temperature !== b.temperature) {
      return a.temperature - b.temperature;
    }
    return a.source.localeCompare(b.source);
  });
  
  return material;
}

/**
 * Validate material structure
 */
function validateMaterial(material) {
  const errors = [];
  
  // Check required fields (id is now optional, will be auto-assigned)
  if (!material.name) errors.push('Missing required field: name');
  if (!material.type) errors.push('Missing required field: type');
  if (!material.composition) errors.push('Missing required field: composition');
  if (!material.source) errors.push('Missing required field: source');
  
  // Validate type
  if (material.type && !VALID_TYPES.includes(material.type)) {
    errors.push(`Invalid material type: ${material.type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  
  // Validate data array
  if (!material.data || material.data.length === 0) {
    errors.push('Material must have at least one data entry');
  }
  
  // Validate each data entry
  material.data.forEach((entry, index) => {
    if (entry.temperature === undefined) {
      errors.push(`Data entry ${index}: missing temperature`);
    }
    if (!entry.source) {
      errors.push(`Data entry ${index}: missing source`);
    }
    if (!entry.properties || Object.keys(entry.properties).length === 0) {
      errors.push(`Data entry ${index}: no properties defined`);
    }
  });
  
  return errors;
}

/**
 * Main conversion function
 */
async function convertData(inputFile, outputFile) {
  console.log(`Reading input file: ${inputFile}`);
  
  const content = fs.readFileSync(inputFile, 'utf8');
  const ext = path.extname(inputFile).toLowerCase();
  
  let rows;
  if (ext === '.csv') {
    rows = parseCSV(content);
  } else if (ext === '.json') {
    // If already in JSON format, just validate
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      console.log('Input is already in JSON array format');
      // Validate each material
      data.forEach((material, index) => {
        const errors = validateMaterial(material);
        if (errors.length > 0) {
          console.error(`\nValidation errors for material ${index + 1}:`);
          errors.forEach(err => console.error(`  - ${err}`));
        }
      });
      
      // Write output
      fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
      console.log(`\nSuccessfully validated and wrote ${data.length} materials to ${outputFile}`);
      return;
    } else {
      throw new Error('JSON input must be an array of materials');
    }
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
  
  console.log(`Parsed ${rows.length} data rows`);
  
  // Group rows by material (name + source)
  const groupedMaterials = groupByMaterial(rows);
  console.log(`Grouped into ${groupedMaterials.length} materials`);
  
  // Convert to material objects
  const materials = groupedMaterials.map(rows => convertToMaterial(rows));
  
  // Auto-assign IDs sequentially
  materials.forEach((material, index) => {
    material.id = index + 1;
  });
  console.log(`Assigned IDs from 1 to ${materials.length}`);
  
  // Validate materials
  let hasErrors = false;
  materials.forEach((material, index) => {
    const errors = validateMaterial(material);
    if (errors.length > 0) {
      hasErrors = true;
      console.error(`\nValidation errors for material "${material.name}" (ID: ${material.id}):`);
      errors.forEach(err => console.error(`  - ${err}`));
    }
  });
  
  if (hasErrors) {
    console.error('\nConversion completed with validation errors. Please fix the errors above.');
    process.exit(1);
  }
  
  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(materials, null, 2));
  console.log(`\nSuccessfully converted ${materials.length} materials to ${outputFile}`);
  
  // Print statistics
  const totalDataPoints = materials.reduce((sum, m) => sum + m.data.length, 0);
  console.log(`Total data entries: ${totalDataPoints}`);
}

/**
 * Generate template
 */
function generateTemplate(outputFile) {
  const template = `id,name,type,composition,poscar,temperature,source,density,lattice_a,lattice_b,lattice_c,lattice_alpha,lattice_beta,lattice_gamma,point_group,rdf,specific_heat,mixing_enthalpy,diffusion_coefficient,thermal_expansion,youngs_modulus,bulk_modulus,shear_modulus,poissons_ratio,elastic_constants,stress_strain,vacancy_formation_energy,interstitial_formation_energy_dumbbell111,interstitial_formation_energy_dumbbell100,interstitial_formation_energy_crowdion111,stacking_fault_energy
1,Material-Name,solid-solution,Al2Cu4,data/poscar/sample.vasp,0,DFT,7.85,3.52,3.52,3.52,90,90,90,Fm-3m,data/rdf/sample.dat,0.45,-0.25,1.2e-10,1.5e-5,200,160,80,0.3,"[[230,135,135,0,0,0],[135,230,135,0,0,0],[135,135,230,0,0,0],[0,0,0,118,0,0],[0,0,0,0,118,0],[0,0,0,0,0,118]]",data/stress-strain/sample.dat,1.2,3.5,3.8,4.2,0.05
1,Material-Name,solid-solution,Al2Cu4,data/poscar/sample.vasp,300,DFT,7.82,3.53,3.53,3.53,90,90,90,Fm-3m,,0.48,,,,,,,,,,,,,,,
`;
  
  fs.writeFileSync(outputFile, template);
  console.log(`Generated template file: ${outputFile}`);
  console.log('\nTemplate includes examples with multiple temperatures and data sources.');
  console.log('Material types: element, solid-solution, intermetallic, amorphous, interface');
  console.log('Data sources: DFT, DPA-1, DPA-3');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Enhanced Data Conversion Tool for Alloy Materials Database V2

Usage:
  node convert-data-v2.js <input-file> [output-file]
  node convert-data-v2.js --template [output-file]

Options:
  --template    Generate a CSV template file
  --help, -h    Show this help message

Examples:
  node convert-data-v2.js data.csv materials.json
  node convert-data-v2.js --template template.csv

Supported input formats: CSV, JSON
Supported material types: element, solid-solution, intermetallic, amorphous, interface
Supported data sources: DFT, DPA-1, DPA-3
`);
    process.exit(0);
  }
  
  if (args[0] === '--template') {
    const outputFile = args[1] || 'template-v2.csv';
    generateTemplate(outputFile);
  } else {
    const inputFile = args[0];
    const outputFile = args[1] || 'materials.json';
    
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file not found: ${inputFile}`);
      process.exit(1);
    }
    
    try {
      convertData(inputFile, outputFile);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}

module.exports = { convertData, parseComposition, validateMaterial };

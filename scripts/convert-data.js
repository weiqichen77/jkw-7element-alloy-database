#!/usr/bin/env node

/**
 * Data Conversion Script for 7-Element Alloy Database
 * 
 * Converts various input formats (CSV, JSON, Excel-like TSV) to the standardized
 * materials.json format required by the web interface.
 * 
 * Usage:
 *   node convert-data.js <input-file> [output-file]
 *   node convert-data.js data.csv real-data/materials.json
 */

const fs = require('fs');
const path = require('path');

// Valid element symbols for the 7-element system
const VALID_ELEMENTS = ['Al', 'Ni', 'Cu', 'Zr', 'Nb', 'Ta', 'W'];

// Valid material types
const VALID_TYPES = ['crystalline', 'amorphous', 'interface'];

/**
 * Schema for validating material data
 */
const SCHEMA = {
  required: ['name', 'type', 'elements'],
  optional: [
    'density',
    'structure.latticeConstants',
    'structure.rdf',
    'thermodynamics.specificHeat',
    'thermodynamics.mixingEnthalpy',
    'thermodynamics.diffusionCoefficient',
    'thermodynamics.thermalExpansion',
    'mechanics.elasticConstants',
    'mechanics.stressStrain',
    'mechanics.youngsModulus',
    'mechanics.poissonsRatio',
    'defects.vacancyFormationEnergy',
    'defects.interstitialFormationEnergy',
    'defects.stackingFaultEnergy'
  ]
};

/**
 * Parse CSV file
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const materials = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const material = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (value && value !== '' && value.toLowerCase() !== 'null' && value !== '-') {
        setNestedProperty(material, header, parseValue(value));
      }
    });

    materials.push(material);
  }

  return materials;
}

/**
 * Parse JSON file
 */
function parseJSON(content) {
  const data = JSON.parse(content);
  return Array.isArray(data) ? data : [data];
}

/**
 * Parse TSV (Tab-separated values) file
 */
function parseTSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('TSV file must have at least header and one data row');
  }

  const headers = lines[0].split('\t').map(h => h.trim());
  const materials = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    const material = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (value && value !== '' && value.toLowerCase() !== 'null' && value !== '-') {
        setNestedProperty(material, header, parseValue(value));
      }
    });

    materials.push(material);
  }

  return materials;
}

/**
 * Set nested property using dot notation
 * Example: setNestedProperty(obj, 'structure.rdf', value)
 */
function setNestedProperty(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Parse value to appropriate type
 */
function parseValue(value) {
  // Try to parse as number
  if (!isNaN(value) && value !== '') {
    return parseFloat(value);
  }

  // Try to parse as array (e.g., "[Al, Ni, Cu]" or "Al,Ni,Cu")
  if (value.includes(',')) {
    return value.replace(/[\[\]]/g, '').split(',').map(v => v.trim());
  }

  // Try to parse as JSON object/array
  if ((value.startsWith('{') && value.endsWith('}')) || 
      (value.startsWith('[') && value.endsWith(']'))) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // If parsing fails, return as string
    }
  }

  // Return as string
  return value;
}

/**
 * Validate and normalize material data
 */
function validateMaterial(material, index) {
  const errors = [];

  // Check required fields
  if (!material.name) {
    errors.push(`Material ${index + 1}: Missing required field 'name'`);
  }

  if (!material.type) {
    errors.push(`Material ${index + 1}: Missing required field 'type'`);
  } else if (!VALID_TYPES.includes(material.type)) {
    errors.push(`Material ${index + 1}: Invalid type '${material.type}'. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  if (!material.elements) {
    errors.push(`Material ${index + 1}: Missing required field 'elements'`);
  } else if (!Array.isArray(material.elements)) {
    errors.push(`Material ${index + 1}: Field 'elements' must be an array`);
  } else {
    // Validate elements
    const invalidElements = material.elements.filter(el => !VALID_ELEMENTS.includes(el));
    if (invalidElements.length > 0) {
      errors.push(`Material ${index + 1}: Invalid elements: ${invalidElements.join(', ')}. Valid elements: ${VALID_ELEMENTS.join(', ')}`);
    }
  }

  return errors;
}

/**
 * Normalize material data structure
 */
function normalizeMaterial(material, index) {
  const normalized = {
    id: material.id || `material-${index + 1}`,
    name: material.name,
    type: material.type,
    elements: material.elements,
    density: material.density || null
  };

  // Structure properties
  normalized.structure = {
    latticeConstants: material.structure?.latticeConstants || null,
    rdf: material.structure?.rdf || null
  };

  // Thermodynamics properties
  normalized.thermodynamics = {
    specificHeat: material.thermodynamics?.specificHeat || null,
    mixingEnthalpy: material.thermodynamics?.mixingEnthalpy || null,
    diffusionCoefficient: material.thermodynamics?.diffusionCoefficient || null,
    thermalExpansion: material.thermodynamics?.thermalExpansion || null
  };

  // Mechanics properties
  normalized.mechanics = {
    elasticConstants: material.mechanics?.elasticConstants || null,
    stressStrain: material.mechanics?.stressStrain || null,
    youngsModulus: material.mechanics?.youngsModulus || null,
    poissonsRatio: material.mechanics?.poissonsRatio || null
  };

  // Defects properties
  normalized.defects = {
    vacancyFormationEnergy: material.defects?.vacancyFormationEnergy || null,
    interstitialFormationEnergy: material.defects?.interstitialFormationEnergy || null,
    stackingFaultEnergy: material.defects?.stackingFaultEnergy || null
  };

  return normalized;
}

/**
 * Main conversion function
 */
function convertData(inputFile, outputFile) {
  console.log(`Converting data from: ${inputFile}`);

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  // Read input file
  const content = fs.readFileSync(inputFile, 'utf8');
  const ext = path.extname(inputFile).toLowerCase();

  // Parse based on file extension
  let materials;
  try {
    if (ext === '.csv') {
      materials = parseCSV(content);
    } else if (ext === '.json') {
      materials = parseJSON(content);
    } else if (ext === '.tsv' || ext === '.txt') {
      materials = parseTSV(content);
    } else {
      throw new Error(`Unsupported file format: ${ext}. Supported formats: .csv, .json, .tsv, .txt`);
    }
  } catch (error) {
    throw new Error(`Failed to parse input file: ${error.message}`);
  }

  console.log(`Parsed ${materials.length} materials from input file`);

  // Validate all materials
  const allErrors = [];
  materials.forEach((material, index) => {
    const errors = validateMaterial(material, index);
    allErrors.push(...errors);
  });

  if (allErrors.length > 0) {
    console.error('\nValidation errors:');
    allErrors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Validation failed. Please fix the errors above.');
  }

  // Normalize all materials
  const normalizedMaterials = materials.map((material, index) => 
    normalizeMaterial(material, index)
  );

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output file
  fs.writeFileSync(outputFile, JSON.stringify(normalizedMaterials, null, 2), 'utf8');
  console.log(`\nSuccessfully converted ${normalizedMaterials.length} materials`);
  console.log(`Output saved to: ${outputFile}`);
  console.log('\nNext steps:');
  console.log('  1. Review the generated file to ensure data accuracy');
  console.log('  2. Commit and push the changes to trigger deployment');
  console.log('  3. Wait for GitHub Actions to deploy the updated website');
}

/**
 * Generate example CSV template
 */
function generateTemplate(outputFile) {
  const template = `name,type,elements,density,structure.latticeConstants,structure.rdf,thermodynamics.specificHeat,thermodynamics.mixingEnthalpy,thermodynamics.diffusionCoefficient,thermodynamics.thermalExpansion,mechanics.elasticConstants,mechanics.stressStrain,mechanics.youngsModulus,mechanics.poissonsRatio,defects.vacancyFormationEnergy,defects.interstitialFormationEnergy,defects.stackingFaultEnergy
AlNiCu-001,crystalline,"[Al,Ni,Cu]",8.5,"{""a"":3.6,""b"":3.6,""c"":3.6}",url-to-rdf-data,450,-25,1.2e-15,12.5,"{""C11"":200,""C12"":150}",url-to-stress-strain,180,0.33,1.2,2.1,120
AlZr-Amorphous,amorphous,"[Al,Zr]",6.2,-,url-to-rdf-data,380,-18,5.6e-16,15.2,-,-,95,0.36,-,-,-
NiCuInterface,interface,"[Ni,Cu]",8.9,-,-,420,-12,2.3e-15,13.8,-,-,160,0.31,-,-,85`;

  fs.writeFileSync(outputFile, template, 'utf8');
  console.log(`CSV template generated: ${outputFile}`);
  console.log('\nTemplate format:');
  console.log('  - Use comma-separated values');
  console.log('  - Arrays: [element1,element2] or "element1,element2"');
  console.log('  - Objects: Use JSON format in quotes');
  console.log('  - Empty/null values: Leave blank or use "-"');
}

// Command-line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
7-Element Alloy Database - Data Conversion Tool

Usage:
  node convert-data.js <input-file> [output-file]
  node convert-data.js --template [output-file]

Options:
  --template    Generate a CSV template file
  --help, -h    Show this help message

Examples:
  node convert-data.js my-data.csv real-data/materials.json
  node convert-data.js my-data.json backend/data/materials.json
  node convert-data.js --template template.csv

Supported Input Formats:
  - CSV (.csv)  - Comma-separated values
  - JSON (.json) - JSON array or object
  - TSV (.tsv, .txt) - Tab-separated values

Required Fields:
  - name: Material name (string)
  - type: Material type (crystalline/amorphous/interface)
  - elements: Array of element symbols

Optional Fields:
  - density: Material density (g/cm³)
  - structure.latticeConstants: Lattice parameters object
  - structure.rdf: Radial distribution function data
  - thermodynamics.*: Thermodynamic properties
  - mechanics.*: Mechanical properties
  - defects.*: Defect properties

Valid Elements: ${VALID_ELEMENTS.join(', ')}
`);
    process.exit(0);
  }

  if (args[0] === '--template') {
    const templateFile = args[1] || 'data-template.csv';
    try {
      generateTemplate(templateFile);
      process.exit(0);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'backend/data/materials.json';

  try {
    convertData(inputFile, outputFile);
    process.exit(0);
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { convertData, parseCSV, parseJSON, parseTSV, validateMaterial, normalizeMaterial };

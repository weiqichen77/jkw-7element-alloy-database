#!/usr/bin/env node

/**
 * JSON Format Fixer for Alloy Materials Database
 * Automatically detects and fixes common format issues in JSON input files
 * 
 * Usage: node scripts/fix-json-format.js input.json [output.json] [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FIXES = {
  FIELD_RENAME: true,           // ori_source → source
  PATH_NORMALIZE: true,          // solid_solution → solid-solution, remove leading slashes
  DATA_SOURCE_NORMALIZE: true,   // DPA1_251208 → DPA-1, DPA3 → DPA-3
  REMOVE_EMPTY_FIELDS: true,     // Remove fields with empty strings or null
  ADD_MISSING_FIELDS: false,     // Add missing required fields (set to false by default)
};

const VALID_TYPES = ['element', 'solid-solution', 'intermetallic', 'amorphous', 'interface'];
const DATA_SOURCE_MAP = {
  'DPA1': 'DPA-1',
  'DPA1_251208': 'DPA-1',
  'DPA2': 'DPA-2',
  'DPA3': 'DPA-3',
  'dft': 'DFT',
  'md': 'MD',
};

let stats = {
  totalMaterials: 0,
  fixedMaterials: 0,
  issues: {
    fieldRename: 0,
    pathNormalize: 0,
    dataSourceNormalize: 0,
    emptyFieldsRemoved: 0,
    typeFixed: 0,
  },
  errors: []
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    inputFile: null,
    outputFile: null,
    dryRun: false,
    verbose: false,
  };

  args.forEach(arg => {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (!options.inputFile) {
      options.inputFile = arg;
    } else if (!options.outputFile) {
      options.outputFile = arg;
    }
  });

  // Default output file
  if (!options.outputFile && options.inputFile) {
    const parsed = path.parse(options.inputFile);
    options.outputFile = path.join(parsed.dir, `${parsed.name}_fixed${parsed.ext}`);
  }

  return options;
}

// Normalize data source name
function normalizeDataSource(source) {
  if (!source) return source;
  
  const normalized = DATA_SOURCE_MAP[source];
  if (normalized) {
    stats.issues.dataSourceNormalize++;
    return normalized;
  }
  
  return source;
}

// Normalize file path
function normalizePath(filePath) {
  if (!filePath) return filePath;
  
  let normalized = filePath;
  let changed = false;
  
  // Remove leading slash
  if (normalized.startsWith('/')) {
    normalized = normalized.substring(1);
    changed = true;
  }
  
  // Replace underscore with hyphen in type directories
  normalized = normalized.replace(/\/(solid_solution|amorphous_metal)\//g, (match) => {
    changed = true;
    return match.replace(/_/g, '-') + '/';
  });
  
  // Fix specific path issues
  if (normalized.includes('solid_solution')) {
    normalized = normalized.replace(/solid_solution/g, 'solid-solution');
    changed = true;
  }
  
  if (changed) {
    stats.issues.pathNormalize++;
  }
  
  return normalized;
}

// Remove empty or null fields from object
function removeEmptyFields(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeEmptyFields(item));
  }
  
  const cleaned = {};
  let removedCount = 0;
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === '' || value === undefined) {
      removedCount++;
      continue;
    }
    
    if (typeof value === 'object') {
      cleaned[key] = removeEmptyFields(value);
    } else {
      cleaned[key] = value;
    }
  }
  
  if (removedCount > 0) {
    stats.issues.emptyFieldsRemoved += removedCount;
  }
  
  return cleaned;
}

// Fix material structure
function fixMaterial(material, index) {
  let fixed = false;
  const issues = [];
  
  // Fix: ori_source → source
  if (FIXES.FIELD_RENAME && material.ori_source && !material.source) {
    material.source = material.ori_source;
    delete material.ori_source;
    stats.issues.fieldRename++;
    fixed = true;
    issues.push('Renamed ori_source to source');
  }
  
  // Fix: type value
  if (material.type) {
    // Fix common type issues
    if (material.type === 'solid_solution') {
      material.type = 'solid-solution';
      stats.issues.typeFixed++;
      fixed = true;
      issues.push('Fixed type: solid_solution → solid-solution');
    } else if (material.type === 'solid-element') {
      material.type = 'element';
      stats.issues.typeFixed++;
      fixed = true;
      issues.push('Fixed type: solid-element → element');
    }
    
    // Warn if type is not valid
    if (!VALID_TYPES.includes(material.type)) {
      stats.errors.push({
        index,
        material: material.name || material.source,
        error: `Invalid type: ${material.type}. Valid types: ${VALID_TYPES.join(', ')}`
      });
    }
  }
  
  // Fix: data array
  if (material.data && Array.isArray(material.data)) {
    material.data.forEach((dataEntry, dataIndex) => {
      // Normalize data source
      if (FIXES.DATA_SOURCE_NORMALIZE && dataEntry.source) {
        const originalSource = dataEntry.source;
        dataEntry.source = normalizeDataSource(dataEntry.source);
        if (dataEntry.source !== originalSource) {
          fixed = true;
          issues.push(`Normalized data source: ${originalSource} → ${dataEntry.source}`);
        }
      }
      
      // Normalize poscar path
      if (FIXES.PATH_NORMALIZE && dataEntry.poscar) {
        const originalPath = dataEntry.poscar;
        dataEntry.poscar = normalizePath(dataEntry.poscar);
        if (dataEntry.poscar !== originalPath) {
          fixed = true;
          issues.push(`Normalized poscar path in data[${dataIndex}]`);
        }
      }
      
      // Remove empty fields from properties
      if (FIXES.REMOVE_EMPTY_FIELDS && dataEntry.properties) {
        dataEntry.properties = removeEmptyFields(dataEntry.properties);
      }
    });
  }
  
  // Remove empty fields from top level
  if (FIXES.REMOVE_EMPTY_FIELDS) {
    // Don't remove data array or other required fields
    const fieldsToCheck = ['poscar_source', 'rdf', 'stressStrain'];
    fieldsToCheck.forEach(field => {
      if (material[field] === '' || material[field] === null) {
        delete material[field];
      }
    });
  }
  
  if (fixed) {
    stats.fixedMaterials++;
  }
  
  return { material, fixed, issues };
}

// Validate material structure
function validateMaterial(material, index) {
  const errors = [];
  
  // Check required fields
  if (!material.name) errors.push('Missing required field: name');
  if (!material.source) errors.push('Missing required field: source');
  if (!material.type) errors.push('Missing required field: type');
  if (!material.composition) errors.push('Missing required field: composition');
  if (!material.elements || !Array.isArray(material.elements)) {
    errors.push('Missing or invalid field: elements (must be array)');
  }
  if (!material.atomCount || typeof material.atomCount !== 'object') {
    errors.push('Missing or invalid field: atomCount (must be object)');
  }
  
  // Check data array
  if (!material.data || !Array.isArray(material.data)) {
    errors.push('Missing or invalid field: data (must be array)');
  } else if (material.data.length === 0) {
    errors.push('Data array is empty');
  } else {
    // Validate data entries
    material.data.forEach((entry, dataIndex) => {
      if (!entry.source) {
        errors.push(`Data[${dataIndex}]: missing source field`);
      }
      
      // For non-init entries, require temperature and properties
      if (entry.source !== 'init') {
        if (entry.temperature === undefined) {
          errors.push(`Data[${dataIndex}]: missing temperature field`);
        }
        if (!entry.properties || Object.keys(entry.properties).length === 0) {
          errors.push(`Data[${dataIndex}]: missing or empty properties`);
        }
      }
      
      // Recommend poscar field
      if (!entry.poscar) {
        errors.push(`Data[${dataIndex}]: missing poscar field (recommended)`);
      }
    });
  }
  
  if (errors.length > 0) {
    stats.errors.push({
      index,
      material: material.name || material.source,
      errors
    });
  }
  
  return errors.length === 0;
}

// Main processing function
function processJSON(inputFile, options) {
  console.log(`\n🔍 Reading file: ${inputFile}\n`);
  
  // Read input file
  let data;
  try {
    const content = fs.readFileSync(inputFile, 'utf8');
    data = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading or parsing JSON file: ${error.message}`);
    process.exit(1);
  }
  
  if (!Array.isArray(data)) {
    console.error('❌ Input JSON must be an array of materials');
    process.exit(1);
  }
  
  stats.totalMaterials = data.length;
  console.log(`📊 Total materials: ${data.length}\n`);
  
  // Process each material
  console.log('🔧 Processing materials...\n');
  const fixedData = data.map((material, index) => {
    const result = fixMaterial(material, index);
    
    if (options.verbose && result.fixed) {
      console.log(`  ✓ Material ${index + 1}: ${material.name || material.source}`);
      result.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
    
    return result.material;
  });
  
  // Validate fixed data
  console.log('\n✅ Validating fixed data...\n');
  fixedData.forEach((material, index) => {
    validateMaterial(material, index);
  });
  
  // Print statistics
  console.log('\n📈 Fix Statistics:');
  console.log('─'.repeat(50));
  console.log(`Total materials:           ${stats.totalMaterials}`);
  console.log(`Materials with fixes:      ${stats.fixedMaterials}`);
  console.log(`\nIssues fixed:`);
  console.log(`  - Field renames:         ${stats.issues.fieldRename}`);
  console.log(`  - Path normalizations:   ${stats.issues.pathNormalize}`);
  console.log(`  - Data source fixes:     ${stats.issues.dataSourceNormalize}`);
  console.log(`  - Type fixes:            ${stats.issues.typeFixed}`);
  console.log(`  - Empty fields removed:  ${stats.issues.emptyFieldsRemoved}`);
  
  // Print errors/warnings
  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Validation Issues: ${stats.errors.length} materials`);
    console.log('─'.repeat(50));
    
    stats.errors.slice(0, 10).forEach(err => {
      console.log(`\n📌 Material ${err.index + 1}: ${err.material}`);
      if (err.errors) {
        err.errors.forEach(e => console.log(`   - ${e}`));
      } else if (err.error) {
        console.log(`   - ${err.error}`);
      }
    });
    
    if (stats.errors.length > 10) {
      console.log(`\n   ... and ${stats.errors.length - 10} more issues`);
    }
  }
  
  // Save output
  if (!options.dryRun) {
    console.log(`\n💾 Saving to: ${options.outputFile}`);
    try {
      fs.writeFileSync(options.outputFile, JSON.stringify(fixedData, null, 2), 'utf8');
      console.log('✅ File saved successfully!');
    } catch (error) {
      console.error(`❌ Error saving file: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log('\n🔍 Dry run mode - no file written');
  }
  
  // Summary
  console.log('\n' + '═'.repeat(50));
  if (stats.fixedMaterials > 0) {
    console.log(`✅ Fixed ${stats.fixedMaterials} materials with format issues`);
  } else {
    console.log('✅ No format issues found - data is clean!');
  }
  
  if (stats.errors.length > 0) {
    console.log(`⚠️  ${stats.errors.length} materials have validation warnings`);
    console.log('   Review the issues above and fix manually if needed');
  }
  console.log('═'.repeat(50) + '\n');
  
  return fixedData;
}

// Main execution
function main() {
  const options = parseArgs();
  
  if (!options.inputFile) {
    console.log(`
Usage: node scripts/fix-json-format.js <input.json> [output.json] [options]

Options:
  --dry-run     Show what would be fixed without writing files
  --verbose     Show detailed information about each fix
  -v            Same as --verbose

Examples:
  node scripts/fix-json-format.js materials.json
  node scripts/fix-json-format.js materials.json materials_fixed.json
  node scripts/fix-json-format.js materials.json --dry-run --verbose

The script will automatically fix:
  ✓ ori_source → source
  ✓ Path normalization (remove leading /, solid_solution → solid-solution)
  ✓ Data source normalization (DPA1_251208 → DPA-1, DPA3 → DPA-3)
  ✓ Type fixes (solid_solution → solid-solution, solid-element → element)
  ✓ Empty fields removal
    `);
    process.exit(0);
  }
  
  if (!fs.existsSync(options.inputFile)) {
    console.error(`❌ Error: Input file not found: ${options.inputFile}`);
    process.exit(1);
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('   JSON Format Fixer - Alloy Materials Database');
  console.log('═'.repeat(50));
  
  processJSON(options.inputFile, options);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processJSON, fixMaterial, validateMaterial };

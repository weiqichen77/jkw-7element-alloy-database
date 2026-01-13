#!/usr/bin/env node

/**
 * Migration script: Add material-level source field to existing materials.json
 * 
 * This script adds a "source" field to each material with a default value.
 * The source field indicates the origin/author of the material data.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = 'Research Database';

/**
 * Add source field to materials
 */
function addSourceField(inputFile, outputFile) {
  // Read input
  const data = fs.readFileSync(inputFile, 'utf8');
  const materials = JSON.parse(data);
  
  console.log(`Processing ${materials.length} materials...`);
  
  // Add source field to each material
  let updated = 0;
  materials.forEach(material => {
    if (!material.source) {
      material.source = DEFAULT_SOURCE;
      updated++;
    }
  });
  
  console.log(`Added source field to ${updated} materials`);
  
  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(materials, null, 2));
  console.log(`Updated materials written to ${outputFile}`);
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default: update data/materials.json
    const inputFile = path.join(__dirname, '../data/materials.json');
    const outputFile = inputFile;
    
    // Create backup
    const backupFile = inputFile + '.backup';
    fs.copyFileSync(inputFile, backupFile);
    console.log(`Backup created: ${backupFile}`);
    
    addSourceField(inputFile, outputFile);
    console.log('Migration complete!');
  } else if (args.length === 2) {
    // Custom input/output
    addSourceField(args[0], args[1]);
  } else {
    console.error('Usage: node add-source-field.js [inputFile outputFile]');
    console.error('  No args: Updates data/materials.json (with backup)');
    console.error('  Two args: Custom input and output files');
    process.exit(1);
  }
}

module.exports = { addSourceField };

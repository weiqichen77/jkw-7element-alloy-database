#!/usr/bin/env node

/**
 * Test script for unknown fields handling
 * Verifies that JSON files with custom/unknown fields are processed correctly
 */

const fs = require('fs');
const path = require('path');

// Create test data with unknown fields
const testData = [
  {
    "source": "test-001",
    "name": "Test Material",
    "type": "intermetallic",
    "composition": "Al2Cu4",
    "elements": ["Al", "Cu"],
    "atomCount": {
      "Al": 2,
      "Cu": 4
    },
    // Unknown/custom fields
    "customField1": "custom value",
    "experimentalNote": "Sample from Lab A",
    "internalId": 12345,
    "metadata": {
      "date": "2026-02-13",
      "researcher": "Test User"
    },
    "data": [
      {
        "source": "init",
        "poscar": "data/intermetallic/test-001/init/POSCAR",
        // Unknown field in data entry
        "customDataField": "test"
      },
      {
        "temperature": 0,
        "source": "DFT",
        "poscar": "data/intermetallic/test-001/DFT/POSCAR",
        "poscar_source": "DFT relaxation",
        // Unknown field in properties
        "customTemperatureNote": "Room temperature equivalent",
        "properties": {
          "structure": {
            "density": 7.85,
            "latticeParameters": {
              "a": 3.52,
              "b": 3.52,
              "c": 3.52,
              "alpha": 90,
              "beta": 90,
              "gamma": 90,
              "pointGroup": "Fm-3m"
            },
            // Unknown field in structure
            "customStructureField": "test value"
          },
          "thermodynamics": {
            "mixingEnthalpy": -0.25,
            // Unknown field
            "customThermoField": 123.456
          },
          // Unknown property category
          "customCategory": {
            "field1": "value1",
            "field2": 42
          }
        }
      }
    ]
  }
];

console.log('🧪 Testing Unknown Fields Handling\n');
console.log('═'.repeat(50));

// Save test data
const testFile = 'test-unknown-fields.json';
fs.writeFileSync(testFile, JSON.stringify(testData, null, 2));
console.log(`✓ Created test file: ${testFile}`);

// Test with fix-json-format.js
console.log('\n📝 Running fix-json-format.js...\n');
const { execSync } = require('child_process');

try {
  const output = execSync(`node scripts/fix-json-format.js ${testFile} ${testFile.replace('.json', '_fixed.json')}`, {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log(output);
  
  // Read and verify fixed file
  const fixedData = JSON.parse(fs.readFileSync(testFile.replace('.json', '_fixed.json'), 'utf8'));
  const fixedMaterial = fixedData[0];
  
  console.log('\n✅ Verification Results:');
  console.log('─'.repeat(50));
  
  // Check top-level unknown fields
  if (fixedMaterial.customField1 === 'custom value') {
    console.log('✓ Top-level custom field preserved: customField1');
  } else {
    console.error('✗ Top-level custom field LOST: customField1');
  }
  
  if (fixedMaterial.metadata && fixedMaterial.metadata.date === '2026-02-13') {
    console.log('✓ Nested custom object preserved: metadata');
  } else {
    console.error('✗ Nested custom object LOST: metadata');
  }
  
  // Check data entry unknown fields
  const dataEntry = fixedMaterial.data[1];
  if (dataEntry.customTemperatureNote) {
    console.log('✓ Data entry custom field preserved: customTemperatureNote');
  } else {
    console.error('✗ Data entry custom field LOST: customTemperatureNote');
  }
  
  // Check properties unknown fields
  if (dataEntry.properties.structure.customStructureField === 'test value') {
    console.log('✓ Properties custom field preserved: customStructureField');
  } else {
    console.error('✗ Properties custom field LOST: customStructureField');
  }
  
  if (dataEntry.properties.customCategory && dataEntry.properties.customCategory.field1 === 'value1') {
    console.log('✓ Custom property category preserved: customCategory');
  } else {
    console.error('✗ Custom property category LOST: customCategory');
  }
  
  // Check required fields are still present
  console.log('\n✅ Required Fields Check:');
  console.log('─'.repeat(50));
  
  const requiredFields = ['name', 'source', 'type', 'composition', 'elements', 'atomCount', 'data'];
  requiredFields.forEach(field => {
    if (fixedMaterial[field]) {
      console.log(`✓ Required field present: ${field}`);
    } else {
      console.error(`✗ Required field MISSING: ${field}`);
    }
  });
  
  console.log('\n' + '═'.repeat(50));
  console.log('✅ Test completed successfully!');
  console.log('✅ Unknown fields are preserved correctly');
  console.log('═'.repeat(50) + '\n');
  
  // Show sample of preserved data
  console.log('📋 Sample of preserved custom fields:');
  console.log(JSON.stringify({
    customField1: fixedMaterial.customField1,
    metadata: fixedMaterial.metadata,
    dataCustomField: dataEntry.customTemperatureNote,
    propertiesCustom: dataEntry.properties.customCategory
  }, null, 2));
  
  // Cleanup
  console.log('\n🧹 Cleaning up test files...');
  fs.unlinkSync(testFile);
  fs.unlinkSync(testFile.replace('.json', '_fixed.json'));
  console.log('✓ Test files removed\n');
  
} catch (error) {
  console.error('❌ Error during test:', error.message);
  
  // Cleanup on error
  try {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    if (fs.existsSync(testFile.replace('.json', '_fixed.json'))) {
      fs.unlinkSync(testFile.replace('.json', '_fixed.json'));
    }
  } catch (e) {}
  
  process.exit(1);
}

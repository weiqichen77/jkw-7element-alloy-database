#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'backend', 'data', 'materials_intermetallic.json');

console.log('Reading materials_intermetallic.json...');
try {
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  
  // Check the current structure
  if (data.length > 0) {
    const first = data[0];
    console.log('First entry keys:', Object.keys(first));
    console.log('Has id:', !!first.id);
    console.log('Has source:', !!first.source);
    
    // If using 'source' as ID, rename it to 'id'
    if (first.source && !first.id) {
      console.log('\nFixing: Converting "source" field to "id"...');
      data.forEach((material, index) => {
        if (material.source && !material.id) {
          material.id = material.source;
        }
      });
      
      fs.writeFileSync(INPUT_FILE, JSON.stringify(data, null, 2));
      console.log('✓ Successfully converted source to id');
      console.log(`✓ Updated ${data.length} entries`);
    } else if (first.id && first.source) {
      console.log('\nFile structure is correct (has both id and source)');
    } else {
      console.log('\nFile structure is already using id field');
    }
  }
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}

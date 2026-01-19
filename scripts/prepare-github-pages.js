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

try {
  let allMaterials = [];
  
  // Load materials.json
  if (fs.existsSync(materialsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
      allMaterials = allMaterials.concat(data);
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

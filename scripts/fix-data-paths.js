const fs = require('fs');
const path = require('path');

console.log('🔧 修复数据路径...');

const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');

if (!fs.existsSync(dataPath)) {
  console.log('❌ 错误：找不到 materials_intermetallic.json');
  process.exit(1);
}

let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 递归修复路径
function fixPaths(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(fixPaths);
  }
  
  const fixed = {};
  for (const [key, value] of Object.entries(obj)) {
    if ((key === 'poscar' || key === 'rdf' || key === 'stressStrain') && 
        typeof value === 'string' && value.length > 0) {
      // 移除开头的 /
      fixed[key] = value.startsWith('/') ? value.slice(1) : value;
    } else {
      fixed[key] = fixPaths(value);
    }
  }
  return fixed;
}

const fixedData = fixPaths(data);

fs.writeFileSync(dataPath, JSON.stringify(fixedData, null, 2));

console.log(`✓ 已修复 ${fixedData.length} 个材料的路径`);

// 统计路径修复数
let pathCount = 0;
data.forEach((material, idx) => {
  if (material.poscar && material.poscar.startsWith('/')) pathCount++;
  if (material.data) {
    material.data.forEach(dp => {
      if (dp.properties && dp.properties.structure) {
        if (dp.properties.structure.rdf && dp.properties.structure.rdf.startsWith('/')) pathCount++;
      }
      if (dp.properties && dp.properties.mechanics) {
        if (dp.properties.mechanics.stressStrain && dp.properties.mechanics.stressStrain.startsWith('/')) pathCount++;
      }
    });
  }
});

console.log(`✓ 修复了 ${pathCount} 个路径引用`);

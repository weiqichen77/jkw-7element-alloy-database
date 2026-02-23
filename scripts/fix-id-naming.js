#!/usr/bin/env node

/**
 * 脚本：修复材料ID和source格式到正确的命名规范
 * 
 * ID格式: Alloy-XX-#####
 * - E = element
 * - SS = solid-solution
 * - IM = intermetallic
 * 
 * Source格式:
 * - Intermetallic: 保持原有 mp-xxx
 * - Element: 使用材料名称 (如 Al-bcc)
 * - Solid Solution: 使用 ori_source (如 bcc_Al0_Cu0_Nb0_Ni0_Ta0_W0_Zr24)
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复材料ID和source格式...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

// 辅助函数：格式化ID编号
function formatId(typeCode, number) {
  return `Alloy-${typeCode}-${String(number).padStart(5, '0')}`;
}

// 处理Materials (包含element和solid-solution)
console.log('\n📝 更新 Materials 的ID和source...');

let elementCount = 0;
let solidSolutionCount = 0;

materials.forEach(material => {
  const oldId = material.id;
  const oldSource = material.source;
  
  if (material.type === 'solid-element') {
    // Element类型
    elementCount++;
    material.id = formatId('E', elementCount);
    // source使用材料名称
    material.source = material.name;
    console.log(`  ✓ Element: ${oldId} → ${material.id}, source: ${oldSource} → ${material.source}`);
    
  } else if (material.type === 'solid-solution') {
    // Solid Solution类型
    solidSolutionCount++;
    material.id = formatId('SS', solidSolutionCount);
    // source使用ori_source
    if (material.ori_source) {
      material.source = material.ori_source;
      console.log(`  ✓ Solid Solution: ${oldId} → ${material.id}, source: ${oldSource} → ${material.source}`);
    } else {
      console.log(`  ⚠️  Solid Solution ${material.name} 缺少 ori_source`);
    }
  }
});

// 处理Intermetallic
console.log('\n📝 更新 Intermetallic 的ID...');

intermetallic.forEach((material, index) => {
  const oldId = material.id;
  material.id = formatId('IM', index + 1);
  // source保持不变 (mp-xxx)
  if (index < 5) {
    console.log(`  ✓ Intermetallic: ${oldId} → ${material.id}, source: ${material.source}`);
  }
});

if (intermetallic.length > 5) {
  console.log(`  ... 还有 ${intermetallic.length - 5} 个已更新`);
}

// 保存更新
console.log('\n💾 保存更新后的数据...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));
fs.writeFileSync(intermetallicPath, JSON.stringify(intermetallic, null, 2));

console.log('\n✅ ID和source格式修复完成！');
console.log('\n📊 统计信息：');
console.log(`  Materials:`);
console.log(`    - Element (Alloy-E-XXXXX): ${elementCount}条`);
console.log(`    - Solid Solution (Alloy-SS-XXXXX): ${solidSolutionCount}条`);
console.log(`  Intermetallic:`);
console.log(`    - Intermetallic (Alloy-IM-XXXXX): ${intermetallic.length}条`);
console.log(`\n  总计: ${elementCount + solidSolutionCount + intermetallic.length}条`);

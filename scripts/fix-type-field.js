#!/usr/bin/env node

/**
 * 脚本：修复type字段 - 从 solid-element 改为 element
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复type字段...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));

let fixedCount = 0;

// 修复type字段
materials.forEach(material => {
  if (material.type === 'solid-element') {
    material.type = 'element';
    fixedCount++;
  }
});

// 保存更新
console.log('\n💾 保存更新后的数据...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));

console.log('\n✅ Type字段修复完成！');
console.log(`   修复数量: ${fixedCount} 条 (solid-element → element)`);

// 验证
const types = materials.reduce((acc, m) => {
  acc[m.type] = (acc[m.type] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 当前type分布：');
Object.entries(types).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}条`);
});

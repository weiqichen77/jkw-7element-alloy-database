#!/usr/bin/env node

/**
 * 脚本：验证并规范化POSCAR文件路径
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 验证和规范化POSCAR文件路径...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

let materialsUpdated = 0;
let materialsVerified = 0;
let materialsMissing = 0;

// 处理Materials
console.log('\n📝 处理 Materials...');
materials.forEach(material => {
  // 检查data数组中的poscar
  if (material.data && Array.isArray(material.data)) {
    material.data.forEach(dataPoint => {
      if (dataPoint.poscar) {
        // 规范化路径格式
        let poscarPath = dataPoint.poscar;
        if (!poscarPath.startsWith('/')) {
          poscarPath = '/' + poscarPath;
        }
        dataPoint.poscar = poscarPath;
        
        // 验证文件是否存在
        const fullPath = path.join(dataDir, poscarPath.replace('/data/', ''));
        if (fs.existsSync(fullPath)) {
          materialsVerified++;
        } else {
          materialsMissing++;
          if (materialsMissing <= 10) {  // 只显示前10个
            console.log(`  ⚠️  文件不存在: ${material.name} (${dataPoint.source}) -> ${fullPath}`);
          }
        }
      }
    });
  }
  
  // 如果material级别有poscar，也规范化
  if (material.poscar) {
    if (!material.poscar.startsWith('/')) {
      material.poscar = '/' + material.poscar;
      materialsUpdated++;
    }
  } else if (material.ori_source) {
    // 为solid solution添加顶层poscar（指向DFT）
    if (material.type === 'solid-solution') {
      material.poscar = `/data/solid_solution/${material.ori_source}/DFT/POSCAR`;
      materialsUpdated++;
    }
  }
});

// 处理Intermetallic
console.log('\n📝 处理 Intermetallic...');
let intermetallicVerified = 0;
let intermetallicMissing = 0;
let intermetallicUpdated = 0;

intermetallic.forEach(material => {
  // 规范化poscar路径
  if (material.poscar && !material.poscar.startsWith('/')) {
    material.poscar = '/' + material.poscar;
    intermetallicUpdated++;
  }
  
  // 验证文件
  if (material.poscar) {
    const fullPath = path.join(dataDir, material.poscar.replace('/data/', ''));
    if (fs.existsSync(fullPath)) {
      intermetallicVerified++;
    } else {
      intermetallicMissing++;
      if (intermetallicMissing <= 10) {
        console.log(`  ⚠️  文件不存在: ${material.source} -> ${fullPath}`);
      }
    }
  }
});

if (materialsMissing > 10) {
  console.log(`  ... 还有 ${materialsMissing - 10} 个文件缺失`);
}

// 保存更新
console.log('\n💾 保存更新...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));
fs.writeFileSync(intermetallicPath, JSON.stringify(intermetallic, null, 2));

console.log('\n✅ POSCAR路径处理完成！');
console.log('\n📊 统计信息：');
console.log(`  Materials:`);
console.log(`    - 路径已更新: ${materialsUpdated}`);
console.log(`    - 文件已验证: ${materialsVerified}`);
console.log(`    - 文件缺失: ${materialsMissing}`);
console.log(`  Intermetallic:`);
console.log(`    - 路径已更新: ${intermetallicUpdated}`);
console.log(`    - 文件已验证: ${intermetallicVerified}`);
console.log(`    - 文件缺失: ${intermetallicMissing}`);

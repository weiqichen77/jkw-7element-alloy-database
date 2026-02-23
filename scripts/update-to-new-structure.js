#!/usr/bin/env node

/**
 * 脚本：更新所有材料的POSCAR路径到新的目录结构
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 更新POSCAR路径到新的目录结构...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

let stats = {
  materials: { updated: 0, verified: 0, missing: 0 },
  intermetallic: { updated: 0, verified: 0, missing: 0 }
};

// 更新Intermetallic - 修改从根目录到DFT子目录
console.log('\n📝 更新 Intermetallic POSCAR路径...');
intermetallic.forEach(material => {
  if (material.poscar) {
    // 旧格式: /data/intermetallic/mp-xxx/POSCAR
    // 新格式: /data/intermetallic/mp-xxx/DFT/POSCAR
    if (!material.poscar.includes('/DFT/') && !material.poscar.includes('/init/')) {
      material.poscar = material.poscar.replace('/POSCAR', '/DFT/POSCAR');
      stats.intermetallic.updated++;
    }
    
    // 验证文件
    const fullPath = path.join(dataDir, material.poscar.replace('/data/', ''));
    if (fs.existsSync(fullPath)) {
      stats.intermetallic.verified++;
    } else {
      stats.intermetallic.missing++;
      if (stats.intermetallic.missing <= 5) {
        console.log(`  ⚠️  ${material.source}: ${fullPath}`);
      }
    }
  }
});

// Materials已经有正确的路径（在data数组中），只需验证顶层poscar
console.log('\n📝 更新 Materials POSCAR路径...');
materials.forEach(material => {
  // 更新顶层poscar（用于快速访问）
  if (material.ori_source && material.type === 'solid-solution') {
    material.poscar = `/data/solid_solution/${material.ori_source}/DFT/POSCAR`;
    stats.materials.updated++;
  } else if (material.type === 'solid-element') {
    // Element材料，从name推断路径
    const match = material.name.match(/^([A-Z][a-z]?)-(bcc|fcc|hcp)$/i);
    if (match) {
      const [, element, lattice] = match;
      // 检查目录是否存在
      const elemDir = path.join(dataDir, 'element', element, lattice);
      if (fs.existsSync(elemDir)) {
        material.poscar = `/data/element/${element}/${lattice}`;
        stats.materials.updated++;
      }
    }
  }
  
  // 验证data数组中的POSCAR（已有路径）
  if (material.data && Array.isArray(material.data)) {
    material.data.forEach(dataPoint => {
      if (dataPoint.poscar) {
        // 确保路径以/开头
        if (!dataPoint.poscar.startsWith('/')) {
          dataPoint.poscar = '/' + dataPoint.poscar;
        }
        
        // 验证文件（排除DPA3因为可能不存在）
        if (!dataPoint.poscar.includes('/DPA3/')) {
          const fullPath = path.join(dataDir, dataPoint.poscar.replace('/data/', ''));
          if (fs.existsSync(fullPath)) {
            stats.materials.verified++;
          } else {
            stats.materials.missing++;
          }
        }
      }
    });
  }
});

// 保存更新
console.log('\n💾 保存更新后的数据...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));
fs.writeFileSync(intermetallicPath, JSON.stringify(intermetallic, null, 2));

console.log('\n✅ POSCAR路径更新完成！');
console.log('\n📊 统计信息：');
console.log(`\n  Materials (${materials.length} 条):`);
console.log(`    - 顶层路径已更新: ${stats.materials.updated}`);
console.log(`    - data数组中文件已验证: ${stats.materials.verified}`);
console.log(`    - data数组中文件缺失: ${stats.materials.missing}`);
console.log(`\n  Intermetallic (${intermetallic.length} 条):`);
console.log(`    - 路径已更新: ${stats.intermetallic.updated}`);
console.log(`    - 文件已验证: ${stats.intermetallic.verified}`);
console.log(`    - 文件缺失: ${stats.intermetallic.missing}`);

if (stats.intermetallic.missing > 5) {
  console.log(`    (只显示前5个缺失文件)`);
}

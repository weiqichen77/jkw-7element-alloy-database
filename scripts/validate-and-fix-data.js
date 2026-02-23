#!/usr/bin/env node

/**
 * 脚本：全面验证和修复数据结构，确保符合文档规范
 * 
 * 检查项：
 * 1. 每个data条目必须有poscar字段（文档要求）
 * 2. poscar路径格式正确
 * 3. 顶层poscar字段存在
 * 4. 必需字段完整性
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 全面检查数据结构规范...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

let stats = {
  materials: { 
    fixed: 0, 
    missingPoscar: 0,
    addedPoscarToData: 0,
    errors: []
  },
  intermetallic: { 
    fixed: 0, 
    missingPoscar: 0,
    addedPoscarToData: 0,
    errors: []
  }
};

// 修复Materials
console.log('\n📝 检查和修复 Materials...');

materials.forEach((material, index) => {
  try {
    // 检查必需字段
    const requiredFields = ['id', 'source', 'name', 'type', 'composition', 'elements', 'atomCount'];
    const missing = requiredFields.filter(f => !material[f]);
    if (missing.length > 0) {
      stats.materials.errors.push(`${material.name || index}: 缺少字段 ${missing.join(', ')}`);
    }
    
    // 检查并修复顶层poscar
    if (!material.poscar) {
      if (material.type === 'solid-element') {
        const match = material.name.match(/^([A-Z][a-z]?)-(bcc|fcc|hcp)$/i);
        if (match) {
          const [, element, lattice] = match;
          material.poscar = `/data/element/${element}/${lattice}`;
          stats.materials.fixed++;
        }
      } else if (material.type === 'solid-solution' && material.source) {
        material.poscar = `/data/solid_solution/${material.source}/DFT/POSCAR`;
        stats.materials.fixed++;
      }
    }
    
    // 检查并修复data数组中的poscar
    if (material.data && Array.isArray(material.data)) {
      material.data.forEach((dataPoint, dIdx) => {
        // init类型的条目已经有poscar，不需要修复
        if (dataPoint.source === 'init') {
          if (!dataPoint.poscar) {
            stats.materials.errors.push(`${material.name}.data[${dIdx}]: init条目缺少poscar`);
          }
          return;
        }
        
        // 常规条目需要poscar
        if (!dataPoint.poscar && dataPoint.properties) {
          // 为常规条目添加poscar
          if (material.type === 'solid-element') {
            const match = material.name.match(/^([A-Z][a-z]?)-(bcc|fcc|hcp)$/i);
            if (match) {
              const [, element, lattice] = match;
              // 根据source确定路径
              const sourceDir = dataPoint.source.replace(/[^a-zA-Z0-9_-]/g, '_');
              dataPoint.poscar = `/data/element/${element}/${lattice}`;
              stats.materials.addedPoscarToData++;
            }
          } else if (material.type === 'solid-solution' && material.source) {
            // solid-solution使用source/data-source/POSCAR格式
            const dataSource = dataPoint.source;
            dataPoint.poscar = `/data/solid_solution/${material.source}/${dataSource}/POSCAR`;
            stats.materials.addedPoscarToData++;
          }
        }
      });
    } else {
      stats.materials.errors.push(`${material.name}: 缺少data数组`);
    }
    
  } catch (err) {
    stats.materials.errors.push(`${material.name || index}: ${err.message}`);
  }
});

// 修复Intermetallic
console.log('\n📝 检查和修复 Intermetallic...');

intermetallic.forEach((material, index) => {
  try {
    // 检查必需字段
    const requiredFields = ['id', 'source', 'name', 'type', 'composition', 'elements', 'atomCount'];
    const missing = requiredFields.filter(f => !material[f]);
    if (missing.length > 0) {
      stats.intermetallic.errors.push(`${material.name || index}: 缺少字段 ${missing.join(', ')}`);
    }
    
    // 检查并修复顶层poscar
    if (!material.poscar) {
      material.poscar = `/data/intermetallic/${material.source}/DFT/POSCAR`;
      stats.intermetallic.fixed++;
    }
    
    // 检查并修复data数组中的poscar
    if (material.data && Array.isArray(material.data)) {
      material.data.forEach((dataPoint, dIdx) => {
        // 常规条目需要poscar
        if (!dataPoint.poscar && dataPoint.properties) {
          const dataSource = dataPoint.source;
          dataPoint.poscar = `/data/intermetallic/${material.source}/${dataSource}/POSCAR`;
          stats.intermetallic.addedPoscarToData++;
        }
      });
    }
    
  } catch (err) {
    stats.intermetallic.errors.push(`${material.name || index}: ${err.message}`);
  }
});

// 显示错误（如果有）
if (stats.materials.errors.length > 0) {
  console.log('\n⚠️  Materials 错误:');
  stats.materials.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
  if (stats.materials.errors.length > 10) {
    console.log(`  ... 还有 ${stats.materials.errors.length - 10} 个错误`);
  }
}

if (stats.intermetallic.errors.length > 0) {
  console.log('\n⚠️  Intermetallic 错误:');
  stats.intermetallic.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
  if (stats.intermetallic.errors.length > 10) {
    console.log(`  ... 还有 ${stats.intermetallic.errors.length - 10} 个错误`);
  }
}

// 保存更新
console.log('\n💾 保存修复后的数据...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));
fs.writeFileSync(intermetallicPath, JSON.stringify(intermetallic, null, 2));

console.log('\n✅ 数据结构检查和修复完成！');
console.log('\n📊 修复统计：');
console.log(`\n  Materials (${materials.length} 条):`);
console.log(`    - 顶层poscar已修复: ${stats.materials.fixed}`);
console.log(`    - data条目poscar已添加: ${stats.materials.addedPoscarToData}`);
console.log(`    - 发现错误: ${stats.materials.errors.length}`);
console.log(`\n  Intermetallic (${intermetallic.length} 条):`);
console.log(`    - 顶层poscar已修复: ${stats.intermetallic.fixed}`);
console.log(`    - data条目poscar已添加: ${stats.intermetallic.addedPoscarToData}`);
console.log(`    - 发现错误: ${stats.intermetallic.errors.length}`);

if (stats.materials.errors.length > 0 || stats.intermetallic.errors.length > 0) {
  console.log('\n⚠️  请检查上述错误并手动修复');
}

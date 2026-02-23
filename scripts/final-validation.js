#!/usr/bin/env node

/**
 * 脚本：最终全面数据验证
 * 检查所有数据是否符合文档规范
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 最终全面数据验证...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

let issues = {
  critical: [],
  warnings: []
};

// 验证函数
function validateMaterial(material, index, datasetName) {
  const prefix = `[${datasetName}][${index}]${material.name}`;
  
  // 1. 检查必需字段
  const required = ['id', 'source', 'name', 'type', 'composition', 'elements', 'atomCount'];
  required.forEach(field => {
    if (!material[field]) {
      issues.critical.push(`${prefix}: 缺少必需字段 "${field}"`);
    }
  });
  
  // 2. 检查ID格式
  if (material.id && !/^Alloy-(E|SS|IM|AM|IF)-\d{5}$/.test(material.id)) {
    issues.warnings.push(`${prefix}: ID格式不正确 "${material.id}"`);
  }
  
  // 3. 检查type值
  const validTypes = ['element', 'solid-solution', 'intermetallic', 'amorphous', 'interface'];
  if (material.type && !validTypes.includes(material.type)) {
    issues.critical.push(`${prefix}: type值不正确 "${material.type}"`);
  }
  
  // 4. 检查顶层poscar
  if (!material.poscar) {
    issues.warnings.push(`${prefix}: 缺少顶层poscar字段`);
  }
  
  // 5. 检查data数组
  if (!material.data || !Array.isArray(material.data)) {
    issues.critical.push(`${prefix}: data字段不是数组`);
    return;
  }
  
  if (material.data.length === 0) {
    issues.warnings.push(`${prefix}: data数组为空`);
  }
  
  // 6. 检查每个data条目
  material.data.forEach((dataPoint, dIdx) => {
    const dPrefix = `${prefix}.data[${dIdx}]`;
    
    // init条目的特殊规则
    if (dataPoint.source === 'init') {
      if (!dataPoint.poscar) {
        issues.critical.push(`${dPrefix}: init条目缺少poscar`);
      }
      if (dataPoint.temperature !== undefined) {
        issues.warnings.push(`${dPrefix}: init条目不应该有temperature字段`);
      }
      if (dataPoint.properties) {
        issues.warnings.push(`${dPrefix}: init条目不应该有properties字段`);
      }
    } else {
      // 常规条目
      if (dataPoint.temperature === undefined) {
        issues.warnings.push(`${dPrefix}: 缺少temperature字段`);
      }
      if (!dataPoint.source) {
        issues.critical.push(`${dPrefix}: 缺少source字段`);
      }
      if (!dataPoint.poscar) {
        issues.critical.push(`${dPrefix}: 缺少poscar字段`);
      }
      if (!dataPoint.properties) {
        issues.warnings.push(`${dPrefix}: 缺少properties字段`);
      }
    }
  });
}

// 验证Materials
console.log('📝 验证 Materials...');
materials.forEach((material, index) => {
  validateMaterial(material, index, 'Materials');
});

// 验证Intermetallic
console.log('📝 验证 Intermetallic...');
intermetallic.forEach((material, index) => {
  validateMaterial(material, index, 'Intermetallic');
});

// 统计
console.log('\n📊 验证结果统计：');
console.log(`  Materials: ${materials.length}条`);
console.log(`  Intermetallic: ${intermetallic.length}条`);
console.log(`  总计: ${materials.length + intermetallic.length}条`);

console.log('\n📋 Type分布：');
const typeStats = {};
materials.forEach(m => typeStats[m.type] = (typeStats[m.type] || 0) + 1);
intermetallic.forEach(m => typeStats[m.type] = (typeStats[m.type] || 0) + 1);
Object.entries(typeStats).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}条`);
});

// 显示问题
if (issues.critical.length > 0) {
  console.log('\n❌ 严重错误 (需要立即修复):');
  issues.critical.slice(0, 20).forEach(issue => console.log(`  ${issue}`));
  if (issues.critical.length > 20) {
    console.log(`  ... 还有 ${issues.critical.length - 20} 个错误`);
  }
}

if (issues.warnings.length > 0) {
  console.log('\n⚠️  警告 (建议修复):');
  issues.warnings.slice(0, 20).forEach(issue => console.log(`  ${issue}`));
  if (issues.warnings.length > 20) {
    console.log(`  ... 还有 ${issues.warnings.length - 20} 个警告`);
  }
}

if (issues.critical.length === 0 && issues.warnings.length === 0) {
  console.log('\n✅ 所有数据验证通过！未发现问题。');
} else {
  console.log(`\n总结: ${issues.critical.length}个严重错误, ${issues.warnings.length}个警告`);
  if (issues.critical.length > 0) {
    process.exit(1);
  }
}

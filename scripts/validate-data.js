const fs = require('fs');
const path = require('path');

console.log('✅ 验证数据完整性...');

const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');

if (!fs.existsSync(dataPath)) {
  console.log('❌ 错误：找不到 materials_intermetallic.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let issues = [];
let warnings = [];

data.forEach((material, idx) => {
  const prefix = `[Material ${idx + 1}/${data.length}]`;
  
  // 验证基本字段
  if (!material.id) issues.push(`${prefix} 缺少 id`);
  if (!material.name) issues.push(`${prefix} 缺少 name`);
  if (!material.type) issues.push(`${prefix} 缺少 type`);
  if (!material.composition) issues.push(`${prefix} 缺少 composition`);
  if (!material.elements || !Array.isArray(material.elements)) 
    issues.push(`${prefix} elements 不是数组`);
  
  // 验证数据数组
  if (!material.data || !Array.isArray(material.data)) {
    issues.push(`${prefix} data 不是数组`);
    return;
  }
  
  if (material.data.length === 0) {
    warnings.push(`${prefix} 没有数据点（data数组为空）`);
  }
  
  // 验证每个数据点
  material.data.forEach((dp, dIdx) => {
    if (typeof dp.temperature !== 'number') 
      issues.push(`${prefix}.data[${dIdx}] temperature 不是数字`);
    if (!dp.source) 
      warnings.push(`${prefix}.data[${dIdx}] 缺少 source`);
    if (!dp.properties) 
      issues.push(`${prefix}.data[${dIdx}] 缺少 properties`);
  });
  
  // 验证POSCAR文件路径（如果指定了）
  if (material.poscar && material.poscar.length > 0) {
    const poscarPath = path.join(__dirname, '../backend', material.poscar);
    if (!fs.existsSync(poscarPath)) {
      warnings.push(`${prefix} POSCAR文件不存在: ${material.poscar}`);
    }
  } else {
    warnings.push(`${prefix} 没有 POSCAR 文件`);
  }
});

// 统计信息
const totalDataPoints = data.reduce((sum, m) => sum + (m.data ? m.data.length : 0), 0);
const materialsWithData = data.filter(m => m.data && m.data.length > 0).length;

console.log('');
console.log('📊 数据统计:');
console.log(`   总材料数: ${data.length}`);
console.log(`   有数据的材料: ${materialsWithData}`);
console.log(`   总数据点: ${totalDataPoints}`);
console.log('');

if (issues.length > 0) {
  console.log('❌ 严重错误:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  警告信息:');
  warnings.slice(0, 10).forEach(warning => console.log(`   ${warning}`));
  if (warnings.length > 10) {
    console.log(`   ... 还有 ${warnings.length - 10} 个警告`);
  }
  console.log('');
}

if (issues.length === 0) {
  console.log('✅ 数据验证通过！');
  process.exit(0);
} else {
  console.log('❌ 发现 ' + issues.length + ' 个严重错误，请修复后重试');
  process.exit(1);
}

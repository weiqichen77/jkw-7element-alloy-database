const fs = require('fs');
const path = require('path');

console.log('🔄 合并材料数据...');

const existingPath = path.join(__dirname, '../backend/data/materials.json');
const newPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');

// 读取新数据
if (!fs.existsSync(newPath)) {
  console.log('❌ 错误：找不到 materials_intermetallic.json');
  process.exit(1);
}

const newData = JSON.parse(fs.readFileSync(newPath, 'utf8'));

// 读取现有数据（如果存在）
let existing = [];
if (fs.existsSync(existingPath)) {
  existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}

console.log(`📋 现有数据: ${existing.length} 个材料`);
console.log(`📋 新增数据: ${newData.length} 个材料`);

// 找最大的数字ID
let maxId = 0;
if (existing.length > 0) {
  existing.forEach(m => {
    const id = parseInt(m.id);
    if (!isNaN(id) && id > maxId) maxId = id;
  });
}

// 转换新数据的ID为数字并递增
let duplicateCount = 0;
const converted = newData.map((material, idx) => {
  const newId = maxId + idx + 1;
  
  // 检查重复
  if (existing.some(m => m.name === material.name && m.composition === material.composition)) {
    duplicateCount++;
  }
  
  return {
    ...material,
    id: newId,
    originalId: material.id  // 保留原始ID用于参考
  };
});

if (duplicateCount > 0) {
  console.log(`⚠️  检测到 ${duplicateCount} 个可能的重复材料`);
}

// 合并
const merged = [...existing, ...converted];

// 保存
fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2));

console.log('');
console.log('✅ 合并完成！');
console.log(`   原有: ${existing.length}`);
console.log(`   新增: ${converted.length}`);
console.log(`   合计: ${merged.length}`);
console.log('');
console.log('💾 已保存到: backend/data/materials.json');

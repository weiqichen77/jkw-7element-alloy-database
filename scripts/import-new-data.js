#!/usr/bin/env node

/**
 * 脚本：导入新的材料数据
 * 从外部路径读取三个JSON文件并合并到数据库中
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始导入新的材料数据...\n');

// 定义文件路径 - 从 scripts 目录读取
const sourcePath = __dirname;
const elementFile = path.join(sourcePath, 'materials_element_0223.json');
const intermetallicFile = path.join(sourcePath, 'materials_intermetallic_0223.json');
const solidSolutionFile = path.join(sourcePath, 'materials_solid_solution_0223.json');

// 目标路径
const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const targetMaterialsPath = path.join(backendDataDir, 'materials.json');
const targetIntermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 函数：安全读取JSON文件
function safeReadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${filePath}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`❌ 读取文件失败 ${filePath}:`, e.message);
    return null;
  }
}

// 读取新数据
console.log('📖 读取新数据文件...');
const elementData = safeReadJSON(elementFile);
const intermetallicData = safeReadJSON(intermetallicFile);
const solidSolutionData = safeReadJSON(solidSolutionFile);

if (!elementData && !intermetallicData && !solidSolutionData) {
  console.error('❌ 没有找到任何有效的数据文件！');
  console.log('\n请确保以下文件存在：');
  console.log(`  - ${elementFile}`);
  console.log(`  - ${intermetallicFile}`);
  console.log(`  - ${solidSolutionFile}`);
  process.exit(1);
}

console.log(`  ✓ Element 数据: ${elementData ? elementData.length : 0} 条`);
console.log(`  ✓ Intermetallic 数据: ${intermetallicData ? intermetallicData.length : 0} 条`);
console.log(`  ✓ Solid Solution 数据: ${solidSolutionData ? solidSolutionData.length : 0} 条`);

// 读取现有数据
console.log('\n📚 读取现有数据库...');
let existingMaterials = [];
let existingIntermetallic = [];

if (fs.existsSync(targetMaterialsPath)) {
  existingMaterials = JSON.parse(fs.readFileSync(targetMaterialsPath, 'utf8'));
  console.log(`  ✓ 现有 materials.json: ${existingMaterials.length} 条`);
}

if (fs.existsSync(targetIntermetallicPath)) {
  existingIntermetallic = JSON.parse(fs.readFileSync(targetIntermetallicPath, 'utf8'));
  console.log(`  ✓ 现有 materials_intermetallic.json: ${existingIntermetallic.length} 条`);
}

// 合并数据
console.log('\n🔄 合并数据...');
let newMaterials = [];
let newIntermetallic = [];

// 将 element 和 solid solution 合并到 materials.json
if (elementData) newMaterials = newMaterials.concat(elementData);
if (solidSolutionData) newMaterials = newMaterials.concat(solidSolutionData);

// intermetallic 单独存储
if (intermetallicData) newIntermetallic = newIntermetallic.concat(intermetallicData);

// 生成唯一的ID
function generateId(materials) {
  let maxId = 0;
  materials.forEach(m => {
    if (m.id) {
      const numId = parseInt(m.id);
      if (!isNaN(numId) && numId > maxId) maxId = numId;
    }
  });
  return maxId;
}

// 为材料添加ID和source字段
function addIdsToMaterials(materials, startId) {
  return materials.map((material, index) => {
    const id = startId + index + 1;
    const source = material.source || `${material.type || 'material'}-${id}`;
    return {
      id: id.toString(),
      source: source,
      ...material
    };
  });
}

// 检查重复
function checkDuplicates(existing, newData, typeName) {
  const duplicates = [];
  const identifierSet = new Set(existing.map(m => {
    if (m.source) return m.source;
    if (m.name) return m.name;
    return `${m.composition}-${m.type}`;
  }));
  
  newData.forEach(material => {
    const identifier = material.source || material.name || `${material.composition}-${material.type}`;
    if (identifierSet.has(identifier)) {
      duplicates.push(identifier);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`  ⚠️  ${typeName} 中发现 ${duplicates.length} 个可能重复的项`);
    console.log(`     重复项示例: ${duplicates.slice(0, 5).join(', ')}`);
  }
  
  return duplicates;
}

const materialsDuplicates = checkDuplicates(existingMaterials, newMaterials, 'Materials');
const intermetallicDuplicates = checkDuplicates(existingIntermetallic, newIntermetallic, 'Intermetallic');

// 为新数据添加ID
console.log('\n💼 准备最终数据...');
const maxMaterialsId = generateId(existingMaterials);
const maxIntermetallicId = generateId(existingIntermetallic);

const materialsWithIds = addIdsToMaterials(newMaterials, maxMaterialsId);
const intermetallicWithIds = addIdsToMaterials(newIntermetallic, maxIntermetallicId);

// 合并（保留现有数据，只添加新数据）
const existingMaterialIdentifiers = new Set(existingMaterials.map(m => 
  m.source || m.name || `${m.composition}-${m.type}`
));
const existingIntermetallicIdentifiers = new Set(existingIntermetallic.map(m => 
  m.source || m.name || `${m.composition}-${m.type}`
));

const filteredNewMaterials = materialsWithIds.filter(m => {
  const identifier = m.source || m.name || `${m.composition}-${m.type}`;
  return !existingMaterialIdentifiers.has(identifier);
});

const filteredNewIntermetallic = intermetallicWithIds.filter(m => {
  const identifier = m.source || m.name || `${m.composition}-${m.type}`;
  return !existingIntermetallicIdentifiers.has(identifier);
});

const finalMaterials = [...existingMaterials, ...filteredNewMaterials];
const finalIntermetallic = [...existingIntermetallic, ...filteredNewIntermetallic];

console.log(`  ✓ Materials 总计: ${finalMaterials.length} 条 (新增 ${filteredNewMaterials.length})`);
console.log(`  ✓ Intermetallic 总计: ${finalIntermetallic.length} 条 (新增 ${filteredNewIntermetallic.length})`);

// 保存数据
console.log('\n💾 保存数据到数据库...');
fs.writeFileSync(targetMaterialsPath, JSON.stringify(finalMaterials, null, 2));
console.log(`  ✓ 已保存: backend/data/materials.json`);

fs.writeFileSync(targetIntermetallicPath, JSON.stringify(finalIntermetallic, null, 2));
console.log(`  ✓ 已保存: backend/data/materials_intermetallic.json`);

// 同步到 data 目录
const dataDir = path.join(__dirname, '..', 'data');
const dataTargetPath = path.join(dataDir, 'materials.json');
fs.writeFileSync(dataTargetPath, JSON.stringify(finalMaterials, null, 2));
console.log(`  ✓ 已同步: data/materials.json`);

console.log('\n✅ 数据导入完成！');
console.log('\n📊 统计信息：');
console.log(`  Materials: ${existingMaterials.length} → ${finalMaterials.length}`);
console.log(`  Intermetallic: ${existingIntermetallic.length} → ${finalIntermetallic.length}`);
console.log(`  总计新增: ${filteredNewMaterials.length + filteredNewIntermetallic.length} 条记录`);

console.log('\n🎯 下一步：');
console.log('  1. 运行 npm run validate 验证数据');
console.log('  2. 运行 npm run prepare 为 GitHub Pages 准备数据');
console.log('  3. 使用 git 提交并推送更改');

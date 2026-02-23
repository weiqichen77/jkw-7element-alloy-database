#!/usr/bin/env node

/**
 * 脚本：为所有材料数据添加ID
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 为数据添加ID字段...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

function addIdsToFile(filePath, fileType) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }

  console.log(`📝 处理 ${fileType}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let modified = 0;
  let alreadyHasId = 0;
  
  // 找到最大ID
  let maxId = 0;
  data.forEach(material => {
    if (material.id) {
      const numId = parseInt(material.id);
      if (!isNaN(numId) && numId > maxId) maxId = numId;
      alreadyHasId++;
    }
  });
  
  // 为没有ID的材料添加ID
  data.forEach((material, index) => {
    if (!material.id) {
      maxId++;
      material.id = maxId.toString();
      modified++;
    }
    
    // 确保有source字段
    if (!material.source) {
      material.source = material.source || `${material.type || 'material'}-${material.id}`;
    }
  });
  
  // 保存
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`  ✓ 总计: ${data.length} 条`);
  console.log(`  ✓ 已有ID: ${alreadyHasId} 条`);
  console.log(`  ✓ 新增ID: ${modified} 条`);
  console.log(`  ✓ 最大ID: ${maxId}`);
  console.log();
}

// 处理materials.json
addIdsToFile(materialsPath, 'materials.json');

// 处理materials_intermetallic.json
addIdsToFile(intermetallicPath, 'materials_intermetallic.json');

console.log('✅ ID添加完成！');

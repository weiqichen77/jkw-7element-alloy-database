#!/usr/bin/env node

/**
 * Check for duplicate materials in the database
 * Usage: node scripts/check-duplicates.js <new-data.json>
 * 
 * Identifies materials by: name, source, type, composition
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function normalizeComposition(comp) {
  if (!comp) return '';
  return comp.toLowerCase().replace(/\s+/g, '');
}

function materialsMatch(mat1, mat2) {
  // Match by: name, source, type, composition
  const nameMatch = (mat1.name || '').toLowerCase() === (mat2.name || '').toLowerCase();
  const sourceMatch = (mat1.source || '') === (mat2.source || '');
  const typeMatch = (mat1.type || '') === (mat2.type || '');
  const compMatch = normalizeComposition(mat1.composition) === normalizeComposition(mat2.composition);
  
  return nameMatch && sourceMatch && typeMatch && compMatch;
}

function checkDuplicates(newDataPath) {
  // Read new data file
  if (!fs.existsSync(newDataPath)) {
    log(`❌ 错误: 文件不存在 - ${newDataPath}`, 'red');
    process.exit(1);
  }

  let newMaterials;
  try {
    const newDataContent = fs.readFileSync(newDataPath, 'utf8');
    newMaterials = JSON.parse(newDataContent);
  } catch (error) {
    log(`❌ 错误: 无法读取或解析文件 - ${error.message}`, 'red');
    process.exit(1);
  }

  if (!Array.isArray(newMaterials)) {
    log('❌ 错误: 文件内容必须是数组格式', 'red');
    process.exit(1);
  }

  // Read existing materials from backend/data
  const materialsPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
  let existingMaterials = [];
  
  if (fs.existsSync(materialsPath)) {
    try {
      const existingContent = fs.readFileSync(materialsPath, 'utf8');
      existingMaterials = JSON.parse(existingContent);
    } catch (error) {
      log(`⚠️  警告: 无法读取现有数据 - ${error.message}`, 'yellow');
    }
  }

  log('\n' + '='.repeat(80), 'cyan');
  log('🔍 数据重复检查报告', 'bold');
  log('='.repeat(80) + '\n', 'cyan');

  log(`📊 待检查材料数量: ${newMaterials.length}`, 'blue');
  log(`📚 现有数据库材料数量: ${existingMaterials.length}\n`, 'blue');

  const duplicates = [];
  const newEntries = [];

  newMaterials.forEach((newMat, idx) => {
    const matchingMaterial = existingMaterials.find(existingMat => 
      materialsMatch(newMat, existingMat)
    );

    if (matchingMaterial) {
      duplicates.push({
        index: idx,
        newMaterial: newMat,
        existingMaterial: matchingMaterial
      });
    } else {
      newEntries.push({
        index: idx,
        material: newMat
      });
    }
  });

  // Display duplicates
  if (duplicates.length > 0) {
    log('⚠️  发现重复条目:', 'yellow');
    log('─'.repeat(80), 'yellow');
    
    duplicates.forEach((dup, i) => {
      log(`\n${i + 1}. 重复材料 #${dup.index + 1}:`, 'yellow');
      log(`   现有ID: ${colors.bold}${dup.existingMaterial.id || '(未分配)'}${colors.reset}`);
      log(`   名称: ${dup.existingMaterial.name}`);
      log(`   来源: ${dup.existingMaterial.source}`);
      log(`   类型: ${dup.existingMaterial.type}`);
      log(`   组成: ${dup.existingMaterial.composition}`);
      
      // Check if data would be updated
      const hasNewData = JSON.stringify(dup.newMaterial.data) !== JSON.stringify(dup.existingMaterial.data);
      if (hasNewData) {
        log(`   状态: ${colors.red}数据将被更新${colors.reset}`, 'red');
        log(`   现有数据点: ${dup.existingMaterial.data?.length || 0}`);
        log(`   新数据点: ${dup.newMaterial.data?.length || 0}`);
      } else {
        log(`   状态: ${colors.green}数据相同，无需更新${colors.reset}`);
      }
    });
    
    log('\n' + '─'.repeat(80), 'yellow');
    log(`\n总计: ${duplicates.length} 个重复条目`, 'yellow');
  } else {
    log('✅ 未发现重复条目', 'green');
  }

  // Display new entries
  if (newEntries.length > 0) {
    log(`\n✨ 新材料条目: ${newEntries.length}`, 'green');
    log('─'.repeat(80), 'green');
    
    newEntries.forEach((entry, i) => {
      log(`${i + 1}. ${entry.material.name} (${entry.material.source}) - ${entry.material.type}`);
    });
  }

  // Summary
  log('\n' + '='.repeat(80), 'cyan');
  log('📋 检查摘要:', 'bold');
  log(`   • 待上传材料: ${newMaterials.length}`);
  log(`   • 重复条目: ${colors.yellow}${duplicates.length}${colors.reset}`);
  log(`   • 新条目: ${colors.green}${newEntries.length}${colors.reset}`);
  log('='.repeat(80) + '\n', 'cyan');

  // Recommendations
  if (duplicates.length > 0) {
    log('💡 下一步操作:', 'blue');
    log('   1. 如需更新重复条目，请使用: node scripts/update-materials.js <文件名>', 'blue');
    log('   2. 如需仅添加新条目，请手动删除重复条目后再上传\n', 'blue');
  } else {
    log('✅ 可以直接上传此文件，所有条目都是新的！\n', 'green');
  }

  // Return exit code based on duplicates
  process.exit(duplicates.length > 0 ? 1 : 0);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('用法: node scripts/check-duplicates.js <new-data.json>\n', 'yellow');
    log('示例: node scripts/check-duplicates.js data/new-materials.json', 'cyan');
    process.exit(1);
  }

  checkDuplicates(args[0]);
}

module.exports = { checkDuplicates, materialsMatch };

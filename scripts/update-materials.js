#!/usr/bin/env node

/**
 * Update existing materials in the database
 * Usage: node scripts/update-materials.js <new-data.json> [--force]
 * 
 * Updates materials by matching: name, source, type, composition
 * Requires user confirmation before updating
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  const nameMatch = (mat1.name || '').toLowerCase() === (mat2.name || '').toLowerCase();
  const sourceMatch = (mat1.source || '') === (mat2.source || '');
  const typeMatch = (mat1.type || '') === (mat2.type || '');
  const compMatch = normalizeComposition(mat1.composition) === normalizeComposition(mat2.composition);
  
  return nameMatch && sourceMatch && typeMatch && compMatch;
}

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(colors.yellow + question + colors.reset + ' ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function updateMaterials(newDataPath, force = false) {
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

  // Read existing materials
  const materialsPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
  let existingMaterials = [];
  
  if (!fs.existsSync(materialsPath)) {
    log('❌ 错误: 现有数据文件不存在，请先确保数据库已初始化', 'red');
    process.exit(1);
  }

  try {
    const existingContent = fs.readFileSync(materialsPath, 'utf8');
    existingMaterials = JSON.parse(existingContent);
  } catch (error) {
    log(`❌ 错误: 无法读取现有数据 - ${error.message}`, 'red');
    process.exit(1);
  }

  log('\n' + '='.repeat(80), 'cyan');
  log('🔄 材料数据更新工具', 'bold');
  log('='.repeat(80) + '\n', 'cyan');

  // Find duplicates and new entries
  const updates = [];
  const additions = [];

  newMaterials.forEach((newMat, idx) => {
    const matchIndex = existingMaterials.findIndex(existingMat => 
      materialsMatch(newMat, existingMat)
    );

    if (matchIndex >= 0) {
      updates.push({
        index: matchIndex,
        newMaterial: newMat,
        existingMaterial: existingMaterials[matchIndex]
      });
    } else {
      additions.push(newMat);
    }
  });

  // Display summary
  log(`📊 分析结果:`, 'blue');
  log(`   • 待更新条目: ${colors.yellow}${updates.length}${colors.reset}`);
  log(`   • 待添加条目: ${colors.green}${additions.length}${colors.reset}`);
  log(`   • 现有数据库条目: ${existingMaterials.length}\n`);

  if (updates.length === 0 && additions.length === 0) {
    log('✅ 没有需要处理的数据', 'green');
    process.exit(0);
  }

  // Display updates
  if (updates.length > 0) {
    log('⚠️  以下条目将被更新:', 'yellow');
    log('─'.repeat(80), 'yellow');
    
    updates.forEach((update, i) => {
      log(`\n${i + 1}. ${update.existingMaterial.name}`, 'yellow');
      log(`   ID: ${update.existingMaterial.id || '(未分配)'}`);
      log(`   来源: ${update.existingMaterial.source}`);
      log(`   类型: ${update.existingMaterial.type}`);
      
      // Show data changes
      const oldDataCount = update.existingMaterial.data?.length || 0;
      const newDataCount = update.newMaterial.data?.length || 0;
      
      if (oldDataCount !== newDataCount) {
        log(`   数据点: ${oldDataCount} → ${colors.bold}${newDataCount}${colors.reset}`);
      }
      
      // Check if POSCAR path changed
      if (update.existingMaterial.poscar !== update.newMaterial.poscar) {
        log(`   POSCAR: ${update.existingMaterial.poscar || '(无)'} → ${update.newMaterial.poscar || '(无)'}`);
      }
    });
    
    log('\n' + '─'.repeat(80), 'yellow');
  }

  // Display additions
  if (additions.length > 0) {
    log(`\n✨ 以下条目将被添加:`, 'green');
    log('─'.repeat(80), 'green');
    
    additions.forEach((mat, i) => {
      log(`${i + 1}. ${mat.name} (${mat.source}) - ${mat.type}`);
    });
    
    log('─'.repeat(80) + '\n', 'green');
  }

  // Ask for confirmation
  if (!force) {
    log('⚠️  警告: 此操作将修改数据库文件！', 'red');
    log('建议先备份 backend/data/materials_intermetallic.json\n', 'yellow');
    
    const answer = await askConfirmation('确认执行更新吗？(yes/no):');
    
    if (answer !== 'yes' && answer !== 'y') {
      log('\n❌ 操作已取消', 'red');
      process.exit(0);
    }
  }

  // Create backup
  const backupPath = materialsPath + `.backup.${Date.now()}`;
  try {
    fs.copyFileSync(materialsPath, backupPath);
    log(`\n✅ 已创建备份: ${path.basename(backupPath)}`, 'green');
  } catch (error) {
    log(`⚠️  警告: 备份失败 - ${error.message}`, 'yellow');
  }

  // Perform updates
  log('\n🔄 正在更新数据...', 'blue');
  
  let updatedCount = 0;
  let addedCount = 0;

  // Update existing materials
  updates.forEach(update => {
    // Preserve the ID if it exists
    if (existingMaterials[update.index].id) {
      update.newMaterial.id = existingMaterials[update.index].id;
    }
    existingMaterials[update.index] = update.newMaterial;
    updatedCount++;
  });

  // Add new materials
  additions.forEach(mat => {
    existingMaterials.push(mat);
    addedCount++;
  });

  // Save updated data
  try {
    fs.writeFileSync(
      materialsPath, 
      JSON.stringify(existingMaterials, null, 2),
      'utf8'
    );
    
    log('\n' + '='.repeat(80), 'green');
    log('✅ 更新完成！', 'bold');
    log('='.repeat(80), 'green');
    log(`   • 已更新: ${updatedCount} 条`, 'green');
    log(`   • 已添加: ${addedCount} 条`, 'green');
    log(`   • 总计: ${existingMaterials.length} 条`, 'green');
    log(`   • 备份文件: ${path.basename(backupPath)}`, 'cyan');
    log('='.repeat(80) + '\n', 'green');
    
    log('💡 下一步:', 'blue');
    log('   1. 检查更新后的数据: cat backend/data/materials_intermetallic.json', 'blue');
    log('   2. 提交更改: git add backend/data/materials_intermetallic.json', 'blue');
    log('   3. 推送部署: git commit -m "Update materials" && git push\n', 'blue');
    
  } catch (error) {
    log(`\n❌ 错误: 保存失败 - ${error.message}`, 'red');
    log('数据未被修改，请检查文件权限', 'red');
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('用法: node scripts/update-materials.js <new-data.json> [--force]\n', 'yellow');
    log('参数:', 'cyan');
    log('  <new-data.json>  包含新材料数据的JSON文件');
    log('  --force          跳过确认提示，直接执行更新\n');
    log('示例:', 'cyan');
    log('  node scripts/update-materials.js data/updates.json');
    log('  node scripts/update-materials.js data/updates.json --force\n');
    process.exit(1);
  }

  const dataFile = args[0];
  const force = args.includes('--force');

  updateMaterials(dataFile, force);
}

module.exports = { updateMaterials };

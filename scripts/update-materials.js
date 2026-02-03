#!/usr/bin/env node

/**
 * Update existing materials in the database
 * Usage: node scripts/update-materials.js <new-data.json> [options]
 * 
 * Options:
 *   --mode=<mode>    Update mode (default: full)
 *     - add-temp:    Add new temperature points only
 *     - add-source:  Add new data sources only  
 *     - partial:     Update non-empty fields only
 *     - full:        Complete replacement (default)
 *   --force          Skip confirmation prompt
 * 
 * Updates materials by matching: name, source, type, composition
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

/**
 * Merge material data based on update mode
 */
function mergeMaterialData(existingMat, newMat, mode) {
  const merged = JSON.parse(JSON.stringify(existingMat)); // Deep copy
  
  switch (mode) {
    case 'add-temp':
      // Add new temperature points only
      if (newMat.data && Array.isArray(newMat.data)) {
        newMat.data.forEach(newDataPoint => {
          const exists = merged.data.some(existing => 
            existing.temperature === newDataPoint.temperature && 
            existing.source === newDataPoint.source
          );
          if (!exists) {
            merged.data.push(newDataPoint);
          }
        });
      }
      break;
      
    case 'add-source':
      // Add new data sources only
      if (newMat.data && Array.isArray(newMat.data)) {
        newMat.data.forEach(newDataPoint => {
          const exists = merged.data.some(existing => 
            existing.source === newDataPoint.source && 
            existing.temperature === newDataPoint.temperature
          );
          if (!exists) {
            merged.data.push(newDataPoint);
          }
        });
      }
      break;
      
    case 'partial':
      // Update non-empty fields only
      // Update top-level fields
      Object.keys(newMat).forEach(key => {
        if (key === 'data') return; // Handle data separately
        if (key === 'id') return;   // Don't update ID
        if (newMat[key] !== undefined && newMat[key] !== null && newMat[key] !== '') {
          merged[key] = newMat[key];
        }
      });
      
      // Merge data points
      if (newMat.data && Array.isArray(newMat.data)) {
        newMat.data.forEach(newDataPoint => {
          const existingIndex = merged.data.findIndex(existing => 
            existing.temperature === newDataPoint.temperature && 
            existing.source === newDataPoint.source
          );
          
          if (existingIndex >= 0) {
            // Merge properties for existing data point
            const existingDP = merged.data[existingIndex];
            if (newDataPoint.properties) {
              Object.keys(newDataPoint.properties).forEach(category => {
                if (!existingDP.properties) existingDP.properties = {};
                if (!existingDP.properties[category]) {
                  existingDP.properties[category] = {};
                }
                
                // Merge non-empty values
                Object.keys(newDataPoint.properties[category]).forEach(prop => {
                  const val = newDataPoint.properties[category][prop];
                  if (val !== undefined && val !== null && val !== '') {
                    existingDP.properties[category][prop] = val;
                  }
                });
              });
            }
          } else {
            // Add new data point
            merged.data.push(newDataPoint);
          }
        });
      }
      break;
      
    case 'full':
    default:
      // Complete replacement, keep ID
      const originalId = existingMat.id;
      Object.assign(merged, newMat);
      if (originalId) {
        merged.id = originalId;
      }
      break;
  }
  
  return merged;
}

async function updateMaterials(newDataPath, mode = 'full', force = false) {
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
  log(`更新模式: ${colors.bold}${mode}${colors.reset}`, 'cyan');
  log('='.repeat(80) + '\n', 'cyan');
  
  // Display mode description
  const modeDescriptions = {
    'add-temp': '📊 增添新的温度点 - 只添加不存在的温度点数据',
    'add-source': '🔬 增添新的数据来源 - 只添加不存在的数据源',
    'partial': '✏️  部分更新 - 只替换非空字段，保留现有数据',
    'full': '🔄 完整替换 - 完全替换整个材料条目'
  };
  log(modeDescriptions[mode] || modeDescriptions['full'], 'blue');
  log('');

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
    // Merge data based on mode
    const mergedMaterial = mergeMaterialData(
      existingMaterials[update.index], 
      update.newMaterial, 
      mode
    );
    existingMaterials[update.index] = mergedMaterial;
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
    log('用法: node scripts/update-materials.js <new-data.json> [options]\n', 'yellow');
    log('参数:', 'cyan');
    log('  <new-data.json>        包含新材料数据的JSON文件');
    log('  --mode=<mode>          更新模式 (默认: full)');
    log('    add-temp             只添加新的温度点');
    log('    add-source           只添加新的数据来源');
    log('    partial              部分更新（只替换非空字段）');
    log('    full                 完整替换（默认）');
    log('  --force                跳过确认提示，直接执行更新\n');
    log('示例:', 'cyan');
    log('  node scripts/update-materials.js data/updates.json');
    log('  node scripts/update-materials.js data/updates.json --mode=add-temp');
    log('  node scripts/update-materials.js data/updates.json --mode=partial');
    log('  node scripts/update-materials.js data/updates.json --force\n');
    log('更新模式说明:', 'cyan');
    log('  add-temp:    添加新温度点数据，已有温度点保持不变');
    log('  add-source:  添加新数据来源，已有来源保持不变');
    log('  partial:     只更新提供的非空字段，空字段保留原值');
    log('  full:        完全替换整个材料条目（保留ID）\n');
    process.exit(1);
  }

  const dataFile = args[0];
  let mode = 'full';
  let force = false;
  
  // Parse options
  args.slice(1).forEach(arg => {
    if (arg === '--force') {
      force = true;
    } else if (arg.startsWith('--mode=')) {
      mode = arg.split('=')[1];
      if (!['add-temp', 'add-source', 'partial', 'full'].includes(mode)) {
        log(`❌ 错误: 无效的更新模式 "${mode}"`, 'red');
        log('有效模式: add-temp, add-source, partial, full\n', 'yellow');
        process.exit(1);
      }
    }
  });

  updateMaterials(dataFile, mode, force);
}

module.exports = { updateMaterials, mergeMaterialData };

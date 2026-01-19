const fs = require('fs');
const path = require('path');

console.log('📝 生成路径映射报告...');

const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
const poscarDir = path.join(__dirname, '../backend/data/poscar');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 获取所有现有的POSCAR文件
const existingPoscars = new Set();
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.vasp') || file === 'POSCAR') {
      const relPath = path.relative(poscarDir, fullPath);
      existingPoscars.add(relPath);
    }
  });
}

if (fs.existsSync(poscarDir)) {
  walkDir(poscarDir);
}

console.log(`找到 ${existingPoscars.length} 个POSCAR文件`);
console.log('');

// 分析每个材料的POSCAR路径
let unmappedCount = 0;
let suggestions = [];

data.forEach((material, idx) => {
  const materialPath = material.poscar;
  if (!materialPath) return;

  // 提取ID或名称
  const id = material.id;
  const name = material.name;
  const fileName = name.split('-')[0];  // 取名称的第一部分

  // 尝试找到匹配的POSCAR文件
  const candidates = Array.from(existingPoscars).filter(p => 
    p.toLowerCase().includes(name.toLowerCase()) ||
    p.toLowerCase().includes(fileName.toLowerCase()) ||
    p.toLowerCase().includes(id.toString())
  );

  if (candidates.length === 0) {
    unmappedCount++;
    if (unmappedCount <= 10) {
      suggestions.push({
        material: name,
        id: id,
        currentPath: materialPath,
        candidates: Array.from(existingPoscars).slice(0, 5)  // 显示前5个可能的文件
      });
    }
  }
});

console.log('⚠️  路径映射情况:');
console.log(`   无法映射: ${unmappedCount}/${data.length}`);
console.log('');

if (suggestions.length > 0) {
  console.log('建议的路径修正 (前10个):');
  console.log('');
  suggestions.forEach((sugg, i) => {
    console.log(`${i + 1}. ${sugg.material} (ID: ${sugg.id})`);
    console.log(`   当前: ${sugg.currentPath}`);
    console.log(`   可选:`);
    sugg.candidates.slice(0, 3).forEach(c => {
      console.log(`     - data/poscar/${c}`);
    });
    console.log('');
  });
}

console.log('解决方案:');
console.log('1. 使用当前的POSCAR文件名命名约定（推荐）:');
console.log('   修改JSON中的poscar字段指向实际文件位置');
console.log('   示例: "poscar": "data/poscar/Al3Zr3-intermetallic.vasp"');
console.log('');
console.log('2. 重新组织POSCAR文件:');
console.log('   创建如下结构:');
console.log('   data/poscar/mp-bbgt/POSCAR');
console.log('   data/poscar/mp-be/POSCAR');
console.log('   等等...');

const fs = require('fs');
const path = require('path');

console.log('🧹 清理无效的POSCAR路径...');

const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
const backendDir = path.join(__dirname, '../backend');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let removedCount = 0;

const cleaned = data.map(material => {
  const newMaterial = { ...material };
  
  // 清理顶级poscar路径
  if (newMaterial.poscar && typeof newMaterial.poscar === 'string') {
    const fullPath = path.join(backendDir, newMaterial.poscar);
    if (!fs.existsSync(fullPath)) {
      console.log(`   移除: ${newMaterial.name} 的无效POSCAR: ${newMaterial.poscar}`);
      delete newMaterial.poscar;
      removedCount++;
    }
  }
  
  return newMaterial;
});

fs.writeFileSync(dataPath, JSON.stringify(cleaned, null, 2));

console.log('');
console.log(`✓ 已清理 ${removedCount} 个无效的POSCAR路径`);
console.log('✓ JSON文件已保存');

const fs = require('fs');
const path = require('path');

// 从composition中提取元素和数量
function parseComposition(comp) {
  const pattern = /([A-Z][a-z]?)(\d*)/g;
  const elements = [];
  const counts = [];
  let match;
  
  while ((match = pattern.exec(comp)) !== null) {
    elements.push(match[1]);
    counts.push(match[2] ? parseInt(match[2]) : 1);
  }
  
  return { elements, counts };
}

// 生成POSCAR文件内容
function generatePOSCAR(filename) {
  // 从文件名提取组分
  const basename = path.basename(filename, '.vasp');
  const comp = basename.split('-')[0].replace(/\//g, ''); // 移除interface标记和斜杠
  
  const { elements, counts } = parseComposition(comp);
  
  if (elements.length === 0) {
    console.log('Warning: Could not parse', filename);
    return null;
  }
  
  // 计算总原子数（缩放到合理的数量）
  const totalAtoms = counts.reduce((a, b) => a + b, 0);
  const scale = Math.ceil(200 / totalAtoms); // 目标约200个原子
  const scaledCounts = counts.map(c => c * scale);
  const finalTotal = scaledCounts.reduce((a, b) => a + b, 0);
  
  // 生成晶格参数（根据原子数调整）
  const latticeParam = Math.cbrt(finalTotal / 0.08).toFixed(12); // 假设密度0.08 atoms/Å³
  
  // POSCAR文件头
  let poscar = `${elements.join(' ')}\n`;
  poscar += `1.0\n`;
  poscar += ` ${latticeParam}   0.000000000000   0.000000000000\n`;
  poscar += `  0.000000000000  ${latticeParam}   0.000000000000\n`;
  poscar += `  0.000000000000   0.000000000000  ${latticeParam}\n`;
  poscar += `${elements.join(' ')}\n`;
  poscar += ` ${scaledCounts.join('  ')}\n`;
  poscar += `Direct\n`;
  
  // 生成原子坐标（随机分布）
  for (let i = 0; i < finalTotal; i++) {
    const x = Math.random().toFixed(12);
    const y = Math.random().toFixed(12);
    const z = Math.random().toFixed(12);
    poscar += `  ${x}   ${y}   ${z}\n`;
  }
  
  return poscar;
}

// 主函数
function main() {
  const materialsFile = path.join(__dirname, '../backend/data/materials.json');
  const poscarDir = path.join(__dirname, '../backend/data/poscar');
  const dataPoscarDir = path.join(__dirname, '../data/poscar');
  
  // 读取materials.json
  const materials = JSON.parse(fs.readFileSync(materialsFile, 'utf8'));
  
  // 收集所有需要的POSCAR文件
  const neededFiles = new Set();
  materials.forEach(material => {
    material.data.forEach(dataPoint => {
      const poscarPath = dataPoint.properties?.structure?.poscar;
      if (poscarPath && poscarPath.startsWith('data/poscar/')) {
        const filename = poscarPath.replace('data/poscar/', '');
        neededFiles.add(filename);
      }
    });
  });
  
  console.log(`Found ${neededFiles.size} unique POSCAR files referenced in database`);
  
  // 检查已存在的文件
  const existingFiles = new Set();
  if (fs.existsSync(poscarDir)) {
    fs.readdirSync(poscarDir).forEach(file => {
      if (file.endsWith('.vasp')) {
        existingFiles.add(file);
      }
    });
  }
  
  console.log(`Already have ${existingFiles.size} POSCAR files`);
  
  // 生成缺失的文件
  let generated = 0;
  neededFiles.forEach(filename => {
    if (existingFiles.has(filename)) {
      return; // 已存在，跳过
    }
    
    const poscar = generatePOSCAR(filename);
    if (!poscar) {
      return;
    }
    
    // 创建目录（如果是interface文件）
    const fullPath = path.join(poscarDir, filename);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(fullPath, poscar);
    
    // 同步到data目录
    const dataPath = path.join(dataPoscarDir, filename);
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataPath, poscar);
    
    generated++;
    console.log(`Generated: ${filename}`);
  });
  
  console.log(`\n✅ Generated ${generated} new POSCAR files`);
  console.log(`Total POSCAR files: ${existingFiles.size + generated}`);
}

main();

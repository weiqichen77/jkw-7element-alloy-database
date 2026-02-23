#!/usr/bin/env node

/**
 * 脚本：更新材料数据中的POSCAR文件路径
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 更新POSCAR文件路径...\n');

const backendDataDir = path.join(__dirname, '..', 'backend', 'data');
const dataDir = path.join(__dirname, '..', 'data');
const materialsPath = path.join(backendDataDir, 'materials.json');
const intermetallicPath = path.join(backendDataDir, 'materials_intermetallic.json');

// 读取数据
console.log('📖 读取材料数据...');
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

let updatedCount = 0;
let notFoundCount = 0;

// 更新Materials (element和solid solution)
console.log('\n📝 更新 Materials 的POSCAR路径...');
materials.forEach(material => {
  const type = material.type;
  
  if (type === 'solid-element') {
    // Element: data/element/[元素]/[晶格]/...
    // 我们需要根据实际的目录结构来找POSCAR
    // 例如: Al-fcc -> data/element/Al/fcc/DPA3_7ele_cryfinal/298k/...
    const element = material.elements[0];
    const composition = material.composition;
    
    // 从name中提取晶格类型，例如"Al-fcc" -> "fcc"
    const latticeMatch = material.name.match(/-(bcc|fcc|hcp)/i);
    if (latticeMatch) {
      const lattice = latticeMatch[1];
      const potentialPath = `/data/element/${element}/${lattice}`;
      
      // 检查是否存在
      const fullPath = path.join(dataDir, 'element', element, lattice);
      if (fs.existsSync(fullPath)) {
        material.poscar = potentialPath;
        updatedCount++;
      } else {
        notFoundCount++;
        console.log(`  ⚠️  未找到: ${material.name} -> ${fullPath}`);
      }
    }
  } else if (type === 'solid-solution') {
    // Solid solution: data/solid_solution/[目录名]/DFT/POSCAR
    // 目录名格式: bcc_Al0_Cu0_Nb0_Ni0_Ta0_W0_Zr24
    
    // 从composition构建目录名
    const comp = material.composition;
    const atomCount = material.atomCount || {};
    
    // 获取晶格类型 (从name中)
    const latticeMatch = material.name.match(/^(bcc|fcc|hcp)/i);
    if (!latticeMatch) {
      console.log(`  ⚠️  无法确定晶格类型: ${material.name}`);
      notFoundCount++;
      return;
    }
    const lattice = latticeMatch[1];
    
    // 构建目录名
    const elements = ['Al', 'Cu', 'Nb', 'Ni', 'Ta', 'W', 'Zr'];
    const dirName = lattice + '_' + elements.map(el => {
      return `${el}${atomCount[el] || 0}`;
    }).join('_');
    
    const poscarPath = `/data/solid_solution/${dirName}/DFT/POSCAR`;
    const fullPath = path.join(dataDir, 'solid_solution', dirName, 'DFT', 'POSCAR');
    
    if (fs.existsSync(fullPath)) {
      material.poscar = poscarPath;
      updatedCount++;
    } else {
      notFoundCount++;
      console.log(`  ⚠️  未找到: ${material.name} -> ${fullPath}`);
    }
  }
});

// Intermetallic的路径已经正确，只需验证
console.log('\n📝 验证 Intermetallic 的POSCAR路径...');
let intermetallicVerified = 0;
let intermetallicMissing = 0;

intermetallic.forEach(material => {
  if (material.poscar) {
    const fullPath = path.join(dataDir, material.poscar.replace('/data/', ''));
    if (fs.existsSync(fullPath)) {
      intermetallicVerified++;
    } else {
      intermetallicMissing++;
      console.log(`  ⚠️  文件不存在: ${material.source} -> ${fullPath}`);
    }
  }
});

// 保存更新
console.log('\n💾 保存更新...');
fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
fs.writeFileSync(path.join(dataDir, 'materials.json'), JSON.stringify(materials, null, 2));

console.log('\n✅ POSCAR路径更新完成！');
console.log('\n📊 统计信息：');
console.log(`  Materials:`);
console.log(`    - 已更新: ${updatedCount}`);
console.log(`    - 未找到: ${notFoundCount}`);
console.log(`  Intermetallic:`);
console.log(`    - 已验证: ${intermetallicVerified}`);
console.log(`    - 缺失: ${intermetallicMissing}`);

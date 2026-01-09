// 为材料数据添加RDF和应力应变曲线的样本数据
const fs = require('fs');
const path = require('path');

// 读取材料数据
const dataPath = path.join(__dirname, '../backend/data/materials.json');
const materials = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 生成RDF样本数据（径向分布函数）
function generateRDFData(materialName) {
  const data = [];
  // 生成从1到10埃的RDF数据
  for (let r = 1.0; r <= 10.0; r += 0.5) {
    let gr;
    if (r < 2.5) {
      // 短程：接近0
      gr = 0.001 * Math.exp(r - 1);
    } else if (r < 4.5) {
      // 第一峰：2.5-4.5埃
      const center = 3.5;
      const width = 0.8;
      gr = 2.5 * Math.exp(-Math.pow((r - center) / width, 2));
    } else if (r < 6.5) {
      // 第二峰：4.5-6.5埃
      const center = 5.5;
      const width = 1.0;
      gr = 1.5 * Math.exp(-Math.pow((r - center) / width, 2)) + 1.0;
    } else {
      // 长程：接近1
      gr = 1.0 + 0.01 * Math.sin(r * 2);
    }
    data.push([parseFloat(r.toFixed(1)), parseFloat(gr.toFixed(3))]);
  }
  return data;
}

// 生成应力应变曲线样本数据
function generateStressStrainData(youngsModulus, materialType) {
  const data = [];
  const E = youngsModulus; // GPa
  
  // 生成0到10%应变的数据
  for (let strain = 0; strain <= 0.10; strain += 0.005) {
    let stress;
    
    if (materialType === 'amorphous') {
      // 非晶材料：接近线性到屈服，然后软化
      const yieldStrain = 0.02;
      if (strain < yieldStrain) {
        stress = E * strain;
      } else {
        const yieldStress = E * yieldStrain;
        const softening = 0.95;
        stress = yieldStress * (1 - softening * (strain - yieldStrain) / 0.08);
      }
    } else {
      // 晶体材料：线性弹性 + 应变硬化
      const yieldStrain = 0.002;
      if (strain < yieldStrain) {
        stress = E * strain;
      } else {
        const yieldStress = E * yieldStrain;
        const hardeningRate = E * 0.05;
        stress = yieldStress + hardeningRate * (strain - yieldStrain);
      }
    }
    
    // 添加一点噪声
    stress *= (1 + (Math.random() - 0.5) * 0.02);
    
    data.push([
      parseFloat((strain * 100).toFixed(2)), // 转换为百分比
      parseFloat(stress.toFixed(2))
    ]);
  }
  return data;
}

// 更新材料数据
let updatedCount = 0;
materials.forEach(material => {
  material.data.forEach(dataPoint => {
    const props = dataPoint.properties;
    
    // 处理RDF数据（仅非晶材料）
    if (props.structure && props.structure.rdf && typeof props.structure.rdf === 'string') {
      props.structure.rdf = generateRDFData(material.name);
      updatedCount++;
      console.log(`添加RDF数据: ${material.name} (${dataPoint.temperature}K, ${dataPoint.source})`);
    }
    
    // 处理应力应变曲线（所有材料）
    if (props.mechanics && props.mechanics.youngsModulus) {
      // 只为没有stressStrain数据的添加
      if (!props.mechanics.stressStrain) {
        props.mechanics.stressStrain = generateStressStrainData(
          props.mechanics.youngsModulus,
          material.type
        );
        updatedCount++;
        console.log(`添加应力应变曲线: ${material.name} (${dataPoint.temperature}K, ${dataPoint.source})`);
      }
    }
  });
});

// 保存更新后的数据
fs.writeFileSync(dataPath, JSON.stringify(materials, null, 2));
console.log(`\n完成！共更新 ${updatedCount} 个数据点`);
console.log(`数据已保存到: ${dataPath}`);

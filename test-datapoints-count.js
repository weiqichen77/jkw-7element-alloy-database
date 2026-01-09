// Test script to verify data points counting logic
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./backend/data/materials.json', 'utf8'));

function countDataProperties(dataPoint) {
  if (!dataPoint || !dataPoint.properties) return 0;
  
  let count = 0;
  const props = dataPoint.properties;
  
  // Structure properties
  if (props.structure) {
    if (props.structure.density !== undefined && props.structure.density !== '-') count++;
    if (props.structure.latticeParameters && props.structure.latticeParameters.a !== undefined && props.structure.latticeParameters.a !== '-') count++;
    if (props.structure.rdf && Array.isArray(props.structure.rdf) && props.structure.rdf.length > 0) count++;
  }
  
  // Thermodynamics properties
  if (props.thermodynamics) {
    if (props.thermodynamics.specificHeat !== undefined && props.thermodynamics.specificHeat !== '-') count++;
    if (props.thermodynamics.mixingEnthalpy !== undefined && props.thermodynamics.mixingEnthalpy !== '-') count++;
    if (props.thermodynamics.diffusionCoefficient !== undefined && props.thermodynamics.diffusionCoefficient !== '-') count++;
  }
  
  // Mechanics properties
  if (props.mechanics) {
    if (props.mechanics.youngsModulus !== undefined && props.mechanics.youngsModulus !== '-') count++;
    if (props.mechanics.bulkModulus !== undefined && props.mechanics.bulkModulus !== '-') count++;
    if (props.mechanics.shearModulus !== undefined && props.mechanics.shearModulus !== '-') count++;
    if (props.mechanics.stressStrain && Array.isArray(props.mechanics.stressStrain) && props.mechanics.stressStrain.length > 0) count++;
  }
  
  // Defects properties
  if (props.defects) {
    if (props.defects.vacancyFormationEnergy !== undefined && props.defects.vacancyFormationEnergy !== '-') count++;
    // Interstitial formation energy might have multiple structures
    if (props.defects.interstitialFormationEnergy) {
      const interstitial = props.defects.interstitialFormationEnergy;
      if (typeof interstitial === 'object' && interstitial !== null) {
        // Count each interstitial structure type that has data
        Object.keys(interstitial).forEach(key => {
          if (interstitial[key] !== undefined && interstitial[key] !== '-') {
            count++;
          }
        });
      } else if (interstitial !== undefined && interstitial !== '-') {
        count++;
      }
    }
  }
  
  return count;
}

let totalDataPoints = 0;
let oldTotalDataPoints = 0;

console.log('\n=== 数据点统计测试 ===\n');
console.log('材料总数:', data.length);

// 详细统计前3个材料
for (let i = 0; i < Math.min(3, data.length); i++) {
  const material = data[i];
  console.log(`\n材料 ${i + 1}: ${material.name} (${material.composition})`);
  console.log(`温度/来源条目数: ${material.data.length}`);
  
  material.data.forEach((dataPoint, idx) => {
    const count = countDataProperties(dataPoint);
    console.log(`  - 条目 ${idx + 1} (${dataPoint.temperature}K, ${dataPoint.source}): ${count} 个属性`);
    totalDataPoints += count;
    oldTotalDataPoints += 1;
  });
}

// 统计所有材料
for (let i = 3; i < data.length; i++) {
  const material = data[i];
  material.data.forEach(dataPoint => {
    totalDataPoints += countDataProperties(dataPoint);
    oldTotalDataPoints += 1;
  });
}

console.log('\n=== 统计结果 ===');
console.log(`旧计数方法（仅温度/来源条目）: ${oldTotalDataPoints} 条数据`);
console.log(`新计数方法（所有属性）: ${totalDataPoints} 条数据`);
console.log(`增加比例: ${(totalDataPoints / oldTotalDataPoints).toFixed(2)}x`);

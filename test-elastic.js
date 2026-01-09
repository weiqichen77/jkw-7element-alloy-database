const fs = require('fs');
const data = JSON.parse(fs.readFileSync('backend/data/materials.json', 'utf8'));

console.log('检查前10个材料的弹性常数显示情况:\n');

for (let i = 0; i < Math.min(10, data.length); i++) {
  const material = data[i];
  
  // getPrimaryData logic
  let primary = material.data.find(d => d.temperature === 0 && d.source === 'DFT');
  if (!primary) primary = material.data.find(d => d.temperature === 0 && d.source === 'DPA-3');
  if (!primary) primary = material.data.find(d => d.temperature === 0 && d.source === 'DPA-1');
  if (!primary) primary = material.data.find(d => d.temperature === 0);
  if (!primary) primary = material.data[0];
  
  if (!primary) {
    console.log(material.name + ': No primary data found!');
    continue;
  }
  
  const props = primary.properties || {};
  const mech = props.mechanics || {};
  const elastic = mech.elasticConstants;
  
  let display = '-';
  if (elastic && Array.isArray(elastic) && elastic.length === 6) {
    display = 'C11=' + elastic[0][0];
  }
  
  console.log(material.name);
  console.log('  Primary: ' + primary.temperature + 'K, ' + primary.source);
  console.log('  Elastic: ' + display);
  const hasOther = material.data.some(d => {
    const e = d.properties && d.properties.mechanics && d.properties.mechanics.elasticConstants;
    return e != null;
  });
  console.log('  Other data points have elastic: ' + (hasOther ? 'YES' : 'NO'));
  console.log('');
}

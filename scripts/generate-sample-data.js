const fs = require('fs'), path = require('path');
const OUT_DIR = path.join(__dirname,'..','backend','data');
fs.mkdirSync(OUT_DIR,{recursive:true});
const OUT_FILE = path.join(OUT_DIR,'materials.json');
const ELEMENTS = ['Al','Ni','Cu','Zr','Nb','Ta','W'];

// 随机数生成函数
function rn(a, b, decimals = 4) {
  return Math.round((Math.random() * (b - a) + a) * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// 随机选择n个不重复元素
function pick(arr, n) {
  const s = new Set();
  while (s.size < n) s.add(arr[~~(Math.random() * arr.length)]);
  return Array.from(s);
}

// 随机决定是否包含某个属性（70%概率）
function maybe(value) {
  return Math.random() > 0.3 ? value : null;
}

// 生成结构信息
function generateStructureInfo(type) {
  if (type === 'crystalline') {
    return {
      lattice_constant: maybe({
        a: rn(3.0, 5.0, 3),
        b: rn(3.0, 5.0, 3),
        c: rn(3.0, 5.0, 3)
      }),
      radial_distribution: maybe(`data/rdf_${Math.floor(Math.random() * 1000)}.dat`)
    };
  } else if (type === 'amorphous') {
    return {
      lattice_constant: null,
      radial_distribution: maybe(`data/rdf_${Math.floor(Math.random() * 1000)}.dat`)
    };
  } else { // interface
    return {
      lattice_constant: maybe({
        a: rn(3.0, 5.0, 3),
        b: rn(3.0, 5.0, 3),
        c: rn(3.0, 5.0, 3)
      }),
      radial_distribution: maybe(`data/rdf_${Math.floor(Math.random() * 1000)}.dat`)
    };
  }
}

// 生成热力学和动力学信息
function generateThermodynamics() {
  return {
    specific_heat: maybe(rn(100, 900, 2)),
    mixing_enthalpy: maybe(rn(-50, 50, 2)),
    diffusion_coefficient: maybe(rn(1e-15, 1e-10, 18)),
    thermal_expansion: maybe(rn(1e-6, 3e-5, 8))
  };
}

// 生成力学性能
function generateMechanics(type) {
  return {
    elastic_constants: maybe({
      C11: rn(100, 300, 2),
      C12: rn(50, 150, 2),
      C44: rn(50, 150, 2)
    }),
    stress_strain_curve: maybe(`data/stress_strain_${Math.floor(Math.random() * 1000)}.dat`),
    youngs_modulus: maybe(rn(50, 200, 2)),
    poisson_ratio: maybe(rn(0.2, 0.4, 3))
  };
}

// 生成缺陷性质
function generateDefects(type) {
  if (type === 'amorphous') {
    // 非晶材料通常不讨论传统的点缺陷
    return {
      vacancy_formation_energy: null,
      interstitial_formation_energy: null,
      stacking_fault_energy: null
    };
  }
  return {
    vacancy_formation_energy: maybe(rn(0.5, 3.0, 3)),
    interstitial_formation_energy: maybe(rn(1.0, 5.0, 3)),
    stacking_fault_energy: maybe(rn(10, 200, 2))
  };
}

// 生成材料数据
const N = 50;
const types = ['amorphous', 'crystalline', 'interface'];
const out = [];

for (let i = 1; i <= N; i++) {
  const typeIndex = i % 3;
  const t = types[typeIndex];
  const elements = pick(ELEMENTS, 2 + (i % 3));
  
  const material = {
    id: i,
    name: `${t}-Sample-${i}`,
    type: t,
    elements: elements,
    density: rn(2.0, 9.5, 3),
    structure: generateStructureInfo(t),
    thermodynamics: generateThermodynamics(),
    mechanics: generateMechanics(t),
    defects: generateDefects(t)
  };
  
  out.push(material);
}

fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
console.log(`✅ Generated ${N} material records`);
console.log(`📁 Saved to: ${OUT_FILE}`);

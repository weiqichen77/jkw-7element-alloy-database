# 数据结构说明

## 材料数据完整字段

每条材料记录包含以下字段结构：

```json
{
  "id": 1,
  "name": "crystalline-Sample-1",
  "type": "crystalline",  // 材料类型: "crystalline", "amorphous", "interface"
  "elements": ["Al", "Zr", "Nb"],  // 元素组成
  "density": 9.106,  // 密度 (g/cm³)
  
  // 结构信息
  "structure": {
    "lattice_constant": {  // 晶格常数 (Å)，非晶材料为 null
      "a": 3.524,
      "b": 3.524,
      "c": 3.524
    },
    "radial_distribution": "data/rdf_728.dat"  // 径向分布函数文件路径，可为 null
  },
  
  // 热力学和动力学信息
  "thermodynamics": {
    "specific_heat": 445.67,  // 比热容 (J/kg·K)，可为 null
    "mixing_enthalpy": -12.45,  // 混合焓 (kJ/mol)，可为 null
    "diffusion_coefficient": 7.2814072e-11,  // 扩散系数 (m²/s)，可为 null
    "thermal_expansion": 2.451e-5  // 热膨胀系数 (1/K)，可为 null
  },
  
  // 力学性能
  "mechanics": {
    "elastic_constants": {  // 弹性常数 (GPa)，可为 null
      "C11": 212.95,
      "C12": 99.78,
      "C44": 65.20
    },
    "stress_strain_curve": "data/stress_strain_927.dat",  // 应力应变曲线文件，可为 null
    "youngs_modulus": 159.4,  // 杨氏模量 (GPa)，可为 null
    "poisson_ratio": 0.263  // 泊松比，可为 null
  },
  
  // 缺陷性质
  "defects": {
    "vacancy_formation_energy": 1.947,  // 空位形成能 (eV)，可为 null
    "interstitial_formation_energy": 4.566,  // 间隙形成能 (eV)，可为 null
    "stacking_fault_energy": 75.12  // 层错能 (mJ/m²)，可为 null
  }
}
```

## 字段说明

### 基本信息
- **id**: 唯一标识符（整数）
- **name**: 材料名称（字符串）
- **type**: 材料类型，可选值：
  - `crystalline`: 晶态
  - `amorphous`: 非晶态
  - `interface`: 界面
- **elements**: 元素组成数组，元素符号为字符串
- **density**: 材料密度，单位 g/cm³

### 结构信息 (structure)
- **lattice_constant**: 晶格常数对象（非晶材料通常为 null）
  - `a`, `b`, `c`: 三个晶格方向的常数，单位 Å
- **radial_distribution**: 径向/双体分布函数数据文件路径

### 热力学和动力学信息 (thermodynamics)
- **specific_heat**: 比热容，单位 J/(kg·K)
- **mixing_enthalpy**: 混合焓，单位 kJ/mol
- **diffusion_coefficient**: 扩散系数，单位 m²/s（通常为科学计数法）
- **thermal_expansion**: 热膨胀系数，单位 1/K（通常为科学计数法）

### 力学性能 (mechanics)
- **elastic_constants**: 弹性常数对象，单位 GPa
  - `C11`, `C12`, `C44`: 弹性常数矩阵元素
- **stress_strain_curve**: 应力应变曲线数据文件路径
- **youngs_modulus**: 杨氏模量，单位 GPa
- **poisson_ratio**: 泊松比（无量纲）

### 缺陷性质 (defects)
- **vacancy_formation_energy**: 空位形成能，单位 eV
- **interstitial_formation_energy**: 间隙形成能，单位 eV
- **stacking_fault_energy**: 广义层错能，单位 mJ/m²

**注意**: 非晶材料通常不包含传统的点缺陷性质，这些字段会设为 null

## 数据完整性

- ✅ **不要求所有字段都存在**：任何性质字段都可以为 `null`
- ✅ **灵活的数据结构**：可以只包含部分性质信息
- ✅ **前端自动处理**：缺失值在网页中显示为 `-`
- ✅ **可扩展**：未来可以添加新的性质字段

## 数据生成

使用 `scripts/generate-sample-data.js` 生成样例数据：

```bash
node scripts/generate-sample-data.js
```

生成的数据会保存到 `backend/data/materials.json`。

脚本特点：
- 自动生成 50 条样例数据
- 各类材料类型均匀分布
- 70% 概率包含可选性质（模拟真实场景）
- 数据范围符合物理实际

## 网页展示

网页提供四种性质分类视图：

1. **结构信息**：显示晶格常数、径向分布函数等
2. **热力学/动力学**：显示比热容、混合焓、扩散系数、热膨胀系数
3. **力学性能**：显示弹性常数、杨氏模量、泊松比、应力应变曲线
4. **缺陷性质**：显示空位/间隙形成能、层错能

可以通过材料类型过滤（全部/晶态/非晶态/界面）和搜索功能组合使用。

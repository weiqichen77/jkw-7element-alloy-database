# Test Data Documentation
## 测试数据说明

*Generated: 2026-01-08*

---

## Overview / 概述

This document describes the comprehensive test dataset generated for V2 database testing.

本文档描述为V2数据库测试生成的comprehensive测试数据集。

---

## Dataset Statistics / 数据集统计

### Total Materials / 材料总数
**100 materials** with **258 data points**

### Material Type Distribution / 材料类型分布

| Type 类型 | Count 数量 | Percentage 百分比 |
|-----------|-----------|------------------|
| **Element** (单质) | 18 | 18% |
| **Solid Solution** (固溶体) | 18 | 18% |
| **Intermetallic** (金属间化合物) | 24 | 24% |
| **Amorphous** (非晶) | 19 | 19% |
| **Interface** (界面) | 21 | 21% |

### Data Coverage / 数据覆盖

| Feature 特性 | Count 数量 | Coverage 覆盖率 |
|-------------|-----------|----------------|
| **Multi-temperature data** | 78 materials | 78% |
| **POSCAR files** | 75 materials | 75% |
| **Elastic constants** | 74 materials | 74% |
| **Multiple data sources** | All | 100% |

---

## Temperature Distribution / 温度分布

Materials include data points at various temperatures:
- **0K** (Ground state)
- **300K** (Room temperature)
- **600K** (Elevated temperature)
- **900K** (High temperature)

材料包含不同温度下的数据点：
- **0K**（基态）
- **300K**（室温）
- **600K**（高温）
- **900K**（高温）

---

## Data Sources / 数据来源

Each data point is attributed to one of four sources:
- **DFT**: Density Functional Theory calculations
- **DPA-1**: Deep Potential-1 model predictions
- **DPA-3**: Deep Potential-3 model predictions
- **Experiment**: Experimental measurements

每个数据点归属于以下四种来源之一：
- **DFT**：密度泛函理论计算
- **DPA-1**：深度势能-1模型预测
- **DPA-3**：深度势能-3模型预测
- **Experiment**：实验测量

---

## Element Coverage / 元素覆盖

The dataset includes combinations from these elements:
- **Primary 7**: Al, Ni, Cu, Zr, Nb, Ta, W
- **Additional 3**: Fe, Co, Ti

数据集包含以下元素组合：
- **主要7元素**：Al, Ni, Cu, Zr, Nb, Ta, W
- **额外3元素**：Fe, Co, Ti

---

## Property Coverage / 性质覆盖

### 1. Structure Properties / 结构性质

**All materials include:**
- Density (g/cm³)

**Crystalline materials include:**
- Lattice parameters: a, b, c (Å)
- Lattice angles: α, β, γ (degrees)
- Point group symmetry

**Amorphous materials include:**
- Radial Distribution Function (RDF) file reference

**75 materials include:**
- POSCAR file for 3D visualization

### 2. Thermodynamics Properties / 热力学性质

**All materials include:**
- Formation energy (eV/atom)
- Mixing enthalpy (eV/atom)

**High-temperature data points include:**
- Specific heat capacity (J/mol·K)
- Thermal expansion coefficient (10⁻⁶/K)

### 3. Mechanics Properties / 力学性质

**All materials include:**
- Young's modulus (GPa)
- Bulk modulus (GPa)
- Shear modulus (GPa)
- Poisson's ratio

**74 materials include:**
- Full elastic constants matrix (6×6 Cij in GPa)

### 4. Defects Properties / 缺陷性质

**Most non-interface materials include:**
- Vacancy formation energy (eV)

**Solid solutions and intermetallics include:**
- Multi-site interstitial formation energy (eV):
  - dumbbell111
  - dumbbell100
  - crowdion111
  - octahedral
  - tetrahedral

**Some solid solutions include:**
- Stacking fault energy (mJ/m²)

---

## File Structure / 文件结构

### Main Data File / 主数据文件
```
backend/data/materials.json
```

### V2 Data Format / V2数据格式
```json
{
  "id": 1,
  "name": "Al3Zr3-intermetallic",
  "type": "intermetallic",
  "composition": "Al3Zr3",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "structure": { ... },
        "thermodynamics": { ... },
        "mechanics": { ... },
        "defects": { ... }
      }
    },
    {
      "temperature": 300,
      "source": "DPA-3",
      "properties": { ... }
    }
  ]
}
```

---

## Testing Coverage / 测试覆盖

This dataset enables testing of:

### ✅ Material Type Filtering
- All 6 types represented with substantial samples
- Element: 18 samples
- Solid Solution: 18 samples
- Intermetallic: 24 samples
- Amorphous: 19 samples
- Interface: 21 samples

### ✅ Composition Display
- Various element combinations
- Subscript formatting test (Al₂Cu₄, etc.)

### ✅ Multi-dimensional Data
- 78 materials with multiple data points
- Expandable rows functionality
- Data source selector in detail view

### ✅ Temperature Variations
- 0K (ground state) data
- 300K, 600K, 900K elevated temperatures
- Sufficient variety for testing

### ✅ Data Source Diversity
- DFT calculations
- DPA-1 and DPA-3 model predictions
- Experimental data
- Mixed sources per material

### ✅ 3D Visualization
- 75 materials with POSCAR references
- Tests 3D viewer loading
- Tests multiple structure types

### ✅ Export Functionality
- All property types present
- Range selection testing (all/filtered/selected)
- Property filtering testing
- JSON export: Full nested structure
- CSV export: Flattened multi-row format

### ✅ Statistics Display
- 100 materials count
- 258 data points count
- Real-time filtering updates

### ✅ Search Functionality
- Element-based search (e.g., "Al", "Cu")
- Composition-based search (e.g., "Al3Zr3")
- Type filtering + search combination

---

## Data Generation Method / 数据生成方法

Data was generated using a Node.js script with:
- Randomized but realistic value ranges
- Proper V2 data structure compliance
- Diverse material type distribution
- Varied temperature and source combinations
- Property completeness based on material type

数据使用Node.js脚本生成：
- 随机但真实的数值范围
- 符合V2数据结构规范
- 多样化的材料类型分布
- 多种温度和来源组合
- 基于材料类型的属性完整性

---

## Validation / 验证

### ✅ Data Structure
- All materials conform to V2 schema
- Proper nesting of temperature/source/properties
- Valid JSON format

### ✅ Value Ranges
- Density: 5.0 - 15.0 g/cm³
- Lattice parameters: 3.0 - 5.0 Å
- Formation energy: -2.0 to 0.5 eV/atom
- Young's modulus: 100 - 300 GPa
- Vacancy formation energy: 0.5 - 2.5 eV

### ✅ Type Consistency
- Element materials: Single element composition
- Solid solutions: Binary/ternary compositions
- Intermetallics: Stoichiometric ratios
- Amorphous: Complex multi-element compositions
- Interfaces: Slash-separated notation (A/B)

---

## Usage / 使用方法

### View Online / 在线查看
Visit: https://wqchen007.github.io/jkw-7element-alloy-database/

### Local Testing / 本地测试
```bash
# Serve locally
python -m http.server 8000

# Open browser
open http://localhost:8000/frontend/
```

### Data Filtering / 数据筛选
1. Click material type tabs (Element, Solid Solution, etc.)
2. Search by element ("Al") or composition ("Al3Zr3")
3. Click ▶ to expand multi-temperature data
4. Click material name to view details

---

## Known Limitations / 已知限制

### Synthetic Data / 合成数据
- Values are randomly generated within realistic ranges
- Not based on actual DFT calculations or experiments
- For demonstration and testing purposes only

### POSCAR Files / POSCAR文件
- File paths reference non-existent files
- 3D viewer will show "File not found" errors
- To test 3D visualization, real POSCAR files must be added

### RDF Data / 径向分布函数数据
- RDF file paths reference placeholder locations
- Actual RDF data files not included

---

## Future Enhancements / 未来改进

### Add Real Data / 添加真实数据
- Replace synthetic data with actual calculations
- Add real POSCAR files for 3D visualization
- Include actual RDF data for amorphous materials

### Expand Coverage / 扩展覆盖
- More element combinations
- Additional temperature points
- More data sources
- Experimental validation data

### Property Enhancements / 性质增强
- Stress-strain curves
- Phonon dispersion
- Band structure
- Magnetic properties

---

## References / 参考

- [V2 Data Structure](docs/DATA_STRUCTURE_V2.md)
- [V2 User Guide](docs/V2_USER_GUIDE.md)
- [Testing Checklist](docs/TESTING_CHECKLIST.md)

---

## Contact / 联系方式

For questions or issues with the test data:
- GitHub Issues: https://github.com/wqchen007/jkw-7element-alloy-database/issues

---

*Last Updated: 2026-01-08*  
*Data Version: V2.0.0*  
*Total Materials: 100*  
*Total Data Points: 258*

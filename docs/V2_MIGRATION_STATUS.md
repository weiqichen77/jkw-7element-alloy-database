# V2 Migration Status / V2迁移状态

**Status:** In Progress (Phase 1-2 Complete) / 进行中（第1-2阶段完成）  
**Last Updated:** 2026-01-08

## Overview / 概述

We are migrating the alloy materials database to a more powerful V2 system that supports multi-dimensional data (temperature, data source), expanded properties, and advanced visualization features.

我们正在将合金材料数据库迁移到更强大的V2系统，支持多维度数据（温度、数据来源）、扩展属性和高级可视化功能。

## Migration Strategy / 迁移策略

We are using a **parallel development approach**:
- Current website (V1) continues to run normally
- V2 system is being developed separately
- Gradual testing and validation
- Switch to V2 when ready

我们采用**并行开发方式**：
- 当前网站（V1）继续正常运行
- V2系统单独开发
- 逐步测试和验证
- 准备就绪后切换到V2

## Completed / 已完成

### ✅ Phase 1: Data Structure & Backend
- [x] V2 data structure definition ([DATA_STRUCTURE_V2.md](DATA_STRUCTURE_V2.md))
- [x] Enhanced data conversion script ([../scripts/convert-data-v2.js](../scripts/convert-data-v2.js))
- [x] CSV template for V2 format ([../example-template-v2.csv](../example-template-v2.csv))
- [x] Test data in V2 format ([../test-materials-v2.json](../test-materials-v2.json))

### ✅ Phase 2: Material Type System
- [x] Updated UI to support 6 material types:
  - `element` - Pure element (单质)
  - `solid-solution` - Solid solution (固溶体)
  - `intermetallic` - Intermetallic compound (金属间化合物)
  - `amorphous` - Amorphous material (非晶)
  - `interface` - Interface structure (界面)
- [x] Bilingual translations for new types

## In Progress / 进行中

### 🔄 Phase 3: Planning & Documentation
- [x] Comprehensive implementation plan ([IMPLEMENTATION_PLAN_V2.md](IMPLEMENTATION_PLAN_V2.md))
- [ ] Create parallel V2 workflow
- [ ] Generate V2 sample data

## Pending / 待完成

### 📋 Phase 4: Frontend Implementation
- [ ] Rewrite frontend for V2 data structure
- [ ] Element composition display (Al₂Cu₄ format)
- [ ] Element filtering/search
- [ ] Multi-dimensional data display (temperature/source)
- [ ] Expandable rows for different temperatures
- [ ] Lattice parameter dropdown
- [ ] Elastic constants matrix display
- [ ] Multiple interstitial sites display

### 📋 Phase 5: POSCAR Visualization
- [ ] Integrate 3Dmol.js library
- [ ] POSCAR file viewer with 3D structure
- [ ] POSCAR text display
- [ ] Download functionality

### 📋 Phase 6: Data Export
- [ ] Export dialog UI
- [ ] Multiple format support (JSON/CSV/Excel)
- [ ] Selective export (materials/properties)
- [ ] POSCAR files ZIP download
- [ ] Integrate JSZip library

### 📋 Phase 7: Statistics
- [ ] Enhanced data point counting
- [ ] Real-time statistics display
- [ ] Detailed statistics panel

### 📋 Phase 8: Testing & Migration
- [ ] Comprehensive testing
- [ ] Documentation updates
- [ ] User guide for V2 features
- [ ] Switch main workflow to V2

## Key Features in V2 / V2关键特性

### 1. Multi-dimensional Data / 多维度数据
Each material can have data at multiple temperatures from multiple sources:
```json
{
  "data": [
    { "temperature": 0, "source": "DFT", "properties": {...} },
    { "temperature": 300, "source": "DFT", "properties": {...} },
    { "temperature": 0, "source": "DPA-3", "properties": {...} }
  ]
}
```

### 2. Enhanced Properties / 增强属性
- **Lattice Parameters**: a, b, c, α, β, γ, point group
- **Elastic Constants**: Full 6×6 Cij matrix
- **Interstitial Sites**: Multiple sites (dumbbell111, dumbbell100, crowdion111, etc.)

### 3. Composition Format / 组成格式
- Input: `Al2Cu4` (chemical formula)
- Parse to: `{Al: 2, Cu: 4}` (atom counts)
- Display: Al₂Cu₄ (with subscripts)

### 4. POSCAR Support / POSCAR支持
- Upload POSCAR files
- 3D structure visualization
- Download functionality

### 5. Advanced Export / 高级导出
- Select specific materials
- Select specific properties
- Select temperature ranges
- Select data sources
- Multiple formats
- Batch download POSCAR files

## How to Use V2 Tools / 如何使用V2工具

### Convert Data to V2 Format / 转换数据为V2格式

```bash
# From CSV
node scripts/convert-data-v2.js your-data.csv output.json

# Generate template
node scripts/convert-data-v2.js --template my-template.csv

# View help
node scripts/convert-data-v2.js --help
```

### CSV Format Example / CSV格式示例

See [example-template-v2.csv](../example-template-v2.csv) for a complete example.

Key columns:
- `id, name, type, composition` - Basic info
- `poscar` - Path to POSCAR file
- `temperature, source` - Data point metadata
- `density, lattice_*, point_group` - Structure properties
- `specific_heat, mixing_enthalpy, ...` - Thermodynamics
- `youngs_modulus, elastic_constants, ...` - Mechanics
- `vacancy_formation_energy, interstitial_formation_energy_*, ...` - Defects

**Important**: Multiple rows with same ID but different temperature/source will be grouped into one material.

## Testing V2 / 测试V2

Current test data:
- [test-materials-v2.json](../test-materials-v2.json) - 2 materials with multiple temperature/source combinations

To test conversion:
```bash
node scripts/convert-data-v2.js example-template-v2.csv test-output.json
cat test-output.json | jq '.[0]'  # View first material
```

## Timeline / 时间线

- **Phase 1-2**: ✅ Completed (2026-01-08)
- **Phase 3-4**: 🔄 In Progress (Estimated: 3-5 days)
- **Phase 5-6**: 📋 Planned (Estimated: 2-3 days)
- **Phase 7-8**: 📋 Planned (Estimated: 1-2 days)

**Total Estimated Time**: 1-2 weeks for full implementation

## Known Issues / 已知问题

1. ⚠️ Old V1 data format is incompatible with V2 validation
   - Solution: V2 validator only works with V2 format data
   - Need to manually convert or regenerate data in V2 format

2. ⚠️ Current website uses V1 data structure
   - Solution: Parallel V2 development, no impact on current site

## How to Contribute / 如何贡献

If you want to help with V2 development:

1. **Data Preparation**: Convert your data to V2 format using the conversion script
2. **Testing**: Test the conversion script with your data
3. **Feedback**: Report issues or suggestions in GitHub Issues
4. **Documentation**: Help improve documentation

## Questions? / 问题？

- See [IMPLEMENTATION_PLAN_V2.md](IMPLEMENTATION_PLAN_V2.md) for detailed technical plan
- See [DATA_STRUCTURE_V2.md](DATA_STRUCTURE_V2.md) for data structure specification
- Open an issue on GitHub for questions or feedback

---

**Note**: V2 is backward-incompatible with V1. Ensure you understand the new data structure before migrating your data.

**注意**：V2与V1不向后兼容。在迁移数据之前，请确保您理解新的数据结构。

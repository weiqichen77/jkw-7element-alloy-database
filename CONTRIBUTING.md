# Contributing Guide

[English](#english) | [中文](#中文)

---

## English

### Data Preparation and Upload

#### Step 1: Prepare Your Data

Use CSV format with the following structure (see [example-template-v2.csv](example-template-v2.csv) for reference):

**Required Columns:**
- `name` - Material name
- `type` - Material type: element, ss (solid solution), intermetallic, amorphous, interface
- `composition` - Element composition (e.g., Al3Zr3, Fe2Ni1)
- `temperature` - Temperature in Kelvin
- `source` - Data source (e.g., DFT, DPA-1, DPA-3, Experiment)

**Property Columns:**
- `density` - Density (g/cm³)
- `lattice_a`, `lattice_b`, `lattice_c` - Lattice parameters (Å)
- `lattice_alpha`, `lattice_beta`, `lattice_gamma` - Lattice angles (degrees)
- `point_group` - Crystallographic point group
- `specific_heat` - Specific heat capacity (J/kg·K)
- `mixing_enthalpy` - Mixing enthalpy (eV/atom)
- `diffusion_coefficient` - Diffusion coefficient (m²/s)
- `thermal_expansion` - Thermal expansion coefficient (10⁻⁶/K)
- `youngs_modulus` - Young's modulus (GPa)
- `bulk_modulus` - Bulk modulus (GPa)
- `shear_modulus` - Shear modulus (GPa)
- `poissons_ratio` - Poisson's ratio
- `vacancy_formation_energy` - Vacancy formation energy (eV)
- `interstitial_*` - Interstitial formation energies for different configurations

#### Step 2: Convert Data to JSON

```bash
node scripts/convert-data-v2.js your-data.csv backend/data/materials.json
```

#### Step 3: Generate POSCAR Files (Optional)

For 3D structure visualization:

```bash
node scripts/generate-poscar-files.js
```

This creates POSCAR files in `data/poscar/` based on material compositions.

#### Step 4: Commit and Deploy

```bash
git add backend/data/materials.json data/poscar/
git commit -m "Add material data"
git push origin main
```

GitHub Actions will automatically deploy your data to the website.

### Data Format Requirements

**Temperature Values:**
- Use numeric values in Kelvin (e.g., 0, 300, 600, 900)

**Data Sources:**
- Common values: DFT, DPA-1, DPA-3, Experiment
- Use consistent naming across your dataset

**Material Types:**
- `element` - Pure elements
- `ss` - Solid solutions
- `intermetallic` - Intermetallic compounds
- `amorphous` - Amorphous alloys
- `interface` - Interface structures

**Composition Format:**
- Use element symbols with stoichiometry (e.g., Al3Zr3, Cu2Nb1Co1)
- No spaces or special characters

### Updating Data

To update existing data or add new materials:

1. Edit your CSV source file
2. Re-run the conversion script
3. Commit and push the updated JSON file
4. Wait for automatic deployment (1-2 minutes)

### Troubleshooting

**Validation Errors:**
- Check that all required columns are present
- Verify material type is one of: element, ss, intermetallic, amorphous, interface
- Ensure temperature and source values are consistent

**Deployment Issues:**
- Check the Actions tab on GitHub for workflow status
- Verify files were pushed to the main branch
- Clear browser cache (Ctrl+Shift+R) to see updates

**Data Not Displaying:**
- Verify JSON syntax is valid
- Check browser console for errors
- Ensure data structure matches the schema in [docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md)

---

## 中文

### 数据准备与上传

#### 步骤 1: 准备数据

使用CSV格式，结构如下（参见 [example-template-v2.csv](example-template-v2.csv)）：

**必填列：**
- `name` - 材料名称
- `type` - 材料类型：element（单质）、ss（固溶体）、intermetallic（金属间化合物）、amorphous（非晶）、interface（界面）
- `composition` - 元素组成（如 Al3Zr3、Fe2Ni1）
- `temperature` - 温度（开尔文）
- `source` - 数据来源（如 DFT、DPA-1、DPA-3、Experiment）

**性质列：**
- `density` - 密度（g/cm³）
- `lattice_a`, `lattice_b`, `lattice_c` - 晶格参数（Å）
- `lattice_alpha`, `lattice_beta`, `lattice_gamma` - 晶格角度（度）
- `point_group` - 晶体点群
- `specific_heat` - 比热容（J/kg·K）
- `mixing_enthalpy` - 混合焓（eV/atom）
- `diffusion_coefficient` - 扩散系数（m²/s）
- `thermal_expansion` - 热膨胀系数（10⁻⁶/K）
- `youngs_modulus` - 杨氏模量（GPa）
- `bulk_modulus` - 体积模量（GPa）
- `shear_modulus` - 剪切模量（GPa）
- `poissons_ratio` - 泊松比
- `vacancy_formation_energy` - 空位形成能（eV）
- `interstitial_*` - 不同构型的间隙形成能

#### 步骤 2: 转换数据为JSON

```bash
node scripts/convert-data-v2.js your-data.csv backend/data/materials.json
```

#### 步骤 3: 生成POSCAR文件（可选）

用于3D结构可视化：

```bash
node scripts/generate-poscar-files.js
```

这将在 `data/poscar/` 中根据材料组成创建POSCAR文件。

#### 步骤 4: 提交并部署

```bash
git add backend/data/materials.json data/poscar/
git commit -m "Add material data"
git push origin main
```

GitHub Actions将自动部署数据到网站。

### 数据格式要求

**温度值：**
- 使用开尔文数值（如 0、300、600、900）

**数据来源：**
- 常用值：DFT、DPA-1、DPA-3、Experiment
- 在数据集中使用一致的命名

**材料类型：**
- `element` - 纯元素
- `ss` - 固溶体
- `intermetallic` - 金属间化合物
- `amorphous` - 非晶合金
- `interface` - 界面结构

**组成格式：**
- 使用元素符号加化学计量（如 Al3Zr3、Cu2Nb1Co1）
- 不含空格或特殊字符

### 更新数据

更新现有数据或添加新材料：

1. 编辑CSV源文件
2. 重新运行转换脚本
3. 提交并推送更新的JSON文件
4. 等待自动部署（1-2分钟）

### 故障排除

**验证错误：**
- 检查所有必填列是否存在
- 验证材料类型是否为：element、ss、intermetallic、amorphous、interface
- 确保温度和来源值一致

**部署问题：**
- 检查GitHub上的Actions标签查看工作流状态
- 验证文件是否已推送到主分支
- 清除浏览器缓存（Ctrl+Shift+R）以查看更新

**数据未显示：**
- 验证JSON语法有效
- 检查浏览器控制台错误
- 确保数据结构匹配 [docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) 中的架构

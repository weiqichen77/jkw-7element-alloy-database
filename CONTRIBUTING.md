# Contributing Guide / 贡献指南

[English](#english) | [中文](#中文)

---

## English

### Data Preparation and Upload

This guide explains how to prepare and upload your material data to the database.

#### Step 1: Prepare Your Data

You can provide data in any of the following formats:
- CSV (Comma-separated values)
- JSON (JavaScript Object Notation)
- TSV (Tab-separated values)

**Required Fields:**
- `name` - Material name (string)
- `type` - Material type: `crystalline`, `amorphous`, or `interface`
- `elements` - Array of element symbols (primary system: Al, Ni, Cu, Zr, Nb, Ta, W; other elements are also supported)

**Optional Fields:**
- `density` - Material density in g/cm³
- **Structure properties:**
  - `structure.latticeConstants` - Lattice parameters (object with a, b, c values)
  - `structure.rdf` - Radial distribution function data (URL or array)
- **Thermodynamics properties:**
  - `thermodynamics.specificHeat` - Specific heat capacity (J/kg·K)
  - `thermodynamics.mixingEnthalpy` - Mixing enthalpy (kJ/mol)
  - `thermodynamics.diffusionCoefficient` - Diffusion coefficient (m²/s)
  - `thermodynamics.thermalExpansion` - Thermal expansion coefficient (10⁻⁶/K)
- **Mechanics properties:**
  - `mechanics.elasticConstants` - Elastic constants (object)
  - `mechanics.stressStrain` - Stress-strain curve data (URL or array)
  - `mechanics.youngsModulus` - Young's modulus (GPa)
  - `mechanics.poissonsRatio` - Poisson's ratio
- **Defects properties:**
  - `defects.vacancyFormationEnergy` - Vacancy formation energy (eV)
  - `defects.interstitialFormationEnergy` - Interstitial formation energy (eV)
  - `defects.stackingFaultEnergy` - Stacking fault energy (mJ/m²)

#### Step 2: Generate a Template (Optional)

Generate a CSV template to see the exact format:

```bash
node scripts/convert-data.js --template my-template.csv
```

#### Step 3: Convert Your Data

Use the conversion script to validate and convert your data:

```bash
node scripts/convert-data.js your-data.csv real-data/materials.json
```

The script will:
- Validate all required fields
- Check for invalid element symbols
- Normalize the data structure
- Generate the standardized materials.json file

**Example CSV format:**

```csv
name,type,elements,density,thermodynamics.specificHeat,mechanics.youngsModulus
AlNiCu-001,crystalline,"[Al,Ni,Cu]",8.5,450,180
AlZr-Glass,amorphous,"[Al,Zr]",6.2,380,95
```

**Example JSON format:**

```json
[
  {
    "name": "AlNiCu-001",
    "type": "crystalline",
    "elements": ["Al", "Ni", "Cu"],
    "density": 8.5,
    "thermodynamics": {
      "specificHeat": 450
    },
    "mechanics": {
      "youngsModulus": 180
    }
  }
]
```

#### Step 4: Review the Output

Open `real-data/materials.json` and verify:
- All materials are present
- Data values are correct
- No validation errors were reported

#### Step 5: Upload and Deploy

Commit and push your changes:

```bash
git add real-data/materials.json
git commit -m "Add real material data"
git push origin main
```

The GitHub Actions workflow will:
1. Detect the presence of real data
2. Skip sample data generation
3. Deploy your real data to the website
4. Make it available at: https://wqchen007.github.io/jkw-7element-alloy-database/

#### Step 6: Verify Deployment

Wait 1-2 minutes for deployment to complete, then visit the website to verify your data is displayed correctly.

### Updating Data

To update existing data or add new materials:

1. Edit your source data file (CSV, JSON, etc.)
2. Re-run the conversion script
3. Commit and push the updated `real-data/materials.json`
4. Wait for automatic deployment

### Troubleshooting

**Validation errors:**
- Check that all required fields are present (name, type, elements)
- Ensure material type is one of: crystalline, amorphous, interface
- Verify elements array is not empty

**Warnings about elements:**
- If using elements outside the primary system (Al, Ni, Cu, Zr, Nb, Ta, W), you will see a warning
- This is informational only - conversion will still succeed
- Non-primary elements are fully supported

**Deployment not updating:**
- Check the Actions tab on GitHub for workflow status
- Verify that `real-data/materials.json` was pushed to the main branch
- Clear browser cache and refresh the page

**Data not displaying correctly:**
- Verify JSON syntax is valid
- Check browser console for JavaScript errors
- Ensure data structure matches the schema

---

## 中文

### 数据准备与上传

本指南说明如何准备并上传材料数据到数据库。

#### 步骤 1: 准备数据

您可以使用以下任一格式提供数据：
- CSV（逗号分隔值）
- JSON（JavaScript对象表示法）
- TSV（制表符分隔值）

**必填字段：**
- `name` - 材料名称（字符串）
- `type` - 材料类型：`crystalline`（晶体）、`amorphous`（非晶）或 `interface`（界面）
- `elements` - 元素符号数组（主要体系：Al、Ni、Cu、Zr、Nb、Ta、W；同时支持其他元素）

**可选字段：**
- `density` - 材料密度（g/cm³）
- **结构性质：**
  - `structure.latticeConstants` - 晶格常数（包含a、b、c值的对象）
  - `structure.rdf` - 径向分布函数数据（URL或数组）
- **热力学性质：**
  - `thermodynamics.specificHeat` - 比热容（J/kg·K）
  - `thermodynamics.mixingEnthalpy` - 混合焓（kJ/mol）
  - `thermodynamics.diffusionCoefficient` - 扩散系数（m²/s）
  - `thermodynamics.thermalExpansion` - 热膨胀系数（10⁻⁶/K）
- **力学性能：**
  - `mechanics.elasticConstants` - 弹性常数（对象）
  - `mechanics.stressStrain` - 应力-应变曲线数据（URL或数组）
  - `mechanics.youngsModulus` - 杨氏模量（GPa）
  - `mechanics.poissonsRatio` - 泊松比
- **缺陷性质：**
  - `defects.vacancyFormationEnergy` - 空位形成能（eV）
  - `defects.interstitialFormationEnergy` - 间隙形成能（eV）
  - `defects.stackingFaultEnergy` - 层错能（mJ/m²）

#### 步骤 2: 生成模板（可选）

生成CSV模板以查看确切格式：

```bash
node scripts/convert-data.js --template my-template.csv
```

#### 步骤 3: 转换数据

使用转换脚本验证并转换您的数据：

```bash
node scripts/convert-data.js your-data.csv real-data/materials.json
```

脚本将：
- 验证所有必填字段
- 检查无效的元素符号
- 标准化数据结构
- 生成标准格式的materials.json文件

**CSV格式示例：**

```csv
name,type,elements,density,thermodynamics.specificHeat,mechanics.youngsModulus
AlNiCu-001,crystalline,"[Al,Ni,Cu]",8.5,450,180
AlZr-Glass,amorphous,"[Al,Zr]",6.2,380,95
```

**JSON格式示例：**

```json
[
  {
    "name": "AlNiCu-001",
    "type": "crystalline",
    "elements": ["Al", "Ni", "Cu"],
    "density": 8.5,
    "thermodynamics": {
      "specificHeat": 450
    },
    "mechanics": {
      "youngsModulus": 180
    }
  }
]
```

#### 步骤 4: 检查输出

打开 `real-data/materials.json` 并验证：
- 所有材料都存在
- 数据值正确
- 没有报告验证错误

#### 步骤 5: 上传和部署

提交并推送更改：

```bash
git add real-data/materials.json
git commit -m "Add real material data"
git push origin main
```

GitHub Actions工作流将：
1. 检测到真实数据的存在
2. 跳过示例数据生成
3. 将您的真实数据部署到网站
4. 在此网址可访问：https://wqchen007.github.io/jkw-7element-alloy-database/

#### 步骤 6: 验证部署

等待1-2分钟完成部署，然后访问网站验证数据显示正确。

### 更新数据

要更新现有数据或添加新材料：

1. 编辑您的源数据文件（CSV、JSON等）
2. 重新运行转换脚本
3. 提交并推送更新的 `real-data/materials.json`
4. 等待自动部署

### 故障排除

**验证错误：**
- 检查所有必填字段是否存在（name、type、elements）
- 确保材料类型是以下之一：crystalline、amorphous、interface
- 验证元素数组不为空

**元素警告：**
- 如果使用主要体系（Al、Ni、Cu、Zr、Nb、Ta、W）之外的元素，会显示警告信息
- 这仅是提示性质 - 转换仍会成功完成
- 完全支持非主要元素

**部署未更新：**
- 检查GitHub上的Actions选项卡查看工作流状态
- 验证 `real-data/materials.json` 已推送到main分支
- 清除浏览器缓存并刷新页面

**数据显示不正确：**
- 验证JSON语法是否有效
- 检查浏览器控制台是否有JavaScript错误
- 确保数据结构符合架构

---

## Data Schema / 数据架构

Complete JSON schema example / 完整JSON架构示例：

```json
{
  "id": "material-1",
  "name": "Material Name",
  "type": "crystalline",
  "elements": ["Al", "Ni", "Cu"],
  "density": 8.5,
  "structure": {
    "latticeConstants": {"a": 3.6, "b": 3.6, "c": 3.6},
    "rdf": "url-or-array"
  },
  "thermodynamics": {
    "specificHeat": 450,
    "mixingEnthalpy": -25,
    "diffusionCoefficient": 1.2e-15,
    "thermalExpansion": 12.5
  },
  "mechanics": {
    "elasticConstants": {"C11": 200, "C12": 150},
    "stressStrain": "url-or-array",
    "youngsModulus": 180,
    "poissonsRatio": 0.33
  },
  "defects": {
    "vacancyFormationEnergy": 1.2,
    "interstitialFormationEnergy": 2.1,
    "stackingFaultEnergy": 120
  }
}
```

# 7-Element Alloy Materials Database V2 / 七元合金材料数据库 V2

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://wqchen007.github.io/jkw-7element-alloy-database/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![V2 Status](https://img.shields.io/badge/V2-Complete-brightgreen)](docs/V2_USER_GUIDE.md)

[English](#english) | [中文](#中文)

> **🎉 V2 Released!**: Major upgrade complete with 7 core features including multi-temperature/multi-source data, 3D POSCAR visualization, and advanced export system. See [V2 User Guide](docs/V2_USER_GUIDE.md) for details.

---

## English

### Overview

A comprehensive, next-generation materials database for alloy systems with multi-dimensional data support. Primary focus on 7-element combinations (Al, Ni, Cu, Zr, Nb, Ta, W), extensible to other elements.

**Primary Element System:** Al, Ni, Cu, Zr, Nb, Ta, W

**V2 New Features:**
- 🏷️ **6 Material Types**: Element, Solid Solution, Intermetallic, Amorphous, Interface
- 🌡️ **Multi-temperature Data**: Support any temperature (0K, 300K, etc.)
- 📊 **Multiple Data Sources**: DFT, DPA-1, DPA-3, and more
- 🔬 **3D POSCAR Visualization**: Interactive atomic structure viewer with 3Dmol.js
- 📥 **Advanced Export**: JSON (complete) and CSV (flattened) with selective export
- 📈 **Enhanced Statistics**: Material count + data point count
- 🔄 **Expandable Rows**: View all temperature/source combinations in tables

### Access

**Live Website:** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

**V2 Features:**
- Material type classification (6 types)
- Element composition search (e.g., "Al2Cu4" shows Al₂Cu₄)
- Expandable table rows for multi-dimensional data
- Detail page with data source selector
- 3D structure visualization (POSCAR/VASP format)
- Data export (JSON/CSV) with filtering options
- Bilingual interface (English/Chinese)

### Material Properties

**Structure:**
- Lattice constants
- Radial distribution function (RDF)

**Thermodynamics:**
- Specific heat capacity
- Mixing enthalpy
- Diffusion coefficient
- Thermal expansion coefficient

**Mechanics:**
- Elastic constants
- Stress-strain curves
- Young's modulus
- Poisson's ratio

**Defects:**
- Vacancy formation energy
- Interstitial formation energy
- Stacking fault energy

### Quick Start

**View Online:**
Visit [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

**Add Your Data (V2 Format):**

1. Prepare data in CSV format (see [example-template-v2.csv](example-template-v2.csv))
2. Convert to V2 JSON format:
   ```bash
   node scripts/convert-data-v2.js your-data.csv backend/data/materials.json
   ```
3. Commit and push:
   ```bash
   git add backend/data/materials.json
   git commit -m "Add V2 material data"
   git push origin main
   ```
4. Website updates automatically via GitHub Actions

See [V2 User Guide](docs/V2_USER_GUIDE.md) for detailed usage instructions.

### Local Development

```bash
# Clone repository
git clone https://github.com/wqchen007/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# Generate sample data (V1 format - deprecated)
node scripts/generate-sample-data.js

# Convert V2 format data (recommended)
node scripts/convert-data-v2.js example-template-v2.csv backend/data/materials.json

# Serve locally
python -m http.server 8000

# Open browser
open http://localhost:8000/frontend/
```

### V2 Documentation

See comprehensive V2 documentation:
- 📖 [V2 User Guide](docs/V2_USER_GUIDE.md) - Complete usage guide with examples
- ✅ [Testing Checklist](docs/TESTING_CHECKLIST.md) - 150+ test items
- 📊 [V2 Progress Summary](V2_PROGRESS_SUMMARY.md) - Implementation summary  
- 🔧 [V2 Implementation Plan](docs/IMPLEMENTATION_PLAN_V2.md) - Technical details (COMPLETED)
- 📐 [V2 Data Structure](docs/DATA_STRUCTURE_V2.md) - Complete data schema

**V2 Key Features:**
- 🌡️ Multi-temperature/multi-source data support
- 🔬 Interactive 3D POSCAR visualization (3Dmol.js)
- 📥 Advanced export system (JSON + CSV)
- 🏷️ 6 material type categories
- 📈 Enhanced statistics
- 🌐 Full bilingual support

```bash
# Convert data to V2 format
node scripts/convert-data-v2.js your-data.csv output.json

# Generate V2 template
node scripts/convert-data-v2.js --template my-template.csv
```

### Project Structure

```
├── backend/
│   └── data/
│       └── materials.json        # Auto-generated from real or sample data
├── frontend/
│   ├── index.html                # Main web interface
│   ├── css/style.css             # Styling
│   └── js/app.js                 # Application logic
├── scripts/
│   ├── convert-data.js           # Data conversion tool
│   └── generate-sample-data.js   # Sample data generator
├── real-data/
│   └── materials.json            # Place real data here (optional)
├── docs/
│   ├── API.md                    # API documentation
│   └── DATA_STRUCTURE.md         # Data schema reference
└── CONTRIBUTING.md               # Data upload guide
```

### Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for data preparation and upload instructions.


---

## 中文

### 概述

下一代合金材料综合数据库，支持多维数据。主要关注七元组合（Al、Ni、Cu、Zr、Nb、Ta、W），可扩展至其他元素。

**主要元素体系：** Al、Ni、Cu、Zr、Nb、Ta、W

**V2 新功能：**
- 🏷️ **6种材料类型**：单质、固溶体、金属间化合物、非晶、界面
- 🌡️ **多温度数据**：支持任意温度（0K、300K等）
- 📊 **多数据来源**：DFT、DPA-1、DPA-3等
- 🔬 **3D POSCAR可视化**：基于3Dmol.js的交互式原子结构查看器
- 📥 **高级导出**：JSON（完整）和CSV（扁平化），支持选择性导出
- 📈 **增强统计**：材料数量 + 数据点数量
- 🔄 **可展开行**：表格中查看所有温度/来源组合

### 访问

**在线网站：** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

**V2 功能特性：**
- 材料类型分类（6种类型）
- 元素组成搜索（如"Al2Cu4"显示为Al₂Cu₄）
- 可展开表格行显示多维数据
- 详情页数据源选择器
- 3D结构可视化（POSCAR/VASP格式）
- 数据导出（JSON/CSV）与筛选选项
- 双语界面（中文/英文）

### 材料性质

**结构性质：**
- 晶格常数
- 径向分布函数（RDF）

**热力学性质：**
- 比热容
- 混合焓
- 扩散系数
- 热膨胀系数

**力学性能：**
- 弹性常数
- 应力-应变曲线
- 杨氏模量
- 泊松比

**缺陷性质：**
- 空位形成能
- 间隙形成能
- 层错能

### 快速开始

**在线查看：**
访问 [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

**添加数据：**

1. 准备CSV、JSON或TSV格式的数据
2. 转换为标准格式：
   ```bash
   node scripts/convert-data.js your-data.csv real-data/materials.json
   ```
3. 提交并推送：
   ```bash
   git add real-data/materials.json
   git commit -m "Add material data"
   git push origin main
   ```
4. GitHub Actions自动更新网站

详细说明请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/wqchen007/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# 生成示例数据
node scripts/generate-sample-data.js

# 本地运行
python -m http.server 8000

# 打开浏览器
open http://localhost:8000/frontend/
```

### 项目结构

```
├── backend/
│   └── data/
│       └── materials.json        # 从真实数据或示例数据自动生成
├── frontend/
│   ├── index.html                # 主网页界面
│   ├── css/style.css             # 样式表
│   └── js/app.js                 # 应用逻辑
├── scripts/
│   ├── convert-data.js           # 数据转换工具
│   └── generate-sample-data.js   # 示例数据生成器
├── real-data/
│   └── materials.json            # 放置真实数据（可选）
├── docs/
│   ├── API.md                    # API文档
│   └── DATA_STRUCTURE.md         # 数据架构参考
└── CONTRIBUTING.md               # 数据上传指南
```

### 贡献

欢迎贡献。数据准备和上传说明请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。


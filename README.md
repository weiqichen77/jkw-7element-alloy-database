# 7-Element Alloy Materials Database

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://weiqichen77.github.io/jkw-7element-alloy-database/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](#english) | [中文](#中文)

---

## English

### Overview

A comprehensive materials database for multi-principal element alloys with multi-dimensional data support. Primary focus on 7-element combinations (Al, Ni, Cu, Zr, Nb, Ta, W), extensible to other elements.

**Live Demo:** [https://weiqichen77.github.io/jkw-7element-alloy-database/](https://weiqichen77.github.io/jkw-7element-alloy-database/)

### 📚 Documentation

**📖 [User Guide](USER_GUIDE_EN.md)** - Complete guide for database users

Quick navigation to what you need:
- 💾 **Database Contents** - What materials and properties are included
- 🔍 **Data Query** - How to search and export data via web interface
- 📤 **Data Upload** - How to contribute new material data
- 📋 **Data Structure** - Format specifications and field definitions

**📂 Technical Documentation** (in `docs/` folder)
- [API.md](docs/API.md) - API interface documentation
- [DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) - Detailed data schema
- [DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md) - File organization guide

**⚙️ Administrator Documentation** (in `admin/` folder)
- [DEPLOYMENT_GUIDE.md](admin/DEPLOYMENT_GUIDE.md) - Deployment instructions
- [SCRIPTS_REFERENCE.md](admin/SCRIPTS_REFERENCE.md) - Scripts reference
- [DATA_UPDATE_GUIDE.md](admin/DATA_UPDATE_GUIDE.md) - Data update procedures

### Key Features

- **Material Classification**: Element, Solid Solution, Intermetallic, Amorphous, Interface
- **Multi-dimensional Data**: Multiple temperatures and data sources per material
- **Property Categories**: Structure, Thermodynamics, Mechanics, Defects
- **3D Visualization**: Interactive atomic structure viewer (POSCAR/VASP format)
- **Advanced Export**: JSON (complete) and CSV (flattened) with selective filtering
- **Bilingual Interface**: English and Chinese support
- **Data Statistics**: Real-time material and data point counting

### Material Properties

**Structure**
- Density
- Lattice parameters
- Radial distribution function (RDF)

**Thermodynamics**
- Specific heat capacity
- Mixing enthalpy
- Diffusion coefficient
- Thermal expansion coefficient

**Mechanics**
- Young's modulus
- Bulk modulus
- Shear modulus
- Poisson's ratio
- Elastic constants (Cij matrix)
- Stress-strain curves

**Defects**
- Vacancy formation energy
- Interstitial formation energy (multiple configurations)

### Quick Start

**View Online**

Visit the live website: [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

**Add Your Data**

1. Prepare data in CSV format (see [example-template-v2.csv](example-template-v2.csv))
2. Convert to JSON format:
   ```bash
   node scripts/convert-data-v2.js your-data.csv backend/data/materials.json
   ```
3. Commit and push:
   ```bash
   git add backend/data/materials.json data/intermetallic/ data/solid-solution/
   git commit -m "Add material data"
   git push origin main
   ```
4. Website updates automatically via GitHub Actions

### Example Data Format

See [USER_GUIDE.md](USER_GUIDE.md) for complete data format documentation.

### Local Development

```bash
# Clone repository
git clone https://github.com/weiqichen77/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# Convert data to V2 format
node scripts/convert-data-v2.js example-template-v2.csv backend/data/materials.json

# Generate POSCAR files (optional)
node scripts/generate-poscar-files.js

# Serve locally
python -m http.server 8000

# Open browser
open http://localhost:8000/frontend/
```

### Project Structure

```
├── backend/
│   ├── api/
│   │   └── materials.js          # API endpoint
│   └── data/
│       ├── materials.json         # Material database
│       ├── poscar/                # POSCAR structure files
│       ├── rdf/                   # RDF data files
│       └── stress-strain/         # Stress-strain curves
├── frontend/
│   ├── index.html                 # Main interface
│   ├── css/style.css              # Styling
│   └── js/app.js                  # Application logic
├── scripts/
│   ├── convert-data-v2.js         # Data conversion tool
│   ├── generate-poscar-files.js   # POSCAR generator
│   └── add-chart-data.js          # Chart data helper
├── data/
│   ├── materials.json             # Production data (optional)
│   └── poscar/                    # POSCAR files (70+ structures)
└── docs/
    ├── API.md                     # API documentation
    ├── DATA_STRUCTURE_V2.md       # Data schema reference
    ├── V2_USER_GUIDE.md           # User guide
    └── IMPLEMENTATION_PLAN_V2.md  # Technical details
```

### Data Format

The database uses a hierarchical JSON format with multi-temperature and multi-source support:

```json
{
  "name": "Al3Zr3-intermetallic",
  "source": "mp-xxxxx",
  "type": "intermetallic",
  "composition": "Al3Zr3",
  "elements": ["Al", "Zr"],
  "atomCount": {"Al": 3, "Zr": 3},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",
      "properties": {
        "structure": { "density": 6.87, "latticeParameters": {...}, "rdf": [[...]] },
        "thermodynamics": { "mixingEnthalpy": 0.61, ... },
        "mechanics": { "youngsModulus": 140.22, "stressStrain": [[...]], ... },
        "defects": { "vacancyFormationEnergy": 1.33, ... }
      }
    }
  ]
}
```

See [docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) for complete schema.

### Documentation

- [V2 User Guide](docs/V2_USER_GUIDE.md) - Complete usage guide
- [Data Structure](docs/DATA_STRUCTURE_V2.md) - JSON schema reference
- [API Documentation](docs/API.md) - API endpoints
- [Testing Checklist](docs/TESTING_CHECKLIST.md) - Validation tests
- [Contributing Guide](CONTRIBUTING.md) - Data contribution guidelines

### Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for data preparation and submission guidelines.

### License

MIT License - see [LICENSE](LICENSE) for details.

---

## 中文

### 概述

多主元合金材料综合数据库，支持多维数据。主要关注七元组合（Al、Ni、Cu、Zr、Nb、Ta、W），可扩展至其他元素。

**在线演示：** [https://weiqichen77.github.io/jkw-7element-alloy-database/](https://weiqichen77.github.io/jkw-7element-alloy-database/)

### 主要功能

- **材料分类**：单质、固溶体、金属间化合物、非晶、界面
- **多维数据**：每种材料支持多个温度和数据来源
- **性质分类**：结构、热力学、力学、缺陷
- **3D可视化**：交互式原子结构查看器（POSCAR/VASP格式）
- **高级导出**：JSON（完整）和CSV（扁平化），支持选择性筛选
- **双语界面**：中英文支持
- **数据统计**：实时材料和数据点计数

### 材料性质

**结构性质**
- 密度
- 晶格参数
- 径向分布函数（RDF）

**热力学性质**
- 比热容
- 混合焓
- 扩散系数
- 热膨胀系数

**力学性能**
- 杨氏模量
- 体积模量
- 剪切模量
- 泊松比
- 弹性常数（Cij矩阵）
- 应力-应变曲线

**缺陷性质**
- 空位形成能
- 间隙形成能（多种构型）

### 快速开始

**在线访问**

访问在线网站：[https://weiqichen77.github.io/jkw-7element-alloy-database/](https://weiqichen77.github.io/jkw-7element-alloy-database/)

### 📚 文档

**📖 [用户指南](USER_GUIDE_CN.md)** - 完整的数据库使用指南

Quick navigation to what you need:
- 💾 **数据库内容** - 包含哪些材料和性质
- 🔍 **数据查询** - 如何通过网页界面搜索和导出数据
- 📤 **数据上传** - 如何贡献新的材料数据
- 📋 **数据结构** - 格式规范和字段定义

**📂 技术文档**（`docs/` 目录）
- [API.md](docs/API.md) - API 接口文档
- [DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) - 详细数据架构
- [DIRECTORY_STRUCTURE.md](docs/DIRECTORY_STRUCTURE.md) - 文件组织指南

**⚙️ 管理员文档**（`admin/` 目录）
- [DEPLOYMENT_GUIDE.md](admin/DEPLOYMENT_GUIDE.md) - 部署说明
- [SCRIPTS_REFERENCE.md](admin/SCRIPTS_REFERENCE.md) - 脚本参考
- [DATA_UPDATE_GUIDE.md](admin/DATA_UPDATE_GUIDE.md) - 数据更新流程

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/weiqichen77/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# 转换数据为 V2 格式
node scripts/convert-data-v2.js example-template-v2.csv backend/data/materials.json

# 生成 POSCAR 文件（可选）
node scripts/generate-poscar-files.js

# 本地服务器
python -m http.server 8000

# 打开浏览器
open http://localhost:8000/frontend/
```

### 项目结构

```
├── backend/
│   ├── api/
│   │   └── materials.js          # API 端点
│   └── data/
│       ├── materials.json         # 材料数据库
│       ├── poscar/                # POSCAR 结构文件
│       ├── rdf/                   # RDF 数据文件
│       └── stress-strain/         # 应力-应变曲线
├── frontend/
│   ├── index.html                 # 主界面
│   ├── css/style.css              # 样式表
│   └── js/app.js                  # 应用逻辑
├── scripts/
│   ├── convert-data-v2.js         # 数据转换工具
│   ├── generate-poscar-files.js   # POSCAR 生成器
│   └── add-chart-data.js          # 图表数据助手
├── data/
│   ├── materials.json             # 生产数据（可选）
│   └── poscar/                    # POSCAR 文件（70+个结构）
└── docs/
    ├── API.md                     # API 文档
    ├── DATA_STRUCTURE_V2.md       # 数据结构参考
    ├── V2_USER_GUIDE.md           # 用户指南
    └── IMPLEMENTATION_PLAN_V2.md  # 技术细节
```

### 数据格式

数据库采用分层 JSON 格式，支持多温度和多数据源：

```json
{
  "name": "Al3Zr3-intermetallic",
  "source": "mp-xxxxx",
  "type": "intermetallic",
  "composition": "Al3Zr3",
  "elements": ["Al", "Zr"],
  "atomCount": {"Al": 3, "Zr": 3},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",
      "properties": {
        "structure": { "density": 6.87, "latticeParameters": {...}, "rdf": "data/intermetallic/mp-xxxxx/rdf.dat" },
        "thermodynamics": { "mixingEnthalpy": 0.61, ... },
        "mechanics": { "youngsModulus": 140.22, "stressStrain": "data/intermetallic/mp-xxxxx/stress_strain.dat", ... },
        "defects": { "vacancyFormationEnergy": 1.33, ... }
      }
    }
  ]
}
```

更多信息参见 [数据上传指南](DATA_UPLOAD_GUIDE.md)。

### 贡献

欢迎贡献。具体数据准备和提交指南，请参见 [贡献指南](CONTRIBUTING.md)。

### 许可证

MIT License - 详见 [LICENSE](LICENSE)
3. 提交并推送：
   ```bash
   git add backend/data/materials.json data/intermetallic/ data/solid-solution/
   git commit -m "Add material data"
   git push origin main
   ```
4. GitHub Actions 自动更新网站

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/weiqichen77/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# 转换数据为V2格式
node scripts/convert-data-v2.js example-template-v2.csv backend/data/materials.json

# 生成POSCAR文件（可选）
node scripts/generate-poscar-files.js

# 本地运行
python -m http.server 8000

# 打开浏览器
open http://localhost:8000/frontend/
```

### 项目结构

```
├── backend/
│   ├── api/
│   │   └── materials.js          # API接口
│   └── data/
│       ├── materials.json         # 材料数据库
│       ├── poscar/                # POSCAR结构文件
│       ├── rdf/                   # RDF数据文件
│       └── stress-strain/         # 应力应变曲线
├── frontend/
│   ├── index.html                 # 主界面
│   ├── css/style.css              # 样式表
│   └── js/app.js                  # 应用逻辑
├── scripts/
│   ├── convert-data-v2.js         # 数据转换工具
│   ├── generate-poscar-files.js   # POSCAR生成器
│   └── add-chart-data.js          # 图表数据助手
├── data/
│   ├── materials.json             # 生产数据（可选）
│   └── poscar/                    # POSCAR文件（70+结构）
└── docs/
    ├── API.md                     # API文档
    ├── DATA_STRUCTURE_V2.md       # 数据架构参考
    ├── V2_USER_GUIDE.md           # 用户指南
    └── IMPLEMENTATION_PLAN_V2.md  # 技术细节
```

### 数据格式

数据库使用层次化JSON格式，支持多温度和多数据源：

```json
{
  "name": "Al3Zr3-intermetallic",
  "source": "mp-xxxxx",
  "type": "intermetallic",
  "composition": "Al3Zr3",
  "elements": ["Al", "Zr"],
  "atomCount": {"Al": 3, "Zr": 3},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",
      "properties": {
        "structure": { "density": 6.87, "latticeParameters": {...}, "rdf": [[...]] },
        "thermodynamics": { "mixingEnthalpy": 0.61, ... },
        "mechanics": { "youngsModulus": 140.22, "stressStrain": [[...]], ... },
        "defects": { "vacancyFormationEnergy": 1.33, ... }
      }
    }
  ]
}
```

完整架构参见 [docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md)。

### 文档

- [V2用户指南](docs/V2_USER_GUIDE.md) - 完整使用指南
- [数据结构](docs/DATA_STRUCTURE_V2.md) - JSON架构参考
- [API文档](docs/API.md) - API接口说明
- [测试清单](docs/TESTING_CHECKLIST.md) - 验证测试
- [贡献指南](CONTRIBUTING.md) - 数据贡献指南

### 贡献

欢迎贡献。数据准备和提交指南请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 许可证

MIT许可证 - 详见 [LICENSE](LICENSE)。


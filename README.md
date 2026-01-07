# 7-Element Alloy Materials Database / 七元合金材料数据库

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://wqchen007.github.io/jkw-7element-alloy-database/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](#english) | [中文](#中文)

---

## English

### Overview

A comprehensive materials database for alloy systems, with primary focus on 7-element combinations (Al, Ni, Cu, Zr, Nb, Ta, W), but supporting other elements as well.

**Primary Element System:** Al, Ni, Cu, Zr, Nb, Ta, W

**Note:** The database is designed to be extensible and can accommodate alloys containing other elements beyond the primary 7-element system.

**Material Types:**
- Crystalline
- Amorphous
- Interface

### Access

**Live Website:** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

Features:
- Material classification and filtering
- Property category (structure, thermodynamics, mechanics, defects)
- Search functionality

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

**Add Your Data:**

1. Prepare data in CSV, JSON, or TSV format
2. Convert to standard format:
   ```bash
   node scripts/convert-data.js your-data.csv real-data/materials.json
   ```
3. Commit and push:
   ```bash
   git add real-data/materials.json
   git commit -m "Add material data"
   git push origin main
   ```
4. Website updates automatically via GitHub Actions

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

### Local Development

```bash
# Clone repository
git clone https://github.com/wqchen007/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# Generate sample data
node scripts/generate-sample-data.js

# Serve locally
python -m http.server 8000

# Open browser
open http://localhost:8000/frontend/
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

合金体系的综合材料数据库，主要关注七元组合（Al、Ni、Cu、Zr、Nb、Ta、W），同时支持包含其他元素的合金材料。

**主要元素体系：** Al、Ni、Cu、Zr、Nb、Ta、W

**说明：** 数据库设计具有可扩展性，可以容纳包含主要7元素体系之外其他元素的合金材料。

**材料类型：**
- 晶体（Crystalline）
- 非晶（Amorphous）
- 界面（Interface）

### 访问

**在线网站：** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

功能特性：
- 材料分类与筛选
- 属性类别（结构、热力学、力学、缺陷）
- 搜索功能

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


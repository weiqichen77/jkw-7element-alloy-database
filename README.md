# 7-Element Alloy Materials Database

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://wqchen007.github.io/jkw-7element-alloy-database/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

非晶合金、合金及非晶-晶体界面材料数据库 - 7元素体系

## 🌐 在线访问

**网页版数据库：** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

在线网页提供：
- 🔍 材料数据检索和筛选
- 📊 数据可视化展示
- 📥 数据导出功能
- 📱 响应式界面设计

## 📚 数据集说明

本数据库包含7元素合金体系的材料数据：
- **元素体系**: Al, Ni, Cu, Zr, Nb, Ta, W
- **材料类型**: 非晶态 (amorphous)、晶态 (crystalline)、界面 (interface)
- **数据规模**: 50+ 样例数据（可扩展）

### 数据集结构

| 数据集 | 说明 | 数据量 |
|--------|------|--------|
| backend/data/materials.json | 主数据文件 | 50条 |
| scripts/generate-sample-data.js | 数据生成脚本 | - |

### 数据字段

每条材料数据包含以下字段：
- `id`: 唯一标识符
- `name`: 材料名称
- `type`: 材料类型（amorphous/crystalline/interface）
- `elements`: 元素组成（数组）
- `density`: 密度 (g/cm³)
- `properties`: 材料性能参数
  - `specific_heat`: 比热容 (J/kg·K)

## 🚀 快速开始

### 在线使用

直接访问：[https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

### 本地部署

```bash
# 1. 克隆仓库
git clone https://github.com/wqchen007/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# 2. 生成样例数据
cd scripts
node generate-sample-data.js

# 3. 启动本地服务器
cd ..
python3 -m http.server 8000

# 4. 访问 http://localhost:8000/frontend/
```

## 📁 项目结构

```
jkw-7element-alloy-database/
├── frontend/              # 前端静态页面
│   ├── index.html        # 主页面
│   ├── css/              # 样式文件
│   └── js/               # JavaScript脚本
├── backend/              # 后端API（可选）
│   ├── api/              # Serverless API
│   └── data/             # 数据文件
├── scripts/              # 工具脚本
│   └── generate-sample-data.js
├── docs/                 # 文档
│   └── API.md           # API文档
└── README.md            # 本文件
```

## 🔧 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **后端**: Node.js (可选，用于API)
- **部署**: GitHub Pages (前端), Vercel (后端API)
- **数据格式**: JSON

## 📖 API使用

### 获取所有材料

```bash
GET /api/materials?q=Al&type=amorphous&page=1&per_page=25
```

### 获取单个材料

```bash
GET /api/materials/:id
```

详细API文档见 [docs/API.md](docs/API.md)

## 🤝 贡献

欢迎贡献数据和代码！请查看 [贡献指南](CONTRIBUTING.md)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📮 联系方式

- GitHub Issues: [提交问题](https://github.com/wqchen007/jkw-7element-alloy-database/issues)
- 项目维护者: [@wqchen007](https://github.com/wqchen007)

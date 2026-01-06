```markdown
# 非晶合金 / 合金 / 非晶-晶体界面材料数据库（7-element 模板）

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://wqchen007.github.io/jkw-7element-alloy-database/)
[![Deploy](https://github.com/wqchen007/jkw-7element-alloy-database/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/wqchen007/jkw-7element-alloy-database/actions)

## 🌐 在线访问

**📊 网页版数据库：** [https://wqchen007.github.io/jkw-7element-alloy-database/](https://wqchen007.github.io/jkw-7element-alloy-database/)

> 💡 **首次部署**：请查看 [部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md) 了解如何启用 GitHub Pages

## 📁 项目说明

本仓库为"非晶合金、合金及非晶-晶体界面材料数据库"模板：

- **前端**：静态页面（适合 GitHub Pages）
- **后端**：Vercel 风格 serverless API（api/*.js）
- **样例数据**：backend/data/materials.json（包含 50 条示例）
- **脚本**：scripts/generate-sample-data.js（用于生成样例数据）

## 🚀 快速开始

### 方式一：在线访问（推荐）

1. **合并 scaffold 分支的 PR**
2. **启用 GitHub Pages**（Settings > Pages > Source: GitHub Actions）
3. **访问您的数据库网页**：https://wqchen007.github.io/jkw-7element-alloy-database/

详细步骤请参考：[📖 部署指南](./DEPLOYMENT.md)

### 方式二：本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/wqchen007/jkw-7element-alloy-database.git
cd jkw-7element-alloy-database

# 2. 切换到 scaffold 分支
git checkout scaffold/frontend-backend-structure

# 3. 生成样例数据
cd scripts
node generate-sample-data.js

# 4. 启动本地服务器
cd ..
python3 -m http.server 8000

# 5. 访问 http://localhost:8000/frontend/
```

## 📚 数据集说明

**元素体系**：Al, Ni, Cu, Zr, Nb, Ta, W（7元素）

**材料类型**：
- 非晶态 (amorphous)
- 晶态 (crystalline)  
- 界面 (interface)

**数据字段**：
- `id`: 唯一标识符
- `name`: 材料名称
- `type`: 材料类型
- `elements`: 元素组成
- `density`: 密度 (g/cm³)
- `properties`: 性能参数（比热容等）

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **后端**: Node.js (Serverless API)
- **部署**: GitHub Pages (前端), Vercel (后端)
- **CI/CD**: GitHub Actions

## 📖 文档

- [📋 部署指南](./DEPLOYMENT.md) - GitHub Pages 部署说明
- [📘 API 文档](./docs/API.md) - 后端 API 使用说明  
- [🔧 部署配置](./deploy-guide.md) - Vercel 部署指南

## 🤝 贡献

欢迎贡献数据和代码！

## 📄 许可证

MIT License
```

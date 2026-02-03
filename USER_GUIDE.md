# 7-Element Alloy Materials Database - User Guide
# 7元合金材料数据库 - 用户使用指南

> **Core System**: Al-Ni-Cu-Zr-Nb-Ta-W alloy materials property database  
> **核心体系**：Al-Ni-Cu-Zr-Nb-Ta-W 合金材料性能数据库

---

## 📖 Language Selection / 语言选择

**Choose your preferred language / 选择您的语言：**

| Language | 语言 | Link |
|----------|------|------|
| 🇬🇧 **English** | 英文版 | **[📘 English User Guide](USER_GUIDE_EN.md)** |
| 🇨🇳 **中文** | 中文版 | **[📙 中文用户指南](USER_GUIDE_CN.md)** |

---

## 🚀 Quick Overview / 快速概览

### What's in this database? / 数据库包含什么？

- **Material Types / 材料类型**: Element, Solid Solution, Intermetallic, Amorphous, Interface
- **Property Categories / 性能类别**: Structure, Thermodynamics, Mechanics, Defects
- **Data Sources / 数据来源**: DFT, DPA-1, DPA-3, MD, Experiment
- **Temperature Range / 温度范围**: 0K - 1000K

### Current Scale / 当前规模

```
📊 Total Materials: 123
📈 Total Data Points: 5904
🌡️ Temperature Range: 0K - 1000K
🔬 Data Source Types: 5
```

---

## 🔗 Quick Links / 快速链接

### Documentation / 文档

| Document | Description |
|----------|-------------|
| [📘 English Guide](USER_GUIDE_EN.md) | Complete English user guide |
| [📙 中文指南](USER_GUIDE_CN.md) | 完整中文用户指南 |
| [📖 API Documentation](docs/API.md) | API reference and usage |
| [🏗️ Data Structure](docs/DATA_STRUCTURE_V2.md) | Detailed data format specification |

### Web Interface / 网页界面

**Visit**: https://weiqichen77.github.io/jkw-7element-alloy-database/

Features:
- 🔍 Search and filter materials / 搜索和筛选材料
- 📊 View property data / 查看性能数据
- 🧊 3D structure visualization / 3D结构可视化
- 💾 Export data (JSON/CSV/POSCAR) / 导出数据

---

## 📚 Quick Navigation / 快速导航

| I want to... / 我想要... | English | 中文 |
|---------------------------|---------|------|
| Know what's in the database<br>了解数据库内容 | [EN: Database Contents](USER_GUIDE_EN.md#database-contents) | [CN: 数据库内容](USER_GUIDE_CN.md#数据库内容) |
| Query and use data<br>查询和使用数据 | [EN: Data Query](USER_GUIDE_EN.md#data-query) | [CN: 数据查询](USER_GUIDE_CN.md#数据查询) |
| Upload new data<br>上传新数据 | [EN: Data Upload](USER_GUIDE_EN.md#data-upload) | [CN: 数据上传](USER_GUIDE_CN.md#数据上传) |
| Update existing data<br>更新已有数据 | [EN: Update Data](USER_GUIDE_EN.md#update-existing-data) | [CN: 更新已有数据](USER_GUIDE_CN.md#更新已有数据) |
| View data format<br>查看数据格式 | [EN: Data Structure](USER_GUIDE_EN.md#data-structure) | [CN: 数据结构](USER_GUIDE_CN.md#数据结构) |

---

## 🛠️ For Developers / 开发者资源

### Scripts / 脚本工具

| Script | Purpose / 用途 |
|--------|---------------|
| `check-duplicates.js` | Check for duplicate materials / 检查重复材料 |
| `update-materials.js` | Update existing data / 更新已有数据 |
| `validate-data.js` | Validate JSON format / 验证JSON格式 |
| `convert-data-v2.js` | Convert CSV to JSON / CSV转JSON |

### Update Modes / 更新模式

```bash
# Add new temperature points / 添加新温度点
node scripts/update-materials.js data.json --mode=add-temp

# Add new data sources / 添加新数据源
node scripts/update-materials.js data.json --mode=add-source

# Partial update / 部分更新
node scripts/update-materials.js data.json --mode=partial

# Full replacement / 完全替换
node scripts/update-materials.js data.json --mode=full
```

---

## 📞 Technical Support / 技术支持

- **GitHub Repository**: https://github.com/weiqichen77/jkw-7element-alloy-database
- **Web Interface**: https://weiqichen77.github.io/jkw-7element-alloy-database/
- **Issue Reporting**: [GitHub Issues](https://github.com/weiqichen77/jkw-7element-alloy-database/issues)

---

## 📋 Version Information / 版本信息

- **Current Version / 当前版本**: V2.1
- **Last Updated / 最后更新**: 2026-02-03
- **Material Count / 材料数量**: 123
- **Data Points / 数据点**: 5904

---

**💡 Tip**: For detailed step-by-step instructions, please select your preferred language guide above.  
**💡 提示**：详细的分步说明，请选择上面的语言指南。

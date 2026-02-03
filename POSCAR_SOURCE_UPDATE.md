# POSCAR Source Feature Update (V2.1)

## 更新日期
2026-02-03

## 功能概述

新增 `poscar_source` / `poscarSource` 字段，用于指明POSCAR构型文件的数据来源。当材料有多个数据源（如DFT、DPA-3、DPA-1_251208、DPA-1_260109等）时，可以明确标注POSCAR构型文件是从哪个数据源生成的。

## 使用场景

### 场景1：多数据源，单一POSCAR文件
- 用户上传了一个材料的四组性质信息
- Data source分别为：DFT, DPA-3 final, DPA-1_251208, DPA-1_260109
- POSCAR构型文件是从DFT计算生成的
- 在所有四个data条目中，设置 `poscarSource: "DFT"`
- 网页端会显示："View POSCAR (Source: DFT)"
- 并在Data Sources部分显示每个数据源及其POSCAR来源

### 场景2：实验数据与模拟数据混合
- DFT模拟数据 + 实验测量数据
- POSCAR来自DFT优化的结构
- 实验数据条目也设置 `poscarSource: "DFT"` 表明使用DFT结构作为参考

## 更新内容

### 1. CSV模板更新
**文件**: `example-template-v2.csv`

新增列：
```csv
name,source,type,composition,poscar,temperature,data_source,poscar_source,...
```

`poscar_source` 列位于 `data_source` 和 `density` 之间，用于指定该行数据对应的POSCAR结构来源。

示例数据：
```csv
Al2Cu4-sample,Wang Lab,solid-solution,Al2Cu4,data/poscar/al2cu4.vasp,0,DFT,DFT,7.85,...
Al2Cu4-sample,Wang Lab,solid-solution,Al2Cu4,data/poscar/al2cu4.vasp,0,DPA-3,DFT,7.83,...
Al2Cu4-sample,Wang Lab,solid-solution,Al2Cu4,data/poscar/al2cu4.vasp,300,DFT,DFT,7.82,...
```

### 2. 转换脚本更新
**文件**: `scripts/convert-data-v2.js`

- 读取CSV中的 `poscar_source` 列
- 转换为JSON时添加 `poscarSource` 字段到每个data条目
- 更新模板生成函数，包含新的列

修改位置：
```javascript
// 在 convertToMaterial 函数中
if (row.poscar_source && row.poscar_source !== '') {
  dataPoint.poscarSource = row.poscar_source;
}
```

### 3. JSON数据结构
**文件**: `test-materials-v2.json` (示例数据)

新的数据结构：
```json
{
  "name": "Al2Cu4-sample",
  "poscar": "data/poscar/al2cu4.vasp",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": { ... }
    },
    {
      "temperature": 0,
      "source": "DPA-3",
      "poscarSource": "DFT",
      "properties": { ... }
    }
  ]
}
```

### 4. 前端显示更新
**文件**: 
- `frontend/index.html`
- `_site/index.html`

显示改进：

#### Material Information部分
```
Structure File: View POSCAR (Source: DFT)
```

#### 新增Data Sources部分
显示所有数据源及其POSCAR来源：
```
Data Sources:
├─ 0K - DFT: DFT
├─ 0K - DPA-3: DPA-3 (POSCAR from DFT)
└─ 300K - DFT: DFT
```

代码实现：
```javascript
// 显示POSCAR来源
if (dataEntry.poscarSource) {
  poscarInfo += ` <span style="color: #888; font-size: 11px;">(Source: ${dataEntry.poscarSource})</span>`;
}

// 显示每个数据源的POSCAR来源
material.data.forEach((dataEntry, idx) => {
  const tempLabel = dataEntry.temperature ? `${dataEntry.temperature}K - ${dataEntry.source}` : dataEntry.source;
  let sourceValue = dataEntry.source;
  if (dataEntry.poscarSource && dataEntry.poscarSource !== dataEntry.source) {
    sourceValue += ` <span style="color: #888; font-size: 11px;">(POSCAR from ${dataEntry.poscarSource})</span>`;
  }
  html += `<div class="detail-item"><div class="detail-item-label">${tempLabel}</div><div class="detail-item-value">${sourceValue}</div></div>`;
});
```

### 5. 文档更新

#### DATA_UPLOAD_GUIDE.md
- 添加CSV模板使用说明
- 说明 `poscar_source` 字段的用途
- 添加示例场景

#### docs/DATA_STRUCTURE_V2.md
- 在"Data Array"部分添加 `poscarSource` 字段说明
- 添加JSON Schema示例
- 新增"POSCAR Source Field Usage"章节，包含：
  - 使用场景示例
  - JSON代码示例
  - 网页显示效果说明

## 使用指南

### 准备CSV数据
1. 使用 `example-template-v2.csv` 作为模板
2. 在 `poscar_source` 列中填写POSCAR构型的数据来源
3. 通常与某个 `data_source` 保持一致

### 转换为JSON
```bash
node scripts/convert-data-v2.js your-data.csv output.json
```

### 验证输出
检查生成的JSON文件：
- 每个data条目是否包含 `poscarSource` 字段
- 值是否正确对应到某个数据源

### 上传到网站
```bash
# 合并到主数据文件
cp output.json backend/data/materials.json

# 提交更改
git add backend/data/materials.json
git commit -m "Add materials with POSCAR source information"
git push origin main
```

## 兼容性说明

### 向后兼容
- `poscarSource` 字段是可选的
- 没有此字段的旧数据仍然可以正常显示
- 只有提供了 `poscarSource` 的材料才会显示来源信息

### 数据迁移
不需要修改现有数据，新字段为可选：
- 现有材料不显示POSCAR来源
- 新上传的材料可以选择性地添加该信息

## 测试验证

已测试场景：
1. ✅ CSV转换脚本正确处理 `poscar_source` 列
2. ✅ JSON数据结构正确包含 `poscarSource` 字段
3. ✅ 前端正确显示POSCAR来源信息
4. ✅ 多数据源情况下正确标注差异
5. ✅ 向后兼容，不影响现有数据

测试文件：
- `test-materials-v2.json` - 包含poscarSource示例数据
- `example-template-v2.csv` - 更新的CSV模板

## 相关文件清单

### 修改的文件
1. `example-template-v2.csv` - CSV模板
2. `scripts/convert-data-v2.js` - 转换脚本
3. `test-materials-v2.json` - 示例数据
4. `frontend/index.html` - 前端页面
5. `_site/index.html` - GitHub Pages页面
6. `DATA_UPLOAD_GUIDE.md` - 上传指南
7. `docs/DATA_STRUCTURE_V2.md` - 数据结构文档

### 新增的文件
1. `POSCAR_SOURCE_UPDATE.md` - 本文档（更新说明）

## 注意事项

1. **数据一致性**: 确保 `poscar_source` 的值与某个 `data_source` 匹配
2. **必填性**: `poscar_source` 是可选字段，但建议在多数据源情况下提供
3. **命名规范**: 使用与 `data_source` 相同的命名规范（如 DFT, DPA-3, DPA-1_251208）
4. **显示逻辑**: 只有当 `poscarSource` 与 `source` 不同时，才在数据源列表中显示差异

## 后续工作

可能的改进：
1. 支持为同一材料上传多个POSCAR文件（来自不同数据源）
2. 在可视化界面直接比较不同来源的结构差异
3. 添加POSCAR文件的自动验证（确保与声明的来源一致）

## 问题反馈

如有问题或建议，请联系：
- GitHub Issues: [项目仓库]
- 邮件: [联系邮箱]

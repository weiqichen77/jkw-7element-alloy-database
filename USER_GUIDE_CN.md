# 7元合金材料数据库 - 用户使用指南

> **核心体系**：Al-Ni-Cu-Zr-Nb-Ta-W 合金材料性能数据库

**[🏠 返回主页](README.md)** | [English Version](USER_GUIDE_EN.md)

---

## 📚 快速导航

| 我想要... | 前往 |
|-----------|------|
| 了解数据库内容 | [数据库内容](#数据库内容) |
| 查询和使用数据 | [数据查询](#数据查询) |
| 上传新数据 | [数据上传](#数据上传) |
| 更新已有数据 | [更新已有数据](#更新已有数据) |
| 查看数据格式 | [数据结构](#数据结构) |

---
## 数据查询

### 网页界面查询

访问: **https://weiqichen77.github.io/jkw-7element-alloy-database/**

#### 1. 基础搜索
- **关键词搜索**: 输入材料名称、元素符号、ID
- **示例**: 搜索 "Al-Ni", "mp-bbgt", "Alloy-IM-00001"

#### 2. 筛选功能

**按材料类型筛选**:
- ☐ 全部 (All)
- ☐ 非晶 (Amorphous)
- ☐ 合金-固溶体 (Alloy-Solid Solution)
- ☐ 合金-金属间化合物 (Alloy-Intermetallic)
- ☐ 界面 (Interface)
- ☐ 单质 (Element)

> 选择“全部”时，列表将按上述类型顺序展示，单质排在最后。

**按性质分类筛选**:
- ☐ 结构 (Structure)
- ☐ 热力学 (Thermodynamics)
- ☐ 力学 (Mechanics)
- ☐ 缺陷 (Defects)

#### 3. 查看详细信息

点击材料行展开详细信息，包括：
- 材料基本信息（组成、类型、来源）
- 原子结构 3D 可视化
- 各温度点的性质数据
- POSCAR 文件下载
- RDF、应力-应变曲线数据

#### 4. 数据导出

**支持格式**:
- **JSON**: 完整数据结构
- **CSV**: 表格格式（适合 Excel）
- **POSCAR ZIP**: 批量下载晶体结构文件

**导出选项**:
- 导出全部数据
- 导出筛选后的数据
- 导出选中的材料

### API 接口（开发中）

```javascript
// 获取所有材料
fetch('https://weiqichen77.github.io/jkw-7element-alloy-database/data/materials.json')
  .then(response => response.json())
  .then(data => console.log(data));

// 材料数据结构
{
  "id": "Alloy-IM-00001",
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "elements": ["Nb", "Al"],
  "atomCount": {"Nb": 20, "Al": 10},
  "poscar": "data/intermetallic/mp-bbgt/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": { ... }
    }
  ]
}
```

---

## 数据上传

### 准备数据

#### 方式 1: 使用 CSV 模板（推荐）

1. **下载模板**: `example-template-v2.csv`

2. **填写数据**:
```csv
name,source,type,composition,poscar,poscar_source,temperature,data_source,density,...
Nb20Al10,mp-xxxxx,intermetallic,Nb20Al10,data/intermetallic/mp-xxxxx/POSCAR,DFT relaxation,0,DFT,8.57,...
Nb20Al10,mp-xxxxx,intermetallic,Nb20Al10,data/intermetallic/mp-xxxxx/POSCAR,DFT relaxation,300,DPA-3,8.55,...
```

**必填字段**:
- `name`: 材料名称
- `source`: 数据来源标识（如 mp-xxxxx, custom-001）
- `type`: 材料类型（element, solid-solution, intermetallic, amorphous, interface）
- `composition`: 化学式（如 Al2Cu4Ni1）
- `temperature`: 温度 (K)
- `data_source`: 数据计算方法（DFT, DPA-1, DPA-3, MD, Experiment）

**可选字段**:
- `poscar_source`: POSCAR 结构来源（如 "DFT relaxation", "DPA-1 model", "DPA-3 model", "Experiment"）
  - 若不填写，网页显示时默认为 "DFT relaxation"

> **注意**: CSV 使用下划线命名（如 `point_group`），转换后 JSON 使用驼峰命名（如 `pointGroup`）

3. **转换为 JSON**:
```bash
node scripts/convert-data-v2.js your-data.csv output.json
```

#### 方式 2: 直接编写 JSON

```json
{
  "name": "Nb20Al10",
  "source": "mp-xxxxx",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "elements": ["Nb", "Al"],
  "atomCount": {"Nb": 20, "Al": 10},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "poscar_source": "DFT relaxation",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "structure": {
          "density": 8.57,
          "latticeParameters": {
            "a": 3.52,
            "b": 3.52,
            "c": 3.52,
            "alpha": 90,
            "beta": 90,
            "gamma": 90,
            "pointGroup": "Fm-3m"
          }
        },
        "thermodynamics": {
          "mixingEnthalpy": -0.25
        },
        "mechanics": {
          "youngsModulus": 200,
          "bulkModulus": 160
        },
        "defects": {
          "vacancyFormationEnergy": 1.35
        }
      }
    }
  ]
}
```

**注意**:
- ✅ **不要**包含 `id` 字段（系统自动生成）
- ✅ **可选**：添加 `poscar_source` 字段指定结构来源（如 "DFT relaxation", "DPA-1 model", "DPA-3 model", "Experiment"）
- ✅ 若不指定 `poscar_source`，网页将默认显示 "DFT relaxation"
- ✅ 使用相对路径（从仓库根目录）

### 组织文件

创建材料目录并放置文件：

```bash
# 创建材料目录（含数据源子目录）
# （目录名称 = source 字段值）
mkdir -p data/intermetallic/mp-xxxxx/DFT

# 添加结构文件
cp your_structure.vasp data/intermetallic/mp-xxxxx/DFT/POSCAR

# 添加可选数据文件
cp rdf_data.txt data/intermetallic/mp-xxxxx/DFT/rdf.dat
cp stress_strain.txt data/intermetallic/mp-xxxxx/DFT/stress_strain.dat
```

**目录结构**：
```
data/intermetallic/mp-xxxxx/
└── DFT/                    # 数据来源子目录
    ├── POSCAR              # 晶体结构（DFT弛豫）
    ├── rdf.dat             # 径向分布函数（可选）
    └── stress_strain.dat   # 应力-应变数据（可选）
```

**多数据源支持**（可选）：
```bash
# 如果有来自多个数据源的文件（DFT、DPA-1、DPA-3等）
mkdir -p data/intermetallic/mp-xxxxx/DPA-1
mkdir -p data/intermetallic/mp-xxxxx/DPA-3

cp dpa1_structure.vasp data/intermetallic/mp-xxxxx/DPA-1/POSCAR
cp dpa3_structure.vasp data/intermetallic/mp-xxxxx/DPA-3/POSCAR
```

**支持的数据源目录**：
- `DFT/` - 密度泛函理论计算
- `DPA-1/` - 深度势能模型第一代
- `DPa-3/` - 深度势能模型第三代
- `MD/` - 分子动力学模拟
- `Experiment/` - 实验测量数据

### 验证数据

```bash
# 验证 JSON 格式
node scripts/validate-data.js your-data.json

# 检查重复和已存在的数据
node scripts/check-duplicates.js your-data.json
```

**输出示例**:
```
✅ 没有发现重复数据
新材料数量: 5

或者：

⚠️  Found 2 duplicate materials:
1. Nb20Al10 (ID: Alloy-IM-00001)
   - Source: mp-bbgt
   - Existing data points: 3 (temperatures: 0K, 300K, 600K)
```

### Update Existing Data

If duplicate data is detected, you can choose different update modes:

#### Update Modes

```bash
# 1. Add new temperature points
node scripts/update-materials.js your-data.json --mode=add-temp
```
- Only add data for new temperature points
- Existing temperature data remains unchanged
- **Use case**: Supplement properties at different temperatures

```bash
# 2. Add new data sources
node scripts/update-materials.js your-data.json --mode=add-source
```
- Only add data from new sources (DFT/DPA-1/DPA-3, etc.)
- Existing data sources remain unchanged
- **Use case**: Calculate the same material with different methods

```bash
# 3. Partial update (non-empty fields only)
node scripts/update-materials.js your-data.json --mode=partial
```
- Only update provided non-empty fields
- Empty or omitted fields retain original values
- **Use case**: Correct or supplement partial property data

```bash
# 4. Full replacement (default mode)
node scripts/update-materials.js your-data.json --mode=full
# Or shorthand
node scripts/update-materials.js your-data.json
```
- Completely replace the entire material entry
- Preserve auto-generated ID
- **Use case**: Re-provide complete material data

#### Usage Examples

**Scenario 1: Add new temperature points**
```json
// Only provide data for new temperature points
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "data": [
    {
      "temperature": 900,  // New temperature point
      "source": "DFT",
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js new-temps.json --mode=add-temp
```

**Scenario 2: Add new calculation method data**
```json
// Same temperature, different data source
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",  // New data source
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js dpa3-data.json --mode=add-source
```

**Scenario 3: Correct partial properties**
```json
// Only provide fields to be updated
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "mechanics": {
          "youngsModulus": 205  // Corrected value
          // Other fields remain unchanged
        }
      }
    }
  ]
}
```
```bash
node scripts/update-materials.js corrections.json --mode=partial
```

#### General Options

```bash
# Skip confirmation prompt
node scripts/update-materials.js your-data.json --mode=add-temp --force
```

**Matching Rules**:
- Material matching: `name` + `source` + `type` + `composition`
- Data point matching: `temperature` + `source` (data origin)

**Notes**:
- ✅ Auto-generated IDs always remain unchanged
- ✅ New materials are directly added to the database
- ✅ Manual commit and push required after updates
- ⚠️  Recommended to check data with `check-duplicates.js` first

---

### 验证数据（中文版）

```bash
# 验证 JSON 格式
node scripts/validate-data.js your-data.json

# 检查重复和已存在的数据
node scripts/check-duplicates.js your-data.json
```

**输出示例**:
```
✅ 没有发现重复数据
新材料数量: 5

或者：

⚠️  发现 2 个重复材料：
1. Nb20Al10 (ID: Alloy-IM-00001)
   - 来源: mp-bbgt
   - 已有数据点: 3 (温度: 0K, 300K, 600K)
```

### 更新已存在的数据

如果检测到重复数据，可以选择不同的更新模式：

#### 更新模式

```bash
# 1. 增添新的温度点（默认：完整替换）
node scripts/update-materials.js your-data.json --mode=add-temp
```
- 只添加新温度点的数据
- 已有温度点的数据保持不变
- **适用场景**：为材料补充不同温度下的性质

```bash
# 2. 增添新的数据来源
node scripts/update-materials.js your-data.json --mode=add-source
```
- 只添加新数据源（DFT/DPA-1/DPA-3等）的数据
- 已有数据源的数据保持不变
- **适用场景**：用不同方法计算同一材料

```bash
# 3. 部分更新（只替换非空字段）
node scripts/update-materials.js your-data.json --mode=partial
```
- 只更新提供的非空字段
- 空字段或未提供的字段保留原值
- **适用场景**：修正或补充部分性质数据

```bash
# 4. 完整替换（默认模式）
node scripts/update-materials.js your-data.json --mode=full
# 或简写
node scripts/update-materials.js your-data.json
```
- 完全替换整个材料条目
- 保留自动生成的 ID
- **适用场景**：重新提供材料的完整数据

#### 使用示例

**场景 1：添加新温度点**
```json
// 只需提供新温度点的数据
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "data": [
    {
      "temperature": 900,  // 新温度点
      "source": "DFT",
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js new-temps.json --mode=add-temp
```

**场景 2：添加新计算方法的数据**
```json
// 同一温度，不同数据源
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",  // 新数据源
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js dpa3-data.json --mode=add-source
```

**场景 3：修正部分属性**
```json
// 只提供需要更新的字段
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "mechanics": {
          "youngsModulus": 205  // 修正值
          // 其他字段保持不变
        }
      }
    }
  ]
}
```
```bash
node scripts/update-materials.js corrections.json --mode=partial
```

#### 通用选项

```bash
# 跳过确认提示
node scripts/update-materials.js your-data.json --mode=add-temp --force
```

**匹配规则**:
- 材料匹配：`name` + `source` + `type` + `composition`
- 数据点匹配：`temperature` + `source` (数据来源)

**注意事项**:
- ✅ 自动生成的 ID 始终保持不变
- ✅ 新材料会直接添加到数据库
- ✅ 更新后需手动 commit 和 push
- ⚠️  建议先用 `check-duplicates.js` 检查数据

### 提交数据

#### 方式 1: GitHub Pull Request（推荐）

1. Fork 仓库
2. 添加数据文件和 POSCAR
3. 提交 Pull Request
4. 等待审核和合并

#### 方式 2: 联系管理员

发送数据到: [管理员邮箱]

包含：
- JSON 数据文件
- POSCAR 及其他数据文件
- 数据来源说明

---

## 数据结构

### JSON 格式说明

#### 材料顶层字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| name | String | ✓ | 材料名称 |
| source | String | ✓ | 数据来源 ID（如 mp-xxxxx） |
| type | String | ✓ | 材料类型 |
| composition | String | ✓ | 化学式（如 Al2Cu4） |
| elements | Array | ✓ | 元素列表 ["Al", "Cu"] |
| atomCount | Object | ✓ | 原子数 {"Al": 2, "Cu": 4} |
| poscar | String | ✗ | POSCAR 文件路径 |
| poscar_source | String | ✗ | POSCAR 来源说明（如 "DFT relaxation", "DPA-1 model", "DPA-3 model", "Experiment"） |
| data | Array | ✓ | 性质数据数组 |

**自动生成字段**（不要在输入中包含）:
- `id`: 系统自动分配（格式：Alloy-XX-#####）

#### 数据点结构

```json
{
  "temperature": 300,      // 温度 (K)
  "source": "DFT",         // 数据来源
  "properties": {
    "structure": { ... },
    "thermodynamics": { ... },
    "mechanics": { ... },
    "defects": { ... }
  }
}
```

### 组成符号规则

#### 基础格式
- 元素符号 + 原子数: `Al2Cu4Ni1` → Al₂Cu₄Ni₁

#### 非晶前缀
- 使用 `a-` 前缀: `a-Al2Cu4` → a-Al₂Cu₄

#### 界面符号
- 使用 `/` 分隔两侧: `Al2Cu3/Nb4Ta5` → Al₂Cu₃/Nb₄Ta₅
- 可组合非晶: `a-Al2Cu3/Nb4Ta5` → a-Al₂Cu₃/Nb₄Ta₅

---

## 常见问题

### Q: 如何搜索特定元素的合金？
**A**: 在搜索框输入元素符号（如 "Al"），系统会显示所有包含该元素的材料。

### Q: 数据有版权限制吗？
**A**: 数据主要来自 Materials Project 和研究文献，使用时请注明来源。

### Q: 可以下载整个数据库吗？
**A**: 可以，点击"Export Data"选择"All Data"，导出完整 JSON 或 CSV 文件。

### Q: POSCAR 文件是什么格式？
**A**: VASP POSCAR 格式，包含晶体结构信息。默认为 DFT 弛豫优化后的结构。

### Q: 如何引用此数据库？
**A**: 
```
7-Element Alloy Materials Database (Al-Ni-Cu-Zr-Nb-Ta-W System)
https://weiqichen77.github.io/jkw-7element-alloy-database/
```

### Q: 发现数据错误怎么办？
**A**: 在 GitHub 仓库提交 Issue，或联系管理员。

### Q: 如何更新已有材料的数据？
**A**: 
1. 准备包含更新数据的 JSON 文件
2. 运行 `node scripts/check-duplicates.js your-data.json` 检查哪些材料已存在
3. 根据需求选择更新模式：
   - `--mode=add-temp` - 只添加新温度点
   - `--mode=add-source` - 只添加新数据源
   - `--mode=partial` - 部分更新（非空字段）
   - `--mode=full` - 完整替换（默认）
4. 运行 `node scripts/update-materials.js your-data.json --mode=<模式>`

### Q: 如何为已有材料添加新的温度点数据？
**A**: 使用 `--mode=add-temp` 模式。只需在 JSON 中提供新温度点的数据，已有温度点不受影响。例如：
```bash
node scripts/update-materials.js new-temps.json --mode=add-temp
```

### Q: 如何修正某个属性的错误值？
**A**: 使用 `--mode=partial` 模式。只提供需要修正的字段，其他字段保持原值不变。

---

## 技术支持

- **GitHub 仓库**: https://github.com/weiqichen77/jkw-7element-alloy-database
- **网页界面**: https://weiqichen77.github.io/jkw-7element-alloy-database/
- **问题报告**: GitHub Issues

---

## 版本信息

- **当前版本**: V2.1
- **最后更新**: 2026-02-03
- **材料数量**: 123
- **数据点数**: 5904

---

**快速链接**:
- 📖 [完整 API 文档](docs/API.md)
- 🏗️ [数据结构详细说明](docs/DATA_STRUCTURE_V2.md)
- 📁 [目录结构指南](docs/DIRECTORY_STRUCTURE.md)

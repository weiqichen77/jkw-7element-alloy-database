# V2 数据库使用指南
## V2 User Guide for Alloy Materials Database

*最后更新 / Last Updated: 2026-01-08*

---

## 📖 目录 / Table of Contents

1. [新功能概览 / New Features Overview](#新功能概览)
2. [材料类型分类 / Material Type Classification](#材料类型分类)
3. [元素组成搜索 / Composition Search](#元素组成搜索)
4. [多维度数据查看 / Multi-dimensional Data View](#多维度数据查看)
5. [3D结构可视化 / 3D Structure Visualization](#3d结构可视化)
6. [数据导出 / Data Export](#数据导出)
7. [数据统计 / Statistics](#数据统计)

---

## 新功能概览 / New Features Overview

V2数据库在原有基础上新增了7大核心功能：

The V2 database adds 7 major core features:

### 1. 六种材料类型 / 6 Material Types
- **全部 / All**: 显示所有材料
- **单质 / Element**: 单一元素材料
- **固溶体 / Solid Solution**: 固溶体合金
- **金属间化合物 / Intermetallic**: 金属间化合物
- **非晶 / Amorphous**: 非晶态材料
- **界面 / Interface**: 界面材料

### 2. 元素组成格式 / Composition Format
- 新格式：Al₂Cu₄（带下标）
- New format: Al₂Cu₄ (with subscripts)
- 支持按元素组成搜索
- Search by composition supported

**特殊标记 / Special Notations:**
- 非晶前缀 / Amorphous prefix: `a-Al₂Nb₃`
- 界面分隔 / Interface separator: `Al₂Cu₃/Nb₄Ta₅`
- 组合标记 / Combined: `Al₂Cu₃/a-Nb₄Ta₅`

### 3. 多温度数据 / Multi-temperature Data
- 支持任意温度点：0K, 300K等
- Support for any temperature: 0K, 300K, etc.
- 可展开行查看不同温度数据
- Expandable rows for different temperatures

### 4. 多数据来源 / Multiple Data Sources
- DFT计算数据
- DPA-1模型预测
- DPA-3模型预测
- 其他来源
- Other sources

### 5. POSCAR 3D可视化 / 3D Visualization
- 交互式3D原子结构查看器
- Interactive 3D atomic structure viewer
- 4种显示样式
- 4 display styles
- 旋转、缩放、重置视角
- Rotate, zoom, reset view

### 6. 数据导出 / Data Export
- JSON格式（完整结构）
- JSON format (complete structure)
- CSV格式（扁平化）
- CSV format (flattened)
- 选择性导出
- Selective export

### 7. 增强统计 / Enhanced Statistics
- 材料数量统计
- Material count
- 数据点数量统计
- Data point count

---

## 材料类型分类 / Material Type Classification

### 使用方法 / How to Use

1. 在主界面顶部找到"材料类型"标签页
2. 点击任意类型标签进行筛选
3. 表格会自动更新显示该类型的所有材料

1. Find the "Material Type" tabs at the top of the main interface
2. Click any type tab to filter
3. The table will automatically update to show all materials of that type

### 材料类型说明 / Type Descriptions

| 类型 Type | 中文 | English | 说明 Description |
|-----------|------|---------|------------------|
| all | 全部 | All | 显示所有材料 Show all materials |
| element | 单质 | Element | 单一元素构成 Single element |
| solid-solution | 固溶体 | Solid Solution | 固溶体合金 Solid solution alloy |
| intermetallic | 金属间化合物 | Intermetallic | 金属间化合物 Intermetallic compound |
| amorphous | 非晶 | Amorphous | 非晶态材料 Amorphous material |
| interface | 界面 | Interface | 界面材料 Interface material |

---

## 元素组成搜索 / Composition Search

### 搜索格式 / Search Format

V2支持两种搜索方式：

V2 supports two search methods:

#### 1. 按元素搜索 / Search by Element
```
Al
```
- 搜索包含Al元素的所有材料
- Search for all materials containing Al element

#### 2. 按组成搜索 / Search by Composition
```
Al2Cu4
```
- 精确搜索Al₂Cu₄组成的材料
- Exact search for Al₂Cu₄ composition

### 示例 / Examples

| 搜索词 Search | 结果 Result |
|--------------|-------------|
| `Al` | 所有含Al的材料 All materials with Al |
| `Cu` | 所有含Cu的材料 All materials with Cu |
| `Al2Cu` | 组成为Al₂Cu的材料 Materials with Al₂Cu composition |
| `NiZr` | 组成为NiZr的材料 Materials with NiZr composition |

---

## 多维度数据查看 / Multi-dimensional Data View

### 表格中的可展开行 / Expandable Rows in Tables

#### 如何展开 / How to Expand

1. 在表格的最左侧列，寻找 **▶** 按钮
2. 点击 **▶** 按钮展开该材料的其他温度/来源数据
3. 展开后显示子表格，包含所有数据点
4. 再次点击（现在是 **▼**）可收起

1. Look for the **▶** button in the leftmost column
2. Click **▶** to expand other temperature/source data
3. A sub-table appears with all data points
4. Click again (**▼**) to collapse

#### 数据点标注 / Data Point Labels

主行显示：`值 (0K, DFT)`
- Main row shows: `value (0K, DFT)`

表示这是0K温度下的DFT计算数据
- Indicates this is DFT calculation data at 0K

子表格包含：
- 温度 / Temperature
- 数据来源 / Source
- 对应属性值 / Property values

### 详细信息弹窗中的数据筛选 / Data Filtering in Detail View

#### 双选择器系统 / Dual Selector System

详细信息页面提供两个独立的选择器：
- **温度选择器 / Temperature Selector**: 筛选指定温度的数据
- **来源选择器 / Source Selector**: 筛选指定来源的数据

Detail view provides two independent selectors:
- **Temperature Selector**: Filter data by temperature
- **Source Selector**: Filter data by source

#### 使用方法 / How to Use

1. 点击材料名称打开详细信息
2. 如果有多个数据点，顶部会显示双选择器
3. 两个选择器可以独立使用：
   - 仅选择温度：显示该温度下所有来源的数据
   - 仅选择来源：显示该来源在所有温度下的数据
   - 同时选择：显示特定温度+来源的数据
4. 选择"全部"可以查看所有数据点

1. Click material name to open details
2. If multiple data points exist, dual selectors appear at top
3. Two selectors work independently:
   - Temperature only: Shows all sources at that temperature
   - Source only: Shows all temperatures from that source
   - Both: Shows specific temperature+source combination
4. Select "All" to view all data points

#### 多结果显示 / Multiple Results Display

当筛选结果包含多个数据点时：
- 每个数据点显示在独立的区块中
- 区块标题显示温度和来源
- 可以一次性对比多个数据点

When filter results contain multiple data points:
- Each data point shown in separate section
- Section header shows temperature and source
- Compare multiple data points at once

#### 示例 / Example

```
温度选择 / Temperature: [全部 ▼]     来源选择 / Source: [DFT ▼]
                       [0K]                          [全部]
                       [300K]                        [DPA-3]
```

选择"温度=全部, 来源=DFT"会显示所有温度下DFT计算的数据。

Selecting "Temperature=All, Source=DFT" shows DFT data at all temperatures.

---

## 3D结构可视化 / 3D Structure Visualization

### 查看3D结构 / View 3D Structure

#### 方法1：从详细信息查看 / Method 1: From Detail View

1. 点击材料名称打开详细信息
2. 如果材料有POSCAR文件，会在"结构信息"部分显示3D查看器
3. 3D结构自动加载并显示

1. Click material name to open details
2. If POSCAR exists, 3D viewer appears in "Structure Info" section
3. 3D structure loads automatically

#### 方法2：从表格识别 / Method 2: Identify from Table

- 表格"原子结构"列显示 🔬 图标表示有3D结构数据
- 🔬 icon in "Structure" column indicates 3D data available

### 交互控制 / Interactive Controls

#### 鼠标操作 / Mouse Controls

| 操作 Action | 功能 Function |
|-------------|---------------|
| 左键拖拽 Left drag | 旋转结构 Rotate structure |
| 滚轮 Scroll | 缩放 Zoom in/out |
| 右键拖拽 Right drag | 平移 Pan |

#### 按钮控制 / Button Controls

- **重置视角 / Reset View**: 恢复初始视角
  - Restore initial view
- **切换样式 / Toggle Style**: 切换显示样式
  - Switch display style
  - 球棒模型 → 棒状 → 线状 → 球形
  - Ball-stick → Stick → Line → Sphere
- **下载POSCAR / Download POSCAR**: 下载原子结构文件
  - Download atomic structure file

---

## 数据导出 / Data Export

### 打开导出对话框 / Open Export Dialog

点击搜索栏旁边的 **📥 Export** 按钮

Click the **📥 Export** button next to the search bar

### 导出选项 / Export Options

#### 1. 导出格式 / Export Format

##### JSON
- **优点 Advantages**:
  - 保留完整的V2数据结构
  - Preserves complete V2 data structure
  - 包含所有温度/来源数据点
  - Includes all temperature/source data points
  - 可直接用于程序读取
  - Directly usable for programming
  
- **适用场景 Use Cases**:
  - 数据备份 Data backup
  - 程序接口 Programming interface
  - 完整数据交换 Complete data exchange

##### CSV
- **优点 Advantages**:
  - 可用Excel/Numbers等软件打开
  - Open with Excel/Numbers
  - 扁平化格式，易于浏览
  - Flattened format, easy to browse
  - 每个数据点一行
  - One row per data point
  
- **适用场景 Use Cases**:
  - 数据分析 Data analysis
  - 表格查看 Spreadsheet viewing
  - 统计计算 Statistical calculation

#### 2. 导出范围 / Export Range

##### 全部材料 / All Materials
- 导出数据库中的所有材料
- Export all materials in database

##### 当前筛选结果 / Current Filtered Results
- 导出当前显示的筛选后的材料
- Export currently filtered materials
- 括号中显示材料数量
- Material count shown in parentheses

##### 选择的材料 / Selected Materials
- 勾选特定材料进行导出
- Select specific materials to export
- 可使用搜索框快速查找
- Use search box for quick find

#### 3. 导出属性 / Properties to Export

可选择导出哪些类型的属性：

Select which property types to export:

- ☑ 结构 / Structure
- ☑ 热力学 / Thermodynamics
- ☑ 力学 / Mechanics
- ☑ 缺陷 / Defects

**提示 Tip**: 取消不需要的属性可减小文件大小

Uncheck unnecessary properties to reduce file size

### 导出流程示例 / Export Workflow Example

#### 示例：导出固溶体的力学数据为CSV / Example: Export Mechanics Data of Solid Solutions as CSV

1. 选择"固溶体"类型标签
2. 选择"力学性能"属性分类
3. 点击 **📥 Export** 按钮
4. 选择 **CSV** 格式
5. 选择 **当前筛选结果**
6. 只勾选 **☑ 力学**
7. 点击 **📥 导出**
8. 文件自动下载：`alloy_materials_2026-01-08.csv`

1. Select "Solid Solution" type tab
2. Select "Mechanics" property category
3. Click **📥 Export** button
4. Choose **CSV** format
5. Choose **Current Filtered Results**
6. Check only **☑ Mechanics**
7. Click **📥 Export**
8. File downloads: `alloy_materials_2026-01-08.csv`

---

## 数据统计 / Statistics

### 统计信息位置 / Statistics Location

统计信息显示在表格上方：

Statistics appear above the table:

**中文显示 / Chinese Display:**
```
找到 15 种材料，共 42 条数据
```

**English Display:**
```
Found 15 materials with 42 data points
```

### 统计说明 / Statistics Explanation

#### 材料数 / Material Count
- 不同材料的数量
- Number of distinct materials
- 每种材料算作1个
- Each material counts as 1

#### 数据点数 / Data Point Count
- 所有数据点的总数
- Total number of data points
- 考虑多温度/多来源
- Accounting for multi-temperature/multi-source

#### 示例 / Example

如果有1种材料，包含3个数据点：
- 0K, DFT
- 0K, DPA-3
- 300K, DFT

统计显示：`1 种材料，共 3 条数据`

If 1 material with 3 data points:
- 0K, DFT
- 0K, DPA-3
- 300K, DFT

Shows: `1 material with 3 data points`

---

## 高级技巧 / Advanced Tips

### 1. 组合筛选 / Combined Filtering

可以同时使用类型筛选、属性分类和搜索：

Use type filter, property category, and search together:

```
类型: 金属间化合物
属性: 力学性能
搜索: Al
```
结果：含Al的金属间化合物的力学性能

Result: Mechanical properties of Al-containing intermetallics

### 2. 快速导出当前视图 / Quick Export Current View

1. 设置好筛选条件
2. 点击导出
3. 选择"当前筛选结果"
4. 一键导出看到的数据

1. Set up filter conditions
2. Click export
3. Choose "Current Filtered Results"
4. One-click export visible data

### 3. 比较不同来源数据 / Compare Different Sources

1. 打开材料详情
2. 使用数据源选择器切换
3. 观察DFT vs DPA模型的差异

1. Open material details
2. Switch with data source selector
3. Observe DFT vs DPA model differences

### 4. 3D结构分析 / 3D Structure Analysis

1. 切换到球棒模型看原子位置
2. 切换到棒状模型看键连接
3. 旋转查看不同晶向
4. 下载POSCAR进行进一步分析

1. Switch to ball-stick to see atom positions
2. Switch to stick to see bonding
3. Rotate to view different crystal directions
4. Download POSCAR for further analysis

---

## 常见问题 / FAQ

### Q1: 为什么有些材料没有可展开的数据？
**A**: 只有一个数据点的材料不显示展开按钮。如果材料只有0K DFT数据，不会显示▶按钮。

### Q1: Why don't some materials have expandable data?
**A**: Materials with only one data point don't show the expand button. If a material only has 0K DFT data, no ▶ button appears.

### Q2: 3D结构为什么加载失败？
**A**: 可能原因：
- 材料没有POSCAR文件
- 网络连接问题
- 文件格式错误

### Q2: Why does 3D structure fail to load?
**A**: Possible reasons:
- Material has no POSCAR file
- Network connection issues
- File format errors

### Q3: CSV导出的数据是否包含所有温度？
**A**: 是的！CSV格式会将每个数据点展开为一行，包含所有温度/来源组合。

### Q3: Does CSV export include all temperatures?
**A**: Yes! CSV format expands each data point to a row, including all temperature/source combinations.

### Q4: 如何搜索特定元素比例的材料？
**A**: 直接输入组成，如"Al2Cu"会搜索Al₂Cu组成的材料。注意：数字表示原子数。

### Q4: How to search for materials with specific element ratio?
**A**: Directly enter composition like "Al2Cu" to search for Al₂Cu. Note: numbers represent atom counts.

---

## 技术支持 / Technical Support

- **GitHub Issues**: [提交问题 / Submit Issue](https://github.com/weiqichen77/jkw-7element-alloy-database/issues)
- **文档 / Documentation**: [README.md](https://github.com/weiqichen77/jkw-7element-alloy-database/blob/main/README.md)
- **数据格式 / Data Format**: [DATA_STRUCTURE_V2.md](../docs/DATA_STRUCTURE_V2.md)

---

## 版本历史 / Version History

### V2.0.0 (2026-01-08)
- ✅ 6种材料类型分类
- ✅ 元素组成显示和搜索
- ✅ 多温度/多来源支持
- ✅ POSCAR 3D可视化
- ✅ 数据导出系统
- ✅ 增强统计功能

### V1.0.0 (初始版本 / Initial Release)
- 基础数据库功能
- Basic database features

---

*文档更新时间 / Document updated: 2026-01-08*

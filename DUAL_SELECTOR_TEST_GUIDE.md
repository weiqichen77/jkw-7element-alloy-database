# 双重选择器测试指南 / Dual Selector Test Guide

## 新功能概览 / Feature Overview

本次更新实现了展开行中的温度/来源双重选择器功能，用户可以动态过滤多温度/多来源数据。

This update implements temperature/source dual selectors in expandable rows for dynamic filtering of multi-temperature/multi-source data.

---

## 功能1: 展开行双重选择器 / Expandable Row Dual Selectors

### 功能描述 / Description

在主表格的展开行中添加了温度和来源两个下拉选择器，可以动态过滤显示的数据。

Added temperature and source dropdown selectors in expandable rows for dynamic data filtering.

### 使用方法 / How to Use

1. **打开展开行 / Expand Row**
   - 在主表格中找到有 ▶ 按钮的材料
   - 点击 ▶ 按钮展开子表格
   - Find materials with ▶ button in main table
   - Click ▶ to expand sub-table

2. **使用温度选择器 / Use Temperature Selector**
   - 在展开区域顶部找到"温度/Temperature"下拉框
   - 选择特定温度（如300K）
   - 子表格将只显示该温度下所有来源的数据
   - Find "Temperature" dropdown at top of expanded area
   - Select specific temperature (e.g., 300K)
   - Sub-table shows all sources for that temperature

3. **使用来源选择器 / Use Source Selector**
   - 在展开区域顶部找到"来源/Source"下拉框
   - 选择特定来源（如DPA-3）
   - 子表格将只显示该来源下所有温度的数据
   - Find "Source" dropdown at top of expanded area
   - Select specific source (e.g., DPA-3)
   - Sub-table shows all temperatures for that source

4. **组合过滤 / Combined Filtering**
   - 同时选择温度和来源
   - 子表格将只显示同时满足两个条件的数据
   - Select both temperature and source
   - Sub-table shows only data matching both conditions

5. **重置过滤 / Reset Filter**
   - 选择"全部/All"选项恢复显示所有数据
   - Select "All" option to show all data

### 测试材料 / Test Materials

推荐使用以下材料测试（有多个温度/来源数据）：

Recommended materials for testing (with multiple temperature/source data):

- **ID: 1 - Al3Zr3-intermetallic**
  - 温度: 0K, 300K, 600K, 900K
  - 来源: DPA-3, EXP-1

- **ID: 2 - Fe3Co4-ss**
  - 温度: 0K, 300K
  - 来源: DPA-3, ML-2

- **ID: 104 - Mn-MgS**
  - 温度: 300K
  - 来源: TEST
  - 包含POSCAR文件用于测试3D结构查看

### 预期行为 / Expected Behavior

**场景1: 选择温度 = 300K**
- 显示所有300K温度下的数据点
- 包含不同来源（DPA-3, EXP-1, ML-2等）
- Shows all data points at 300K
- Includes different sources

**场景2: 选择来源 = DPA-3**
- 显示DPA-3来源下所有温度的数据
- 包含0K, 300K, 600K等
- Shows all temperatures for DPA-3
- Includes 0K, 300K, 600K, etc.

**场景3: 选择温度 = 300K + 来源 = DPA-3**
- 仅显示300K温度且来源为DPA-3的数据点
- 其他行被隐藏
- Shows only 300K data from DPA-3
- Other rows are hidden

**场景4: 选择全部**
- 恢复显示所有数据点（包括主表格中的primary数据）
- Reset to show all data points

---

## 功能2: POSCAR文件路径修复 / POSCAR Path Fix

### 问题修复 / Issue Fixed

之前POSCAR文件位于 `real-data/poscar/` 但材料数据中引用的是 `data/poscar/`，导致：
- 🔬 图标点击无反应
- 批量下载的ZIP文件为空

Previously POSCAR files were in `real-data/poscar/` but referenced as `data/poscar/`, causing:
- 🔬 icon not working
- Empty ZIP file when batch downloading

### 解决方案 / Solution

复制POSCAR文件到 `backend/data/poscar/` 目录，使其与URL路径一致。

Copied POSCAR files to `backend/data/poscar/` to match URL paths.

### 测试步骤 / Test Steps

1. **测试3D结构查看 / Test 3D Structure Viewing**
   - 选择"Structure"属性类别
   - 展开ID 104 (Mn-MgS)材料
   - 点击🔬图标
   - 应该打开详细弹窗并显示3D结构（412个原子）
   - Select "Structure" property category
   - Expand ID 104 (Mn-MgS) material
   - Click 🔬 icon
   - Should open detail modal showing 3D structure (412 atoms)

2. **测试批量POSCAR下载 / Test Batch POSCAR Download**
   - 点击顶部"Export"按钮
   - 选择"All materials"或筛选特定材料
   - 点击"🔬 Download POSCAR (ZIP)"
   - 应该下载包含.vasp文件的ZIP压缩包
   - Click "Export" button at top
   - Select "All materials" or filter specific materials
   - Click "🔬 Download POSCAR (ZIP)"
   - Should download ZIP file containing .vasp files

---

## 技术实现细节 / Technical Implementation

### 1. 数据收集 / Data Collection

```javascript
// 收集所有数据点（包括primary）
const allDataPoints = [primary, ...secondary];

// 提取唯一的温度和来源
const temperatures = [...new Set(allDataPoints.map(d => d.temperature))].sort((a, b) => a - b);
const sources = [...new Set(allDataPoints.map(d => d.source))].sort();
```

### 2. 选择器HTML生成 / Selector HTML Generation

```html
<div class="expanded-selectors">
  <div class="selector-group">
    <label>Temperature:</label>
    <select class="expanded-temp-select" onchange="filterExpandedRows(this, 'structure', materialId)">
      <option value="all">All</option>
      <option value="0">0K</option>
      <option value="300">300K</option>
      ...
    </select>
  </div>
  <div class="selector-group">
    <label>Source:</label>
    <select class="expanded-source-select" onchange="filterExpandedRows(this, 'structure', materialId)">
      <option value="all">All</option>
      <option value="DPA-3">DPA-3</option>
      ...
    </select>
  </div>
</div>
```

### 3. 过滤函数 / Filter Function

```javascript
window.filterExpandedRows = function(selectElement, tableType, materialId) {
  const expandedRow = selectElement.closest('.expanded-content');
  const tempSelect = expandedRow.querySelector('.expanded-temp-select');
  const sourceSelect = expandedRow.querySelector('.expanded-source-select');
  const table = expandedRow.querySelector('.sub-table[data-material-id="' + materialId + '"]');
  
  const selectedTemp = tempSelect.value;
  const selectedSource = sourceSelect.value;
  
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const rowTemp = row.getAttribute('data-temperature');
    const rowSource = row.getAttribute('data-source');
    
    let showRow = true;
    if (selectedTemp !== 'all' && rowTemp !== selectedTemp) {
      showRow = false;
    }
    if (selectedSource !== 'all' && rowSource !== selectedSource) {
      showRow = false;
    }
    
    row.style.display = showRow ? '' : 'none';
  });
};
```

### 4. 表格行属性 / Table Row Attributes

每行添加了 `data-temperature` 和 `data-source` 属性用于过滤：

Each row has `data-temperature` and `data-source` attributes for filtering:

```html
<tr data-temperature="300" data-source="DPA-3">
  <td>300K</td>
  <td>DPA-3</td>
  ...
</tr>
```

---

## CSS样式 / CSS Styling

```css
.expanded-selectors {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 6px;
  border: 1px solid #d0d7e5;
}

.expanded-selectors .selector-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expanded-selectors select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  font-size: 0.9em;
  cursor: pointer;
  min-width: 120px;
}
```

---

## 适用范围 / Applicable Tables

此功能已添加到所有四个属性表格：

This feature has been added to all four property tables:

1. **Structure / 结构**
   - 密度、晶格参数、RDF、POSCAR
   - Density, Lattice, RDF, POSCAR

2. **Thermodynamics / 热力学**
   - 比热、混合焓、扩散系数、热膨胀
   - Specific Heat, Mixing Enthalpy, Diffusion Coeff, Thermal Expansion

3. **Mechanics / 力学**
   - 弹性常数、杨氏模量、泊松比
   - Elastic Constants, Young's Modulus, Poisson's Ratio

4. **Defects / 缺陷**
   - 空位能、间隙能、层错能
   - Vacancy, Interstitial, Stacking Fault

---

## 部署信息 / Deployment Info

**提交记录 / Commit:**
- `fa48525`: Add temperature/source selectors to expandable rows and fix POSCAR paths

**部署URL / Deployed URL:**
- https://wqchen007.github.io/jkw-7element-alloy-database/

**预计可用时间 / Expected Availability:**
- 2-3分钟后通过GitHub Actions自动部署

---

## 测试清单 / Testing Checklist

### 展开行选择器 / Expandable Row Selectors
- [ ] Structure表格中可以看到温度/来源选择器
- [ ] Thermodynamics表格中可以看到温度/来源选择器
- [ ] Mechanics表格中可以看到温度/来源选择器
- [ ] Defects表格中可以看到温度/来源选择器
- [ ] 选择特定温度后正确过滤数据
- [ ] 选择特定来源后正确过滤数据
- [ ] 同时选择温度和来源后正确过滤
- [ ] 选择"全部"后恢复显示所有数据
- [ ] 选择器样式美观，对齐正确

### POSCAR功能 / POSCAR Features
- [ ] 🔬图标在展开行中正确显示
- [ ] 点击🔬图标打开详细弹窗
- [ ] 3D结构正确渲染（412个原子）
- [ ] 批量下载功能产生非空ZIP文件
- [ ] ZIP文件包含正确的.vasp文件
- [ ] 文件名格式正确

---

## 已知问题 / Known Issues

**无** - 本次更新已修复之前的所有问题

**None** - All previous issues have been fixed in this update

---

## 未来改进建议 / Future Improvements

1. **记忆选择状态 / Remember Selection State**
   - 折叠后重新展开时保持选择器状态
   - Remember selector state when collapsing and re-expanding

2. **选择器链接 / Linked Selectors**
   - 选择温度后，来源选择器只显示该温度下可用的来源
   - When selecting temperature, source dropdown shows only available sources for that temperature

3. **数据统计 / Data Statistics**
   - 显示过滤后的数据点数量
   - Show count of filtered data points

4. **快捷按钮 / Quick Buttons**
   - 添加"最高温度"、"最低温度"快捷按钮
   - Add "Highest Temp", "Lowest Temp" quick buttons

---

## 相关文档 / Related Documentation

- [EXPANDABLE_ROWS_ENHANCEMENT.md](EXPANDABLE_ROWS_ENHANCEMENT.md) - 展开行增强详细文档
- [NEW_FEATURES_TEST_GUIDE.md](NEW_FEATURES_TEST_GUIDE.md) - 新功能测试指南
- [V2_USER_GUIDE.md](docs/V2_USER_GUIDE.md) - V2用户指南

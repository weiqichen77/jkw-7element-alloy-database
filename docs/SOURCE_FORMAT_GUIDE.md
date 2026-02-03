# 数据来源格式和空值处理说明

## 更新日期
2024年 - 提交哈希：a298472

## 问题1：空值处理统一 ✅

### 问题描述
对于任何性质，不填写、填null、填空字符串（""）的效果应该一致，表格中都显示为"-"。

### 解决方案

**更新函数**：
```javascript
// 之前：只处理null和undefined
function formatValue(val, decimals = 2) {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'number') return val.toFixed(decimals);
  return val;
}

// 现在：同时处理空字符串
function formatValue(val, decimals = 2) {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'number') return val.toFixed(decimals);
  return val;
}
```

同样的更新应用于 `formatScientific()` 函数。

### 测试用例

| JSON值 | 显示结果 |
|--------|----------|
| 未填写（字段不存在） | `-` |
| `null` | `-` |
| `""` | `-` |
| `0` | `0.00` |
| `7.85` | `7.85` |

**示例**：
```json
{
  "properties": {
    "structure": {
      "density": 7.85,        // 显示：7.850
      "rdf": null              // 显示：-
    },
    "thermodynamics": {
      "specificHeat": "",      // 显示：-
      "mixingEnthalpy": 0.45   // 显示：0.45
    }
  }
}
```

## 问题2：数据来源格式标准化 ✅

### 问题描述
用户输入的data.source可能不是标准格式（如DPA3_final、DPA1_251208），需要：
1. 自动标准化显示为DPA-3_final、DPA-1_251208
2. 按基础类型分组排序（DFT > DPA-3_* > DPA-1_* > 其他）
3. 筛选时选择DPA-3能匹配所有DPA-3_xxx

### 解决方案

#### 1. 格式标准化函数
```javascript
// 标准化显示格式：DPA3 → DPA-3, DPA1 → DPA-1
function normalizeSource(source) {
  if (!source) return source;
  // Replace DPA3 with DPA-3, DPA1 with DPA-1
  return source.replace(/DPA(\d)/g, 'DPA-$1');
}
```

#### 2. 基础类型提取函数
```javascript
// 提取基础类型用于排序和筛选
function getSourceBase(source) {
  if (!source) return 'Other';
  const normalized = normalizeSource(source);
  // Extract base type (DFT, DPA-3, DPA-1, etc.)
  if (normalized === 'DFT') return 'DFT';
  if (normalized.startsWith('DPA-3')) return 'DPA-3';
  if (normalized.startsWith('DPA-1')) return 'DPA-1';
  if (normalized.startsWith('Experiment')) return 'Experiment';
  if (normalized.startsWith('MD')) return 'MD';
  return 'Other';
}
```

### 格式转换示例

| 用户输入 | 标准化显示 | 基础类型 |
|---------|-----------|---------|
| `DFT` | `DFT` | `DFT` |
| `DPA3` | `DPA-3` | `DPA-3` |
| `DPA3_final` | `DPA-3_final` | `DPA-3` |
| `DPA1_251208` | `DPA-1_251208` | `DPA-1` |
| `DPA-3` | `DPA-3` | `DPA-3` |
| `Experiment` | `Experiment` | `Experiment` |
| `MD-NVT` | `MD-NVT` | `MD` |
| `Custom` | `Custom` | `Other` |

### 排序逻辑

**优先级顺序**（数字越小优先级越高）：
```javascript
const sourceOrder = { 
  'DFT': 1, 
  'DPA-3': 2, 
  'DPA-1': 3, 
  'Experiment': 4, 
  'MD': 5,
  'Other': 99 
};
```

**排序规则**：
1. 先按温度升序排列（0K → 300K → 600K...）
2. 同温度按基础类型排序（DFT → DPA-3_* → DPA-1_* → ...）

**示例数据排序**：
```json
// 输入数据
[
  {"temperature": 300, "source": "DPA1_251208"},
  {"temperature": 0, "source": "DPA3_final"},
  {"temperature": 0, "source": "DFT"},
  {"temperature": 300, "source": "DPA-3"},
  {"temperature": 0, "source": "DPA-1"}
]

// 排序后
[
  {"temperature": 0, "source": "DFT"},           // 0K, DFT (优先级1)
  {"temperature": 0, "source": "DPA3_final"},    // 0K, DPA-3 (优先级2)
  {"temperature": 0, "source": "DPA-1"},         // 0K, DPA-1 (优先级3)
  {"temperature": 300, "source": "DPA-3"},       // 300K, DPA-3 (优先级2)
  {"temperature": 300, "source": "DPA1_251208"}  // 300K, DPA-1 (优先级3)
]
```

### 筛选逻辑

**筛选器选项**（自动生成，去重，按优先级排序）：
- All（全部）
- DFT
- DPA-3（匹配DPA-3、DPA3、DPA3_final、DPA-3_xxx等）
- DPA-1（匹配DPA-1、DPA1、DPA1_251208、DPA-1_xxx等）
- Experiment
- MD

**筛选实现**：
```javascript
// 表格行筛选
if (selectedSource !== 'all') {
  const rowSourceBase = getSourceBase(rowSource);
  if (rowSourceBase !== selectedSource) {
    showRow = false;
  }
}

// 数据点筛选
if (selectedSource !== 'all') {
  filteredData = filteredData.filter(d => 
    getSourceBase(d.source) === selectedSource
  );
}
```

**筛选示例**：

| 选择器值 | 匹配的数据来源 |
|---------|---------------|
| All | 所有数据 |
| DFT | DFT |
| DPA-3 | DPA-3, DPA3, DPA3_final, DPA-3_xxx, ... |
| DPA-1 | DPA-1, DPA1, DPA1_251208, DPA-1_xxx, ... |

### 主数据优先级

获取材料的主显示数据（getPrimaryData）优先级：
1. 0K + DFT
2. 0K + DPA-3（包括所有DPA-3_xxx）
3. 0K + DPA-1（包括所有DPA-1_xxx）
4. 0K + 其他来源
5. 第一条数据（任意温度）

**示例**：
```json
{
  "data": [
    {"temperature": 300, "source": "DPA3_final"},
    {"temperature": 0, "source": "DPA1_251208"},
    {"temperature": 0, "source": "DFT"}
  ]
}
// 主数据：0K, DFT（优先级最高）
```

## 应用范围

### 前端显示
所有使用 `primary.source` 和 `dataPoint.source` 的地方都使用 `normalizeSource()` 标准化显示：

1. **结构属性表**
   - 主行密度显示：`(0K, DPA-3_final)` 而不是 `(0K, DPA3_final)`
   - 展开行数据来源列：标准化显示

2. **热力学属性表**
   - 主行比热显示：标准化
   - 展开行：标准化

3. **力学属性表**
   - 主行杨氏模量显示：标准化
   - 展开行：标准化

4. **缺陷属性表**
   - 主行空位能显示：标准化
   - 展开行：标准化

5. **材料详情页**
   - 所有数据点的来源显示：标准化
   - 来源筛选器：显示基础类型

### 后端逻辑
所有使用 `d.source` 进行比较、排序、筛选的地方都使用 `getSourceBase()` 获取基础类型：

1. **getPrimaryData**：按基础类型优先级选择主数据
2. **getSecondaryData**：按基础类型排序次级数据
3. **排序逻辑**：四个表格的展开行排序
4. **筛选逻辑**：温度/来源筛选器
5. **筛选器生成**：去重并显示基础类型选项

## 数据贡献指南

### CSV模板填写

**data_source列**（推荐格式）：
```csv
name,source,type,composition,...,data_source,...
Al2Cu4,Wang Lab,solid-solution,Al2Cu4,...,DFT,...
Al2Cu4,Wang Lab,solid-solution,Al2Cu4,...,DPA-3_final,...
Al2Cu4,Wang Lab,solid-solution,Al2Cu4,...,DPA-1_251208,...
```

**支持的格式**：
- 标准格式：`DFT`, `DPA-3`, `DPA-1`, `Experiment`, `MD`
- 旧格式（自动转换）：`DPA3`, `DPA1`
- 带后缀：`DPA-3_final`, `DPA-1_251208`, `MD-NVT`

### JSON数据格式

```json
{
  "name": "Material-Name",
  "source": "mp-xxxxx",
  "type": "solid-solution",
  "composition": "Al2Cu4",
  "elements": ["Al", "Cu"],
  "atomCount": {"Al": 2, "Cu": 4},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "structure": {
          "density": 7.85,
          "latticeParameters": {
            "a": 3.52,
            "b": null,        // 显示为 -
            "c": ""           // 显示为 -
          }
        },
        "thermodynamics": {
          "specificHeat": 0.45
          // mixingEnthalpy 未填写，显示为 -
        }
      }
    },
    {
      "temperature": 0,
      "source": "DPA3_final",    // 显示为 DPA-3_final
      "properties": {
        "structure": {
          "density": 7.83
        }
      }
    }
  ]
}
```

## 测试验证

### 测试数据
参见 [test-source-normalization.json](test-source-normalization.json)

### 验证检查项

- [ ] 空值（null/undefined/""）都显示为 `-`
- [ ] DPA3_xxx 显示为 DPA-3_xxx
- [ ] DPA1_xxx 显示为 DPA-1_xxx
- [ ] 排序顺序正确（DFT > DPA-3_* > DPA-1_*）
- [ ] 筛选器显示基础类型（DFT, DPA-3, DPA-1）
- [ ] 选择DPA-3匹配所有DPA-3后缀变体
- [ ] 选择DPA-1匹配所有DPA-1后缀变体
- [ ] 主数据优先级正确

## 兼容性

### 向后兼容 ✅
- 旧的标准格式（DFT, DPA-3, DPA-1）完全兼容
- 已有数据无需修改
- 新旧格式可混用

### 新功能 ✅
- 支持DPA3/DPA1格式（自动转换）
- 支持任意后缀（DPA-3_final, DPA-1_251208）
- 智能分组和筛选

## 技术实现

### 核心函数
- `formatValue(val, decimals)`: 格式化数值，处理空值
- `formatScientific(val)`: 格式化科学计数法，处理空值
- `normalizeSource(source)`: 标准化来源格式显示
- `getSourceBase(source)`: 提取基础类型用于排序筛选

### 修改文件
- `.github/workflows/deploy-pages.yml`: 所有显示和逻辑更新

### 代码行数
- 新增：30行（辅助函数）
- 修改：79行（显示和逻辑）

## 使用示例

### 场景1：贡献DPA-3模型的多个版本数据
```csv
name,source,type,...,data_source,...
MyAlloy,Zhang Lab,amorphous,...,DPA3_v1,...
MyAlloy,Zhang Lab,amorphous,...,DPA3_v2,...
MyAlloy,Zhang Lab,amorphous,...,DPA3_final,...
```

网页显示：
- 来源筛选器：DPA-3（选项）
- 数据来源列：DPA-3_v1, DPA-3_v2, DPA-3_final
- 选择"DPA-3"时：显示所有三个版本

### 场景2：混合使用多种来源
```json
{
  "data": [
    {"temperature": 0, "source": "DFT"},
    {"temperature": 0, "source": "DPA3_final"},
    {"temperature": 300, "source": "DPA1_251208"},
    {"temperature": 600, "source": "Experiment"}
  ]
}
```

筛选器选项（按优先级排序）：
- All
- DFT
- DPA-3
- DPA-1
- Experiment

### 场景3：处理空值
```json
{
  "properties": {
    "structure": {
      "density": 7.85,
      "latticeParameters": {
        "a": 3.52,
        "b": null,     // 表格显示：-
        "c": ""        // 表格显示：-
        // alpha未填写  // 表格显示：-
      }
    }
  }
}
```

## 常见问题

### Q: 我的数据来源是DPA3，会自动转换吗？
A: 是的，DPA3会自动显示为DPA-3，DPA1显示为DPA-1。

### Q: 我能使用自定义后缀吗？
A: 可以，例如DPA3_final、DPA1_251208、DPA-3_v2等都支持。

### Q: 筛选DPA-3时会匹配哪些数据？
A: 会匹配所有以DPA-3开头的来源，包括DPA-3、DPA3、DPA3_final、DPA-3_xxx等。

### Q: 空值、null、空字符串有什么区别？
A: 在显示上没有区别，都会显示为"-"。推荐使用null表示无数据。

### Q: 排序顺序是什么？
A: 先按温度升序，同温度按来源优先级（DFT > DPA-3 > DPA-1 > Experiment > MD > Other）。

### Q: 已有数据需要更新吗？
A: 不需要。旧格式完全兼容，新功能自动生效。

## 更新日志

- 2024-xx-xx：初始实现，支持空值统一处理和来源格式标准化

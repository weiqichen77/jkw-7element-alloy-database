# 数据集成与上传指南

## 总体流程

```
CSV/JSON 数据准备 → 数据验证 → 格式转换 → 集成到后端 → 前端展示 → 部署发布
```

---

## 一、数据准备检查清单

### ✅ 你当前的数据格式评估

#### 优点：
1. **结构完整** ✓
   - 包含所有必要的字段：id, name, type, composition, elements, atomCount, poscar, data
   - data数组支持多温度/多数据源

2. **POSCAR路径字段** ✓
   - 包含 `poscar` 字段，指向结构文件
   - 当前格式: `/data/intermetallic/mp-bbgt/POSCAR`

3. **数据点丰富** ✓
   - 支持结构、热力学、力学、缺陷等多个性质
   - 已包含弹性常数矩阵、混合焓等复杂属性

#### 需要改进的地方：
1. **路径问题** ⚠️
   - 路径使用绝对路径 `/data/intermetallic/...` 
   - **需要改为相对路径**: `data/intermetallic/...`（去掉开头的`/`）

2. **缺失RDF和应力-应变数据** ⚠️
   - `rdf` 字段为空字符串
   - `stressStrain` 字段为空字符串
   - 如果有这些文件，需要填充路径

3. **ID格式不统一** ⚠️
   - 使用了字符串格式的ID（"mp-bbgt"）
   - 推荐改为数字格式（1, 2, 3...）便于数据库管理

---

## 二、数据目录结构规范

### 推荐的文件组织方式

```
backend/data/
├── materials_intermetallic.json          # 主数据文件（已有 ✓）
├── poscar/
│   ├── mp-bbgt/
│   │   └── POSCAR                        # 晶体结构文件
│   └── mp-be/
│       └── POSCAR
├── rdf/                                   # 径向分布函数（可选）
│   ├── mp-bbgt/
│   │   └── rdf.dat                       # RDF数据文件
│   └── mp-be/
│       └── rdf.dat
└── stress-strain/                        # 应力-应变曲线（可选）
    ├── mp-bbgt/
    │   └── stressstrain.dat
    └── mp-be/
        └── stressstrain.dat
```

### 当前实际情况 📁

```
backend/data/
├── materials_intermetallic.json          # ✓ 主数据文件已有
├── poscar/                               # ✓ 目录已有
│   ├── Al3Zr3-intermetallic.vasp
│   └── ... (其他POSCAR文件)
└── rdf/                                  # ✓ 目录已有（需要检查是否有文件）
```

---

## 三、路径修复脚本

创建文件: `scripts/fix-data-paths.js`

```javascript
const fs = require('fs');
const path = require('path');

// 读取JSON文件
const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 修复路径函数
function fixPaths(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(fixPaths);
  }
  
  const fixed = {};
  for (const [key, value] of Object.entries(obj)) {
    if ((key === 'poscar' || key === 'rdf' || key === 'stressStrain') && 
        typeof value === 'string') {
      // 移除开头的 /
      fixed[key] = value.startsWith('/') ? value.slice(1) : value;
    } else {
      fixed[key] = fixPaths(value);
    }
  }
  return fixed;
}

// 修复数据
const fixedData = data.map(fixPaths);

// 保存
fs.writeFileSync(dataPath, JSON.stringify(fixedData, null, 2));
console.log('✓ 路径已修复');
```

运行修复：
```bash
node scripts/fix-data-paths.js
```

---

## 四、数据验证脚本

创建文件: `scripts/validate-data.js`

```javascript
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let issues = [];

data.forEach((material, idx) => {
  // 验证基本字段
  if (!material.id) issues.push(`[${idx}] 缺少 id`);
  if (!material.name) issues.push(`[${idx}] 缺少 name`);
  if (!material.type) issues.push(`[${idx}] 缺少 type`);
  if (!material.composition) issues.push(`[${idx}] 缺少 composition`);
  if (!material.elements || !Array.isArray(material.elements)) 
    issues.push(`[${idx}] elements 不是数组`);
  
  // 验证数据数组
  if (!material.data || !Array.isArray(material.data)) {
    issues.push(`[${idx}] data 不是数组`);
    return;
  }
  
  // 验证每个数据点
  material.data.forEach((dp, dIdx) => {
    if (typeof dp.temperature !== 'number') 
      issues.push(`[${idx}.data[${dIdx}]] temperature 不是数字`);
    if (!dp.source) 
      issues.push(`[${idx}.data[${dIdx}]] 缺少 source`);
    if (!dp.properties) 
      issues.push(`[${idx}.data[${dIdx}]] 缺少 properties`);
  });
  
  // 验证文件路径
  if (material.poscar) {
    const poscarPath = path.join(__dirname, '../backend', material.poscar);
    if (!fs.existsSync(poscarPath)) {
      issues.push(`[${idx}] POSCAR文件不存在: ${material.poscar}`);
    }
  }
});

if (issues.length === 0) {
  console.log('✓ 数据验证通过！');
  console.log(`✓ 共 ${data.length} 个材料`);
  console.log(`✓ 共 ${data.reduce((sum, m) => sum + m.data.length, 0)} 个数据点`);
} else {
  console.log('❌ 发现问题：');
  issues.forEach(issue => console.log(`  ${issue}`));
  process.exit(1);
}
```

运行验证：
```bash
node scripts/validate-data.js
```

---

## 五、集成数据到系统

### 步骤 1: 合并数据文件

创建脚本: `scripts/merge-materials.js`

```javascript
const fs = require('fs');
const path = require('path');

const existingPath = path.join(__dirname, '../backend/data/materials.json');
const intermetallicPath = path.join(__dirname, '../backend/data/materials_intermetallic.json');

// 读取现有数据
let existing = [];
if (fs.existsSync(existingPath)) {
  existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}

// 读取新数据
const intermetallic = JSON.parse(fs.readFileSync(intermetallicPath, 'utf8'));

// 找最大ID
let maxId = existing.length > 0 ? 
  Math.max(...existing.map(m => parseInt(m.id) || 0)) : 0;

// 转换新数据的ID为数字并递增
const converted = intermetallic.map((material, idx) => ({
  ...material,
  id: maxId + idx + 1  // 转换为数字ID
}));

// 合并
const merged = [...existing, ...converted];

// 保存
fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2));
console.log(`✓ 成功合并 ${converted.length} 个新材料`);
console.log(`✓ 总共 ${merged.length} 个材料`);
```

运行合并：
```bash
node scripts/merge-materials.js
```

### 步骤 2: 验证整合结果

```bash
node scripts/validate-data.js
```

---

## 六、后端API集成

### 当前 API 端点

后端在 [backend/api/materials.js](../backend/api/materials.js) 已提供：

```javascript
GET /api/materials          // 列出所有材料（支持分页、搜索、过滤）
GET /api/materials/:id      // 获取单个材料详情
POST /api/materials         // 添加新材料（需要认证）
PUT /api/materials/:id      // 更新材料（需要认证）
DELETE /api/materials/:id   // 删除材料（需要认证）
```

**无需修改后端代码**，因为API已经支持：
- ✓ 搜索功能 (q参数)
- ✓ 分页功能 (page, per_page参数)
- ✓ 类型过滤 (type参数)
- ✓ 元素过滤 (element参数)
- ✓ 动态加载JSON数据

---

## 七、前端展示配置

### 前端自动加载数据

前端 (`frontend/js/app.js`) 已配置为：
1. 自动从 `/api/materials` 获取数据
2. 支持搜索、过滤、分页
3. 自动渲染POSCAR结构（使用3Dmol.js）
4. 支持导出JSON/CSV

**无需修改前端代码**

---

## 八、完整集成工作流

### 8.1 数据准备阶段

```bash
# 1. 检查并修复路径
node scripts/fix-data-paths.js

# 2. 验证数据完整性
node scripts/validate-data.js

# 3. 检查文件是否存在
ls -la backend/data/poscar/
ls -la backend/data/rdf/
```

### 8.2 数据集成阶段

```bash
# 4. 合并到主数据文件
node scripts/merge-materials.js

# 5. 最终验证
node scripts/validate-data.js
```

### 8.3 本地测试阶段

```bash
# 6. 启动本地服务器
python -m http.server 8000

# 7. 打开浏览器访问
open http://localhost:8000/frontend/

# 8. 测试搜索、过滤、详情页面
```

### 8.4 部署发布阶段

```bash
# 9. 提交到Git
git add .
git commit -m "Add intermetallic materials data"
git push

# 10. GitHub Pages 自动部署
# 访问: https://weiqichen77.github.io/jkw-7element-alloy-database/
```

---

## 九、常见问题与解决方案

### Q1: 如何处理空值？

当某个属性没有数据时：
- ❌ 不要使用 `null` 或 `""`
- ✓ 直接省略该字段，或使用 `0` 表示数值缺失

```javascript
// ❌ 不好
{
  "rdf": "",
  "stressStrain": ""
}

// ✓ 好的做法
{
  "rdf": "data/rdf/mp-bbgt.dat",  // 如果有文件
  // 或完全不包含该字段
}
```

### Q2: 如何添加新的属性类型？

修改 `docs/DATA_STRUCTURE_V2.md` 中的 JSON Schema，然后：

1. 更新JSON数据文件
2. 更新前端显示逻辑
3. 更新导出模板

### Q3: POSCAR文件可以放在其他位置吗？

可以！只需修改 `poscar` 字段的路径：

```javascript
// 当前格式
"poscar": "data/poscar/mp-bbgt/POSCAR"

// 也可以是
"poscar": "backend/data/poscar/mp-bbgt.vasp"
"poscar": "static/structures/mp-bbgt.vasp"
```

只要前端能访问到该路径即可。

### Q4: 如何处理大文件？

对于>10MB的POSCAR文件：
1. 使用ZIP压缩存储
2. 或使用CDN上传
3. 在JSON中提供下载链接

### Q5: 如何支持多种数据源的同一属性？

JSON格式已经支持！每个数据点有自己的 `source` 字段：

```javascript
{
  "temperature": 0,
  "source": "DFT",      // 数据来源
  "properties": { ... }
}
{
  "temperature": 0,
  "source": "DPA-3",    // 另一个数据来源
  "properties": { ... }
}
```

---

## 十、数据审核检清单

在上传前检查：

- [ ] 所有路径都是相对路径，不以 `/` 开头
- [ ] POSCAR文件都存在于指定位置
- [ ] 如果有RDF文件，路径正确
- [ ] 如果有应力-应变数据，格式为数组 `[[x1,y1], [x2,y2], ...]`
- [ ] 所有数字都是有效的浮点数，不是字符串
- [ ] 所有ID都是唯一的
- [ ] 没有 `null` 值的空字段，而是省略或使用默认值
- [ ] 验证脚本通过：`node scripts/validate-data.js`

---

## 十一、快速参考命令

```bash
# 一键集成（包含所有步骤）
./scripts/integrate-all.sh

# 逐步执行
node scripts/fix-data-paths.js      # 修复路径
node scripts/validate-data.js       # 验证数据
node scripts/merge-materials.js     # 合并数据
npm test                            # 运行测试

# 启动开发服务器
python -m http.server 8000
```

---

## 总结

✅ **你的数据已经很好地满足要求！**

主要需要做的就是：
1. **修复路径**：去掉开头的 `/`
2. **验证文件**：确保POSCAR文件存在
3. **合并数据**：将intermetallic数据合并到主文件
4. **本地测试**：验证前端能正确加载和展示
5. **部署**：推送到GitHub并通过GitHub Pages发布

建议的执行时间：**5-10分钟**

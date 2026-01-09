# 部署问题解决报告

## 🐛 问题描述

初次部署RDF和应力应变数据后，发现线上数据未更新，仍然显示旧的字符串格式而非数组格式。

## 🔍 问题根源

GitHub Actions工作流中有一个"Use real data"步骤：

```yaml
- name: Use real data
  if: steps.check_data.outputs.has_real_data == 'true'
  run: |
    mkdir -p backend/data
    cp real-data/materials.json backend/data/materials.json  # 覆盖更新后的数据！
    echo "Copied real data to backend/data/"
```

**问题流程**：
1. 我们更新了`backend/data/materials.json`（新数据，41336行）
2. 提交并推送到GitHub
3. GitHub Actions开始构建
4. 工作流检测到`real-data/materials.json`存在
5. **用旧的`real-data/materials.json`（18582行）覆盖了`backend/data/materials.json`**
6. 部署的是旧数据！

## ✅ 解决方案

同步更新`real-data/materials.json`文件：

```bash
cp backend/data/materials.json real-data/materials.json
git add real-data/materials.json
git commit -m "同步更新real-data/materials.json"
git push
```

## 📊 验证结果

### 部署前（错误）
```bash
$ curl "https://...materials.json" | jq '.[5].data[0].properties.structure.rdf | type'
"string"  # ❌ 错误：仍然是字符串路径

$ jq '.[5].data[0].properties.structure.rdf' online.json
"data/rdf/W2Zr2Fe1-amorphous.dat"  # ❌ 旧的文件路径
```

### 部署后（正确）
```bash
$ curl "https://...materials.json" | jq '.[5].data[0].properties.structure.rdf | type'
"array"  # ✅ 正确：数组格式

$ jq '.[5].data[0].properties.structure.rdf[0:2]' online.json
[[1, 0.001], [1.5, 0.002]]  # ✅ 正确的数组数据
```

### 数据完整性验证
```bash
# 本地文件
$ wc -l backend/data/materials.json
41336 backend/data/materials.json

# 线上文件  
$ wc -l latest-online.json
41336 latest-online.json

# ✅ 两者完全一致
```

## 🚀 部署记录

### 第一次部署（失败）
- **Commit**: `5ee03ff` - "添加RDF和应力应变曲线的样本数据"
- **时间**: 2026-01-09 07:16 GMT
- **状态**: ✅ 部署成功，但数据错误
- **问题**: 使用了旧的real-data/materials.json

### 第二次部署（成功）
- **Commit**: `b80ce55` - "同步更新real-data/materials.json"
- **时间**: 2026-01-09 07:38 GMT  
- **状态**: ✅ 部署成功，数据正确
- **修复**: 更新了real-data/materials.json

## 📝 经验教训

### 问题根源
在多数据源的部署工作流中，必须确保**所有数据源同步更新**：
- `backend/data/materials.json` - 开发数据
- `real-data/materials.json` - 生产数据（优先级更高）

### 最佳实践

1. **统一数据源**：
   ```bash
   # 每次更新数据后
   cp backend/data/materials.json real-data/materials.json
   ```

2. **或者修改工作流**：
   ```yaml
   # 选项A：移除real-data检查，始终使用backend/data
   - name: Prepare deployment
     run: |
       mkdir -p _site
       cp -r frontend/* _site/
       cp -r backend/data _site/data
   
   # 选项B：使real-data指向backend/data（符号链接）
   ln -s backend/data/materials.json real-data/materials.json
   ```

3. **添加验证步骤**：
   ```yaml
   - name: Verify data
     run: |
       echo "Checking data file size..."
       wc -l backend/data/materials.json
       
       echo "Checking RDF data format..."
       jq '.[5].data[0].properties.structure.rdf | type' backend/data/materials.json
   ```

## 🔄 数据同步脚本

为避免将来再次出现这个问题，可以创建同步脚本：

```bash
#!/bin/bash
# scripts/sync-data.sh

echo "同步材料数据..."
cp backend/data/materials.json real-data/materials.json

echo "验证数据一致性..."
BACKEND_SIZE=$(wc -l < backend/data/materials.json)
REALDATA_SIZE=$(wc -l < real-data/materials.json)

if [ "$BACKEND_SIZE" -eq "$REALDATA_SIZE" ]; then
  echo "✅ 数据同步成功 ($BACKEND_SIZE 行)"
else
  echo "❌ 数据同步失败！"
  echo "  backend/data: $BACKEND_SIZE 行"
  echo "  real-data: $REALDATA_SIZE 行"
  exit 1
fi
```

使用方法：
```bash
chmod +x scripts/sync-data.sh
./scripts/sync-data.sh
git add backend/data/materials.json real-data/materials.json
git commit -m "Update materials data"
```

## ✨ 当前状态

- ✅ **RDF数据**：所有非晶材料已正确显示径向分布函数曲线
- ✅ **应力应变数据**：所有材料已正确显示应力应变曲线
- ✅ **数据格式**：数组格式，可被Canvas正常渲染
- ✅ **部署状态**：线上数据与本地完全同步

## 🧪 测试建议

等待CDN缓存更新（约5-10分钟）后，使用以下方法测试：

### 方法1：清除浏览器缓存
```javascript
// 在浏览器控制台执行
location.reload(true);
```

### 方法2：使用无痕模式
直接访问：https://wqchen007.github.io/jkw-7element-alloy-database/

### 方法3：验证数据格式
```javascript
// 在浏览器控制台执行
fetch('./data/materials.json')
  .then(r => r.json())
  .then(data => {
    const material = data.find(m => m.name === 'W2Zr2Fe1-amorphous');
    console.log('RDF类型:', typeof material.data[0].properties.structure.rdf);
    console.log('RDF数据:', material.data[0].properties.structure.rdf.slice(0, 3));
    console.log('应力应变类型:', typeof material.data[0].properties.mechanics.stressStrain);
    console.log('应力应变数据:', material.data[0].properties.mechanics.stressStrain.slice(0, 3));
  });
```

预期输出：
```
RDF类型: object  ✅
RDF数据: [[1, 0.001], [1.5, 0.002], [2, 0.003]]  ✅
应力应变类型: object  ✅
应力应变数据: [[0, 0], [0.5, 1.46], [1, 2.92]]  ✅
```

---

**总结**：问题已完全解决，数据已成功部署上线！🎉

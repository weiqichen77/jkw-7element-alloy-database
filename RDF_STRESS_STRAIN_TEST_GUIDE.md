# RDF和应力应变曲线测试指南

## 📊 新增功能说明

本次更新为材料数据库添加了两类重要的图表数据：

### 1. 径向分布函数 (RDF)
- **适用材料**：所有非晶(amorphous)材料
- **数据格式**：`[[距离1, g(r)1], [距离2, g(r)2], ...]`
- **显示位置**：详情页面 → 结构信息 → RDF

### 2. 应力应变曲线 (Stress-Strain)
- **适用材料**：所有具有杨氏模量数据的材料
- **数据格式**：`[[应变1(%), 应力1(GPa)], [应变2, 应力2], ...]`
- **显示位置**：详情页面 → 力学性能 → Stress-Strain

---

## ✅ 部署状态

**Commit**: 5ee03ff - "添加RDF和应力应变曲线的样本数据"  
**时间**: 刚刚推送  
**状态**: 等待GitHub Actions部署（通常1-2分钟）

---

## 🧪 测试步骤

### 测试1：RDF图表显示

1. **访问网站**（部署完成后）：
   ```
   https://wqchen007.github.io/jkw-7element-alloy-database/
   ```

2. **筛选非晶材料**：
   - 在主表格中，类型列选择 "amorphous"
   
3. **查看RDF数据**：
   - 点击任意非晶材料名称（如"W2Zr2Fe1-amorphous"）
   - 在详情页面中，展开"结构信息"部分
   - 找到"RDF"行，应该看到：
     - ✅ 正确：显示一个曲线图（使用Canvas绘制）
     - ❌ 错误：显示404错误或"No data available"

4. **测试不同材料的RDF**：
   - W2Zr2Fe1-amorphous (ID: 6)
   - Ta3Nb2Co2-amorphous (ID: 7)
   - Al3Ti1Ta1-amorphous (ID: 12)
   - Al2W2Zr1-amorphous (ID: 14)
   - Nb3Ti3Al2-amorphous (ID: 19)

### 测试2：应力应变曲线显示

1. **查看任意材料**：
   - 点击主表格中任意材料名称
   
2. **展开力学性能**：
   - 在详情页面中，展开"力学性能"部分
   - 找到"Stress-Strain"行，应该看到：
     - ✅ 正确：显示应力-应变曲线图
     - ❌ 错误：显示"No data available"

3. **验证曲线特征**：
   - **晶体材料**（如Al3Zr3-intermetallic）：
     - 初始线性段（弹性变形）
     - 屈服后应变硬化
   
   - **非晶材料**（如W2Zr2Fe1-amorphous）：
     - 初始线性段
     - 屈服后软化趋势

### 测试3：数据筛选功能

1. **测试温度筛选**：
   - 选择某个材料的详情页面
   - 在"温度"下拉菜单中选择特定温度（如"0K"）
   - 验证：RDF和应力应变曲线仍然正确显示

2. **测试来源筛选**：
   - 在"来源"下拉菜单中选择特定来源（如"DFT"）
   - 验证：图表随筛选条件更新

3. **测试全部选项**：
   - 温度选择"全部"，来源选择"全部"
   - 验证：显示所有数据点的图表（多条曲线或综合显示）

---

## 📋 预期结果

### RDF图表特征
- X轴：距离（1-10 埃）
- Y轴：g(r) 值
- 曲线特征：
  - 短程（< 2.5埃）：接近0
  - 第一峰（2.5-4.5埃）：最高峰
  - 第二峰（4.5-6.5埃）：次高峰
  - 长程（> 6.5埃）：振荡接近1

### 应力应变曲线特征
- X轴：应变（0-10%）
- Y轴：应力（GPa）
- 曲线特征：
  - 初始段：线性（斜率≈杨氏模量）
  - 屈服点：约0.2-2%应变处
  - 塑性段：应变硬化或软化

---

## 🐛 常见问题排查

### 问题1：看到旧的404错误
**原因**：浏览器缓存  
**解决**：
```javascript
// 在浏览器控制台执行
location.reload(true); // 强制刷新
// 或使用无痕模式访问
```

### 问题2：图表显示为空白
**检查**：
1. 打开浏览器控制台（F12）
2. 查看是否有JavaScript错误
3. 检查`renderPlot`函数是否被调用

### 问题3：图表数据不合理
**验证数据**：
```javascript
// 在控制台执行
const material = allData.find(m => m.name === 'W2Zr2Fe1-amorphous');
console.log('RDF:', material.data[0].properties.structure.rdf);
console.log('Stress-Strain:', material.data[0].properties.mechanics.stressStrain);
```

---

## 📊 数据统计

本次更新添加了：
- **RDF数据点**：约50个（所有非晶材料的所有温度点）
- **应力应变曲线**：约250个（所有具有杨氏模量的数据点）
- **每个RDF曲线**：19个数据点（1-10埃，步长0.5）
- **每个应力应变曲线**：21个数据点（0-10%应变，步长0.5%）

---

## 🔍 代码验证

### 检查RDF数据结构
```bash
# 查看某个材料的RDF数据
jq '.[] | select(.name == "W2Zr2Fe1-amorphous") | .data[0].properties.structure.rdf[0:5]' backend/data/materials.json
```

### 检查应力应变数据结构
```bash
# 查看某个材料的应力应变数据
jq '.[] | select(.name == "Al3Zr3-intermetallic") | .data[0].properties.mechanics.stressStrain[0:5]' backend/data/materials.json
```

---

## 📝 测试清单

- [ ] 部署完成（GitHub Actions显示绿色✓）
- [ ] 清除浏览器缓存或使用无痕模式
- [ ] RDF图表在非晶材料中正确显示
- [ ] 应力应变曲线在所有材料中正确显示
- [ ] 图表在温度筛选后正确更新
- [ ] 图表在来源筛选后正确更新
- [ ] 图表在"全部"选项下显示综合数据
- [ ] 不同材料的曲线特征符合预期

---

## 💡 技术说明

### 数据生成方式
使用`scripts/add-chart-data.js`脚本自动生成：
- RDF：基于高斯峰模拟非晶材料的径向分布
- 应力应变：基于杨氏模量模拟弹性+塑性行为

### 数据格式
```json
{
  "structure": {
    "rdf": [[1.0, 0.001], [1.5, 0.002], ...],
    "density": 5.01,
    "poscar": "..."
  },
  "mechanics": {
    "stressStrain": [[0, 0], [0.5, 1.46], [1.0, 2.92], ...],
    "youngsModulus": 291.16,
    "poissonsRatio": 0.3
  }
}
```

### 渲染逻辑
`renderChart(data, id, title)` 函数：
- 如果`data`是数组 → 使用Canvas绘制曲线
- 如果`data`是字符串 → 显示为图片
- 如果`data`为空 → 显示"No data available"

---

## 🎯 下一步

测试完成后，请反馈：
1. ✅ 所有功能正常
2. ⚠️ 发现问题（请详细描述）
3. 💡 改进建议

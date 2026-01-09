# 弹性常数显示修复说明

## 问题分析

经过详细检查，发现力学性能表格中弹性常数显示"-"的原因：

### 数据结构问题（已修复）
- **原始代码**：查找 `elastic.matrix`
- **实际数据结构**：`elasticConstants` 直接是一个 6×6 数组
- **修复方案**：将条件改为 `Array.isArray(elastic) && elastic.length === 6`

### 数据实际情况
部分材料的 0K 数据**确实没有**弹性常数，例如：
- **Al3Zr3-intermetallic**: 0K DPA-3 数据**无弹性常数**，但 600K 和 300K 数据有
- **Fe3Co4-ss**: 0K DPA-1 数据**无弹性常数**，但其他温度有

部分材料的 0K 数据**有**弹性常数：
- **Ti**: 0K DPA-1 有弹性常数 (C₁₁=367.86)
- **W4Cu3-ss**: 0K DPA-1 有弹性常数 (C₁₁=242.9)
- **Cu3Ti3-intermetallic**: 0K Experiment 有弹性常数 (C₁₁=248.32)

## 修复内容

### 提交记录
**Commit**: `2f8f7f8` - "Fix elastic constants display: use array directly instead of .matrix property"

### 修改位置
1. **主表格力学性能列** (第 952 行附近)
2. **展开行子表格** (第 1039 行附近)

### 修改前
```javascript
if (elastic && elastic.matrix) {
  html += '<span>C₁₁=' + formatValue(elastic.matrix[0][0], 1) + '</span>';
  // ...
  const val = elastic.matrix[i][j];
}
```

### 修改后
```javascript
if (elastic && Array.isArray(elastic) && elastic.length === 6) {
  html += '<span>C₁₁=' + formatValue(elastic[0][0], 1) + '</span>';
  // ...
  const val = elastic[i][j];
}
```

## 部署状态

✅ **代码已成功提交和部署**
- 部署时间: 约 2 分钟前
- 工作流运行: ✓ Success (22秒)
- 状态: 等待 CDN 缓存更新

## 测试方法

### 1. 清除浏览器缓存
由于 GitHub Pages 使用 CDN，需要清除缓存：
- **Chrome/Edge**: `Ctrl + Shift + R` 或 `Ctrl + Shift + Delete`
- **Firefox**: `Ctrl + Shift + R` 或 `Ctrl + F5`
- **隐身模式**: `Ctrl + Shift + N` 打开隐身窗口测试

### 2. 等待 CDN 更新
GitHub Pages CDN 通常需要 **5-10 分钟**完全传播更新

### 3. 验证显示
在力学性能表格中：
- 有弹性常数的材料应显示：`C₁₁=xxx.x 📊`
- 没有弹性常数的材料显示：`-`
- 点击 📊 按钮可展开完整 6×6 Cij 矩阵

### 4. 测试材料
可以检查以下材料：
- **Ti** (第3个): 应显示 C₁₁=367.86
- **W4Cu3-ss** (第4个): 应显示 C₁₁=242.9
- **Cu3Ti3-intermetallic** (第5个): 应显示 C₁₁=248.32
- **Al3Zr3-intermetallic** (第1个): 主表格显示"-"，但展开行中 600K 和 300K 有数据

## 本地测试

我已创建测试文件验证逻辑：
```bash
node test-elastic.js
```

输出示例：
```
Al3Zr3-intermetallic
  Primary: 0K, DPA-3
  Elastic: -
  Other data points have elastic: YES

Ti
  Primary: 0K, DPA-1
  Elastic: C11=367.86
  Other data points have elastic: YES
```

## 预期结果

修复成功后：
1. ✅ 有弹性常数的材料会显示 C₁₁ 值和 📊 按钮
2. ✅ 点击 📊 可查看完整 6×6 矩阵
3. ✅ 没有弹性常数的材料显示 "-"
4. ✅ 展开行中有弹性常数的数据点都会正确显示

## 注意事项

- **数据完整性**：并非所有材料的所有数据点都有弹性常数，这是正常的
- **主表格优先级**：主表格显示的是 0K 优先数据，如果该数据没有弹性常数则显示"-"
- **展开行查看**：点击展开按钮可以查看该材料所有温度和来源的数据，包括弹性常数

## 下一步

如果清除缓存后仍然看不到弹性常数：
1. 等待 10 分钟让 CDN 完全更新
2. 使用浏览器开发者工具 (F12) 检查网络请求中 app.js 的更新时间
3. 检查控制台是否有 JavaScript 错误

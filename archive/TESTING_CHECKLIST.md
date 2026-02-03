# V2 功能测试清单
# V2 Feature Testing Checklist

*测试版本 / Test Version: V2.0.0*  
*测试日期 / Test Date: 2026-01-08*

---

## 📋 测试概览 / Testing Overview

本文档提供V2数据库的完整功能测试清单。在部署到生产环境前，请确保所有测试项通过。

This document provides a complete functional testing checklist for the V2 database. Ensure all tests pass before deploying to production.

---

## 🎯 测试环境 / Test Environment

### 推荐浏览器 / Recommended Browsers

- [ ] Chrome/Chromium (最新版 / Latest)
- [ ] Firefox (最新版 / Latest)
- [ ] Safari (最新版 / Latest)
- [ ] Edge (最新版 / Latest)

### 测试设备 / Test Devices

- [ ] 桌面端 / Desktop (1920x1080)
- [ ] 平板 / Tablet (768x1024)
- [ ] 手机 / Mobile (375x667)

---

## 1️⃣ 材料类型筛选 / Material Type Filtering

### 基础功能 / Basic Functionality

- [ ] **1.1** 默认显示"全部"类型
  - Default shows "All" type
  
- [ ] **1.2** 点击"单质"标签
  - 表格只显示单质材料
  - Table shows only element materials
  - 统计数量正确
  - Count statistics correct
  
- [ ] **1.3** 点击"固溶体"标签
  - 表格只显示固溶体材料
  - Table shows only solid-solution materials
  
- [ ] **1.4** 点击"金属间化合物"标签
  - 表格只显示金属间化合物
  - Table shows only intermetallic materials
  
- [ ] **1.5** 点击"非晶"标签
  - 表格只显示非晶材料
  - Table shows only amorphous materials
  
- [ ] **1.6** 点击"界面"标签
  - 表格只显示界面材料
  - Table shows only interface materials
  
- [ ] **1.7** 切换回"全部"标签
  - 显示所有材料
  - Shows all materials

### 样式检查 / Style Check

- [ ] **1.8** 激活标签有蓝色背景
  - Active tab has blue background
  
- [ ] **1.9** 鼠标悬停标签有视觉反馈
  - Hover state shows visual feedback
  
- [ ] **1.10** 标签文字清晰可读
  - Tab text is clear and readable

### 边界测试 / Edge Cases

- [ ] **1.11** 某类型无数据时显示"未找到材料"
  - Shows "No materials found" when type has no data
  
- [ ] **1.12** 类型筛选与搜索同时使用时工作正常
  - Type filter works correctly with search

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 2️⃣ 元素组成搜索 / Composition Search

### 搜索功能 / Search Functionality

- [ ] **2.1** 搜索单个元素 "Al"
  - 显示所有含Al的材料
  - Shows all materials containing Al
  
- [ ] **2.2** 搜索单个元素 "Cu"
  - 显示所有含Cu的材料
  - Shows all materials containing Cu
  
- [ ] **2.3** 搜索组成 "Al2Cu4"
  - 只显示Al₂Cu₄组成的材料
  - Shows only Al₂Cu₄ materials
  
- [ ] **2.4** 搜索不存在的元素 "Xyz"
  - 显示"未找到材料"
  - Shows "No materials found"
  
- [ ] **2.5** 清空搜索框
  - 恢复显示所有材料
  - Restores all materials display

### 组成显示 / Composition Display

- [ ] **2.6** 表格中组成显示为下标格式
  - Al₂Cu₄ 而非 Al2Cu4
  - Al₂Cu₄ instead of Al2Cu4
  
- [ ] **2.7** 详情页组成显示为下标格式
  - Detail page uses subscript format

### 实时搜索 / Real-time Search

- [ ] **2.8** 输入时实时更新结果
  - Results update in real-time while typing
  
- [ ] **2.9** 搜索时统计数量实时更新
  - Statistics update in real-time during search

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 3️⃣ 多维度数据 - 表格展开 / Multi-dimensional Data - Table Expansion

### 展开/收起功能 / Expand/Collapse

- [ ] **3.1** 单数据点材料不显示展开按钮
  - Materials with single data point show no expand button
  
- [ ] **3.2** 多数据点材料显示 ▶ 按钮
  - Materials with multiple data points show ▶ button
  
- [ ] **3.3** 点击 ▶ 按钮展开子表格
  - Clicking ▶ expands sub-table
  - 按钮变为 ▼
  - Button changes to ▼
  
- [ ] **3.4** 展开后显示所有数据点
  - All data points shown after expansion
  - 包含温度、来源列
  - Includes temperature, source columns
  
- [ ] **3.5** 点击 ▼ 按钮收起子表格
  - Clicking ▼ collapses sub-table
  - 按钮变回 ▶
  - Button changes back to ▶

### 主行数据标注 / Main Row Data Labels

- [ ] **3.6** 主行显示数据点标注
  - 格式: `值 (温度, 来源)`
  - Format: `value (temperature, source)`
  - 例如: `3.52 (0K, DFT)`
  - Example: `3.52 (0K, DFT)`

### 子表格内容 / Sub-table Content

- [ ] **3.7** 子表格有表头
  - 温度 / Temperature
  - 来源 / Source
  - 对应属性列
  - Corresponding property columns
  
- [ ] **3.8** 子表格数据准确
  - 与原始数据匹配
  - Matches original data
  
- [ ] **3.9** 子表格可滚动（如果列太多）
  - Sub-table scrollable if many columns

### 多材料展开 / Multiple Material Expansion

- [ ] **3.10** 可以同时展开多个材料
  - Can expand multiple materials simultaneously
  
- [ ] **3.11** 展开状态在筛选后保持
  - Expansion state persists after filtering

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 4️⃣ 多维度数据 - 详情页切换 / Multi-dimensional Data - Detail Page Switching

### 数据源选择器 / Data Source Selector

- [ ] **4.1** 单数据点材料不显示选择器
  - Materials with single data point show no selector
  
- [ ] **4.2** 多数据点材料显示下拉选择器
  - Materials with multiple data points show dropdown
  
- [ ] **4.3** 下拉列表包含所有数据点
  - 格式: `温度, 来源`
  - Format: `temperature, source`
  - 例如: `0K, DFT`
  - Example: `0K, DFT`

### 数据切换 / Data Switching

- [ ] **4.4** 选择不同数据源
  - 页面内容立即更新
  - Page content updates immediately
  
- [ ] **4.5** 结构信息更新正确
  - Structure info updates correctly
  
- [ ] **4.6** 热力学信息更新正确
  - Thermodynamics info updates correctly
  
- [ ] **4.7** 力学信息更新正确
  - Mechanics info updates correctly
  
- [ ] **4.8** 缺陷信息更新正确
  - Defects info updates correctly

### 3D结构联动 / 3D Structure Sync

- [ ] **4.9** 切换数据源时，如果POSCAR不同
  - 3D结构自动更新
  - 3D structure auto-updates
  
- [ ] **4.10** 切换数据源时，如果没有POSCAR
  - 显示"无POSCAR数据"
  - Shows "No POSCAR data"

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 5️⃣ POSCAR 3D可视化 / POSCAR 3D Visualization

### 基础显示 / Basic Display

- [ ] **5.1** 有POSCAR的材料在表格显示 🔬 图标
  - Materials with POSCAR show 🔬 icon in table
  
- [ ] **5.2** 打开详情后3D查看器自动加载
  - 3D viewer auto-loads after opening details
  
- [ ] **5.3** 3D结构正确渲染
  - 原子显示正确
  - Atoms render correctly
  - 键连接合理
  - Bonds look reasonable

### 交互控制 / Interactive Controls

- [ ] **5.4** 鼠标左键拖拽旋转
  - Left mouse drag rotates structure
  
- [ ] **5.5** 鼠标滚轮缩放
  - Mouse wheel zooms in/out
  
- [ ] **5.6** 鼠标右键拖拽平移
  - Right mouse drag pans view

### 按钮功能 / Button Functions

- [ ] **5.7** 点击"重置视角"按钮
  - 结构恢复初始视角
  - Structure returns to initial view
  
- [ ] **5.8** 点击"切换样式"按钮
  - 样式循环: 球棒 → 棒状 → 线状 → 球形
  - Style cycles: ball-stick → stick → line → sphere
  
- [ ] **5.9** 点击"下载POSCAR"按钮
  - POSCAR文件下载成功
  - POSCAR file downloads successfully
  - 文件内容正确
  - File content is correct

### 错误处理 / Error Handling

- [ ] **5.10** 无POSCAR时不显示3D查看器
  - No 3D viewer shown when POSCAR missing
  
- [ ] **5.11** POSCAR加载失败时显示错误信息
  - Error message shown when POSCAR fails to load
  
- [ ] **5.12** 错误信息清晰易懂
  - Error message is clear and understandable

### 性能测试 / Performance Test

- [ ] **5.13** 大结构（>100原子）加载流畅
  - Large structures (>100 atoms) load smoothly
  
- [ ] **5.14** 多次打开/关闭详情不卡顿
  - No lag when opening/closing details multiple times

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 6️⃣ 数据导出系统 / Data Export System

### 导出对话框 / Export Dialog

- [ ] **6.1** 点击"📥 Export"按钮打开对话框
  - Clicking "📥 Export" opens dialog
  
- [ ] **6.2** 对话框布局清晰
  - Dialog layout is clear
  
- [ ] **6.3** 点击背景或X关闭对话框
  - Clicking background or X closes dialog

### 导出格式选择 / Export Format Selection

- [ ] **6.4** JSON选项可选择
  - JSON option is selectable
  - 显示描述文字
  - Shows description text
  
- [ ] **6.5** CSV选项可选择
  - CSV option is selectable
  - 显示描述文字
  - Shows description text

### 导出范围选择 / Export Range Selection

#### 全部材料 / All Materials

- [ ] **6.6** 选择"全部材料"
  - 导出数据库所有材料
  - Exports all materials in database
  
#### 当前筛选结果 / Current Filtered Results

- [ ] **6.7** 设置类型筛选为"固溶体"
  - 显示筛选材料数量
  - Shows filtered material count
  
- [ ] **6.8** 选择"当前筛选结果"导出
  - 只导出固溶体材料
  - Only exports solid-solution materials

#### 选择的材料 / Selected Materials

- [ ] **6.9** 选择"选择的材料"
  - 显示材料选择列表
  - Shows material selector list
  
- [ ] **6.10** 材料列表可滚动
  - Material list is scrollable
  
- [ ] **6.11** 勾选/取消勾选材料
  - 选择状态正确更新
  - Selection state updates correctly
  
- [ ] **6.12** 使用搜索框筛选材料
  - 列表实时过滤
  - List filters in real-time
  
- [ ] **6.13** 全选功能正常工作
  - Select all works correctly
  
- [ ] **6.14** 导出只包含选中的材料
  - Export includes only selected materials

### 属性选择 / Property Selection

- [ ] **6.15** 勾选"结构"
  - 导出包含结构数据
  - Export includes structure data
  
- [ ] **6.16** 勾选"热力学"
  - 导出包含热力学数据
  - Export includes thermodynamics data
  
- [ ] **6.17** 勾选"力学"
  - 导出包含力学数据
  - Export includes mechanics data
  
- [ ] **6.18** 勾选"缺陷"
  - 导出包含缺陷数据
  - Export includes defects data
  
- [ ] **6.19** 取消所有勾选尝试导出
  - 显示错误提示
  - Shows error message
  
- [ ] **6.20** 选择部分属性
  - 导出只包含选中的属性
  - Export includes only selected properties

### JSON导出测试 / JSON Export Test

- [ ] **6.21** 选择JSON格式导出
  - 文件下载成功
  - File downloads successfully
  
- [ ] **6.22** 文件名包含时间戳
  - 格式: `alloy_materials_YYYY-MM-DD.json`
  - Format: `alloy_materials_YYYY-MM-DD.json`
  
- [ ] **6.23** 打开JSON文件
  - 格式正确，可以解析
  - Format is correct, parseable
  
- [ ] **6.24** 检查JSON结构
  - 包含所有材料
  - Includes all materials
  - 保留V2嵌套结构
  - Preserves V2 nested structure
  - data数组包含多个数据点
  - data array contains multiple points
  
- [ ] **6.25** JSON格式化美观
  - 有缩进，易读
  - Indented, readable

### CSV导出测试 / CSV Export Test

- [ ] **6.26** 选择CSV格式导出
  - 文件下载成功
  - File downloads successfully
  
- [ ] **6.27** 文件名包含时间戳
  - 格式: `alloy_materials_YYYY-MM-DD.csv`
  - Format: `alloy_materials_YYYY-MM-DD.csv`
  
- [ ] **6.28** 用Excel/Numbers打开CSV
  - 文件正常打开
  - File opens normally
  
- [ ] **6.29** 检查CSV表头
  - 包含: ID, Name, Type, Composition
  - Includes: ID, Name, Type, Composition
  - 包含: Temperature, Source
  - Includes: Temperature, Source
  - 包含所有属性列
  - Includes all property columns
  
- [ ] **6.30** 检查CSV数据行
  - 每个数据点一行
  - One row per data point
  - 材料A有3个数据点 → 3行
  - Material A with 3 points → 3 rows
  
- [ ] **6.31** 检查嵌套数据处理
  - interstitialEnergy正确展开或JSON化
  - interstitialEnergy correctly expanded or JSONified
  
- [ ] **6.32** 检查中文字符
  - 中文正确显示，无乱码
  - Chinese displays correctly, no garbled text

### 边界测试 / Edge Cases

- [ ] **6.33** 导出空筛选结果
  - 显示"无数据导出"错误
  - Shows "No data to export" error
  
- [ ] **6.34** 导出大量数据（>100材料）
  - 导出成功，不卡顿
  - Exports successfully, no lag
  
- [ ] **6.35** 取消导出操作
  - 对话框正常关闭
  - Dialog closes normally
  - 不产生文件下载
  - No file download occurs

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 7️⃣ 统计功能 / Statistics

### 基础统计 / Basic Statistics

- [ ] **7.1** 页面加载时显示正确统计
  - `找到 X 种材料，共 Y 条数据`
  - `Found X materials with Y data points`
  
- [ ] **7.2** 类型筛选后统计更新
  - 材料数正确
  - Material count correct
  - 数据点数正确
  - Data point count correct
  
- [ ] **7.3** 搜索后统计更新
  - 实时更新统计数字
  - Real-time statistics update

### 统计准确性 / Statistics Accuracy

- [ ] **7.4** 验证材料数计算
  - 手动计数 = 统计显示
  - Manual count = displayed count
  
- [ ] **7.5** 验证数据点数计算
  - 考虑多温度/多来源
  - Accounts for multi-temp/multi-source
  - 手动计数 = 统计显示
  - Manual count = displayed count

### 语言切换 / Language Switching

- [ ] **7.6** 中文显示
  - `找到 15 种材料，共 42 条数据`
  
- [ ] **7.7** 英文显示
  - `Found 15 materials with 42 data points`

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 8️⃣ 国际化 / Internationalization

### 语言切换 / Language Switching

- [ ] **8.1** 点击"EN"切换到英文
  - 所有UI文字变为英文
  - All UI text changes to English
  
- [ ] **8.2** 点击"中"切换到中文
  - 所有UI文字变为中文
  - All UI text changes to Chinese

### 新功能翻译完整性 / New Feature Translation Completeness

- [ ] **8.3** 材料类型标签已翻译
  - Type tabs translated
  
- [ ] **8.4** 表格列名已翻译
  - Table column names translated
  
- [ ] **8.5** 详情页数据源选择器已翻译
  - Detail page data source selector translated
  
- [ ] **8.6** 3D查看器按钮已翻译
  - 3D viewer buttons translated
  
- [ ] **8.7** 导出对话框完全翻译
  - 标题 / Title
  - 格式选项 / Format options
  - 范围选项 / Range options
  - 属性选项 / Property options
  - 按钮文字 / Button text
  - 描述文字 / Description text
  
- [ ] **8.8** 统计文字已翻译
  - Statistics text translated
  
- [ ] **8.9** 错误提示已翻译
  - Error messages translated

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 9️⃣ 用户体验 / User Experience

### 响应速度 / Response Speed

- [ ] **9.1** 类型筛选响应 < 100ms
  - Type filtering responds < 100ms
  
- [ ] **9.2** 搜索响应 < 200ms
  - Search responds < 200ms
  
- [ ] **9.3** 展开行响应 < 50ms
  - Row expansion responds < 50ms
  
- [ ] **9.4** 3D结构加载 < 2s
  - 3D structure loads < 2s
  
- [ ] **9.5** 导出对话框打开 < 100ms
  - Export dialog opens < 100ms

### 视觉反馈 / Visual Feedback

- [ ] **9.6** 按钮有悬停效果
  - Buttons have hover effects
  
- [ ] **9.7** 可点击元素有视觉提示
  - Clickable elements have visual cues
  
- [ ] **9.8** 加载状态有指示
  - Loading states are indicated
  
- [ ] **9.9** 过渡动画流畅
  - Transition animations are smooth

### 错误处理 / Error Handling

- [ ] **9.10** 网络错误有友好提示
  - Network errors show friendly messages
  
- [ ] **9.11** 数据加载失败有重试选项
  - Data load failures offer retry options
  
- [ ] **9.12** 用户操作错误有明确指引
  - User operation errors have clear guidance

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 🔟 兼容性测试 / Compatibility Testing

### 浏览器兼容性 / Browser Compatibility

- [ ] **10.1** Chrome: 所有功能正常
  - Chrome: All features work
  
- [ ] **10.2** Firefox: 所有功能正常
  - Firefox: All features work
  
- [ ] **10.3** Safari: 所有功能正常
  - Safari: All features work
  
- [ ] **10.4** Edge: 所有功能正常
  - Edge: All features work

### 设备兼容性 / Device Compatibility

- [ ] **10.5** 桌面端: 布局正常
  - Desktop: Layout normal
  
- [ ] **10.6** 平板: 布局正常
  - Tablet: Layout normal
  
- [ ] **10.7** 手机: 布局正常
  - Mobile: Layout normal

### 数据兼容性 / Data Compatibility

- [ ] **10.8** V1数据正常显示
  - V1 data displays normally
  
- [ ] **10.9** V2数据正常显示
  - V2 data displays normally
  
- [ ] **10.10** V1→V2混合数据正常工作
  - V1→V2 mixed data works normally

**测试结果 / Test Result**: ✅ Pass / ❌ Fail / ⏸️ Skipped  
**备注 / Notes**: 

---

## 📊 测试总结 / Test Summary

### 测试统计 / Test Statistics

- **总测试项 / Total Tests**: 150+
- **通过 / Passed**: ___
- **失败 / Failed**: ___
- **跳过 / Skipped**: ___
- **通过率 / Pass Rate**: ___%

### 严重问题 / Critical Issues

| 编号 ID | 问题描述 Description | 优先级 Priority | 状态 Status |
|---------|---------------------|----------------|-------------|
| | | | |

### 一般问题 / General Issues

| 编号 ID | 问题描述 Description | 优先级 Priority | 状态 Status |
|---------|---------------------|----------------|-------------|
| | | | |

### 改进建议 / Improvement Suggestions

1. 
2. 
3. 

### 测试结论 / Test Conclusion

- [ ] ✅ **通过 / PASS** - 可以部署到生产环境
  - Ready to deploy to production
  
- [ ] ❌ **不通过 / FAIL** - 需要修复问题后重新测试
  - Needs fixes before re-testing
  
- [ ] ⚠️ **有保留通过 / PASS WITH RESERVATIONS** - 有小问题但不影响核心功能
  - Minor issues but core functions work

---

## 🔄 测试更新记录 / Test Update Log

| 日期 Date | 测试人 Tester | 版本 Version | 结果 Result | 备注 Notes |
|-----------|---------------|--------------|-------------|------------|
| 2026-01-08 | | V2.0.0 | | Initial checklist |
| | | | | |

---

*文档创建 / Document created: 2026-01-08*  
*最后更新 / Last updated: 2026-01-08*

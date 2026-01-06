# Material Detail View Feature / 材料详情查看功能

## Overview / 概述

**English:** Added a comprehensive detail view feature that allows users to click on any material in the table to see all its properties, including chart visualizations for RDF and stress-strain data.

**中文：** 新增了全面的详情查看功能，用户可以点击表格中的任何材料查看其所有性质，包括径向分布函数和应力应变曲线的图表可视化。

## Features / 功能特性

### 1. Detail View Button / 详情查看按钮

- **Location / 位置:** Added to the rightmost column of all tables
- **Icon / 图标:** 👁️ (eye icon)
- **Trigger / 触发:** Click to open detail modal

### 2. Modal Popup / 弹窗模态框

**Design / 设计:**
- Overlay with semi-transparent background / 半透明背景遮罩
- Centered modal with smooth slide-in animation / 居中弹窗带平滑滑入动画
- Close button (×) in top-right corner / 右上角关闭按钮
- Click outside to close / 点击外部关闭
- Responsive design / 响应式设计

### 3. Information Display / 信息展示

The detail view is organized into sections / 详情视图按类别组织：

#### Basic Information / 基本信息
- Material ID / 材料ID
- Name / 名称
- Type (Crystalline/Amorphous/Interface) / 类型（晶态/非晶态/界面）
- Elements / 元素组成
- Density / 密度

#### Structure Properties / 结构性质
- Lattice constants (a, b, c) / 晶格常数
- Radial Distribution Function (RDF) / 径向分布函数
  - Displayed as image if URL / 如果是URL则显示为图片
  - Plotted as chart if array data / 如果是数组则绘制图表

#### Thermodynamics Properties / 热力学性质
- Specific heat capacity / 比热容
- Mixing enthalpy / 混合焓
- Diffusion coefficient / 扩散系数
- Thermal expansion coefficient / 热膨胀系数

#### Mechanics Properties / 力学性能
- Elastic constants (C11, C12, C44) / 弹性常数
- Young's modulus / 杨氏模量
- Poisson's ratio / 泊松比
- Stress-strain curve / 应力应变曲线
  - Displayed as image if URL / 如果是URL则显示为图片
  - Plotted as chart if array data / 如果是数组则绘制图表

#### Defect Properties / 缺陷性质
- Vacancy formation energy / 空位形成能
- Interstitial formation energy / 间隙形成能
- Stacking fault energy / 层错能

### 4. Chart Visualization / 图表可视化

**Two types of data support / 支持两种数据类型:**

#### A. Image URL / 图片URL
When the data is a string URL:
```json
{
  "structure": {
    "rdf": "https://example.com/rdf-plot.png"
  }
}
```
- Displays as an embedded image / 显示为嵌入图片
- Responsive sizing / 响应式尺寸
- Click to view full size / 点击查看完整尺寸

#### B. Array Data / 数组数据
When the data is an array:
```json
{
  "structure": {
    "rdf": [
      {"x": 0, "y": 0},
      {"x": 1, "y": 2.5},
      {"x": 2, "y": 3.8}
    ]
  }
}
```
or simple format:
```json
{
  "structure": {
    "rdf": [0, 2.5, 3.8, 4.2, 3.1]
  }
}
```
- Rendered using HTML5 Canvas / 使用HTML5 Canvas渲染
- Simple line plot / 简单折线图
- Axes and labels / 坐标轴和标签
- Responsive canvas / 响应式画布

### 5. Bilingual Support / 双语支持

All detail view text automatically switches based on language selection:
所有详情视图文本根据语言选择自动切换：

- Section headers / 章节标题
- Property labels / 属性标签
- Units / 单位
- Messages / 消息提示

## Usage / 使用方法

### For Users / 用户使用

1. **Browse the table / 浏览表格**
   - Use filters and search to find materials / 使用筛选和搜索查找材料

2. **Click the eye icon / 点击眼睛图标**
   - Located in the last column / 位于最后一列
   - Click 👁️ button for any material / 点击任意材料的👁️按钮

3. **View details / 查看详情**
   - All properties displayed in organized sections / 所有性质按类别组织显示
   - Charts rendered automatically / 图表自动渲染
   - Scroll to see all information / 滚动查看所有信息

4. **Close the modal / 关闭弹窗**
   - Click the × button / 点击×按钮
   - Click outside the modal / 点击弹窗外部
   - Press ESC key (if implemented) / 按ESC键（如已实现）

### For Data Providers / 数据提供者

To enable chart visualization, provide data in one of these formats:

#### Option 1: Image URL / 选项1：图片URL
```json
{
  "name": "Material-001",
  "structure": {
    "rdf": "https://your-server.com/data/material-001-rdf.png"
  },
  "mechanics": {
    "stressStrain": "https://your-server.com/data/material-001-stress.png"
  }
}
```

#### Option 2: Data Points / 选项2：数据点
```json
{
  "name": "Material-001",
  "structure": {
    "rdf": [
      [0, 0],
      [0.5, 1.2],
      [1.0, 2.3],
      [1.5, 3.1]
    ]
  },
  "mechanics": {
    "stressStrain": [
      {"x": 0, "y": 0},
      {"x": 0.01, "y": 50},
      {"x": 0.02, "y": 100}
    ]
  }
}
```

#### Option 3: Simple Array / 选项3：简单数组
```json
{
  "name": "Material-001",
  "structure": {
    "rdf": [0, 1.2, 2.3, 3.1, 2.8, 1.5, 0.8]
  }
}
```

## Technical Details / 技术细节

### Implementation / 实现

- **Modal System / 模态框系统:** Pure JavaScript, no external dependencies
- **Chart Rendering / 图表渲染:** HTML5 Canvas API
- **Responsive / 响应式:** CSS Grid and Flexbox
- **Animation / 动画:** CSS transitions and keyframes
- **Accessibility / 可访问性:** Keyboard navigation support

### Browser Support / 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance / 性能

- Lazy rendering: Charts only rendered when modal opens / 延迟渲染：仅在打开弹窗时渲染图表
- Efficient DOM manipulation / 高效的DOM操作
- Smooth 60fps animations / 流畅的60fps动画

## Examples / 示例

### Example 1: Material with Image Charts
```javascript
// Click on "AlNiCu-Crystal-001"
// See detailed properties
// View RDF and stress-strain as embedded images
```

### Example 2: Material with Array Data
```javascript
// Click on "AlZr-Amorphous-025"
// See all thermodynamic properties
// View plotted RDF curve from array data
```

### Example 3: Mobile View
```javascript
// Open on mobile device
// Click detail button
// Modal adapts to screen size
// Scroll to view all sections
```

## Future Enhancements / 未来增强

Potential improvements:
- Interactive charts with zoom/pan / 可交互图表（缩放/平移）
- Export detail as PDF / 导出详情为PDF
- Compare multiple materials / 比较多个材料
- Advanced chart library integration (Chart.js, D3.js) / 集成高级图表库
- Download chart images / 下载图表图片
- Print-friendly layout / 打印友好布局

## Testing / 测试

To test the feature:

1. Visit: https://wqchen007.github.io/jkw-7element-alloy-database/
2. Click any 👁️ button in the table
3. Verify all sections display correctly
4. Test chart rendering (if data available)
5. Test language switching
6. Test on mobile device
7. Test modal close functions

## Troubleshooting / 故障排除

**Modal doesn't open:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Charts don't display:**
- Verify data format in materials.json
- Check if URL is accessible
- Ensure array data is properly formatted

**Mobile layout issues:**
- Clear browser cache
- Check viewport meta tag
- Test in different mobile browsers

## Support / 支持

For issues or questions:
- GitHub Issues: https://github.com/wqchen007/jkw-7element-alloy-database/issues
- Documentation: See README.md and CONTRIBUTING.md

# Browser Cache Clearing Guide
## 浏览器缓存清除指南

**Problem / 问题**: The website shows old data (2 materials) instead of new data (100 materials)  
**原因**: Browser is loading cached files instead of new data

---

## ✅ Data Deployment Verified / 数据部署已确认

The new data **IS deployed** and accessible:
- URL: https://wqchen007.github.io/jkw-7element-alloy-database/data/materials.json
- Materials count: **100** ✅
- Data points: **258** ✅

新数据**已部署**并可访问：
- 材料数量：**100个** ✅
- 数据点数量：**258个** ✅

---

## 🔧 Solution: Clear Browser Cache / 解决方案：清除浏览器缓存

### Method 1: Hard Refresh (Recommended) / 方法1：强制刷新（推荐）

**Windows/Linux:**
- Press `Ctrl + Shift + R`
- Or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`

### Method 2: Clear Specific Site Cache / 方法2：清除特定站点缓存

#### Chrome / Edge
1. Right-click on the page
2. Select "Inspect" or press `F12`
3. Open "Application" tab
4. Under "Storage", click "Clear site data"
5. Refresh the page

#### Firefox
1. Press `F12` to open Developer Tools
2. Go to "Storage" tab
3. Right-click on the site URL
4. Select "Delete All"
5. Refresh the page

#### Safari
1. Press `Cmd + Option + E` to empty caches
2. Or go to Safari > Preferences > Advanced
3. Enable "Show Develop menu"
4. Develop > Empty Caches

### Method 3: Incognito/Private Mode / 方法3：隐私模式

Open the website in:
- **Chrome**: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- **Firefox**: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- **Edge**: `Ctrl+Shift+N`
- **Safari**: `Cmd+Shift+N`

This will load the page without any cached data.

### Method 4: Disable Cache in DevTools / 方法4：开发者工具禁用缓存

1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh the page

---

## 🎯 What You Should See After Clearing Cache / 清除缓存后应看到的内容

### Statistics Bar / 统计栏
```
找到 100 种材料，共 258 条数据
Found 100 materials with 258 data points
```

### Material Examples / 材料示例
- Al3Zr3-intermetallic
- Fe3Co4-ss
- Ti
- Ni2Cu3-intermetallic
- Al3Fe2Ta1-amorphous
- Cu/Zr-interface

### Material Type Distribution / 材料类型分布
- Element (单质): 18 materials
- Solid Solution (固溶体): 18 materials
- Intermetallic (金属间化合物): 24 materials
- Amorphous (非晶): 19 materials
- Interface (界面): 21 materials

### Features to Test / 可测试功能
- ✅ Click type tabs - each should show materials
- ✅ Search "Al" - should find ~40 materials
- ✅ Click ▶ on materials - expand multi-temperature data
- ✅ Click material names - open detail view
- ✅ Export button - test JSON/CSV export
- ✅ Language toggle - EN/中

---

## 🐛 Still Not Working? / 仍然不工作？

### Check if data is loaded:
1. Open Developer Console (`F12`)
2. Go to "Console" tab
3. Type: `allData.length`
4. Should show: `100`

### Check network request:
1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Refresh page
4. Find `materials.json` request
5. Click on it
6. Check "Response" - should show 100 materials

### If still showing old data:
The issue might be browser cache is very persistent. Try:
1. Clear ALL browser data (History, Cookies, Cache)
2. Restart browser
3. Or use a different browser

---

## 📞 Support / 支持

If none of these methods work, please report:
1. Browser name and version
2. Operating system
3. Screenshot of what you see
4. Console errors (if any)

GitHub Issues: https://github.com/wqchen007/jkw-7element-alloy-database/issues

---

*Last Updated: 2026-01-08*

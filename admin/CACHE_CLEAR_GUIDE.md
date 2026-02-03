# 浏览器缓存清除指南 / Browser Cache Clear Guide

## 问题说明 / Issue Description

如果您更新了网站但仍看到旧版本的内容，这通常是由于浏览器缓存导致的。

If you've updated the website but still see the old version, it's usually due to browser caching.

---

## 快速解决方法 / Quick Solutions

### 方法 1：强制刷新 / Force Refresh

**Windows/Linux:**
- Chrome/Edge/Firefox: `Ctrl + Shift + R` 或 `Ctrl + F5`
- Opera: `Ctrl + F5`

**Mac:**
- Chrome/Safari/Edge: `Cmd + Shift + R`
- Firefox: `Cmd + Shift + R` 或 `Cmd + F5`

### 方法 2：清除特定网站缓存 / Clear Site Cache

#### Chrome / Edge

1. 按 `F12` 打开开发者工具 / Press `F12` to open DevTools
2. 右键点击刷新按钮 / Right-click the refresh button
3. 选择"清空缓存并硬性重新加载" / Select "Empty Cache and Hard Reload"

#### Firefox

1. 按 `F12` 打开开发者工具 / Press `F12` to open DevTools
2. 右键点击刷新按钮 / Right-click the refresh button
3. 选择"清空缓存并强制刷新" / Select "Empty Cache and Force Refresh"

#### Safari

1. 打开"开发"菜单 / Open "Develop" menu
   - 如未看到，在Safari > 设置 > 高级中启用"显示开发菜单"
   - If not visible, enable it in Safari > Preferences > Advanced > "Show Develop menu"
2. 点击"清空缓存" / Click "Empty Caches"
3. 刷新页面 / Refresh the page

---

## 方法 3：完全清除浏览器缓存 / Complete Cache Clear

### Chrome / Edge

1. 按 `Ctrl + Shift + Delete` (Windows/Linux) 或 `Cmd + Shift + Delete` (Mac)
2. 选择"缓存的图片和文件" / Select "Cached images and files"
3. 时间范围选择"全部" / Time range: "All time"
4. 点击"清除数据" / Click "Clear data"

### Firefox

1. 按 `Ctrl + Shift + Delete` (Windows/Linux) 或 `Cmd + Shift + Delete` (Mac)
2. 选择"缓存" / Select "Cache"
3. 时间范围选择"全部" / Time range: "Everything"
4. 点击"立即清除" / Click "Clear Now"

### Safari

1. Safari > 设置 > 隐私 / Safari > Preferences > Privacy
2. 点击"管理网站数据" / Click "Manage Website Data"
3. 搜索您的网站 / Search for your site
4. 点击"移除" / Click "Remove"

---

## 方法 4：无痕/隐私浏览模式 / Incognito/Private Mode

**Windows/Linux:**
- Chrome/Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

**Mac:**
- Chrome/Safari/Edge: `Cmd + Shift + N`
- Firefox: `Cmd + Shift + P`

在无痕模式下访问网站，可以看到最新版本而不受缓存影响。

Open your site in incognito/private mode to see the latest version without cache interference.

---

## 验证更新是否生效 / Verify Updates

访问您的网站后，检查以下内容：

After visiting your site, check:

1. **ID列** - 应显示数字序号 (1, 2, 3...) 而不是 source ID (如 "mp-bbgt")
   - **ID column** - Should show sequential numbers (1, 2, 3...) instead of source IDs (like "mp-bbgt")

2. **POSCAR文件** - 点击"View"展开材料详情，应看到"Structure File"链接
   - **POSCAR files** - Click "View" to expand details, should see "Structure File" link

3. **晶格参数** - 即使没有点群信息，也应显示 a, b, c, α, β, γ 参数
   - **Lattice parameters** - Should display a, b, c, α, β, γ even without point group info

---

## GitHub Pages 部署延迟 / GitHub Pages Deployment Delay

GitHub Pages 可能需要 1-5 分钟来部署更新。您可以：

GitHub Pages may take 1-5 minutes to deploy updates. You can:

1. 访问仓库的 Actions 标签页 / Visit the repository's Actions tab
2. 查看最新的"pages build and deployment"工作流 / Check the latest "pages build and deployment" workflow
3. 确认已成功完成（绿色✓）/ Ensure it's completed successfully (green ✓)
4. 等待几分钟后再访问网站 / Wait a few minutes before visiting the site

---

## 仍有问题？/ Still Having Issues?

如果清除缓存后仍有问题：

If issues persist after clearing cache:

1. 检查浏览器控制台是否有错误 / Check browser console for errors (F12 > Console)
2. 确认文件路径正确 / Verify file paths are correct
3. 检查 GitHub Actions 是否成功部署 / Check if GitHub Actions deployed successfully
4. 尝试不同的浏览器 / Try a different browser

---

## 联系支持 / Contact Support

如需帮助，请提供以下信息：
- 浏览器类型和版本
- 已尝试的缓存清除方法
- 浏览器控制台的错误信息（如有）

For help, please provide:
- Browser type and version
- Cache clearing methods tried
- Browser console error messages (if any)

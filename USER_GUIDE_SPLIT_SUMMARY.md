# USER_GUIDE 文件拆分说明
# USER_GUIDE File Split Summary

**Date / 日期**: 2026-02-03  
**Version / 版本**: V2.1

---

## 变更说明 / Change Summary

为了提高可维护性和用户体验，将原来的单一长文档（703行）拆分为三个独立文件。

To improve maintainability and user experience, the original long document (703 lines) has been split into three separate files.

---

## 文件结构 / File Structure

### 新结构 / New Structure

```
USER_GUIDE.md           (127 lines) - Index/landing page with language selection
USER_GUIDE_EN.md        (348 lines) - Complete English version
USER_GUIDE_CN.md        (636 lines) - Complete Chinese version (完整中文版本)
USER_GUIDE_FULL.md.backup          - Original file backup (原始备份)
```

### 旧结构 / Old Structure

```
USER_GUIDE.md           (703 lines) - Single bilingual document (混合双语文档)
```

---

## 优势 / Advantages

### 1. 可维护性 / Maintainability
- ✅ 独立维护中英文版本 / Maintain EN/CN versions independently
- ✅ 减少编辑冲突 / Reduce merge conflicts
- ✅ 清晰的文件组织 / Clear file organization

### 2. 用户体验 / User Experience
- ✅ 快速选择语言 / Quick language selection
- ✅ 专注单一语言内容 / Focus on single language
- ✅ 更好的导航体验 / Better navigation experience

### 3. 文档管理 / Documentation Management
- ✅ 易于翻译和更新 / Easy to translate and update
- ✅ 支持独立版本控制 / Support independent version control
- ✅ 保留完整备份 / Keep full backup

---

## 文件说明 / File Description

### USER_GUIDE.md (Index / 索引页)

**用途 / Purpose**: Language selection landing page / 语言选择首页

**内容 / Contents**:
- 双语标题和简介 / Bilingual title and introduction
- 语言选择链接 / Language selection links
- 快速概览（统计数据） / Quick overview (statistics)
- 快速导航表 / Quick navigation table
- 开发者资源链接 / Developer resource links

**特点 / Features**:
- 简洁明了 / Concise and clear
- 双语并列 / Bilingual side-by-side
- 快速跳转 / Quick navigation

### USER_GUIDE_EN.md (English / 英文完整版)

**用途 / Purpose**: Complete English user guide / 完整英文用户指南

**章节 / Sections**:
1. Database Contents - Material types, properties, data sources
2. Data Query - Web interface usage, search, filtering
3. Data Upload - CSV template, JSON format, file organization
4. Update Existing Data - 4 update modes with examples
5. Data Structure - Field specifications
6. FAQ - Common questions and answers
7. Technical Support - Links and contact

**特点 / Features**:
- 📘 纯英文内容 / Pure English content
- 📖 完整详细说明 / Complete detailed instructions
- 🔗 内部锚点导航 / Internal anchor navigation
- 🏠 返回主页链接 / Back to main page link

### USER_GUIDE_CN.md (Chinese / 中文完整版)

**用途 / Purpose**: Complete Chinese user guide / 完整中文用户指南

**章节 / Sections**:
1. 数据库内容 - 材料类型、性能、数据来源
2. 数据查询 - 网页界面使用、搜索、筛选
3. 数据上传 - CSV模板、JSON格式、文件组织
4. 更新已有数据 - 4种更新模式及示例
5. 数据结构 - 字段规范
6. 常见问题 - 常见问题解答
7. 技术支持 - 链接和联系方式

**特点 / Features**:
- 📙 纯中文内容 / Pure Chinese content
- 📖 完整详细说明 / Complete detailed instructions
- 🔗 内部锚点导航 / Internal anchor navigation
- 🏠 返回主页链接 / Back to main page link

---

## 使用指南 / Usage Guide

### 对于用户 / For Users

1. **访问主页** / **Visit main page**: Open `USER_GUIDE.md`
2. **选择语言** / **Select language**: Click on preferred language link
3. **阅读指南** / **Read guide**: Navigate through sections

### 对于维护者 / For Maintainers

#### 更新英文内容 / Update English Content
```bash
# Edit English version
vim USER_GUIDE_EN.md

# Commit changes
git add USER_GUIDE_EN.md
git commit -m "docs: update English user guide"
```

#### 更新中文内容 / Update Chinese Content
```bash
# Edit Chinese version
vim USER_GUIDE_CN.md

# Commit changes
git add USER_GUIDE_CN.md
git commit -m "docs: 更新中文用户指南"
```

#### 更新索引页 / Update Index Page
```bash
# Edit index page
vim USER_GUIDE.md

# Usually for: statistics, links, overview
# Commit changes
git add USER_GUIDE.md
git commit -m "docs: update user guide index"
```

---

## 向后兼容 / Backward Compatibility

### README.md 引用 / README.md References

原来的 README.md 引用保持不变，因为 `USER_GUIDE.md` 现在是索引页，可以引导用户选择语言。

Original README.md references remain unchanged, as `USER_GUIDE.md` is now an index page that guides users to select their language.

**Example**:
```markdown
- [📖 User Guide](USER_GUIDE.md) - Still works! Now shows language selection
```

### 外部链接 / External Links

所有指向 `USER_GUIDE.md` 的外部链接仍然有效，用户会看到语言选择页面。

All external links to `USER_GUIDE.md` still work, users will see the language selection page.

---

## 迁移检查清单 / Migration Checklist

- ✅ 创建 USER_GUIDE_EN.md / Created USER_GUIDE_EN.md
- ✅ 创建 USER_GUIDE_CN.md / Created USER_GUIDE_CN.md
- ✅ 创建新的 USER_GUIDE.md 索引页 / Created new USER_GUIDE.md index
- ✅ 保留原文件备份 / Kept original file backup
- ⚠️  检查其他文档中的引用 / Check references in other docs (recommended)
- ⚠️  更新 README.md 说明（如需要） / Update README.md notes (if needed)

---

## 备份文件 / Backup Files

### USER_GUIDE_FULL.md.backup

这是原始的703行混合双语文档的完整备份。如果需要恢复或参考原始内容，请使用此文件。

This is the full backup of the original 703-line mixed bilingual document. Use this file if you need to restore or reference the original content.

**恢复方法 / Recovery Method**:
```bash
# Restore original file
cp USER_GUIDE_FULL.md.backup USER_GUIDE.md
```

---

## 文件对应关系 / File Mapping

| Original Section | New Location |
|------------------|--------------|
| Lines 1-86 (English) | USER_GUIDE_EN.md |
| Lines 87-703 (Chinese) | USER_GUIDE_CN.md |
| New: Language selection | USER_GUIDE.md (index) |

---

## 注意事项 / Notes

1. **保持同步** / **Keep in sync**: 更新一种语言时，考虑更新另一种语言 / When updating one language, consider updating the other

2. **链接检查** / **Link check**: 定期检查内部锚点链接是否有效 / Regularly check if internal anchor links work

3. **版本号** / **Version number**: 三个文件应保持相同的版本号 / All three files should maintain the same version number

4. **备份管理** / **Backup management**: USER_GUIDE_FULL.md.backup 仅用于参考，不要频繁更新 / USER_GUIDE_FULL.md.backup is for reference only, don't update frequently

---

## 相关文档 / Related Documentation

- [README.md](README.md) - Project overview
- [docs/API.md](docs/API.md) - API documentation
- [docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) - Data format specification

---

**Last Updated / 最后更新**: 2026-02-03  
**Maintainer / 维护者**: Documentation Team

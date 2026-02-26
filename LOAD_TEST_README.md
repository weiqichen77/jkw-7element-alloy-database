# 并发负载测试工具 - 快速参考

## 🎯 验收标准：100并发用户

本项目提供完整的并发测试解决方案，满足100用户并发访问的验收要求。

---

## 🚀 快速开始（3种方式）

### 方式1：一键启动脚本（最简单）

```bash
# 运行交互式菜单
./run-load-test.sh

# 然后选择：
#   1 - 快速测试 (50并发)
#   2 - 标准测试 (100并发) ← 验收测试
#   3 - 压力测试 (150并发)
#   5 - Web界面测试
```

### 方式2：Node.js命令行（最灵活）

```bash
# 验收标准测试 (100并发)
node scripts/load-test.js \
  --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
  --concurrent 100 \
  --requests 5

# 查看帮助
node scripts/load-test.js --help
```

### 方式3：Web可视化界面（最直观）

```bash
# 在浏览器中打开
open test-load.html

# 或者使用任何HTTP服务器
python -m http.server 8080
# 然后访问 http://localhost:8080/test-load.html
```

---

## 📊 测试工具对比

| 工具 | 文件 | 适用场景 | 难度 |
|------|------|----------|------|
| **Web界面** | `test-load.html` | 快速测试、演示展示 | ⭐ 简单 |
| **Node.js脚本** | `scripts/load-test.js` | 开发测试、CI/CD | ⭐⭐ 中等 |
| **Artillery** | `scripts/load-test-artillery.yml` | 专业验收、详细报告 | ⭐⭐⭐ 高级 |
| **k6** | `scripts/load-test-k6.js` | 压力测试、持续监控 | ⭐⭐⭐ 高级 |

---

## 📈 性能指标说明

### 验收标准

✅ **必须满足**：
- 并发数：100用户
- 成功率：> 95%
- 平均响应时间：< 2秒

🎯 **期望达到**：
- 成功率：> 99%
- P95响应时间：< 2秒
- P99响应时间：< 3秒

### 评分等级

- **A+（95-100分）**：优秀 - 非常流畅 ✅
- **A（85-94分）**：良好 - 流畅 ✅
- **B（75-84分）**：中等 - 基本流畅 ⚠️
- **C（60-74分）**：合格 - 有些卡顿 ⚠️
- **D/F（<60分）**：不合格 ❌

---

## 📝 测试示例

### 示例1：快速验证（10秒内）

```bash
node scripts/load-test.js \
  --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
  --concurrent 20 \
  --requests 2
```

### 示例2：标准验收测试

```bash
node scripts/load-test.js \
  --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
  --concurrent 100 \
  --requests 5
```

### 示例3：本地开发测试

```bash
# 启动本地服务器
python -m http.server 8080 &

# 运行测试
node scripts/load-test.js \
  --url http://localhost:8080 \
  --concurrent 50
```

---

## 🔧 高级工具使用

### Artillery（推荐用于正式验收）

```bash
# 安装
npm install -g artillery@latest

# 运行测试
artillery run scripts/load-test-artillery.yml

# 生成HTML报告
artillery run --output report.json scripts/load-test-artillery.yml
artillery report --output report.html report.json
open report.html
```

### k6（推荐用于压力测试）

```bash
# 安装 (macOS)
brew install k6

# 运行测试
k6 run scripts/load-test-k6.js

# 自定义URL
BASE_URL=https://your-site.com k6 run scripts/load-test-k6.js
```

---

## 📖 完整文档

详细使用说明请查看：**[LOAD_TEST_GUIDE.md](LOAD_TEST_GUIDE.md)**

包含内容：
- 详细参数说明
- 高级配置选项
- CI/CD集成指南
- 性能优化建议
- 常见问题解答
- 最佳实践

---

## 📁 文件说明

```
项目根目录/
├── test-load.html                          # Web可视化测试界面
├── run-load-test.sh                        # 一键启动脚本
├── LOAD_TEST_GUIDE.md                      # 完整使用文档
└── scripts/
    ├── load-test.js                        # Node.js测试脚本
    ├── load-test-artillery.yml             # Artillery配置
    └── load-test-k6.js                     # k6测试脚本
```

---

## ✅ 测试清单

验收测试前请确认：

- [ ] 已选择合适的测试工具
- [ ] 已配置正确的测试URL
- [ ] 已设置100并发用户
- [ ] 网络连接稳定
- [ ] 目标网站正常运行
- [ ] 已准备记录测试结果

测试后请检查：

- [ ] 成功率 > 95%
- [ ] 平均响应时间 < 2秒
- [ ] 无严重错误或崩溃
- [ ] 已保存测试报告
- [ ] 如有问题，已记录优化计划

---

## 💡 提示

1. **首次测试**：建议先用50并发进行预热测试
2. **网络环境**：确保测试环境网络稳定
3. **GitHub Pages**：可能有速率限制，建议适当降低并发
4. **结果保存**：测试结果会自动保存为JSON文件
5. **问题排查**：查看控制台输出和错误日志

---

## 🆘 需要帮助？

- 📖 查看完整文档：`LOAD_TEST_GUIDE.md`
- 🔍 查看示例输出：运行演示测试观察输出格式
- 💬 提交Issue：如遇到问题请在GitHub提交Issue

---

**快速命令速查**：

```bash
# Web界面
open test-load.html

# 快速测试
./run-load-test.sh

# 标准测试 (100并发)
node scripts/load-test.js --url YOUR_URL --concurrent 100

# 专业测试
artillery run scripts/load-test-artillery.yml
k6 run scripts/load-test-k6.js
```

---

**最后更新**: 2026-02-26

# 并发负载测试使用指南

## 📋 目录

1. [概述](#概述)
2. [测试工具对比](#测试工具对比)
3. [快速开始](#快速开始)
4. [详细使用说明](#详细使用说明)
5. [性能指标说明](#性能指标说明)
6. [验收标准](#验收标准)
7. [常见问题](#常见问题)

---

## 概述

本项目提供了三种并发负载测试方案，用于验证网站在100个并发用户访问时的性能表现：

1. **Web界面测试工具** - 可视化测试工具，适合快速测试
2. **Node.js测试脚本** - 轻量级命令行工具
3. **专业测试工具** - Artillery/k6，生产级压测工具

---

## 测试工具对比

| 工具 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Web界面工具** | 🎨 直观可视化<br>✅ 无需安装<br>📊 实时反馈 | ⚠️ 受浏览器限制<br>⚠️ 并发数有限 | 快速测试<br>演示展示 |
| **Node.js脚本** | 🚀 轻量快速<br>✅ 易于定制<br>📈 详细统计 | ⚠️ 功能相对简单 | 开发测试<br>CI/CD集成 |
| **Artillery/k6** | 💪 功能强大<br>📊 指标全面<br>🎯 模拟真实场景 | ❌ 需要安装 | 生产验收<br>性能基准测试 |

---

## 快速开始

### 方案一：Web界面测试（推荐新手）

1. **打开测试页面**
   ```bash
   # 在浏览器中打开
   open test-load.html
   # 或者使用Live Server
   ```

2. **配置测试参数**
   - 测试网址：输入要测试的URL（默认为项目GitHub Pages地址）
   - 并发用户数：100（验收标准）
   - 每用户请求次数：3-5次

3. **开始测试**
   - 点击"开始测试"按钮
   - 等待测试完成
   - 查看性能评分和详细报告

4. **解读结果**
   - **A+/A等级**：优秀，满足要求
   - **B等级**：良好，基本满足
   - **C及以下**：需要优化

---

### 方案二：Node.js测试脚本

#### 1. 基本使用

```bash
# 使用默认配置（100并发）
node scripts/load-test.js --url https://weiqichen77.github.io/jkw-7element-alloy-database/

# 自定义并发数
node scripts/load-test.js \
  --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
  --concurrent 100 \
  --requests 5

# 本地测试
node scripts/load-test.js --url http://localhost:8080 --concurrent 50
```

#### 2. 参数说明

- `--url <url>`: 目标网址（必填）
- `--concurrent <num>`: 并发用户数（默认：100）
- `--requests <num>`: 每用户请求次数（默认：5）
- `--delay <ms>`: 请求间延迟毫秒数（默认：100）

#### 3. 输出结果

测试完成后会显示：
- 📊 基本统计（总请求、成功率、失败数）
- ⏱️ 响应时间分析（平均、最小、最大、P90/P95/P99）
- 🎯 性能评分和等级
- 💡 优化建议
- 📄 结果JSON文件（保存在当前目录）

#### 4. 结果文件

```bash
# 查看保存的结果文件
ls -lt load-test-results-*.json | head -1

# 查看详细结果
cat load-test-results-*.json | jq '.'
```

---

### 方案三：Artillery测试（推荐验收测试）

#### 1. 安装Artillery

```bash
# macOS
brew install artillery

# 或使用npm
npm install -g artillery@latest

# 验证安装
artillery --version
```

#### 2. 运行测试

```bash
# 基本测试
artillery run scripts/load-test-artillery.yml

# 生成详细报告
artillery run --output report.json scripts/load-test-artillery.yml
artillery report report.json

# 在浏览器中查看HTML报告
artillery report --output report.html report.json
open report.html
```

#### 3. 自定义URL

修改 `scripts/load-test-artillery.yml` 中的 `target` 字段：

```yaml
config:
  target: "https://your-domain.com"
```

#### 4. 测试阶段说明

- **阶段1（30秒）**：预热，逐步增加到5 req/s
- **阶段2（60秒）**：稳定负载，20 req/s
- **阶段3（30秒）**：压力峰值，50 req/s
- **阶段4（20秒）**：降温，5 req/s

---

### 方案四：k6测试（高级用户）

#### 1. 安装k6

```bash
# macOS
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6

# 验证安装
k6 version
```

#### 2. 运行测试

```bash
# 基本测试
k6 run scripts/load-test-k6.js

# 自定义目标URL
BASE_URL=https://your-domain.com k6 run scripts/load-test-k6.js

# 生成JSON报告
k6 run --out json=results.json scripts/load-test-k6.js

# 查看详细统计
k6 run --summary-export=summary.json scripts/load-test-k6.js
```

#### 3. 测试场景

k6脚本包含4个测试场景：

1. **访问主页（40%）**：加载HTML、CSS、JS
2. **加载数据（30%）**：获取materials.json
3. **浏览页面（20%）**：访问不同元素页面
4. **API查询（10%）**：执行多次数据查询

#### 4. 负载阶段

- 0-30秒：预热到20用户
- 30秒-1分30秒：增加到50用户
- 1分30秒-3分30秒：**峰值100用户**（验收阶段）
- 3分30秒-4分30秒：降到50用户
- 4分30秒-5分钟：冷却到0

---

## 详细使用说明

### Web界面工具详细说明

#### 功能特点

- ✅ 实时进度显示
- ✅ 可视化性能评分
- ✅ 详细统计表格
- ✅ 优化建议提示
- ✅ 历史结果保存（浏览器本地）

#### 使用技巧

1. **测试前准备**
   - 确保网络连接稳定
   - 关闭不必要的浏览器标签（释放资源）
   - 建议使用Chrome或Edge浏览器

2. **参数建议**
   - **首次测试**：50并发，3请求
   - **验收测试**：100并发，5请求
   - **压力测试**：150-200并发，10请求

3. **注意事项**
   - 浏览器并发受限于操作系统和浏览器设置
   - CORS可能影响某些请求（使用no-cors模式）
   - 测试时浏览器可能短暂卡顿（正常现象）

---

### Node.js脚本详细说明

#### 高级用法

##### 1. 批量测试不同并发数

```bash
#!/bin/bash
# 创建批量测试脚本

for concurrent in 10 25 50 75 100; do
  echo "Testing with $concurrent concurrent users..."
  node scripts/load-test.js \
    --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
    --concurrent $concurrent \
    --requests 5
  sleep 10  # 测试间隔
done
```

##### 2. 集成到CI/CD

```yaml
# .github/workflows/load-test.yml
name: Load Test

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每周日运行

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Load Test
        run: |
          node scripts/load-test.js \
            --url https://weiqichen77.github.io/jkw-7element-alloy-database/ \
            --concurrent 100 \
            --requests 5
```

##### 3. 性能基准对比

```bash
# 测试优化前
node scripts/load-test.js --url https://your-site.com --concurrent 100 > before.txt

# 应用优化...

# 测试优化后
node scripts/load-test.js --url https://your-site.com --concurrent 100 > after.txt

# 对比结果
diff before.txt after.txt
```

---

### Artillery详细配置

#### 自定义测试场景

编辑 `scripts/load-test-artillery.yml`：

```yaml
scenarios:
  # 添加自定义场景
  - name: "Custom Scenario"
    weight: 10
    flow:
      - get:
          url: "/your-endpoint"
          headers:
            Authorization: "Bearer token"
          expect:
            - statusCode: 200
      - think: 1
      - post:
          url: "/api/data"
          json:
            key: "value"
```

#### 性能阈值设置

```yaml
config:
  ensure:
    # 确保P99响应时间<3秒
    p99: 3000
    # 确保错误率<1%
    maxErrorRate: 0.01
```

#### 生成专业报告

```bash
# 安装报告插件
npm install -g artillery-plugin-expect
npm install -g artillery-plugin-metrics-by-endpoint

# 运行并生成HTML报告
artillery run \
  --output raw-report.json \
  scripts/load-test-artillery.yml

artillery report \
  --output performance-report.html \
  raw-report.json

# 打开报告
open performance-report.html
```

---

### k6详细配置

#### 自定义性能阈值

修改 `scripts/load-test-k6.js` 中的 `thresholds`：

```javascript
thresholds: {
  // 自定义阈值
  'http_req_duration': ['p(95)<1500', 'p(99)<2500'],
  'http_req_failed': ['rate<0.005'],  // 失败率<0.5%
  'success_rate': ['rate>0.995'],     // 成功率>99.5%
},
```

#### 分布式测试

```bash
# 在多台机器上同时运行
# 机器1
k6 run --tag instance=1 scripts/load-test-k6.js

# 机器2
k6 run --tag instance=2 scripts/load-test-k6.js

# 合并结果分析
```

#### 云端测试（k6 Cloud）

```bash
# 注册k6 Cloud账号
k6 login cloud

# 上传到云端运行
k6 cloud scripts/load-test-k6.js

# 查看实时结果
# 访问提供的URL查看详细报告
```

---

## 性能指标说明

### 关键指标

#### 1. 响应时间 (Response Time)

- **平均响应时间 (Average)**：所有请求的平均值
  - 优秀：< 500ms
  - 良好：500-1000ms
  - 可接受：1000-2000ms
  - 需优化：> 2000ms

- **中位数 P50**：50%的请求快于此值
  - 反映典型用户体验

- **P90/P95/P99**：90%/95%/99%的请求快于此值
  - P95和P99用于识别慢请求
  - **验收标准建议**：P95 < 2秒，P99 < 3秒

#### 2. 吞吐量 (Throughput)

- **定义**：单位时间内处理的请求数（req/s）
- **计算**：总请求数 ÷ 测试时长
- **验收标准**：
  - 100并发下 > 50 req/s（良好）
  - 100并发下 > 30 req/s（可接受）

#### 3. 成功率 (Success Rate)

- **定义**：成功请求占总请求的百分比
- **验收标准**：
  - 优秀：> 99.5%
  - 良好：99%-99.5%
  - 可接受：95%-99%
  - 不合格：< 95%

#### 4. 错误率 (Error Rate)

- **定义**：失败请求占总请求的百分比
- **验收标准**：< 1%（最多1%的请求可以失败）

### 性能等级评定

根据综合评分（0-100分）：

| 等级 | 分数范围 | 描述 | 用户体验 |
|------|----------|------|----------|
| **A+** | 95-100 | 优秀 | 非常流畅 |
| **A** | 85-94 | 良好 | 流畅 |
| **B** | 75-84 | 中等 | 基本流畅 |
| **C** | 60-74 | 合格 | 有些卡顿 |
| **D** | 40-59 | 较差 | 明显卡顿 |
| **F** | 0-39 | 不合格 | 严重卡顿 |

### 评分算法

```
初始分数 = 100分

响应时间扣分：
  > 5000ms：-50分
  > 3000ms：-40分
  > 2000ms：-30分
  > 1000ms：-20分
  > 500ms：-10分

成功率扣分：
  < 50%：-50分
  < 80%：-30分
  < 95%：-15分
  < 99%：-5分

最终得分 = 初始分数 - 响应时间扣分 - 成功率扣分
```

---

## 验收标准

### 项目验收标准：100并发用户

#### 必须满足（Must Have）

1. ✅ **并发数**：支持100个并发用户同时访问
2. ✅ **成功率**：> 95%的请求成功
3. ✅ **响应时间**：平均响应时间 < 2秒
4. ✅ **稳定性**：测试期间无崩溃或长时间hang

#### 期望满足（Should Have）

1. 🎯 **成功率**：> 99%
2. 🎯 **P95响应时间**：< 2秒
3. 🎯 **P99响应时间**：< 3秒
4. 🎯 **平均响应时间**：< 1秒

#### 最佳实践（Nice to Have）

1. ⭐ **成功率**：> 99.5%
2. ⭐ **平均响应时间**：< 500ms
3. ⭐ **P99响应时间**：< 2秒

### 推荐测试流程

```bash
# 1. 预热测试（50并发）
node scripts/load-test.js --url YOUR_URL --concurrent 50 --requests 3

# 2. 验收测试（100并发）
node scripts/load-test.js --url YOUR_URL --concurrent 100 --requests 5

# 3. 压力测试（150并发）
node scripts/load-test.js --url YOUR_URL --concurrent 150 --requests 5

# 4. 专业验收（Artillery）
artillery run scripts/load-test-artillery.yml

# 5. 生成报告
artillery report --output final-report.html report.json
```

### 测试清单

- [ ] 已完成预热测试（50并发）
- [ ] 已完成验收测试（100并发）
- [ ] 平均响应时间 < 2秒
- [ ] 成功率 > 95%
- [ ] 无严重错误或崩溃
- [ ] 已生成测试报告
- [ ] 已记录测试结果
- [ ] 如有问题，已制定优化计划

---

## 常见问题

### Q1: Web界面测试时浏览器卡死怎么办？

**A:** 这是正常现象，因为浏览器同时发起大量请求。建议：
- 降低并发数（50-80）
- 减少每用户请求次数
- 使用Node.js脚本或专业工具

### Q2: 测试结果显示大量失败，如何排查？

**A:** 按以下步骤排查：
1. 检查目标URL是否正确
2. 确认网络连接稳定
3. 查看是否有CORS限制
4. 检查服务器是否限流
5. 查看浏览器控制台错误信息

### Q3: GitHub Pages测试时成功率很低？

**A:** GitHub Pages有速率限制：
- 建议降低并发数（20-50）
- 增加请求间隔（--delay 500）
- 使用CDN加速
- 考虑迁移到其他托管平台

### Q4: 如何测试本地开发服务器？

**A:** 
```bash
# 1. 启动本地服务器
python -m http.server 8080
# 或
npx serve -p 8080

# 2. 运行测试
node scripts/load-test.js --url http://localhost:8080 --concurrent 100
```

### Q5: Artillery/k6安装失败怎么办？

**A:** 
```bash
# Artillery - 使用npm
npm install -g artillery@latest

# k6 - 使用预编译二进制
# macOS
brew install k6

# Linux - 直接下载
wget https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz
tar -xzf k6-v0.45.0-linux-amd64.tar.gz
sudo mv k6-v0.45.0-linux-amd64/k6 /usr/local/bin/
```

### Q6: 测试结果如何保存和分享？

**A:**
```bash
# Node.js脚本 - 自动保存JSON
node scripts/load-test.js --url YOUR_URL > test-output.txt
# 结果文件：load-test-results-*.json

# Artillery - 生成HTML报告
artillery run --output report.json scripts/load-test-artillery.yml
artillery report --output report.html report.json

# k6 - 导出JSON
k6 run --out json=results.json scripts/load-test-k6.js
```

### Q7: 如何与团队成员共享测试标准？

**A:** 
1. 将配置文件提交到Git仓库
2. 使用相同的测试参数
3. 记录测试环境信息（网络、设备等）
4. 建立基准性能指标
5. 定期运行回归测试

### Q8: 性能不达标如何优化？

**A:** 建议优化方向：

**前端优化**：
- 启用Gzip/Brotli压缩
- 压缩CSS/JS文件
- 优化图片（WebP格式）
- 使用CDN加速
- 启用浏览器缓存
- 代码分割和懒加载

**后端优化**：
- 启用服务器缓存
- 数据库查询优化
- 使用Redis缓存
- 增加服务器资源
- 负载均衡

**网络优化**：
- 使用HTTP/2或HTTP/3
- 减少DNS查询
- 启用Keep-Alive
- 使用CDN

---

## 高级技巧

### 1. 性能监控集成

```bash
# 使用Grafana监控k6结果
k6 run --out influxdb=http://localhost:8086/k6 scripts/load-test-k6.js

# 结合New Relic
k6 run --out statsd scripts/load-test-k6.js
```

### 2. 自动化测试

```bash
# 创建测试脚本
#!/bin/bash
# test-automation.sh

URL="https://weiqichen77.github.io/jkw-7element-alloy-database/"
THRESHOLD=85  # 最低分数阈值

# 运行测试
node scripts/load-test.js --url $URL --concurrent 100 > result.txt

# 提取分数（需要解析输出）
SCORE=$(grep "评分:" result.txt | grep -o '[0-9]*' | head -1)

# 判断是否通过
if [ "$SCORE" -ge "$THRESHOLD" ]; then
  echo "✅ 测试通过！分数: $SCORE"
  exit 0
else
  echo "❌ 测试失败！分数: $SCORE (要求: $THRESHOLD)"
  exit 1
fi
```

### 3. 多地域测试

使用云服务从不同地域测试：
- AWS Lambda
- Google Cloud Functions
- Azure Functions

---

## 总结

### 推荐方案选择

| 场景 | 推荐工具 |
|------|----------|
| 快速验证 | Web界面工具 |
| 开发测试 | Node.js脚本 |
| 正式验收 | Artillery |
| 持续监控 | k6 + CI/CD |
| 压力测试 | k6 |
| 演示展示 | Web界面工具 |

### 快速命令参考

   ```bash
# Web测试
open test-load.html

# Node.js测试
node scripts/load-test.js --url YOUR_URL --concurrent 100

# Artillery测试
artillery run scripts/load-test-artillery.yml

# k6测试
k6 run scripts/load-test-k6.js
```

---

## 联系支持

如遇到问题或需要帮助：
- 📧 提交GitHub Issue
- 📖 查看项目文档
- 💬 联系项目维护者

---

**最后更新**: 2026-02-26

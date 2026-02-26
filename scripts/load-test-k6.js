// k6 负载测试脚本
// 专业的负载测试工具，提供详细的性能指标
//
// 安装: brew install k6 (macOS) 或访问 https://k6.io/docs/getting-started/installation/
// 运行: k6 run load-test-k6.js
// 生成HTML报告: k6 run --out json=results.json load-test-k6.js && k6-reporter results.json

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// 自定义性能指标
const pageLoadTime = new Trend('page_load_time');
const successRate = new Rate('success_rate');
const errorCounter = new Counter('errors');

// 测试配置
export const options = {
  // 测试场景配置
  stages: [
    { duration: '30s', target: 20 },   // 预热：30秒内逐步增加到20个虚拟用户
    { duration: '1m', target: 50 },    // 增加负载：1分钟内增加到50个用户
    { duration: '2m', target: 100 },   // 峰值测试：2分钟保持100个并发用户
    { duration: '1m', target: 50 },    // 降低负载：1分钟降到50个用户
    { duration: '30s', target: 0 },    // 冷却：30秒内降到0
  ],
  
  // 性能阈值（验收标准）
  thresholds: {
    // HTTP请求失败率应低于1%
    http_req_failed: ['rate<0.01'],
    
    // 95%的请求应在2秒内完成
    http_req_duration: ['p(95)<2000'],
    
    // 平均响应时间应低于1秒
    http_req_duration: ['avg<1000'],
    
    // 99%的请求应在3秒内完成
    http_req_duration: ['p(99)<3000'],
    
    // 自定义成功率应高于99%
    success_rate: ['rate>0.99'],
  },
  
  // HTTP配置
  httpDebug: 'false',
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  
  // 批处理配置
  batch: 10,
  batchPerHost: 5,
};

// 基础URL（可通过环境变量覆盖）
const BASE_URL = __ENV.BASE_URL || 'https://weiqichen77.github.io/jkw-7element-alloy-database';

// 主测试函数
export default function () {
  // 场景1: 访问主页 (40% 权重)
  if (Math.random() < 0.4) {
    visitHomepage();
  }
  // 场景2: 加载数据 (30% 权重)
  else if (Math.random() < 0.7) {
    loadData();
  }
  // 场景3: 浏览多个页面 (20% 权重)
  else if (Math.random() < 0.9) {
    browseMultiplePages();
  }
  // 场景4: API查询 (10% 权重)
  else {
    performAPIQueries();
  }
  
  // 用户思考时间（模拟真实用户行为）
  sleep(Math.random() * 2 + 1); // 1-3秒随机延迟
}

// 场景1: 访问主页
function visitHomepage() {
  const startTime = new Date();
  
  // 加载主页
  const responses = http.batch([
    ['GET', `${BASE_URL}/`, null, { tags: { name: 'homepage' } }],
    ['GET', `${BASE_URL}/css/style.css`, null, { tags: { name: 'css' } }],
    ['GET', `${BASE_URL}/js/app.js`, null, { tags: { name: 'js' } }],
  ]);
  
  // 验证响应
  responses.forEach((res) => {
    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 2s': (r) => r.timings.duration < 2000,
    });
    
    successRate.add(success);
    if (!success) {
      errorCounter.add(1);
    }
  });
  
  const loadTime = new Date() - startTime;
  pageLoadTime.add(loadTime);
  
  sleep(1);
}

// 场景2: 加载数据
function loadData() {
  const res = http.get(`${BASE_URL}/data/materials.json`, {
    tags: { name: 'materials_data' }
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    'response time < 1s': (r) => r.timings.duration < 1000,
  });
  
  successRate.add(success);
  if (!success) {
    errorCounter.add(1);
  }
  
  sleep(0.5);
}

// 场景3: 浏览多个页面
function browseMultiplePages() {
  const elements = ['Al', 'Cu', 'Ni', 'Zr', 'Nb', 'Ta', 'W'];
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  
  // 访问主页
  http.get(`${BASE_URL}/`, { tags: { name: 'homepage_browse' } });
  sleep(1);
  
  // 加载特定元素数据
  const res = http.get(`${BASE_URL}/data/element/${randomElement}/materials.json`, {
    tags: { name: `element_${randomElement}` }
  });
  
  const success = check(res, {
    'element data loaded': (r) => r.status === 200 || r.status === 404, // 404也算正常（文件可能不存在）
  });
  
  successRate.add(success);
  
  sleep(2);
}

// 场景4: API查询
function performAPIQueries() {
  // 执行多次查询
  for (let i = 0; i < 3; i++) {
    const res = http.get(`${BASE_URL}/data/materials.json`, {
      tags: { name: 'api_query', iteration: i }
    });
    
    const success = check(res, {
      'query successful': (r) => r.status === 200,
    });
    
    successRate.add(success);
    if (!success) {
      errorCounter.add(1);
    }
    
    sleep(0.5);
  }
}

// 测试开始前的设置
export function setup() {
  console.log('🚀 开始负载测试...');
  console.log(`目标URL: ${BASE_URL}`);
  console.log('测试配置：逐步增加到100个并发用户');
  return { startTime: new Date() };
}

// 测试结束后的清理和报告
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  console.log(`\n✅ 测试完成！总时长: ${duration.toFixed(2)}秒`);
}

// 自定义摘要输出
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: '  ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data, null, 2),
  };
}

// 简单的文本摘要生成
function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = '\n' + '='.repeat(60) + '\n';
  summary += '📊 k6 负载测试结果摘要\n';
  summary += '='.repeat(60) + '\n\n';
  
  const metrics = data.metrics;
  
  // HTTP请求统计
  if (metrics.http_reqs) {
    summary += `${indent}总HTTP请求数: ${metrics.http_reqs.values.count}\n`;
    summary += `${indent}请求速率: ${metrics.http_reqs.values.rate.toFixed(2)} 请求/秒\n`;
  }
  
  // 响应时间统计
  if (metrics.http_req_duration) {
    const duration = metrics.http_req_duration.values;
    summary += `\n${indent}响应时间统计 (毫秒):\n`;
    summary += `${indent}  平均值: ${duration.avg.toFixed(2)}ms\n`;
    summary += `${indent}  中位数: ${duration.med.toFixed(2)}ms\n`;
    summary += `${indent}  最小值: ${duration.min.toFixed(2)}ms\n`;
    summary += `${indent}  最大值: ${duration.max.toFixed(2)}ms\n`;
    summary += `${indent}  P90: ${duration['p(90)'].toFixed(2)}ms\n`;
    summary += `${indent}  P95: ${duration['p(95)'].toFixed(2)}ms\n`;
    summary += `${indent}  P99: ${duration['p(99)'].toFixed(2)}ms\n`;
  }
  
  // 失败率
  if (metrics.http_req_failed) {
    const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2);
    summary += `\n${indent}请求失败率: ${failRate}%\n`;
  }
  
  // 自定义成功率
  if (metrics.success_rate) {
    const successRate = (metrics.success_rate.values.rate * 100).toFixed(2);
    summary += `${indent}成功率: ${successRate}%\n`;
  }
  
  summary += '\n' + '='.repeat(60) + '\n';
  
  return summary;
}

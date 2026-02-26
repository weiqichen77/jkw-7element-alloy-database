#!/usr/bin/env node

/**
 * 并发负载测试工具
 * 用于测试网站在多用户并发访问时的性能
 * 
 * 使用方法:
 *   node scripts/load-test.js --url https://example.com --concurrent 100
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 命令行参数解析
const args = process.argv.slice(2);
let targetUrl = 'http://localhost:3000';
let concurrentUsers = 100;
let requestsPerUser = 5;
let delayBetweenRequests = 100; // 毫秒

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && i + 1 < args.length) {
    targetUrl = args[i + 1];
    i++;
  } else if (args[i] === '--concurrent' && i + 1 < args.length) {
    concurrentUsers = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--requests' && i + 1 < args.length) {
    requestsPerUser = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--delay' && i + 1 < args.length) {
    delayBetweenRequests = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
并发负载测试工具

使用方法:
  node scripts/load-test.js [选项]

选项:
  --url <url>           目标URL (默认: http://localhost:3000)
  --concurrent <num>    并发用户数 (默认: 100)
  --requests <num>      每个用户的请求次数 (默认: 5)
  --delay <ms>          请求之间的延迟(毫秒) (默认: 100)
  --help, -h            显示帮助信息

示例:
  node scripts/load-test.js --url https://weiqichen77.github.io/jkw-7element-alloy-database/ --concurrent 100
  node scripts/load-test.js --url http://localhost:8080 --concurrent 50 --requests 10
    `);
    process.exit(0);
  }
}

console.log('\n🚀 并发负载测试工具\n');
console.log('测试配置:');
console.log(`  目标URL: ${targetUrl}`);
console.log(`  并发用户数: ${concurrentUsers}`);
console.log(`  每用户请求数: ${requestsPerUser}`);
console.log(`  请求间隔: ${delayBetweenRequests}ms`);
console.log(`  总请求数: ${concurrentUsers * requestsPerUser}\n`);

// 测试结果统计
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: {},
  startTime: 0,
  endTime: 0
};

/**
 * 发送HTTP请求
 */
function makeRequest(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const startTime = Date.now();
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'LoadTest/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      
      // 接收响应数据
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        stats.totalRequests++;
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successfulRequests++;
          stats.responseTimes.push(responseTime);
        } else {
          stats.failedRequests++;
          const errorKey = `HTTP ${res.statusCode}`;
          stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
        }
        
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          responseTime: responseTime,
          size: data.length
        });
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      stats.totalRequests++;
      stats.failedRequests++;
      
      const errorKey = error.code || 'UNKNOWN_ERROR';
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
      
      resolve({
        success: false,
        error: error.message,
        responseTime: responseTime
      });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      const errorKey = 'TIMEOUT';
      stats.errors[errorKey] = (stats.errors[errorKey] || 0) + 1;
    });

    req.end();
  });
}

/**
 * 模拟单个用户行为
 */
async function simulateUser(userId) {
  const results = [];
  
  for (let i = 0; i < requestsPerUser; i++) {
    const result = await makeRequest(targetUrl);
    results.push(result);
    
    // 请求之间的延迟
    if (i < requestsPerUser - 1 && delayBetweenRequests > 0) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }
  
  return results;
}

/**
 * 计算统计数据
 */
function calculateStats() {
  const sortedTimes = stats.responseTimes.sort((a, b) => a - b);
  const len = sortedTimes.length;
  
  const sum = sortedTimes.reduce((a, b) => a + b, 0);
  const avg = len > 0 ? sum / len : 0;
  
  const min = len > 0 ? sortedTimes[0] : 0;
  const max = len > 0 ? sortedTimes[len - 1] : 0;
  
  const p50 = len > 0 ? sortedTimes[Math.floor(len * 0.5)] : 0;
  const p90 = len > 0 ? sortedTimes[Math.floor(len * 0.9)] : 0;
  const p95 = len > 0 ? sortedTimes[Math.floor(len * 0.95)] : 0;
  const p99 = len > 0 ? sortedTimes[Math.floor(len * 0.99)] : 0;
  
  return { avg, min, max, p50, p90, p95, p99 };
}

/**
 * 评估性能等级
 */
function evaluatePerformance(avgResponseTime, successRate) {
  let score = 100;
  let grade = 'A+';
  let description = '优秀';
  
  // 基于响应时间评分
  if (avgResponseTime > 5000) {
    score -= 50;
  } else if (avgResponseTime > 3000) {
    score -= 40;
  } else if (avgResponseTime > 2000) {
    score -= 30;
  } else if (avgResponseTime > 1000) {
    score -= 20;
  } else if (avgResponseTime > 500) {
    score -= 10;
  }
  
  // 基于成功率评分
  if (successRate < 50) {
    score -= 50;
  } else if (successRate < 80) {
    score -= 30;
  } else if (successRate < 95) {
    score -= 15;
  } else if (successRate < 99) {
    score -= 5;
  }
  
  // 确定等级
  if (score >= 95) {
    grade = 'A+';
    description = '优秀 - 网页加载非常流畅';
  } else if (score >= 85) {
    grade = 'A';
    description = '良好 - 网页加载流畅';
  } else if (score >= 75) {
    grade = 'B';
    description = '中等 - 网页加载基本流畅';
  } else if (score >= 60) {
    grade = 'C';
    description = '合格 - 网页加载有些卡顿';
  } else if (score >= 40) {
    grade = 'D';
    description = '较差 - 网页加载明显卡顿';
  } else {
    grade = 'F';
    description = '不合格 - 网页加载严重卡顿或失败';
  }
  
  return { score, grade, description };
}

/**
 * 打印测试结果
 */
function printResults() {
  const duration = (stats.endTime - stats.startTime) / 1000;
  const throughput = stats.totalRequests / duration;
  const successRate = (stats.successfulRequests / stats.totalRequests) * 100;
  
  const responseStats = calculateStats();
  const performance = evaluatePerformance(responseStats.avg, successRate);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果统计');
  console.log('='.repeat(60));
  
  console.log('\n基本统计:');
  console.log(`  总请求数: ${stats.totalRequests}`);
  console.log(`  成功请求: ${stats.successfulRequests} (${successRate.toFixed(2)}%)`);
  console.log(`  失败请求: ${stats.failedRequests}`);
  console.log(`  测试时长: ${duration.toFixed(2)}秒`);
  console.log(`  吞吐量: ${throughput.toFixed(2)} 请求/秒`);
  
  console.log('\n响应时间 (毫秒):');
  console.log(`  平均值: ${responseStats.avg.toFixed(2)}ms`);
  console.log(`  最小值: ${responseStats.min}ms`);
  console.log(`  最大值: ${responseStats.max}ms`);
  console.log(`  中位数 (P50): ${responseStats.p50}ms`);
  console.log(`  P90: ${responseStats.p90}ms`);
  console.log(`  P95: ${responseStats.p95}ms`);
  console.log(`  P99: ${responseStats.p99}ms`);
  
  if (Object.keys(stats.errors).length > 0) {
    console.log('\n错误统计:');
    for (const [error, count] of Object.entries(stats.errors)) {
      console.log(`  ${error}: ${count}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 性能评估');
  console.log('='.repeat(60));
  console.log(`  评分: ${performance.score}/100`);
  console.log(`  等级: ${performance.grade}`);
  console.log(`  评价: ${performance.description}`);
  console.log('='.repeat(60) + '\n');
  
  // 性能建议
  if (performance.score < 85) {
    console.log('💡 优化建议:');
    if (responseStats.avg > 1000) {
      console.log('  - 响应时间较慢，考虑优化服务器性能或使用CDN');
    }
    if (successRate < 99) {
      console.log('  - 成功率偏低，检查服务器稳定性和错误日志');
    }
    if (stats.failedRequests > 0) {
      console.log('  - 存在请求失败，检查网络连接和服务器配置');
    }
    console.log('');
  }
}

/**
 * 主测试函数
 */
async function runLoadTest() {
  console.log('⏳ 测试开始...\n');
  
  stats.startTime = Date.now();
  
  // 显示进度条
  let completed = 0;
  const total = concurrentUsers;
  const progressBar = (current, total) => {
    const percentage = (current / total * 100).toFixed(1);
    const filled = Math.floor(current / total * 40);
    const empty = 40 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    process.stdout.write(`\r进度: [${bar}] ${percentage}% (${current}/${total})`);
  };
  
  // 创建并发用户
  const userPromises = [];
  for (let i = 0; i < concurrentUsers; i++) {
    const promise = simulateUser(i).then(() => {
      completed++;
      progressBar(completed, total);
    });
    userPromises.push(promise);
  }
  
  // 等待所有用户完成
  await Promise.all(userPromises);
  
  stats.endTime = Date.now();
  
  console.log('\n\n✅ 测试完成！\n');
  
  // 打印结果
  printResults();
  
  // 保存结果到文件
  const resultsFile = `load-test-results-${Date.now()}.json`;
  const fs = require('fs');
  const resultsData = {
    config: {
      url: targetUrl,
      concurrentUsers,
      requestsPerUser,
      delayBetweenRequests
    },
    stats: {
      ...stats,
      duration: (stats.endTime - stats.startTime) / 1000,
      ...calculateStats(),
      performance: evaluatePerformance(
        calculateStats().avg,
        (stats.successfulRequests / stats.totalRequests) * 100
      )
    },
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(resultsFile, JSON.stringify(resultsData, null, 2));
    console.log(`📄 详细结果已保存到: ${resultsFile}\n`);
  } catch (err) {
    console.error(`保存结果文件失败: ${err.message}`);
  }
}

// 运行测试
runLoadTest().catch(err => {
  console.error('\n❌ 测试失败:', err);
  process.exit(1);
});

#!/bin/bash
# 数据集成一键脚本
# 执行顺序的自动化

set -e  # 出错停止

echo "=== 7-Element Alloy Database 数据集成工具 ==="
echo ""

# 检查前置条件
if ! command -v node &> /dev/null; then
    echo "❌ 需要安装 Node.js"
    exit 1
fi

cd "$(dirname "$0")/.."

echo "📋 步骤 1/4: 修复路径..."
node scripts/fix-data-paths.js
echo ""

echo "✅ 步骤 2/4: 验证数据..."
node scripts/validate-data.js
echo ""

echo "🔄 步骤 3/4: 合并材料数据..."
node scripts/merge-materials.js
echo ""

echo "🎉 步骤 4/4: 最终验证..."
node scripts/validate-data.js
echo ""

echo "================================"
echo "✓ 数据集成完成！"
echo ""
echo "接下来："
echo "1. 启动本地服务器:"
echo "   python -m http.server 8000"
echo ""
echo "2. 打开浏览器:"
echo "   http://localhost:8000/frontend/"
echo ""
echo "3. 提交到Git:"
echo "   git add ."
echo '   git commit -m "Add intermetallic materials data"'
echo "   git push"
echo ""
echo "✓ 部署完成！"
echo "================================"

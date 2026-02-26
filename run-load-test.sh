#!/bin/bash

# 并发负载测试 - 快速启动脚本
# 用于快速运行各种负载测试

echo "=============================================="
echo "  🚀 并发负载测试工具 - 快速启动"
echo "=============================================="
echo ""

# 默认URL
DEFAULT_URL="https://weiqichen77.github.io/jkw-7element-alloy-database/"

# 显示菜单
echo "请选择测试方式："
echo ""
echo "  1) 快速测试 (50并发，适合预览)"
echo "  2) 标准测试 (100并发，验收标准)"
echo "  3) 压力测试 (150并发，压力测试)"
echo "  4) 自定义测试"
echo "  5) 打开Web测试界面"
echo "  6) 查看使用文档"
echo "  0) 退出"
echo ""
read -p "请输入选项 (0-6): " choice

case $choice in
  1)
    echo ""
    echo "🔥 启动快速测试 (50并发)..."
    read -p "输入测试URL (回车使用默认值): " url
    url=${url:-$DEFAULT_URL}
    node scripts/load-test.js --url "$url" --concurrent 50 --requests 3
    ;;
  
  2)
    echo ""
    echo "🎯 启动标准测试 (100并发 - 验收标准)..."
    read -p "输入测试URL (回车使用默认值): " url
    url=${url:-$DEFAULT_URL}
    node scripts/load-test.js --url "$url" --concurrent 100 --requests 5
    ;;
  
  3)
    echo ""
    echo "💪 启动压力测试 (150并发)..."
    read -p "输入测试URL (回车使用默认值): " url
    url=${url:-$DEFAULT_URL}
    node scripts/load-test.js --url "$url" --concurrent 150 --requests 5
    ;;
  
  4)
    echo ""
    echo "⚙️  自定义测试参数"
    read -p "输入测试URL: " url
    url=${url:-$DEFAULT_URL}
    read -p "并发用户数 (默认100): " concurrent
    concurrent=${concurrent:-100}
    read -p "每用户请求次数 (默认5): " requests
    requests=${requests:-5}
    read -p "请求延迟ms (默认100): " delay
    delay=${delay:-100}
    
    echo ""
    echo "启动测试："
    echo "  URL: $url"
    echo "  并发数: $concurrent"
    echo "  请求数: $requests"
    echo "  延迟: ${delay}ms"
    echo ""
    
    node scripts/load-test.js \
      --url "$url" \
      --concurrent "$concurrent" \
      --requests "$requests" \
      --delay "$delay"
    ;;
  
  5)
    echo ""
    echo "🌐 打开Web测试界面..."
    
    # 尝试在浏览器中打开
    if command -v xdg-open > /dev/null; then
      xdg-open test-load.html
    elif command -v open > /dev/null; then
      open test-load.html
    elif [ -n "$BROWSER" ]; then
      "$BROWSER" test-load.html
    else
      echo "请手动打开浏览器访问: $(pwd)/test-load.html"
    fi
    ;;
  
  6)
    echo ""
    echo "📖 查看使用文档..."
    
    if command -v less > /dev/null; then
      less LOAD_TEST_GUIDE.md
    elif command -v more > /dev/null; then
      more LOAD_TEST_GUIDE.md
    else
      cat LOAD_TEST_GUIDE.md
    fi
    ;;
  
  0)
    echo "退出"
    exit 0
    ;;
  
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac

echo ""
echo "=============================================="
echo "  ✅ 测试完成"
echo "=============================================="
echo ""
echo "💡 提示："
echo "  - 详细文档: LOAD_TEST_GUIDE.md"
echo "  - Web界面: test-load.html"
echo "  - 测试结果: load-test-results-*.json"
echo ""

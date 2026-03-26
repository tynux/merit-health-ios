#!/bin/bash

# 功德圆满 iOS 应用 - Xcode 配置脚本
# 本脚本将自动配置 Xcode 项目的基本设置

set -e

echo "=========================================="
echo "功德圆满 iOS 应用 - Xcode 配置"
echo "=========================================="
echo ""

# 检查 Xcode 是否已安装
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ 错误：未找到 Xcode。请先安装 Xcode。"
    exit 1
fi

echo "✓ 已检测到 Xcode"
echo ""

# 获取 Xcode 版本
XCODE_VERSION=$(xcodebuild -version | head -n 1)
echo "Xcode 版本：$XCODE_VERSION"
echo ""

# 检查项目文件
PROJECT_DIR="/home/ubuntu/merit-game-ios"
WORKSPACE="$PROJECT_DIR/ios/App/App.xcworkspace"
PROJECT="$PROJECT_DIR/ios/App/App.xcodeproj"

if [ ! -d "$WORKSPACE" ]; then
    echo "❌ 错误：未找到 Xcode 工作区文件"
    echo "   路径：$WORKSPACE"
    exit 1
fi

echo "✓ 已找到 Xcode 工作区"
echo ""

# 配置 Bundle ID
echo "配置 Bundle ID..."
BUNDLE_ID="com.meritgame.ios"

# 使用 xcrun 修改 Bundle ID
# 注意：这需要手动在 Xcode 中进行，因为 xcrun 不支持直接修改 Bundle ID

echo "⚠️  Bundle ID 需要在 Xcode 中手动配置"
echo "   步骤："
echo "   1. 打开 $WORKSPACE"
echo "   2. 选择 'App' 目标"
echo "   3. 进入 'General' 标签"
echo "   4. 修改 'Bundle Identifier' 为 '$BUNDLE_ID'"
echo ""

# 检查 Cocoapods
echo "检查 Cocoapods 依赖..."
cd "$PROJECT_DIR/ios/App"

if [ ! -d "Pods" ]; then
    echo "⚠️  未找到 Pods 目录，正在安装..."
    pod install
    echo "✓ Pods 已安装"
else
    echo "✓ Pods 已存在"
fi

cd "$PROJECT_DIR"
echo ""

# 构建 Web 资源
echo "构建 Web 资源..."
if [ ! -d "dist" ]; then
    echo "正在构建 Web 应用..."
    pnpm build
    echo "✓ Web 应用已构建"
else
    echo "✓ Web 应用已存在"
fi

echo ""

# 复制资源到 iOS 项目
echo "复制 Web 资源到 iOS 项目..."
pnpm exec capacitor copy ios
echo "✓ 资源已复制"
echo ""

# 清理构建文件
echo "清理构建文件..."
xcodebuild clean -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Debug 2>/dev/null || true
echo "✓ 构建文件已清理"
echo ""

# 测试构建
echo "测试 Debug 构建..."
xcodebuild build \
  -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build \
  -quiet

if [ $? -eq 0 ]; then
    echo "✓ Debug 构建成功"
else
    echo "❌ Debug 构建失败"
    exit 1
fi

echo ""

# 显示配置总结
echo "=========================================="
echo "配置总结"
echo "=========================================="
echo ""
echo "项目路径：$PROJECT_DIR"
echo "工作区：$WORKSPACE"
echo "Bundle ID：$BUNDLE_ID"
echo "Xcode 版本：$XCODE_VERSION"
echo ""

echo "✓ 基本配置已完成！"
echo ""
echo "后续步骤："
echo "1. 打开 Xcode：open '$WORKSPACE'"
echo "2. 在 Xcode 中配置签名证书和团队"
echo "3. 在真机上测试应用"
echo "4. 提交到 App Store"
echo ""

echo "=========================================="

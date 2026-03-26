# Xcode 配置验证和测试构建指南

## 概述

本指南将帮助您验证 Xcode 配置是否正确，并测试应用的构建过程。

## 第一步：验证 Xcode 配置

### 1.1 检查项目设置

在 Xcode 中：

1. 打开 `ios/App/App.xcworkspace`
2. 选择 "App" 项目
3. 选择 "App" 目标
4. 进入 "General" 标签

验证以下信息：

| 项目 | 预期值 |
|------|--------|
| Display Name | App |
| Bundle Identifier | com.meritgame.ios |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 14.0 |

### 1.2 检查签名配置

在 "Signing & Capabilities" 标签中：

验证以下信息：

| 项目 | Debug | Release |
|------|-------|---------|
| Team | 您的开发团队 | 您的开发团队 |
| Signing Certificate | Apple Development | Apple Distribution |
| Provisioning Profile | 开发预配置文件 | App Store 预配置文件 |

### 1.3 检查构建设置

在 "Build Settings" 标签中，搜索 "Code Signing"：

验证以下设置：

| 设置 | Debug | Release |
|------|-------|---------|
| Code Sign Identity | Apple Development | Apple Distribution |
| Provisioning Profile | 开发预配置文件 | App Store 预配置文件 |
| Code Sign Style | Automatic 或 Manual | Manual |

## 第二步：清理和准备构建

### 2.1 清理构建文件

```bash
cd /home/ubuntu/merit-game-ios

# 清理 Xcode 构建文件
xcodebuild clean -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug

xcodebuild clean -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release
```

### 2.2 更新 Cocoapods 依赖

```bash
cd ios/App

# 更新 Cocoapods
pod repo update

# 重新安装依赖
rm -rf Pods Podfile.lock
pod install

cd ../..
```

### 2.3 构建 Web 资源

```bash
# 构建 Web 应用
pnpm build

# 复制资源到 iOS 项目
pnpm exec capacitor copy ios
```

## 第三步：测试 Debug 构建

### 3.1 为模拟器构建

```bash
cd /home/ubuntu/merit-game-ios

echo "构建 Debug 版本（模拟器）..."
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build \
  -verbose

if [ $? -eq 0 ]; then
    echo "✓ Debug 构建成功（模拟器）"
else
    echo "❌ Debug 构建失败（模拟器）"
    exit 1
fi
```

### 3.2 为真机构建

```bash
cd /home/ubuntu/merit-game-ios

echo "构建 Debug 版本（真机）..."
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphoneos \
  -derivedDataPath build \
  -verbose

if [ $? -eq 0 ]; then
    echo "✓ Debug 构建成功（真机）"
else
    echo "❌ Debug 构建失败（真机）"
    exit 1
fi
```

### 3.3 在 Xcode 中运行应用

1. 在 Xcode 中打开项目
2. 选择一个模拟器或连接的设备
3. 点击 "Run" 按钮（或按 Cmd+R）
4. 应用应该在模拟器或设备上启动

## 第四步：测试 Release 构建

### 4.1 为真机构建 Release 版本

```bash
cd /home/ubuntu/merit-game-ios

echo "构建 Release 版本（真机）..."
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build \
  -verbose

if [ $? -eq 0 ]; then
    echo "✓ Release 构建成功"
else
    echo "❌ Release 构建失败"
    exit 1
fi
```

### 4.2 验证签名

```bash
# 检查应用是否正确签名
codesign -v -v build/Release-iphoneos/App.app
```

## 第五步：创建应用存档

### 5.1 为 App Store 创建存档

```bash
cd /home/ubuntu/merit-game-ios

echo "创建应用存档..."
xcodebuild archive \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive \
  -verbose

if [ $? -eq 0 ]; then
    echo "✓ 应用存档创建成功"
    echo "存档位置：build/App.xcarchive"
else
    echo "❌ 应用存档创建失败"
    exit 1
fi
```

### 5.2 验证存档

在 Xcode 中：

1. 选择菜单 "Window" → "Organizer"
2. 选择 "Archives" 标签
3. 验证新创建的存档显示在列表中
4. 选择存档并点击 "Validate App"

## 第六步：故障排除

### 问题 1：签名错误

**错误信息**：
```
Code signing identity "Apple Development" not found
```

**解决方案**：

1. 在 Keychain Access 中验证证书已安装
2. 在 Xcode 中重新选择签名证书
3. 重新启动 Xcode

### 问题 2：预配置文件错误

**错误信息**：
```
No provisioning profiles found
```

**解决方案**：

1. 在 Apple Developer 网站上创建预配置文件
2. 下载预配置文件
3. 双击 `.mobileprovision` 文件导入到 Xcode
4. 在 Xcode 中重新选择预配置文件

### 问题 3：Bundle ID 不匹配

**错误信息**：
```
Bundle ID does not match provisioning profile
```

**解决方案**：

1. 验证 Xcode 中的 Bundle ID 是 `com.meritgame.ios`
2. 验证预配置文件的 Bundle ID 也是 `com.meritgame.ios`
3. 如果不匹配，更新预配置文件或 Bundle ID

### 问题 4：构建失败

**错误信息**：
```
Build failed with multiple errors
```

**解决方案**：

1. 清理构建文件：`xcodebuild clean`
2. 更新 Cocoapods：`pod update`
3. 重新构建：`xcodebuild build`
4. 检查构建日志中的具体错误

## 完整的构建和验证脚本

创建一个 `build-and-verify.sh` 脚本来自动化整个过程：

```bash
#!/bin/bash

set -e

PROJECT_DIR="/home/ubuntu/merit-game-ios"
WORKSPACE="$PROJECT_DIR/ios/App/App.xcworkspace"

echo "=========================================="
echo "功德圆满 iOS 应用 - 构建和验证"
echo "=========================================="
echo ""

# 清理
echo "1. 清理构建文件..."
xcodebuild clean -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Debug 2>/dev/null || true
xcodebuild clean -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Release 2>/dev/null || true
echo "✓ 清理完成"
echo ""

# 更新依赖
echo "2. 更新依赖..."
cd "$PROJECT_DIR/ios/App"
pod repo update
pod install
cd "$PROJECT_DIR"
echo "✓ 依赖更新完成"
echo ""

# 构建 Web 资源
echo "3. 构建 Web 资源..."
pnpm build
pnpm exec capacitor copy ios
echo "✓ Web 资源构建完成"
echo ""

# Debug 构建
echo "4. 构建 Debug 版本..."
xcodebuild build \
  -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build \
  -quiet
echo "✓ Debug 构建成功"
echo ""

# Release 构建
echo "5. 构建 Release 版本..."
xcodebuild build \
  -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build \
  -quiet
echo "✓ Release 构建成功"
echo ""

# 创建存档
echo "6. 创建应用存档..."
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive \
  -quiet
echo "✓ 应用存档创建成功"
echo ""

echo "=========================================="
echo "✓ 所有构建和验证步骤完成！"
echo "=========================================="
echo ""
echo "应用存档位置：build/App.xcarchive"
echo ""
echo "下一步："
echo "1. 在 Xcode 中验证应用存档"
echo "2. 导出应用包"
echo "3. 上传到 App Store"
echo ""
```

使用脚本：

```bash
chmod +x build-and-verify.sh
./build-and-verify.sh
```

## 验证检查清单

在提交应用之前，请确保以下所有项目都已完成：

- [ ] Xcode 版本为 13.0 或更高
- [ ] 项目设置已验证
- [ ] 签名配置已验证
- [ ] 构建设置已验证
- [ ] Debug 构建成功
- [ ] Release 构建成功
- [ ] 应用存档创建成功
- [ ] 应用在模拟器上成功运行
- [ ] 应用在真机上成功运行
- [ ] 没有任何构建警告或错误

## 下一步

1. 完成本指南中的所有步骤
2. 验证应用可以成功构建和运行
3. 进行 TestFlight 测试
4. 提交应用到 App Store

---

**祝您的构建和验证顺利！**

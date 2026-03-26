# 应用包构建和提交流程指南

## 概述

本指南将帮助您构建功德圆满应用的最终版本，并将其提交到 App Store。

## 前置条件

在开始之前，请确保您已经：

1. 安装了最新版本的 Xcode（13.0 或更高版本）
2. 拥有有效的 Apple 开发者账号
3. 生成了应用签名证书和预配置文件
4. 完成了 App Store Connect 中的应用信息配置
5. 在本地测试了应用，确保没有崩溃或严重错误

## 第一步：准备构建环境

### 1.1 更新依赖

```bash
cd /home/ubuntu/merit-game-ios

# 更新 npm 依赖
pnpm install

# 更新 Cocoapods 依赖
cd ios/App
pod repo update
pod install
cd ../..
```

### 1.2 验证构建配置

在 Xcode 中：

1. 打开 `ios/App/App.xcworkspace`
2. 选择 "App" 目标
3. 进入 "Build Settings"
4. 验证以下设置：

| 设置 | 值 |
|------|-----|
| Product Name | App |
| Bundle Identifier | com.meritgame.ios |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 14.0 |

### 1.3 配置签名证书

1. 在 Xcode 中，选择 "App" 目标
2. 进入 "Signing & Capabilities"
3. 确保以下信息已配置：

| 项目 | 说明 |
|------|------|
| Team | 您的 Apple 开发者团队 |
| Bundle Identifier | com.meritgame.ios |
| Signing Certificate | Apple Distribution 证书 |
| Provisioning Profile | App Store 预配置文件 |

## 第二步：构建应用

### 2.1 清理构建文件

```bash
cd /home/ubuntu/merit-game-ios

# 清理 Xcode 构建文件
xcodebuild clean -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release

# 清理 npm 构建文件
rm -rf dist build
```

### 2.2 构建 Web 资源

```bash
# 构建 Web 应用
pnpm build

# 验证 dist 文件夹已生成
ls -la dist/
```

### 2.3 复制 Web 资源到 iOS 项目

```bash
# 使用 Capacitor 复制资源
pnpm exec capacitor copy ios
```

### 2.4 构建 iOS 应用

```bash
# 构建 iOS 应用
xcodebuild build-for-testing \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -arch arm64
```

## 第三步：测试应用

### 3.1 在模拟器中测试

```bash
# 在 iPhone 模拟器中测试
xcodebuild test \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -destination 'platform=iOS Simulator,name=iPhone 14'
```

### 3.2 在真机中测试

1. 连接 iOS 设备
2. 在 Xcode 中选择设备
3. 点击 "Run" 按钮
4. 测试应用的所有功能

### 3.3 测试清单

在提交前，请测试以下功能：

- [ ] 应用启动和加载
- [ ] 功德仪表盘显示正确
- [ ] 健康数据追踪功能
- [ ] 奖章陈列室显示正确
- [ ] 推送通知功能
- [ ] AI 健康建议功能
- [ ] 应用设置和个人资料
- [ ] 应用没有崩溃或错误

## 第四步：创建发布构建

### 4.1 构建应用存档

```bash
# 构建应用存档
xcodebuild archive \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive
```

### 4.2 验证存档

1. 打开 Xcode
2. 进入 "Window" → "Organizer"
3. 选择 "Archives" 标签
4. 验证新创建的存档显示在列表中

## 第五步：导出应用包

### 5.1 使用 Xcode 导出

1. 在 Organizer 中，选择最新的存档
2. 点击 "Distribute App"
3. 选择 "App Store Connect"
4. 选择 "Upload"
5. 选择您的 Apple 开发者团队
6. 点击 "Next" 并完成导出流程

### 5.2 使用命令行导出

```bash
# 创建导出选项文件
cat > ExportOptions.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
</dict>
</plist>
EOF

# 导出应用包
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath build/Export \
  -exportOptionsPlist ExportOptions.plist
```

## 第六步：上传到 App Store

### 6.1 使用 Transporter 上传

1. 下载 [Apple Transporter](https://apps.apple.com/us/app/transporter/id1450874784?mt=12)
2. 打开 Transporter
3. 使用您的 Apple ID 登录
4. 拖放导出的 `.ipa` 文件
5. 点击 "Deliver"

### 6.2 使用命令行上传

```bash
# 使用 xcrun 上传
xcrun altool --upload-app \
  -f build/Export/App.ipa \
  -t ios \
  -u your-apple-id@example.com \
  -p your-app-specific-password
```

### 6.3 验证上传

1. 在 App Store Connect 中检查应用状态
2. 等待构建版本处理完成（通常需要几分钟）
3. 构建版本应该显示在 "Builds" 部分

## 第七步：在 App Store Connect 中完成提交

### 7.1 选择构建版本

1. 在 App Store Connect 中打开应用
2. 进入 "App Store" → "Prepare for Submission"
3. 在 "Build" 部分，选择刚刚上传的构建版本

### 7.2 完成应用信息

确保以下信息已完成：

- [ ] 应用名称和副标题
- [ ] 应用描述
- [ ] 关键词
- [ ] 应用类别
- [ ] 内容评级
- [ ] 隐私政策
- [ ] 应用图标
- [ ] 截图
- [ ] 预览视频（可选）

### 7.3 填写审核信息

1. 进入 "App Review Information"
2. 填写以下信息：

| 字段 | 说明 |
|------|------|
| Contact Information | 您的联系信息 |
| Demo Account | 无需（应用无需登录） |
| Review Notes | 应用审核说明 |
| Attachment | 任何额外的文档或说明 |

### 7.4 审核说明示例

```
功德圆满是一款健康追踪应用，帮助用户通过日常健康活动积累功德分数。

主要功能：
- 追踪 12 项健康指标（步数、睡眠、心率等）
- 135 个精美的功德奖章系统
- 智能功德计算引擎
- AI 驱动的个性化健康建议
- 推送通知系统

应用无需登录，所有健康数据都在用户设备上本地处理，不上传到服务器。应用遵循最高的隐私和安全标准。

应用已在 iPhone 模拟器和真机上进行了充分测试，没有发现崩溃或严重错误。
```

## 第八步：提交审核

### 8.1 最终检查

在提交前，请再次检查：

- [ ] 所有信息已完成
- [ ] 构建版本已选择
- [ ] 应用没有崩溃或错误
- [ ] 隐私政策已提供
- [ ] 联系信息已完成
- [ ] 审核说明已填写

### 8.2 提交应用

1. 点击 "Submit for Review"
2. 确认提交信息
3. 点击 "Submit"

## 第九步：监控审核进度

### 9.1 检查审核状态

1. 在 App Store Connect 中查看应用状态
2. 状态应该显示 "Waiting for Review"
3. 您会收到电子邮件通知

### 9.2 审核时间

- 通常审核需要 1-3 天
- 在假期或高峰期可能需要更长时间
- 您可以随时在 App Store Connect 中检查状态

### 9.3 处理审核反馈

如果应用被拒绝：

1. 仔细阅读拒绝原因
2. 进行必要的修改
3. 增加构建号（例如，从 1 改为 2）
4. 重新构建和上传应用
5. 重新提交审核

## 第十步：发布应用

### 10.1 审核通过

当应用通过审核时，您会收到电子邮件通知。

### 10.2 发布应用

1. 在 App Store Connect 中查看应用状态
2. 状态应该显示 "Ready to Distribute"
3. 点击 "Release This Version"

### 10.3 应用上线

1. 应用将在 App Store 上线
2. 您会收到确认电子邮件
3. 应用将在搜索结果中显示

## 常见问题

### Q: 构建失败怎么办？

A: 检查构建日志中的错误信息。常见原因包括缺少依赖、签名证书过期、或代码编译错误。

### Q: 如何更新应用？

A: 增加版本号或构建号，重复构建和提交流程。

### Q: 应用上线后如何推广？

A: 使用 App Store 优化（ASO）技术，优化关键词和描述。在社交媒体上宣传应用。

### Q: 如何处理应用崩溃？

A: 在 Xcode 中修复崩溃，上传新的构建版本，重新提交审核。

### Q: 应用被拒绝了怎么办？

A: 仔细阅读拒绝原因，进行必要的修改，重新提交。

## 脚本自动化

### 完整构建脚本

创建一个 `build.sh` 脚本来自动化构建过程：

```bash
#!/bin/bash

set -e

echo "开始构建功德圆满应用..."

# 清理
echo "清理构建文件..."
xcodebuild clean -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release
rm -rf dist build

# 构建 Web 资源
echo "构建 Web 资源..."
pnpm build

# 复制资源
echo "复制资源到 iOS 项目..."
pnpm exec capacitor copy ios

# 构建存档
echo "构建应用存档..."
xcodebuild archive \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive

echo "构建完成！"
echo "应用存档位置：build/App.xcarchive"
```

使用脚本：

```bash
chmod +x build.sh
./build.sh
```

## 参考资源

- [Xcode 构建和发布指南](https://developer.apple.com/documentation/xcode)
- [App Store Connect 帮助](https://help.apple.com/app-store-connect/)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor iOS 部署指南](https://capacitorjs.com/docs/ios)

---

**祝您的应用构建和提交顺利！**

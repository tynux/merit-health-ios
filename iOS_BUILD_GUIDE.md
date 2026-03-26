# 功德圆满 iOS 应用构建指南

## 项目信息

- **应用名称**: 功德圆满
- **Bundle ID**: com.meritgame.ios
- **最低 iOS 版本**: 14.0
- **支持设备**: iPhone、iPad

## 前置要求

1. **Xcode** 13.0 或更高版本
2. **Node.js** 16.0 或更高版本
3. **CocoaPods** (通常随 Xcode 安装)
4. **Apple 开发者账号** (用于签名和发布)

## 项目结构

```
merit-game-ios/
├── ios/                          # iOS 原生项目
│   └── App/                       # Xcode 项目文件夹
│       ├── App.xcodeproj/         # Xcode 项目
│       ├── Podfile                # CocoaPods 依赖配置
│       └── App/                   # 应用源代码
├── capacitor.config.ts            # Capacitor 配置
├── dist/public/                   # Web 资源（HTML、CSS、JS）
└── package.json                   # Node.js 依赖
```

## 构建步骤

### 1. 安装依赖

```bash
cd /home/ubuntu/merit-game-ios
pnpm install
```

### 2. 构建 Web 资源

```bash
pnpm build
```

这将生成 `dist/public/` 目录，包含所有 Web 资源。

### 3. 打开 Xcode 项目

```bash
open ios/App/App.xcodeproj
```

### 4. 配置签名

在 Xcode 中：
1. 选择 "App" 目标
2. 进入 "Signing & Capabilities" 标签页
3. 选择您的 Team
4. 配置 Bundle Identifier（如需要）

### 5. 选择构建目标

- **模拟器**: 选择 "iPhone 15" 或其他模拟器
- **真机**: 连接 iPhone，选择相应设备

### 6. 构建和运行

```bash
# 使用 Xcode UI 或命令行
xcodebuild -scheme App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15'
```

## iOS 特定功能

### HealthKit 集成

应用需要访问 HealthKit 数据。在 `Info.plist` 中添加以下权限：

```xml
<key>NSHealthShareUsageDescription</key>
<string>我们需要访问您的健康数据来计算功德分数</string>
<key>NSHealthUpdateUsageDescription</key>
<string>我们需要更新您的健康数据</string>
```

### 推送通知

配置推送通知：
1. 在 Apple Developer 中创建 Push Notification 证书
2. 在 Xcode 中启用 "Push Notifications" capability
3. 配置 APNs 证书

### 本地通知

应用已配置支持本地通知，无需额外配置。

## 开发工作流

### 热重载开发

```bash
# 终端 1: 启动开发服务器
pnpm dev

# 终端 2: 监听文件变化并同步到 iOS
pnpm exec capacitor copy ios --watch
```

### 调试

1. 在 Xcode 中设置断点
2. 使用 Safari Web Inspector 调试 Web 部分
3. 查看 Xcode 控制台输出

## 常见问题

### CocoaPods 依赖错误

```bash
cd ios/App
pod install --repo-update
cd ../..
```

### 签名错误

确保在 Xcode 中正确配置了签名证书和预置配置文件。

### 构建失败

清理构建：
```bash
xcodebuild clean -scheme App
```

## 发布到 App Store

1. 创建 App Store Connect 应用记录
2. 在 Xcode 中配置版本号和构建号
3. 创建存档 (Archive)
4. 使用 Xcode Organizer 验证和上传
5. 在 App Store Connect 中提交审核

## 支持的 iOS 功能

- ✅ 本地通知
- ✅ 推送通知（需要配置）
- ✅ HealthKit 数据访问
- ✅ 离线支持
- ✅ 深链接
- ✅ 文件访问

## 更新应用

更新 Web 资源后：

```bash
pnpm build
pnpm exec capacitor copy ios
pnpm exec capacitor update ios
```

然后在 Xcode 中重新构建。

## 技术栈

- **框架**: Capacitor 8
- **前端**: React 19 + Tailwind CSS 4
- **后端**: Express + tRPC
- **数据库**: MySQL/TiDB
- **iOS 最低版本**: 14.0

## 许可证

MIT

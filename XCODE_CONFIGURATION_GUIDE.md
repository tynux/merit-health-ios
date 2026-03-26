# Xcode 配置详细指南

## 概述

本指南将帮助您在 Xcode 中配置功德圆满应用的签名证书、Bundle ID 和预配置文件。这些配置是应用能够在真机上运行和提交到 App Store 的必要条件。

## 前置条件

在开始之前，请确保您已经：

1. 安装了最新版本的 Xcode（13.0 或更高版本）
2. 拥有有效的 Apple 开发者账号（年费 99 美元）
3. 在 Apple Developer 网站上创建了应用标识符
4. 生成了开发和发布签名证书
5. 创建了开发和发布预配置文件

## 第一步：打开 Xcode 项目

### 1.1 打开工作区文件

```bash
cd /home/ubuntu/merit-game-ios
open ios/App/App.xcworkspace
```

**重要**：请打开 `.xcworkspace` 文件，而不是 `.xcodeproj` 文件。工作区文件包含了 Cocoapods 的依赖配置。

### 1.2 验证项目结构

在 Xcode 中，您应该看到以下结构：

```
App (工作区)
├── App (项目)
│   ├── App (目标)
│   ├── App Tests (测试目标)
│   └── App UI Tests (UI 测试目标)
└── Pods (依赖)
```

## 第二步：配置 Bundle ID 和团队

### 2.1 选择目标

1. 在 Xcode 的项目导航器中，选择 "App" 项目
2. 在编辑器中，选择 "App" 目标
3. 点击 "General" 标签

### 2.2 配置 Bundle Identifier

在 "General" 标签中，找到 "Bundle Identifier" 字段：

1. 清除现有的 Bundle ID
2. 输入 `com.meritgame.ios`
3. 确保 Bundle ID 与 App Store Connect 中的应用 Bundle ID 一致

### 2.3 设置开发团队

在 "Signing & Capabilities" 标签中：

1. 找到 "Team" 下拉菜单
2. 选择您的 Apple 开发者团队
3. 如果看到错误，可能需要在 Xcode 中添加您的 Apple ID

### 2.4 添加 Apple ID（如需要）

如果您还没有在 Xcode 中添加 Apple ID：

1. 打开 Xcode 菜单
2. 选择 "Preferences" (或 "Settings")
3. 点击 "Accounts" 标签
4. 点击左下角的 "+" 按钮
5. 选择 "Apple ID"
6. 输入您的 Apple ID 和密码
7. 点击 "Sign In"

## 第三步：配置签名证书

### 3.1 理解签名证书类型

有两种类型的签名证书：

| 证书类型 | 用途 | 有效期 |
|---------|------|--------|
| Development | 在真机和模拟器上开发和测试 | 1 年 |
| Distribution (App Store) | 提交到 App Store | 3 年 |

### 3.2 创建签名证书（如需要）

如果您还没有签名证书，可以在 Xcode 中自动创建：

1. 在 Xcode 中，选择 "App" 目标
2. 进入 "Signing & Capabilities" 标签
3. 在 "Signing" 部分，确保 "Automatically manage signing" 已勾选
4. 选择您的开发团队
5. Xcode 将自动创建必要的证书和预配置文件

### 3.3 手动配置签名证书

如果您想手动管理签名：

1. 取消勾选 "Automatically manage signing"
2. 在 "Debug" 部分，选择：
   - **Signing Certificate**: Apple Development
   - **Provisioning Profile**: 您的开发预配置文件
3. 在 "Release" 部分，选择：
   - **Signing Certificate**: Apple Distribution
   - **Provisioning Profile**: 您的 App Store 预配置文件

## 第四步：配置预配置文件

### 4.1 理解预配置文件

预配置文件是连接以下三个元素的文件：

1. **应用标识符** - 您的应用的唯一标识（com.meritgame.ios）
2. **签名证书** - 用于签名应用的证书
3. **设备** - 应用可以运行的设备（仅限开发预配置文件）

### 4.2 创建预配置文件

#### 开发预配置文件

1. 访问 [Apple Developer 网站](https://developer.apple.com)
2. 登录您的账号
3. 进入 "Certificates, Identifiers & Profiles"
4. 选择 "Profiles"
5. 点击 "+" 按钮创建新预配置文件
6. 选择 "iOS App Development"
7. 选择应用标识符 "com.meritgame.ios"
8. 选择开发证书
9. 选择要包含的设备（或选择所有设备）
10. 输入预配置文件名称（例如 "Merit Game Development"）
11. 下载预配置文件

#### App Store 预配置文件

1. 在 Apple Developer 网站上，创建新预配置文件
2. 选择 "App Store"
3. 选择应用标识符 "com.meritgame.ios"
4. 选择 App Store 分发证书
5. 输入预配置文件名称（例如 "Merit Game App Store"）
6. 下载预配置文件

### 4.3 在 Xcode 中导入预配置文件

1. 双击下载的 `.mobileprovision` 文件
2. Xcode 将自动导入预配置文件
3. 在 Xcode 中，选择 "App" 目标
4. 进入 "Signing & Capabilities" 标签
5. 验证预配置文件已正确选择

## 第五步：验证配置

### 5.1 检查签名配置

在 Xcode 中：

1. 选择 "App" 目标
2. 进入 "Signing & Capabilities" 标签
3. 验证以下信息：

| 项目 | 值 |
|------|-----|
| Team | 您的 Apple 开发者团队 |
| Bundle Identifier | com.meritgame.ios |
| Signing Certificate (Debug) | Apple Development |
| Provisioning Profile (Debug) | 您的开发预配置文件 |
| Signing Certificate (Release) | Apple Distribution |
| Provisioning Profile (Release) | 您的 App Store 预配置文件 |

### 5.2 检查项目设置

1. 选择 "App" 项目（不是目标）
2. 进入 "Build Settings" 标签
3. 搜索 "Code Signing"
4. 验证以下设置：

| 设置 | Debug | Release |
|------|-------|---------|
| Code Sign Identity | Apple Development | Apple Distribution |
| Provisioning Profile | 开发预配置文件 | App Store 预配置文件 |

## 第六步：测试构建

### 6.1 清理构建文件

```bash
cd /home/ubuntu/merit-game-ios

# 清理 Xcode 构建文件
xcodebuild clean -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug
```

### 6.2 构建应用（Debug）

```bash
# 为模拟器构建
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build
```

### 6.3 构建应用（Release）

```bash
# 为真机构建
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build
```

### 6.4 在 Xcode 中测试

1. 在 Xcode 中，选择一个模拟器或连接的设备
2. 点击 "Run" 按钮（或按 Cmd+R）
3. 应用应该在模拟器或设备上启动
4. 测试应用的基本功能

## 常见问题

### Q: "No provisioning profiles found" 错误

A: 这意味着 Xcode 找不到预配置文件。解决方案：

1. 在 Apple Developer 网站上创建预配置文件
2. 下载预配置文件
3. 双击 `.mobileprovision` 文件导入到 Xcode
4. 在 Xcode 中重新选择预配置文件

### Q: "Code signing identity" 错误

A: 这意味着签名证书不可用。解决方案：

1. 在 Xcode 中添加您的 Apple ID（Preferences → Accounts）
2. 在 Apple Developer 网站上创建签名证书
3. 在 Xcode 中重新选择签名证书

### Q: 应用在真机上崩溃

A: 这可能是由于签名问题。解决方案：

1. 验证预配置文件中包含您的设备
2. 重新生成预配置文件
3. 重新构建应用

### Q: 如何更新过期的证书？

A: 在 Apple Developer 网站上：

1. 进入 "Certificates, Identifiers & Profiles"
2. 选择 "Certificates"
3. 删除过期的证书
4. 创建新的证书
5. 更新相关的预配置文件

## 配置检查清单

在继续之前，请确保以下所有项目都已完成：

- [ ] Xcode 版本为 13.0 或更高
- [ ] 已打开 `.xcworkspace` 文件
- [ ] Bundle ID 已设置为 `com.meritgame.ios`
- [ ] 开发团队已选择
- [ ] Apple ID 已在 Xcode 中添加
- [ ] 开发签名证书已创建或导入
- [ ] App Store 签名证书已创建或导入
- [ ] 开发预配置文件已创建或导入
- [ ] App Store 预配置文件已创建或导入
- [ ] 签名配置已验证
- [ ] Debug 构建成功
- [ ] Release 构建成功
- [ ] 应用在模拟器上成功运行
- [ ] 应用在真机上成功运行

## 下一步

1. 完成本指南中的所有步骤
2. 验证应用可以成功构建和运行
3. 进行 TestFlight 测试
4. 提交应用到 App Store

---

**祝您的 Xcode 配置顺利！**

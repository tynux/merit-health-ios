# 签名证书和预配置文件配置指南

## 概述

本指南将帮助您创建和配置 iOS 应用所需的签名证书和预配置文件。这些是将应用部署到真机和 App Store 的必要条件。

## 前置条件

在开始之前，请确保您已经：

1. 拥有有效的 Apple 开发者账号（年费 99 美元）
2. 已在 Xcode 中添加您的 Apple ID
3. 已创建应用标识符（App ID）
4. 已注册至少一个 iOS 设备（用于开发）

## 第一步：访问 Apple Developer 网站

### 1.1 登录 Apple Developer

1. 访问 [Apple Developer 网站](https://developer.apple.com)
2. 点击右上角的 "Account"
3. 使用您的 Apple ID 登录

### 1.2 进入证书管理

1. 点击 "Certificates, Identifiers & Profiles"
2. 选择 "Certificates"

## 第二步：创建签名证书

### 2.1 创建开发证书

#### 步骤 1：请求证书签名

1. 在 Mac 上打开 "Keychain Access"
2. 选择菜单 "Keychain Access" → "Certificate Assistant" → "Request a Certificate from a Certificate Authority"
3. 输入以下信息：
   - **Common Name**: 您的名字（例如 "Merit Game Developer"）
   - **Email Address**: 您的 Apple ID 邮箱
   - **CA Email Address**: 留空
   - **Request is**: 选择 "Saved to disk"
4. 点击 "Continue"
5. 选择保存位置（例如桌面）
6. 点击 "Save"

#### 步骤 2：上传证书签名请求

1. 在 Apple Developer 网站上，点击 "+" 按钮创建新证书
2. 选择 "iOS App Development"
3. 点击 "Continue"
4. 选择刚刚创建的 `.certSigningRequest` 文件
5. 点击 "Continue"
6. 点击 "Download" 下载证书

#### 步骤 3：安装证书

1. 双击下载的 `.cer` 文件
2. Keychain Access 将自动安装证书
3. 验证证书已出现在 Keychain 中

### 2.2 创建 App Store 分发证书

重复上述步骤，但在步骤 2 中选择 "App Store and Ad Hoc" 而不是 "iOS App Development"。

## 第三步：创建应用标识符（App ID）

### 3.1 创建新的 App ID

1. 在 Apple Developer 网站上，进入 "Identifiers"
2. 点击 "+" 按钮创建新标识符
3. 选择 "App IDs"
4. 点击 "Continue"
5. 选择 "App"
6. 点击 "Continue"

### 3.2 配置 App ID

1. **Description**: 输入应用名称（例如 "Merit Game"）
2. **Bundle ID**: 选择 "Explicit"，输入 `com.meritgame.ios`
3. **Capabilities**: 选择应用需要的功能：
   - [ ] Health Kit（健康数据访问）
   - [ ] Push Notifications（推送通知）
   - [ ] Background Modes（后台模式）
   - [ ] HomeKit（可选）
4. 点击 "Continue"
5. 点击 "Register"

## 第四步：注册设备

### 4.1 获取设备 UDID

#### 方法 1：使用 Xcode

1. 在 Xcode 中，选择菜单 "Window" → "Devices and Simulators"
2. 选择您的 iOS 设备
3. 复制 "Identifier" 字段中的 UDID

#### 方法 2：使用 iTunes

1. 连接 iOS 设备到 Mac
2. 打开 iTunes
3. 选择设备
4. 在摘要页面中，点击 "Serial Number"
5. 它将切换显示 UDID

### 4.2 在 Apple Developer 网站上注册设备

1. 在 Apple Developer 网站上，进入 "Devices"
2. 点击 "+" 按钮注册新设备
3. 选择 "Register a Single Device"
4. 输入以下信息：
   - **Device Name**: 您的设备名称（例如 "My iPhone"）
   - **Device ID (UDID)**: 粘贴刚刚复制的 UDID
5. 点击 "Continue"
6. 点击 "Register"

## 第五步：创建预配置文件

### 5.1 创建开发预配置文件

#### 步骤 1：创建新预配置文件

1. 在 Apple Developer 网站上，进入 "Profiles"
2. 点击 "+" 按钮创建新预配置文件
3. 选择 "iOS App Development"
4. 点击 "Continue"

#### 步骤 2：选择 App ID

1. 选择 "com.meritgame.ios"
2. 点击 "Continue"

#### 步骤 3：选择证书

1. 选择您的开发证书
2. 点击 "Continue"

#### 步骤 4：选择设备

1. 选择您要包含的设备
2. 点击 "Continue"

#### 步骤 5：命名预配置文件

1. 输入预配置文件名称（例如 "Merit Game Development"）
2. 点击 "Continue"
3. 点击 "Download"

### 5.2 创建 App Store 预配置文件

重复上述步骤，但在步骤 1 中选择 "App Store" 而不是 "iOS App Development"，并在步骤 4 中跳过设备选择。

## 第六步：在 Xcode 中配置预配置文件

### 6.1 导入预配置文件

1. 双击下载的 `.mobileprovision` 文件
2. Xcode 将自动导入预配置文件

### 6.2 在 Xcode 中选择预配置文件

1. 打开 Xcode 项目
2. 选择 "App" 目标
3. 进入 "Signing & Capabilities" 标签
4. 在 "Debug" 部分：
   - **Team**: 选择您的开发团队
   - **Signing Certificate**: Apple Development
   - **Provisioning Profile**: Merit Game Development
5. 在 "Release" 部分：
   - **Team**: 选择您的开发团队
   - **Signing Certificate**: Apple Distribution
   - **Provisioning Profile**: Merit Game App Store

## 第七步：验证配置

### 7.1 检查签名配置

在 Xcode 中：

1. 选择 "App" 目标
2. 进入 "Signing & Capabilities" 标签
3. 验证所有字段都已正确配置
4. 应该没有任何红色警告

### 7.2 测试构建

```bash
# 为模拟器构建
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build

# 为真机构建
xcodebuild build \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build
```

## 常见问题

### Q: "No provisioning profiles found" 错误

A: 这意味着预配置文件不可用。解决方案：

1. 在 Apple Developer 网站上创建预配置文件
2. 下载预配置文件
3. 双击 `.mobileprovision` 文件导入到 Xcode
4. 重新启动 Xcode
5. 在 Xcode 中重新选择预配置文件

### Q: "Code signing identity" 错误

A: 这意味着签名证书不可用。解决方案：

1. 在 Keychain Access 中验证证书已安装
2. 在 Xcode 中重新选择签名证书
3. 重新启动 Xcode

### Q: 应用在真机上崩溃

A: 这可能是由于签名问题。解决方案：

1. 验证预配置文件中包含您的设备
2. 验证设备的 UDID 正确
3. 重新生成预配置文件
4. 重新构建应用

### Q: 如何更新过期的证书？

A: 在 Apple Developer 网站上：

1. 进入 "Certificates"
2. 删除过期的证书
3. 创建新的证书
4. 更新相关的预配置文件
5. 在 Xcode 中重新选择新证书

### Q: 如何添加新设备？

A: 在 Apple Developer 网站上：

1. 进入 "Devices"
2. 点击 "+" 按钮注册新设备
3. 输入设备信息
4. 更新开发预配置文件以包含新设备
5. 重新下载预配置文件

## 配置检查清单

在继续之前，请确保以下所有项目都已完成：

- [ ] 已创建开发签名证书
- [ ] 已创建 App Store 分发证书
- [ ] 已创建应用标识符（com.meritgame.ios）
- [ ] 已注册至少一个 iOS 设备
- [ ] 已创建开发预配置文件
- [ ] 已创建 App Store 预配置文件
- [ ] 已在 Xcode 中导入预配置文件
- [ ] 已在 Xcode 中配置签名证书和预配置文件
- [ ] Debug 构建成功
- [ ] Release 构建成功
- [ ] 应用在真机上成功运行

## 下一步

1. 完成本指南中的所有步骤
2. 验证应用可以成功构建和运行
3. 进行 TestFlight 测试
4. 提交应用到 App Store

---

**祝您的签名证书配置顺利！**

# Apple Developer 账号配置 - 快速执行指南

## 总体流程

本指南将帮助您在 Apple Developer 网站上完成以下操作：

1. ✅ 创建开发签名证书
2. ✅ 创建应用标识符（App ID）
3. ✅ 注册 iOS 设备
4. ✅ 创建预配置文件
5. ✅ 在 Xcode 中导入配置

**预计时间**：30-45 分钟

---

## 第一步：创建开发签名证书（10 分钟）

### 1.1 在 Mac 上生成证书签名请求（CSR）

打开终端，执行以下命令：

```bash
# 打开 Keychain Access
open /Applications/Utilities/Keychain\ Access.app
```

或者使用菜单：

1. 打开 **Keychain Access** 应用
2. 菜单 → **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
3. 填写表单：
   - **Common Name**: `Merit Game Developer` （或您的名字）
   - **Email Address**: 您的 Apple ID 邮箱
   - **CA Email Address**: 留空
   - **Request is**: 选择 **Saved to disk**
4. 点击 **Continue**
5. 选择保存位置（例如桌面）
6. 点击 **Save**

**结果**：您将获得一个 `CertificateSigningRequest.certSigningRequest` 文件

### 1.2 在 Apple Developer 网站上上传 CSR

1. 访问 [Apple Developer 网站](https://developer.apple.com)
2. 点击右上角 **Account**
3. 使用您的 Apple ID 登录
4. 进入 **Certificates, Identifiers & Profiles**
5. 选择 **Certificates**
6. 点击 **+** 按钮
7. 选择 **iOS App Development**
8. 点击 **Continue**
9. 选择刚刚创建的 `CertificateSigningRequest.certSigningRequest` 文件
10. 点击 **Continue**
11. 点击 **Download** 下载证书

**结果**：您将获得一个 `ios_development.cer` 文件

### 1.3 安装证书到 Keychain

1. 双击下载的 `ios_development.cer` 文件
2. Keychain Access 将自动打开并安装证书
3. 在 Keychain Access 中，验证证书已出现在 "My Certificates" 中
   - 证书名称应该是 "Apple Development: [您的名字] ([Team ID])"

---

## 第二步：创建应用标识符（5 分钟）

### 2.1 在 Apple Developer 网站上创建 App ID

1. 在 Apple Developer 网站上，进入 **Certificates, Identifiers & Profiles**
2. 选择 **Identifiers**
3. 点击 **+** 按钮
4. 选择 **App IDs**
5. 点击 **Continue**
6. 选择 **App**
7. 点击 **Continue**

### 2.2 配置 App ID

在表单中填写以下信息：

| 字段 | 值 |
|------|-----|
| **Description** | Merit Game |
| **Bundle ID** | Explicit |
| **Bundle ID (输入框)** | `com.meritgame.ios` |

### 2.3 选择功能

勾选以下功能（根据应用需求）：

- ✅ **Health Kit** - 访问用户的健康数据
- ✅ **Push Notifications** - 发送推送通知
- ✅ **Background Modes** - 后台运行（可选）

### 2.4 完成创建

1. 点击 **Continue**
2. 点击 **Register**
3. 点击 **Done**

**结果**：应用标识符已创建，Bundle ID 为 `com.meritgame.ios`

---

## 第三步：注册 iOS 设备（5 分钟）

### 3.1 获取您的 iOS 设备 UDID

#### 方法 1：使用 Xcode（推荐）

1. 在 Mac 上打开 Xcode
2. 菜单 → **Window** → **Devices and Simulators**
3. 选择您的 iOS 设备
4. 复制 **Identifier** 字段中的 UDID（长字符串）

#### 方法 2：使用 Apple Configurator

1. 在 Mac App Store 中下载 **Apple Configurator 2**
2. 打开应用
3. 连接 iOS 设备
4. 在列表中选择设备
5. 在右侧面板中找到 **UDID**

### 3.2 在 Apple Developer 网站上注册设备

1. 在 Apple Developer 网站上，进入 **Devices**
2. 点击 **+** 按钮
3. 选择 **Register a Single Device**
4. 填写表单：
   - **Device Name**: 例如 "My iPhone 14"
   - **Device ID (UDID)**: 粘贴您的 UDID
5. 点击 **Continue**
6. 点击 **Register**
7. 点击 **Done**

**结果**：您的 iOS 设备已注册

---

## 第四步：创建开发预配置文件（5 分钟）

### 4.1 创建预配置文件

1. 在 Apple Developer 网站上，进入 **Profiles**
2. 点击 **+** 按钮
3. 选择 **iOS App Development**
4. 点击 **Continue**

### 4.2 选择 App ID

1. 选择 **com.meritgame.ios**
2. 点击 **Continue**

### 4.3 选择证书

1. 选择您的开发证书（"Apple Development: [您的名字]"）
2. 点击 **Continue**

### 4.4 选择设备

1. 勾选您刚刚注册的 iOS 设备
2. 点击 **Continue**

### 4.5 命名和下载

1. 输入预配置文件名称：`Merit Game Development`
2. 点击 **Continue**
3. 点击 **Download**

**结果**：您将获得 `Merit Game Development.mobileprovision` 文件

---

## 第五步：创建 App Store 分发证书（10 分钟）

### 5.1 生成新的 CSR（如需要）

如果您还没有 App Store 分发证书，重复第一步的步骤 1.1 和 1.2，但在步骤 1.2 的第 7 步选择 **App Store and Ad Hoc** 而不是 **iOS App Development**。

**结果**：您将获得 `ios_distribution.cer` 文件

### 5.2 创建 App Store 预配置文件

1. 在 Apple Developer 网站上，进入 **Profiles**
2. 点击 **+** 按钮
3. 选择 **App Store**
4. 点击 **Continue**
5. 选择 **com.meritgame.ios**
6. 点击 **Continue**
7. 选择您的 App Store 分发证书
8. 点击 **Continue**
9. 输入预配置文件名称：`Merit Game App Store`
10. 点击 **Continue**
11. 点击 **Download**

**结果**：您将获得 `Merit Game App Store.mobileprovision` 文件

---

## 第六步：在 Xcode 中导入配置（5 分钟）

### 6.1 导入预配置文件

1. 双击下载的 `Merit Game Development.mobileprovision` 文件
2. Xcode 将自动打开并导入预配置文件
3. 重复步骤 1-2，导入 `Merit Game App Store.mobileprovision` 文件

### 6.2 在 Xcode 中配置项目

1. 打开 Xcode
2. 打开 `ios/App/App.xcworkspace`
3. 选择 "App" 项目
4. 选择 "App" 目标
5. 进入 **Signing & Capabilities** 标签

### 6.3 配置 Debug 签名

在 **Debug** 部分：

1. **Team**: 选择您的开发团队
2. **Signing Certificate**: Apple Development
3. **Provisioning Profile**: Merit Game Development

### 6.4 配置 Release 签名

在 **Release** 部分：

1. **Team**: 选择您的开发团队
2. **Signing Certificate**: Apple Distribution
3. **Provisioning Profile**: Merit Game App Store

### 6.5 验证配置

1. 应该没有任何红色警告
2. 所有字段都应该正确填充

---

## 常见问题

### Q: 找不到我的开发团队？

A: 在 Xcode 中添加您的 Apple ID：

1. 打开 Xcode
2. 菜单 → **Preferences** (或 **Settings**)
3. 点击 **Accounts** 标签
4. 点击左下角的 **+** 按钮
5. 选择 **Apple ID**
6. 输入您的 Apple ID 和密码
7. 点击 **Sign In**

### Q: 预配置文件显示 "Invalid"？

A: 这通常意味着：

1. 设备 UDID 不正确
2. 证书已过期
3. 预配置文件与 App ID 不匹配

解决方案：

1. 验证设备 UDID
2. 在 Apple Developer 网站上检查证书和预配置文件
3. 如需要，重新创建预配置文件

### Q: 如何添加新设备？

A: 如果您想在新设备上测试：

1. 获取新设备的 UDID
2. 在 Apple Developer 网站上注册设备
3. 更新开发预配置文件以包含新设备
4. 重新下载预配置文件
5. 在 Xcode 中重新导入

---

## 完成检查清单

在继续下一步之前，请确保以下所有项目都已完成：

- [ ] 开发签名证书已创建并安装在 Keychain 中
- [ ] App ID `com.meritgame.ios` 已创建
- [ ] iOS 设备已注册
- [ ] 开发预配置文件已创建并下载
- [ ] App Store 分发证书已创建并安装
- [ ] App Store 预配置文件已创建并下载
- [ ] 预配置文件已在 Xcode 中导入
- [ ] Xcode 中的签名配置已验证
- [ ] 没有任何红色警告

---

## 下一步

1. ✅ 完成本指南中的所有步骤
2. → 执行本地构建测试（参考 VERIFY_AND_TEST_BUILD.md）
3. → 进行 TestFlight 测试
4. → 提交应用到 App Store

---

**祝您的 Apple Developer 账号配置顺利！** 🎉

# Apple Developer 账号配置 - 完整详细指南

## 📌 重要提示

本指南将帮助您完成以下操作：

1. ✅ 创建开发签名证书
2. ✅ 创建应用标识符（App ID）
3. ✅ 注册 iOS 设备
4. ✅ 创建开发预配置文件
5. ✅ 创建 App Store 分发证书
6. ✅ 创建 App Store 预配置文件
7. ✅ 在 Xcode 中导入配置

**预计完成时间**：45 分钟 - 1 小时

---

## 前置准备

### 需要的物品

- [ ] Mac 电脑（运行 macOS 10.15 或更高版本）
- [ ] Xcode（已安装）
- [ ] Apple ID（已创建）
- [ ] iOS 设备（用于测试）
- [ ] 网络连接

### 需要的信息

| 信息 | 值 | 备注 |
|------|-----|------|
| Apple ID | _________________ | 您的 Apple 账号邮箱 |
| Apple ID 密码 | _________________ | 保管好，不要泄露 |
| 应用名称 | 功德圆满 | 已确定 |
| Bundle ID | com.meritgame.ios | 已确定 |
| 开发团队 | _________________ | 将在配置过程中获得 |
| iOS 设备 UDID | _________________ | 将在步骤 3 中获取 |

---

## 第一步：在 Mac 上生成证书签名请求（CSR）

### 步骤 1.1：打开 Keychain Access

在 Mac 上打开 **Keychain Access** 应用：

1. 按下 **Command + Space** 打开 Spotlight
2. 输入 "Keychain Access"
3. 按 Enter 打开应用

**或者**：
- 打开 **Finder**
- 进入 **Applications** → **Utilities** → **Keychain Access**

### 步骤 1.2：生成证书签名请求

1. 在菜单栏中，点击 **Keychain Access**
2. 选择 **Certificate Assistant**
3. 选择 **Request a Certificate from a Certificate Authority...**

**您将看到一个表单，如下所示：**

```
┌─────────────────────────────────────────┐
│ Certificate Information                 │
├─────────────────────────────────────────┤
│ Common Name: _____________________      │
│ Email Address: _____________________   │
│ CA Email Address: _____________________│
│ Request is:                             │
│   ○ Emailed to the CA                  │
│   ● Saved to disk                      │
└─────────────────────────────────────────┘
```

### 步骤 1.3：填写表单

在表单中填写以下信息：

| 字段 | 值 | 说明 |
|------|-----|------|
| **Common Name** | Merit Game Developer | 任意名称，用于标识证书 |
| **Email Address** | 您的 Apple ID 邮箱 | 必须与 Apple ID 相同 |
| **CA Email Address** | （留空） | 不需要填写 |
| **Request is** | Saved to disk | 选择此选项 |

**示例**：
```
Common Name: Merit Game Developer
Email Address: your-email@example.com
CA Email Address: (留空)
Request is: ● Saved to disk
```

### 步骤 1.4：保存 CSR 文件

1. 点击 **Continue**
2. 选择保存位置（例如桌面）
3. 输入文件名：`MeritGameCSR`
4. 点击 **Save**

**结果**：您将在桌面上看到一个名为 `MeritGameCSR.certSigningRequest` 的文件

### 验证

- [ ] 文件已保存到桌面
- [ ] 文件名为 `MeritGameCSR.certSigningRequest`
- [ ] 文件大小约为 1-2 KB

---

## 第二步：在 Apple Developer 网站上创建开发证书

### 步骤 2.1：登录 Apple Developer 网站

1. 打开浏览器
2. 访问 https://developer.apple.com
3. 点击右上角 **Account**
4. 使用您的 Apple ID 登录

**您应该看到**：
```
Welcome, [Your Name]
Apple Developer Account
```

### 步骤 2.2：进入证书管理页面

1. 在账户页面中，点击 **Certificates, Identifiers & Profiles**
2. 您应该看到以下菜单：

```
┌─────────────────────────────────┐
│ Certificates, Identifiers &     │
│ Profiles                        │
├─────────────────────────────────┤
│ ▼ iOS, tvOS, watchOS            │
│   • Certificates                │
│   • Identifiers                 │
│   • Devices                     │
│   • Profiles                    │
└─────────────────────────────────┘
```

3. 点击 **Certificates**

### 步骤 2.3：创建新证书

1. 在 Certificates 页面中，点击右上角的 **+** 按钮
2. 您将看到证书类型列表：

```
┌─────────────────────────────────┐
│ Select a certificate type:      │
├─────────────────────────────────┤
│ ○ iOS App Development           │
│ ○ iOS Distribution              │
│ ○ Apple Push Notification       │
│ ○ ...                           │
└─────────────────────────────────┘
```

3. 选择 **iOS App Development**
4. 点击 **Continue**

### 步骤 2.4：上传 CSR 文件

1. 您将看到一个页面，要求选择 CSR 文件
2. 点击 **Choose File**
3. 选择您在步骤 1.4 中保存的 `MeritGameCSR.certSigningRequest` 文件
4. 点击 **Continue**

**您应该看到**：
```
Certificate Request Received

Your certificate request has been received.
Click Download to save your certificate.
```

### 步骤 2.5：下载证书

1. 点击 **Download** 按钮
2. 一个名为 `ios_development.cer` 的文件将被下载到您的 Downloads 文件夹
3. 点击 **Done**

**验证**：
- [ ] 文件已下载到 Downloads 文件夹
- [ ] 文件名为 `ios_development.cer`
- [ ] 文件大小约为 3-5 KB

### 步骤 2.6：安装证书到 Keychain

1. 打开 **Finder**
2. 进入 **Downloads** 文件夹
3. 双击 `ios_development.cer` 文件
4. **Keychain Access** 将自动打开
5. 您将看到一个对话框，要求您选择 Keychain：

```
┌─────────────────────────────────┐
│ Select a Keychain:              │
├─────────────────────────────────┤
│ ○ login                         │
│ ○ Local Items                   │
│ ○ ...                           │
└─────────────────────────────────┘
```

6. 选择 **login**
7. 点击 **Add**

**结果**：证书已安装到 Keychain

### 验证证书安装

1. 打开 **Keychain Access**
2. 在左侧菜单中，选择 **My Certificates**
3. 您应该看到一个新的证书，名称类似于：

```
Apple Development: Merit Game Developer (XXXXXXXXXX)
```

- [ ] 证书已出现在 "My Certificates" 中
- [ ] 证书名称包含 "Apple Development"
- [ ] 证书有一个绿色的勾号（表示有效）

---

## 第三步：创建应用标识符（App ID）

### 步骤 3.1：进入 Identifiers 页面

1. 在 Apple Developer 网站上，进入 **Certificates, Identifiers & Profiles**
2. 点击 **Identifiers**
3. 您应该看到现有的 Identifiers 列表

### 步骤 3.2：创建新的 App ID

1. 点击右上角的 **+** 按钮
2. 您将看到一个页面，要求选择 Identifier 类型：

```
┌─────────────────────────────────┐
│ Select a type:                  │
├─────────────────────────────────┤
│ ○ App IDs                       │
│ ○ App Groups                    │
│ ○ ...                           │
└─────────────────────────────────┘
```

3. 选择 **App IDs**
4. 点击 **Continue**

### 步骤 3.3：选择应用类型

1. 您将看到应用类型选择：

```
┌─────────────────────────────────┐
│ Select the type of app ID:      │
├─────────────────────────────────┤
│ ○ App                           │
│ ○ App Clip                      │
└─────────────────────────────────┘
```

2. 选择 **App**
3. 点击 **Continue**

### 步骤 3.4：填写应用信息

您将看到一个表单：

```
┌─────────────────────────────────┐
│ App ID Description              │
├─────────────────────────────────┤
│ Description: _________________  │
│                                 │
│ Bundle ID:                      │
│ ○ Explicit                      │
│ ○ Wildcard                      │
│                                 │
│ Explicit Bundle ID: ____________│
└─────────────────────────────────┘
```

填写以下信息：

| 字段 | 值 |
|------|-----|
| **Description** | Merit Game |
| **Bundle ID** | 选择 "Explicit" |
| **Explicit Bundle ID** | com.meritgame.ios |

### 步骤 3.5：选择功能

向下滚动，您将看到一个功能列表。勾选以下功能：

- [ ] **Health Kit** - 用于访问用户的健康数据
- [ ] **Push Notifications** - 用于发送推送通知
- [ ] **Background Modes**（可选）- 用于后台运行

**示例**：
```
☑ Health Kit
☑ Push Notifications
☐ Background Modes
☐ ...
```

### 步骤 3.6：完成创建

1. 点击 **Continue**
2. 您将看到一个确认页面，显示您的 App ID 配置
3. 点击 **Register**
4. 您应该看到成功消息：

```
App ID "com.meritgame.ios" has been registered.
```

5. 点击 **Done**

**验证**：
- [ ] App ID 已创建
- [ ] Bundle ID 为 `com.meritgame.ios`
- [ ] Health Kit 和 Push Notifications 已启用

---

## 第四步：注册 iOS 设备

### 步骤 4.1：获取 iOS 设备的 UDID

#### 方法 1：使用 Xcode（推荐）

1. 使用 USB 线连接 iOS 设备到 Mac
2. 打开 **Xcode**
3. 在菜单栏中，点击 **Window**
4. 选择 **Devices and Simulators**

**您应该看到**：
```
┌─────────────────────────────────┐
│ Devices                         │
├─────────────────────────────────┤
│ Connected                       │
│ • iPhone 14 (UDID)             │
│   Identifier: XXXXXXXX...      │
│   Version: iOS 17.x            │
└─────────────────────────────────┘
```

5. 选择您的设备
6. 在右侧面板中，找到 **Identifier** 字段
7. 右键点击 UDID，选择 **Copy**

**您的 UDID 应该看起来像**：
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

#### 方法 2：使用 Apple Configurator

1. 在 Mac App Store 中搜索并下载 **Apple Configurator 2**
2. 打开应用
3. 使用 USB 线连接 iOS 设备
4. 在列表中选择您的设备
5. 在右侧面板中找到 **UDID**
6. 复制 UDID

### 步骤 4.2：在 Apple Developer 网站上注册设备

1. 在 Apple Developer 网站上，进入 **Certificates, Identifiers & Profiles**
2. 点击 **Devices**
3. 点击右上角的 **+** 按钮
4. 您将看到一个页面，要求选择设备类型：

```
┌─────────────────────────────────┐
│ Register a Device               │
├─────────────────────────────────┤
│ ○ Register a Single Device      │
│ ○ Register Multiple Devices     │
└─────────────────────────────────┘
```

5. 选择 **Register a Single Device**
6. 点击 **Continue**

### 步骤 4.3：填写设备信息

您将看到一个表单：

```
┌─────────────────────────────────┐
│ Device Registration             │
├─────────────────────────────────┤
│ Device Name: _________________  │
│ Device ID (UDID): _____________ │
└─────────────────────────────────┘
```

填写以下信息：

| 字段 | 值 | 说明 |
|------|-----|------|
| **Device Name** | My iPhone 14 | 任意名称，用于标识设备 |
| **Device ID (UDID)** | a1b2c3d4... | 从步骤 4.1 中复制的 UDID |

### 步骤 4.4：完成注册

1. 点击 **Continue**
2. 您将看到一个确认页面
3. 点击 **Register**
4. 您应该看到成功消息：

```
Device "My iPhone 14" has been registered.
```

5. 点击 **Done**

**验证**：
- [ ] 设备已注册
- [ ] 设备名称正确
- [ ] UDID 正确

---

## 第五步：创建开发预配置文件

### 步骤 5.1：进入 Profiles 页面

1. 在 Apple Developer 网站上，进入 **Certificates, Identifiers & Profiles**
2. 点击 **Profiles**

### 步骤 5.2：创建新预配置文件

1. 点击右上角的 **+** 按钮
2. 您将看到预配置文件类型列表：

```
┌─────────────────────────────────┐
│ Select a provisioning profile   │
│ type:                           │
├─────────────────────────────────┤
│ ○ iOS App Development           │
│ ○ Ad Hoc                        │
│ ○ App Store                     │
│ ○ ...                           │
└─────────────────────────────────┘
```

3. 选择 **iOS App Development**
4. 点击 **Continue**

### 步骤 5.3：选择 App ID

1. 您将看到一个 App ID 列表
2. 选择 **com.meritgame.ios**
3. 点击 **Continue**

### 步骤 5.4：选择证书

1. 您将看到您的开发证书列表
2. 勾选 **Apple Development: Merit Game Developer** 证书
3. 点击 **Continue**

### 步骤 5.5：选择设备

1. 您将看到您注册的设备列表
2. 勾选您的 iOS 设备
3. 点击 **Continue**

### 步骤 5.6：命名和下载

1. 输入预配置文件名称：`Merit Game Development`
2. 点击 **Continue**
3. 您将看到一个确认页面
4. 点击 **Download**
5. 一个名为 `Merit Game Development.mobileprovision` 的文件将被下载

**验证**：
- [ ] 文件已下载
- [ ] 文件名为 `Merit Game Development.mobileprovision`
- [ ] 文件大小约为 30-50 KB

### 步骤 5.7：安装预配置文件

1. 打开 **Finder**
2. 进入 **Downloads** 文件夹
3. 双击 `Merit Game Development.mobileprovision` 文件
4. **Xcode** 将自动打开并安装预配置文件

**结果**：预配置文件已安装

---

## 第六步：创建 App Store 分发证书

### 步骤 6.1：生成新的 CSR（如需要）

如果您还没有 App Store 分发证书，重复第一步的步骤 1.1 - 1.4，但在步骤 1.3 中，使用以下信息：

| 字段 | 值 |
|------|-----|
| **Common Name** | Merit Game Distribution |
| **Email Address** | 您的 Apple ID 邮箱 |

**结果**：您将获得 `MeritGameDistributionCSR.certSigningRequest` 文件

### 步骤 6.2：在 Apple Developer 网站上创建分发证书

1. 在 Apple Developer 网站上，进入 **Certificates**
2. 点击 **+** 按钮
3. 选择 **App Store and Ad Hoc**
4. 点击 **Continue**
5. 上传您在步骤 6.1 中创建的 CSR 文件
6. 点击 **Continue**
7. 点击 **Download**

**结果**：您将获得 `ios_distribution.cer` 文件

### 步骤 6.3：安装分发证书

1. 打开 **Finder**
2. 进入 **Downloads** 文件夹
3. 双击 `ios_distribution.cer` 文件
4. **Keychain Access** 将自动打开并安装证书

**验证**：
- [ ] 证书已安装到 Keychain
- [ ] 证书名称包含 "Apple Distribution"

---

## 第七步：创建 App Store 预配置文件

### 步骤 7.1：创建新预配置文件

1. 在 Apple Developer 网站上，进入 **Profiles**
2. 点击 **+** 按钮
3. 选择 **App Store**
4. 点击 **Continue**

### 步骤 7.2：选择 App ID

1. 选择 **com.meritgame.ios**
2. 点击 **Continue**

### 步骤 7.3：选择分发证书

1. 选择 **Apple Distribution: Merit Game Developer** 证书
2. 点击 **Continue**

### 步骤 7.4：命名和下载

1. 输入预配置文件名称：`Merit Game App Store`
2. 点击 **Continue**
3. 点击 **Download**

**结果**：您将获得 `Merit Game App Store.mobileprovision` 文件

### 步骤 7.5：安装预配置文件

1. 双击 `Merit Game App Store.mobileprovision` 文件
2. **Xcode** 将自动安装预配置文件

---

## 第八步：在 Xcode 中导入配置

### 步骤 8.1：打开 Xcode 项目

1. 打开 **Xcode**
2. 打开 `/home/ubuntu/merit-game-ios/ios/App/App.xcworkspace`

**重要**：确保打开的是 `.xcworkspace` 文件，而不是 `.xcodeproj` 文件

### 步骤 8.2：选择项目和目标

1. 在左侧的 Project Navigator 中，选择 "App" 项目
2. 在中央窗格中，选择 "App" 目标

### 步骤 8.3：进入签名配置

1. 点击顶部的 **Signing & Capabilities** 标签
2. 您应该看到两个部分：**Debug** 和 **Release**

### 步骤 8.4：配置 Debug 签名

在 **Debug** 部分中：

1. **Team**：点击下拉菜单，选择您的开发团队
2. **Signing Certificate**：应该自动设置为 "Apple Development"
3. **Provisioning Profile**：应该自动设置为 "Merit Game Development"

**您应该看到**：
```
Debug
├─ Team: [Your Team Name] (XXXXXXXXXX)
├─ Signing Certificate: Apple Development
└─ Provisioning Profile: Merit Game Development
```

### 步骤 8.5：配置 Release 签名

在 **Release** 部分中：

1. **Team**：点击下拉菜单，选择您的开发团队
2. **Signing Certificate**：应该自动设置为 "Apple Distribution"
3. **Provisioning Profile**：应该自动设置为 "Merit Game App Store"

**您应该看到**：
```
Release
├─ Team: [Your Team Name] (XXXXXXXXXX)
├─ Signing Certificate: Apple Distribution
└─ Provisioning Profile: Merit Game App Store
```

### 步骤 8.6：验证配置

检查以下内容：

- [ ] 没有任何红色警告或错误
- [ ] 所有字段都已正确填充
- [ ] Bundle ID 显示为 `com.meritgame.ios`
- [ ] Team 已正确选择

**如果看到红色警告**：

这通常意味着预配置文件未正确安装。解决方案：

1. 关闭 Xcode
2. 再次双击预配置文件以重新安装
3. 重新打开 Xcode

---

## 验证和测试

### 验证证书和预配置文件

1. 在 Xcode 中，打开 **Preferences** (或 **Settings**)
2. 点击 **Accounts** 标签
3. 选择您的 Apple ID
4. 点击 **Manage Certificates**
5. 您应该看到您的证书列表：

```
Certificates
├─ Apple Development: Merit Game Developer (XXXXXXXXXX)
├─ Apple Distribution: Merit Game Developer (XXXXXXXXXX)
└─ ...
```

### 测试构建

1. 在 Xcode 中，选择您的 iOS 设备作为目标
2. 点击菜单栏中的 **Product**
3. 选择 **Build**
4. 应用应该成功构建

**如果构建成功**：
```
Build Successful!
```

**如果构建失败**：
- 检查错误信息
- 确保所有签名配置都正确
- 重新启动 Xcode

---

## 常见问题和解决方案

### Q: 我看到 "No provisioning profiles found" 错误

**解决方案**：
1. 确保预配置文件已下载
2. 双击预配置文件以安装
3. 在 Xcode 中，进入 **Preferences** → **Accounts** → **Manage Certificates**
4. 点击右下角的刷新按钮
5. 重新启动 Xcode

### Q: 我看到 "Certificate is invalid" 错误

**解决方案**：
1. 检查证书是否已过期
2. 如果已过期，在 Apple Developer 网站上创建新证书
3. 重新安装新证书
4. 更新预配置文件

### Q: 我看到 "Bundle ID mismatch" 错误

**解决方案**：
1. 确保 Xcode 中的 Bundle ID 为 `com.meritgame.ios`
2. 确保预配置文件的 Bundle ID 也是 `com.meritgame.ios`
3. 如果不匹配，创建新的预配置文件

### Q: 我看到 "Device is not registered" 错误

**解决方案**：
1. 确保您的 iOS 设备已在 Apple Developer 网站上注册
2. 检查 UDID 是否正确
3. 如果 UDID 不正确，重新注册设备
4. 更新预配置文件以包含新设备

### Q: 我如何添加新设备？

**解决方案**：
1. 获取新设备的 UDID
2. 在 Apple Developer 网站上注册新设备
3. 更新开发预配置文件以包含新设备
4. 重新下载预配置文件
5. 在 Xcode 中重新导入预配置文件

---

## 完成检查清单

在继续下一步之前，请确保以下所有项目都已完成：

### 证书和 CSR
- [ ] 开发 CSR 已创建
- [ ] 开发证书已下载和安装
- [ ] 分发 CSR 已创建
- [ ] 分发证书已下载和安装

### App ID 和设备
- [ ] App ID `com.meritgame.ios` 已创建
- [ ] Health Kit 已启用
- [ ] Push Notifications 已启用
- [ ] iOS 设备已注册
- [ ] 设备 UDID 正确

### 预配置文件
- [ ] 开发预配置文件已下载和安装
- [ ] App Store 预配置文件已下载和安装

### Xcode 配置
- [ ] Debug 签名已配置
- [ ] Release 签名已配置
- [ ] 没有任何红色警告
- [ ] 构建测试成功

---

## 下一步

完成本指南后，您可以：

1. ✅ 在真机上测试应用
2. ✅ 创建应用存档
3. ✅ 在 App Store Connect 中创建应用
4. ✅ 上传应用到 TestFlight
5. ✅ 提交应用到 App Store

---

## 需要帮助？

如果您遇到问题，请参考：

1. **Apple Developer 文档**：https://developer.apple.com/documentation/
2. **Xcode 帮助**：在 Xcode 中按 Command + ? 打开帮助
3. **Apple 支持**：https://support.apple.com/

---

**祝您的 Apple Developer 账号配置顺利！** 🎉

**配置完成日期**：_________________

# Xcode 配置验证和故障排除指南

## 📋 配置验证清单

完成 Apple Developer 账号配置后，请按照以下步骤验证 Xcode 中的配置。

---

## 第一步：验证 Xcode 账户配置

### 1.1 检查 Apple ID 是否已添加到 Xcode

1. 打开 **Xcode**
2. 在菜单栏中，点击 **Xcode**
3. 选择 **Preferences** (macOS 12 及以下) 或 **Settings** (macOS 13 及以上)
4. 点击 **Accounts** 标签

**您应该看到**：
```
┌─────────────────────────────────┐
│ Accounts                        │
├─────────────────────────────────┤
│ Apple ID: your-email@example.com│
│ Name: Your Name                 │
│ Team ID: XXXXXXXXXX             │
│ ✓ Active                        │
└─────────────────────────────────┘
```

### 1.2 如果 Apple ID 未添加

1. 点击左下角的 **+** 按钮
2. 选择 **Apple ID**
3. 输入您的 Apple ID 邮箱
4. 输入您的 Apple ID 密码
5. 点击 **Sign In**

**验证**：
- [ ] Apple ID 已添加到 Xcode
- [ ] 显示 "Active" 状态
- [ ] Team ID 已显示

---

## 第二步：验证证书

### 2.1 查看已安装的证书

1. 在 Xcode Preferences 中，点击 **Accounts** 标签
2. 选择您的 Apple ID
3. 点击 **Manage Certificates**

**您应该看到**：
```
Certificates
├─ Apple Development: Merit Game Developer (XXXXXXXXXX)
├─ Apple Distribution: Merit Game Developer (XXXXXXXXXX)
└─ ...
```

### 2.2 验证证书详情

对于每个证书，检查以下内容：

| 项目 | 检查内容 |
|------|---------|
| **证书名称** | 应该包含 "Apple Development" 或 "Apple Distribution" |
| **有效期** | 应该显示有效期（通常为 1 年） |
| **状态** | 应该显示为有效（无红色警告） |

### 2.3 如果证书无效或过期

1. 在 Apple Developer 网站上创建新证书
2. 在 Xcode 中，点击 **Refresh** 按钮（右下角）
3. 重新启动 Xcode

---

## 第三步：验证预配置文件

### 3.1 查看预配置文件

1. 在 Xcode Preferences 中，点击 **Accounts** 标签
2. 选择您的 Apple ID
3. 点击 **Manage Certificates**
4. 在左侧菜单中，选择 **Provisioning Profiles**

**您应该看到**：
```
Provisioning Profiles
├─ Merit Game Development (iOS)
├─ Merit Game App Store (iOS)
└─ ...
```

### 3.2 验证预配置文件详情

对于每个预配置文件，检查以下内容：

| 项目 | 检查内容 |
|------|---------|
| **名称** | Merit Game Development 或 Merit Game App Store |
| **类型** | Development 或 Distribution |
| **Bundle ID** | com.meritgame.ios |
| **有效期** | 应该显示有效期 |
| **状态** | 应该显示为有效 |

### 3.3 如果预配置文件无效

1. 在 Apple Developer 网站上重新创建预配置文件
2. 下载新的预配置文件
3. 双击安装
4. 在 Xcode 中点击 **Refresh** 按钮

---

## 第四步：验证项目配置

### 4.1 打开项目

1. 打开 **Xcode**
2. 打开 `/home/ubuntu/merit-game-ios/ios/App/App.xcworkspace`

**重要**：确保打开的是 `.xcworkspace` 文件

### 4.2 检查 Bundle ID

1. 在左侧的 Project Navigator 中，选择 "App" 项目
2. 在中央窗格中，选择 "App" 目标
3. 点击 **General** 标签
4. 检查 **Bundle Identifier** 字段

**应该显示**：
```
com.meritgame.ios
```

### 4.3 检查签名配置

1. 点击 **Signing & Capabilities** 标签
2. 检查 **Debug** 部分：

```
Debug
├─ Team: [Your Team Name] (XXXXXXXXXX)
├─ Signing Certificate: Apple Development
├─ Provisioning Profile: Merit Game Development
└─ Status: ✓ (无红色警告)
```

3. 检查 **Release** 部分：

```
Release
├─ Team: [Your Team Name] (XXXXXXXXXX)
├─ Signing Certificate: Apple Distribution
├─ Provisioning Profile: Merit Game App Store
└─ Status: ✓ (无红色警告)
```

---

## 第五步：测试构建

### 5.1 连接 iOS 设备

1. 使用 USB 线连接您的 iOS 设备到 Mac
2. 在 iOS 设备上，点击 **Trust** 以信任这台 Mac

### 5.2 选择构建目标

1. 在 Xcode 的顶部工具栏中，选择您的 iOS 设备作为构建目标
2. 您应该看到设备名称（例如 "iPhone 14"）

### 5.3 执行构建

1. 在菜单栏中，点击 **Product**
2. 选择 **Build**
3. 等待构建完成

**成功的构建应该显示**：
```
Build Successful!
```

**如果构建失败**：
- 查看错误信息
- 参考下面的故障排除部分

### 5.4 在设备上运行应用

1. 在菜单栏中，点击 **Product**
2. 选择 **Run**
3. 应用应该在您的 iOS 设备上启动

---

## 故障排除

### 问题 1：No provisioning profiles found

**错误信息**：
```
No provisioning profiles found
```

**原因**：预配置文件未正确安装或已过期

**解决方案**：

1. 在 Apple Developer 网站上检查预配置文件是否有效
2. 重新下载预配置文件
3. 双击预配置文件以重新安装
4. 在 Xcode 中，进入 **Preferences** → **Accounts** → **Manage Certificates**
5. 点击 **Refresh** 按钮
6. 重新启动 Xcode
7. 尝试重新构建

### 问题 2：Certificate is invalid

**错误信息**：
```
Certificate is invalid
```

**原因**：证书已过期或不正确

**解决方案**：

1. 在 Xcode Preferences 中，点击 **Manage Certificates**
2. 检查证书的有效期
3. 如果已过期，在 Apple Developer 网站上创建新证书
4. 重新安装新证书
5. 更新预配置文件
6. 重新启动 Xcode

### 问题 3：Bundle ID mismatch

**错误信息**：
```
Bundle ID mismatch
```

**原因**：项目中的 Bundle ID 与预配置文件的 Bundle ID 不匹配

**解决方案**：

1. 在 Xcode 中，检查 Bundle Identifier：
   - 选择项目 → 目标 → General
   - 检查 Bundle Identifier 是否为 `com.meritgame.ios`

2. 在 Apple Developer 网站上，检查预配置文件的 Bundle ID：
   - 进入 Profiles
   - 选择预配置文件
   - 检查 Bundle ID 是否为 `com.meritgame.ios`

3. 如果不匹配，创建新的预配置文件或更新 Bundle ID

### 问题 4：Device is not registered

**错误信息**：
```
Device is not registered
```

**原因**：您的 iOS 设备未在 Apple Developer 网站上注册

**解决方案**：

1. 获取您的 iOS 设备的 UDID：
   - 在 Xcode 中，打开 Window → Devices and Simulators
   - 选择您的设备
   - 复制 Identifier

2. 在 Apple Developer 网站上注册设备：
   - 进入 Devices
   - 点击 + 按钮
   - 输入设备名称和 UDID
   - 点击 Register

3. 更新开发预配置文件以包含新设备：
   - 进入 Profiles
   - 选择开发预配置文件
   - 编辑预配置文件
   - 勾选新设备
   - 保存

4. 重新下载预配置文件并在 Xcode 中重新安装

### 问题 5：Code signing is required for product type 'Application'

**错误信息**：
```
Code signing is required for product type 'Application'
```

**原因**：签名配置不完整或不正确

**解决方案**：

1. 在 Xcode 中，进入 Signing & Capabilities
2. 确保 Team 已选择
3. 确保 Signing Certificate 已选择
4. 确保 Provisioning Profile 已选择
5. 如果任何字段显示为空，手动选择正确的值
6. 重新启动 Xcode

### 问题 6：Xcode 无法找到我的 Apple ID

**错误信息**：
```
No Apple ID found
```

**原因**：Apple ID 未添加到 Xcode

**解决方案**：

1. 打开 Xcode Preferences
2. 点击 Accounts 标签
3. 点击左下角的 + 按钮
4. 选择 Apple ID
5. 输入您的 Apple ID 邮箱和密码
6. 点击 Sign In

---

## 快速检查清单

在开始构建之前，请检查以下内容：

- [ ] Apple ID 已添加到 Xcode
- [ ] 开发证书已安装
- [ ] 分发证书已安装
- [ ] 开发预配置文件已安装
- [ ] App Store 预配置文件已安装
- [ ] Bundle ID 为 `com.meritgame.ios`
- [ ] Debug 签名已配置
- [ ] Release 签名已配置
- [ ] 没有任何红色警告
- [ ] iOS 设备已连接
- [ ] iOS 设备已在 Apple Developer 网站上注册

---

## 验证成功标志

如果您看到以下内容，说明配置已成功：

1. ✅ Xcode 中没有任何红色警告或错误
2. ✅ 构建成功完成
3. ✅ 应用可以在真机上运行
4. ✅ 应用可以在模拟器上运行
5. ✅ 所有签名和预配置文件都显示为有效

---

## 下一步

配置验证完成后，您可以：

1. 创建应用存档（Archive）
2. 在 App Store Connect 中创建应用
3. 上传应用到 TestFlight
4. 提交应用到 App Store

---

**祝您的配置验证顺利！** ✅

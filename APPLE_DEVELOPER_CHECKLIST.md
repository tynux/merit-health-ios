# Apple Developer 账号配置 - 打印版检查清单

## 📋 快速参考

**应用信息**
- 应用名称：功德圆满 (Merit Game)
- Bundle ID：`com.meritgame.ios`
- 预计完成时间：30-45 分钟

---

## ✅ 第一步：创建开发签名证书

### 在 Mac 上生成 CSR
- [ ] 打开 Keychain Access
- [ ] 菜单 → Certificate Assistant → Request a Certificate
- [ ] 输入名称：`Merit Game Developer`
- [ ] 输入邮箱：您的 Apple ID 邮箱
- [ ] 选择 "Saved to disk"
- [ ] 保存文件到桌面
- [ ] 获得 `CertificateSigningRequest.certSigningRequest` 文件

### 在 Apple Developer 网站上上传 CSR
- [ ] 访问 https://developer.apple.com
- [ ] 登录您的 Apple ID
- [ ] 进入 Certificates, Identifiers & Profiles
- [ ] 选择 Certificates
- [ ] 点击 + 按钮
- [ ] 选择 "iOS App Development"
- [ ] 上传 CSR 文件
- [ ] 点击 Download 下载 `ios_development.cer`

### 安装证书
- [ ] 双击 `ios_development.cer` 文件
- [ ] 在 Keychain Access 中验证证书已安装
- [ ] 证书名称应该是 "Apple Development: [您的名字]"

---

## ✅ 第二步：创建应用标识符

### 在 Apple Developer 网站上创建 App ID
- [ ] 进入 Identifiers
- [ ] 点击 + 按钮
- [ ] 选择 "App IDs"
- [ ] 选择 "App"
- [ ] Description：`Merit Game`
- [ ] Bundle ID：选择 "Explicit"
- [ ] Bundle ID 值：`com.meritgame.ios`

### 选择功能
- [ ] 勾选 "Health Kit"
- [ ] 勾选 "Push Notifications"
- [ ] 点击 Continue
- [ ] 点击 Register

---

## ✅ 第三步：注册 iOS 设备

### 获取设备 UDID
- [ ] 连接 iOS 设备到 Mac
- [ ] 打开 Xcode
- [ ] 菜单 → Window → Devices and Simulators
- [ ] 选择您的设备
- [ ] 复制 Identifier（UDID）

**您的设备 UDID：** ___________________________________

### 在 Apple Developer 网站上注册设备
- [ ] 进入 Devices
- [ ] 点击 + 按钮
- [ ] 选择 "Register a Single Device"
- [ ] Device Name：例如 "My iPhone 14"
- [ ] Device ID (UDID)：粘贴您的 UDID
- [ ] 点击 Continue
- [ ] 点击 Register

---

## ✅ 第四步：创建开发预配置文件

### 创建预配置文件
- [ ] 进入 Profiles
- [ ] 点击 + 按钮
- [ ] 选择 "iOS App Development"
- [ ] 点击 Continue

### 选择 App ID
- [ ] 选择 `com.meritgame.ios`
- [ ] 点击 Continue

### 选择证书
- [ ] 选择 "Apple Development: [您的名字]"
- [ ] 点击 Continue

### 选择设备
- [ ] 勾选您的 iOS 设备
- [ ] 点击 Continue

### 命名和下载
- [ ] 输入名称：`Merit Game Development`
- [ ] 点击 Continue
- [ ] 点击 Download
- [ ] 获得 `Merit Game Development.mobileprovision` 文件

---

## ✅ 第五步：创建 App Store 分发证书

### 生成新的 CSR（如需要）
- [ ] 重复第一步的步骤，但在选择证书类型时选择 "App Store and Ad Hoc"
- [ ] 获得 `ios_distribution.cer` 文件
- [ ] 双击安装证书

### 创建 App Store 预配置文件
- [ ] 进入 Profiles
- [ ] 点击 + 按钮
- [ ] 选择 "App Store"
- [ ] 点击 Continue
- [ ] 选择 `com.meritgame.ios`
- [ ] 点击 Continue
- [ ] 选择 "Apple Distribution" 证书
- [ ] 点击 Continue
- [ ] 输入名称：`Merit Game App Store`
- [ ] 点击 Continue
- [ ] 点击 Download
- [ ] 获得 `Merit Game App Store.mobileprovision` 文件

---

## ✅ 第六步：在 Xcode 中导入配置

### 导入预配置文件
- [ ] 双击 `Merit Game Development.mobileprovision`
- [ ] 双击 `Merit Game App Store.mobileprovision`
- [ ] Xcode 将自动导入

### 在 Xcode 中配置项目
- [ ] 打开 Xcode
- [ ] 打开 `ios/App/App.xcworkspace`
- [ ] 选择 "App" 项目
- [ ] 选择 "App" 目标
- [ ] 进入 "Signing & Capabilities" 标签

### 配置 Debug 签名
- [ ] Team：选择您的开发团队
- [ ] Signing Certificate：Apple Development
- [ ] Provisioning Profile：Merit Game Development

### 配置 Release 签名
- [ ] Team：选择您的开发团队
- [ ] Signing Certificate：Apple Distribution
- [ ] Provisioning Profile：Merit Game App Store

### 验证配置
- [ ] 没有任何红色警告
- [ ] 所有字段都已正确填充
- [ ] Bundle ID 显示为 `com.meritgame.ios`

---

## 🎯 完成状态

**总体进度：** _____ / 6 步

- [ ] 第一步：创建开发签名证书 ✅
- [ ] 第二步：创建应用标识符 ✅
- [ ] 第三步：注册 iOS 设备 ✅
- [ ] 第四步：创建开发预配置文件 ✅
- [ ] 第五步：创建 App Store 分发证书 ✅
- [ ] 第六步：在 Xcode 中导入配置 ✅

---

## 📞 需要帮助？

如果您遇到问题，请参考：

1. **APPLE_DEVELOPER_QUICK_START.md** - 详细的步骤指南
2. **SIGNING_CERTIFICATE_GUIDE.md** - 签名证书常见问题
3. **XCODE_CONFIGURATION_GUIDE.md** - Xcode 配置指南

---

## 🚀 下一步

完成本清单后，您可以：

1. 执行本地构建测试（参考 VERIFY_AND_TEST_BUILD.md）
2. 在真机上测试应用
3. 进行 TestFlight 测试
4. 提交应用到 App Store

---

**日期：** ________________  
**签名：** ________________

---

*本清单可以打印并在完成每个步骤时勾选。*

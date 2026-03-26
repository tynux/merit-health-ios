# iOS Info.plist 配置指南

## 位置

`ios/App/App/App/Info.plist`

## 必需的权限配置

在 Xcode 中编辑 Info.plist 或直接编辑 XML 文件，添加以下权限：

### 1. HealthKit 权限

```xml
<key>NSHealthShareUsageDescription</key>
<string>功德圆满需要访问您的健康数据来计算功德分数，包括步数、睡眠、能量消耗等。</string>
<key>NSHealthUpdateUsageDescription</key>
<string>功德圆满需要更新您的健康数据。</string>
<key>NSHealthClinicalHealthRecordsShareUsageDescription</key>
<string>功德圆满需要访问您的临床健康记录。</string>
```

### 2. 通知权限

```xml
<key>UIUserInterfaceStyle</key>
<string>Light</string>
```

### 3. 应用信息

```xml
<key>CFBundleName</key>
<string>功德圆满</string>
<key>CFBundleDisplayName</key>
<string>功德圆满</string>
<key>CFBundleIdentifier</key>
<string>com.meritgame.ios</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

### 4. 支持的设备方向

```xml
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationPortraitUpsideDown</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### 5. 最低 iOS 版本

```xml
<key>MinimumOSVersion</key>
<string>14.0</string>
```

### 6. 应用传输安全 (ATS)

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <false/>
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

## 完整示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- 应用信息 -->
  <key>CFBundleName</key>
  <string>功德圆满</string>
  <key>CFBundleDisplayName</key>
  <string>功德圆满</string>
  <key>CFBundleIdentifier</key>
  <string>com.meritgame.ios</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  
  <!-- 最低 iOS 版本 -->
  <key>MinimumOSVersion</key>
  <string>14.0</string>
  
  <!-- 支持的设备方向 -->
  <key>UISupportedInterfaceOrientations</key>
  <array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
  </array>
  <key>UISupportedInterfaceOrientations~ipad</key>
  <array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
  </array>
  
  <!-- HealthKit 权限 -->
  <key>NSHealthShareUsageDescription</key>
  <string>功德圆满需要访问您的健康数据来计算功德分数，包括步数、睡眠、能量消耗等。</string>
  <key>NSHealthUpdateUsageDescription</key>
  <string>功德圆满需要更新您的健康数据。</string>
  
  <!-- 应用传输安全 -->
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
  </dict>
  
  <!-- 主题 -->
  <key>UIUserInterfaceStyle</key>
  <string>Light</string>
</dict>
</plist>
```

## 在 Xcode 中配置

1. 打开 `ios/App/App.xcodeproj`
2. 选择 "App" 目标
3. 进入 "Info" 标签页
4. 添加或修改上述键值对

## 推送通知配置

如需支持推送通知，还需要：

1. 在 Apple Developer 中创建 Push Notification 证书
2. 在 Xcode 中启用 "Push Notifications" capability
3. 配置 APNs 证书

## 相机和麦克风权限（可选）

如果应用需要使用相机或麦克风：

```xml
<key>NSCameraUsageDescription</key>
<string>功德圆满需要访问您的相机。</string>
<key>NSMicrophoneUsageDescription</key>
<string>功德圆满需要访问您的麦克风。</string>
```

## 位置权限（可选）

如果应用需要访问用户位置：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>功德圆满需要访问您的位置信息。</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>功德圆满需要始终访问您的位置信息。</string>
```

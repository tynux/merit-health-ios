# iOS 应用图标和启动屏幕配置指南

## 概述

本指南说明如何在 Xcode 中配置应用图标和启动屏幕。功德游戏的设计采用和尚敲木鱼的禅意主题。

## 应用图标配置

### 第一步：准备图标文件

应用图标需要多个尺寸以适配不同的设备和场景。以下是所需的尺寸：

| 用途 | 尺寸 | 说明 |
|------|------|------|
| iPhone App | 1024x1024 | 最高分辨率，用于 App Store |
| iPhone Spotlight | 120x120 | iPhone 主屏幕搜索结果 |
| iPhone Settings | 58x58 | iPhone 设置应用 |
| iPad App | 1024x1024 | iPad 主屏幕 |
| iPad Spotlight | 167x167 | iPad 搜索结果 |
| iPad Settings | 58x58 | iPad 设置应用 |
| Watch App | 172x172 | Apple Watch |
| macOS App | 512x512 | macOS 应用 |

### 第二步：使用 Xcode 配置

1. **打开项目**
   - 在 Xcode 中打开 `ios/App/App.xcodeproj`

2. **选择 Assets**
   - 在项目导航器中，选择 "App" 目标
   - 进入 "Build Phases" 标签页
   - 找到 "Copy Bundle Resources"

3. **添加 AppIcon 集合**
   - 在项目导航器中，选择 "Assets.xcassets"
   - 点击 "+" 按钮，选择 "App Icon Set"
   - 命名为 "AppIcon"

4. **导入图标**
   - 将不同尺寸的图标拖放到对应的位置
   - 确保所有必需的尺寸都已填充

5. **配置 Info.plist**
   - 在 Info.plist 中，确保 `CFBundleIcons` 指向正确的 AppIcon 集合

### 第三步：验证

- 在模拟器中运行应用，检查应用图标是否正确显示
- 检查主屏幕、搜索结果和设置应用中的图标

## 启动屏幕配置

### 第一步：创建启动屏幕

启动屏幕可以使用两种方式：

#### 方式 1：使用 LaunchScreen.storyboard（推荐）

1. **创建 Storyboard**
   - 在 Xcode 中，选择 File → New → File
   - 选择 "Launch Screen"
   - 命名为 "LaunchScreen"

2. **编辑启动屏幕**
   - 在 Interface Builder 中编辑 LaunchScreen.storyboard
   - 添加应用图标、应用名称和其他元素
   - 使用 Auto Layout 确保在所有设备上正确显示

3. **配置 Info.plist**
   - 在 Info.plist 中，设置 `UILaunchStoryboardName` 为 "LaunchScreen"

#### 方式 2：使用启动图像

1. **准备启动图像**
   - 创建以下尺寸的图像：
     - iPhone 6/7/8: 750x1334
     - iPhone X/11/12/13/14: 1125x2436
     - iPhone 6/7/8 Plus: 1242x2208
     - iPad: 1536x2048

2. **添加到 Assets**
   - 在 Assets.xcassets 中创建 "LaunchImage" 集合
   - 导入相应尺寸的启动图像

3. **配置 Info.plist**
   - 在 Info.plist 中，设置 `UILaunchImages` 指向启动图像集合

### 第二步：设置启动屏幕持续时间

在 `capacitor.config.ts` 中配置：

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 3000, // 显示 3 秒
    launchAutoHide: true,
    backgroundColor: "#ffffffff",
    showSpinner: false,
  },
}
```

### 第三步：在代码中隐藏启动屏幕

在 `ios/App/App/AppDelegate.swift` 中：

```swift
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // 隐藏启动屏幕
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
      SplashScreen.hide()
    }
    return true
  }
}
```

## 最佳实践

### 1. 图标设计

- **简洁性**: 应用图标应该简洁易识别
- **可扩展性**: 确保图标在所有尺寸下都清晰可见
- **品牌一致性**: 图标应该反映应用的品牌和主题
- **颜色对比**: 确保图标与背景有足够的对比度

### 2. 启动屏幕

- **加载时间**: 启动屏幕通常显示 2-3 秒
- **品牌展示**: 使用启动屏幕展示应用品牌
- **避免文本**: 尽量避免在启动屏幕上放置过多文本
- **响应式设计**: 确保启动屏幕在所有设备尺寸上都能正确显示

### 3. 性能优化

- **图像优化**: 使用优化的图像格式（PNG、JPEG）
- **文件大小**: 保持图标文件大小在合理范围内
- **缓存**: 系统会缓存应用图标，无需担心性能

## 故障排除

### 图标不显示

1. 检查 Info.plist 中的 `CFBundleIcons` 配置
2. 确保所有必需的图标尺寸都已添加
3. 清理构建文件夹（Cmd + Shift + K）
4. 重新构建应用

### 启动屏幕显示不正确

1. 检查 LaunchScreen.storyboard 的 Auto Layout 约束
2. 验证 Info.plist 中的 `UILaunchStoryboardName` 配置
3. 在不同的模拟器上测试
4. 检查启动屏幕的背景颜色和元素

## 参考资源

- [Apple Human Interface Guidelines - App Icon](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Xcode Help - App Icons](https://help.apple.com/xcode/mac/current/#/dev4ee4f8183)
- [Launch Screens - Apple Developer](https://developer.apple.com/design/human-interface-guidelines/launch-screens)

## 下一步

1. 使用提供的图标和启动屏幕图像
2. 按照上述步骤在 Xcode 中配置
3. 在模拟器和真机上测试
4. 提交到 App Store 前进行最终检查

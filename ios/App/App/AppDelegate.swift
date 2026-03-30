import UIKit
import Capacitor
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 配置推送通知
        configurePushNotifications(application)
        
        // 注册远程通知
        UIApplication.shared.registerForRemoteNotifications()
        
        // 处理启动时的推送通知
        if let notification = launchOptions?[.remoteNotification] as? [String: AnyObject] {
            handleRemoteNotification(notification)
        }
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // MARK: - 推送通知配置
    
    private func configurePushNotifications(_ application: UIApplication) {
        // 设置通知中心委托
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        
        // 请求通知权限
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        center.requestAuthorization(options: options) { granted, error in
            if let error = error {
                print("推送通知权限请求失败: \(error.localizedDescription)")
            } else {
                print("推送通知权限已授予: \(granted)")
            }
        }
    }
    
    // MARK: - 远程通知注册
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // 将设备令牌转换为字符串
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("APNs设备令牌: \(token)")
        
        // 发送设备令牌到服务器
        sendDeviceTokenToServer(token)
        
        // 通知Capacitor插件
        NotificationCenter.default.post(
            name: .capacitorDidRegisterForRemoteNotifications,
            object: deviceToken
        )
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("APNs注册失败: \(error.localizedDescription)")
        
        // 通知Capacitor插件
        NotificationCenter.default.post(
            name: .capacitorDidFailToRegisterForRemoteNotifications,
            object: error
        )
    }
    
    // MARK: - 远程通知处理
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("收到远程通知: \(userInfo)")
        
        // 处理推送通知
        handleRemoteNotification(userInfo)
        
        // 通知Capacitor插件
        NotificationCenter.default.post(
            name: .capacitorDidReceiveRemoteNotification,
            object: userInfo
        )
        
        completionHandler(.newData)
    }
    
    // MARK: - UNUserNotificationCenterDelegate
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // 应用在前台时收到通知
        let userInfo = notification.request.content.userInfo
        print("前台收到通知: \(userInfo)")
        
        // 显示通知横幅和声音
        completionHandler([.banner, .sound, .badge])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // 用户点击通知
        let userInfo = response.notification.request.content.userInfo
        print("用户点击通知: \(userInfo)")
        
        // 处理通知点击
        handleNotificationClick(userInfo)
        
        completionHandler()
    }
    
    // MARK: - 通知处理
    
    private func handleRemoteNotification(_ userInfo: [AnyHashable: Any]) {
        // 解析通知数据
        guard let aps = userInfo["aps"] as? [String: Any],
              let alert = aps["alert"] as? [String: Any] else {
            return
        }
        
        let title = alert["title"] as? String ?? "功德圆满"
        let body = alert["body"] as? String ?? ""
        let type = userInfo["type"] as? String ?? "daily_settlement"
        
        print("处理推送通知: \(title) - \(body) (类型: \(type))")
        
        // 根据通知类型执行相应操作
        switch type {
        case "badge_unlocked":
            print("奖章解锁通知")
        case "daily_settlement":
            print("每日结算通知")
        case "heart_rate_alert":
            print("心率预警通知")
        case "sloth_penalty":
            print("懈怠惩罚通知")
        case "achievement_unlocked":
            print("成就达成通知")
        case "stage_achieved":
            print("阶段达成通知")
        default:
            print("未知通知类型: \(type)")
        }
    }
    
    private func handleNotificationClick(_ userInfo: [AnyHashable: Any]) {
        // 处理用户点击通知后的操作
        let type = userInfo["type"] as? String ?? "daily_settlement"
        
        // 发送事件到WebView
        DispatchQueue.main.async {
            if let viewController = self.window?.rootViewController as? CAPBridgeViewController {
                viewController.bridge?.triggerWindowJSEvent(eventName: "notificationClick", data: "{\"type\":\"\(type)\"}")
            }
        }
    }
    
    private func sendDeviceTokenToServer(_ token: String) {
        // TODO: 实现将设备令牌发送到您的服务器
        // 这里需要根据您的后端API进行实现
        print("将设备令牌发送到服务器: \(token)")
        
        // 示例代码:
        // let url = URL(string: "https://your-server.com/api/register-device-token")!
        // var request = URLRequest(url: url)
        // request.httpMethod = "POST"
        // request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        // let body = ["deviceToken": token, "userId": "current_user_id"]
        // request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        // URLSession.shared.dataTask(with: request).resume()
    }
}

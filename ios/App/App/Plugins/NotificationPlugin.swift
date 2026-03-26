import Capacitor
import UserNotifications

/**
 * 推送通知插件 - 用于发送本地和远程通知
 */
@objc(NotificationPlugin)
public class NotificationPlugin: CAPPlugin {
    
    /**
     * 请求通知权限
     */
    @objc func requestPermission(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if let error = error {
                call.reject("Permission request failed", nil, error)
                return
            }
            
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
            
            call.resolve(["granted": granted])
        }
    }
    
    /**
     * 发送本地通知
     */
    @objc func sendLocalNotification(_ call: CAPPluginCall) {
        guard let title = call.getString("title") else {
            call.reject("Missing title")
            return
        }
        
        let body = call.getString("body") ?? ""
        let delay = call.getInt("delay") ?? 5
        
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        content.badge = NSNumber(value: UIApplication.shared.applicationIconBadgeNumber + 1)
        
        // 添加自定义数据
        if let data = call.getObject("data") {
            content.userInfo = data
        }
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: TimeInterval(delay), repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                call.reject("Failed to schedule notification", nil, error)
                return
            }
            
            call.resolve(["scheduled": true])
        }
    }
    
    /**
     * 获取所有待处理的通知
     */
    @objc func getPendingNotifications(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            let notifications = requests.map { request -> [String: Any] in
                var notification: [String: Any] = [
                    "id": request.identifier,
                    "title": request.content.title,
                    "body": request.content.body,
                ]
                
                if let trigger = request.trigger as? UNTimeIntervalNotificationTrigger {
                    notification["trigger"] = trigger.timeInterval
                }
                
                return notification
            }
            
            call.resolve(["notifications": notifications])
        }
    }
    
    /**
     * 清除所有通知
     */
    @objc func clearAllNotifications(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        UIApplication.shared.applicationIconBadgeNumber = 0
        
        call.resolve(["cleared": true])
    }
    
    /**
     * 清除特定通知
     */
    @objc func clearNotification(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            call.reject("Missing notification id")
            return
        }
        
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [id])
        UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [id])
        
        call.resolve(["cleared": true])
    }
    
    /**
     * 获取应用徽章数
     */
    @objc func getBadgeNumber(_ call: CAPPluginCall) {
        let badge = UIApplication.shared.applicationIconBadgeNumber
        call.resolve(["badge": badge])
    }
    
    /**
     * 设置应用徽章数
     */
    @objc func setBadgeNumber(_ call: CAPPluginCall) {
        guard let badge = call.getInt("badge") else {
            call.reject("Missing badge number")
            return
        }
        
        DispatchQueue.main.async {
            UIApplication.shared.applicationIconBadgeNumber = badge
        }
        
        call.resolve(["badge": badge])
    }
}

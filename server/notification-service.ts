import { notifyOwner } from "./_core/notification";
import { APNsService } from "./apns-service";
import { getUserDeviceTokens, upsertDeviceToken } from "./db";
import type { Badge, DailyMeritRecord } from "../drizzle/schema";

export interface NotificationPayload {
  userId: number;
  type: "badge_unlocked" | "achievement_unlocked" | "daily_settlement" | "heart_rate_alert" | "sloth_penalty";
  title: string;
  content: string;
  data?: Record<string, unknown>;
}

/**
 * 推送通知服务
 * 处理所有与功德游戏相关的通知
 */
export class NotificationService {
  /**
   * 发送奖章解锁通知
   */
  static async notifyBadgeUnlocked(
    userId: number,
    badge: Badge,
    userName?: string
  ): Promise<void> {
    const badgeNames: Record<string, string> = {
      "steps_first": "步数初缘",
      "steps_gold": "步数金级",
      "sleep_silver": "睡眠银级",
      "weekly_merit": "周功德",
      "monthly_merit": "月功德",
      "yearly_merit": "年功德",
      "running_diamond": "跑步钻石",
      "swimming_pearl": "游泳珍珠",
      "mindfulness_enlightenment": "正念开悟",
      "cycling_emerald": "自行车翡翠",
    };

    const badgeName = badgeNames[badge.badgeType] || badge.badgeType;
    const title = `🏆 恭喜获得新奖章！`;
    const content = `您已解锁 ${badgeName} 奖章，继续修行，功德圆满不远矣！`;

    console.log(`[Notification] Badge unlocked for user ${userId}: ${badgeName}`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });
  }

  /**
   * 发送每日结算通知
   */
  static async notifyDailySettlement(
    userId: number,
    dailyRecord: DailyMeritRecord,
    userName?: string,
    newBadges?: Badge[]
  ): Promise<void> {
    const totalMerit = dailyRecord.netMerit || 0;
    const title = `✨ 今日功德结算`;
    let content = `今日获得 ${totalMerit} 点功德`;

    if (newBadges && newBadges.length > 0) {
      const badgeCount = newBadges.length;
      content += `，并解锁了 ${badgeCount} 个新奖章`;
    }

    content += "。坚持修行，功德圆满在即！";

    console.log(`[Notification] Daily settlement for user ${userId}: ${totalMerit} merit points`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} - ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });
  }

  /**
   * 发送成就达成通知
   */
  static async notifyAchievementUnlocked(
    userId: number,
    achievementName: string,
    achievementDescription: string,
    userName?: string
  ): Promise<void> {
    const title = `🎯 成就达成！`;
    const content = `您已达成成就：${achievementName} - ${achievementDescription}`;

    console.log(`[Notification] Achievement unlocked for user ${userId}: ${achievementName}`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} - ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });
  }

  /**
   * 发送心率预警通知
   */
  static async notifyHeartRateAlert(
    userId: number,
    heartRate: number,
    threshold: number,
    gender: string,
    userName?: string
  ): Promise<void> {
    const title = `⚠️ 心率预警`;
    const content = `您的心率 ${heartRate} bpm 超过了安全阈值 ${threshold} bpm，请放松身心，调整呼吸。`;

    console.log(`[Notification] Heart rate alert for user ${userId}: ${heartRate} bpm`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} - ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });
  }

  /**
   * 发送懈怠惩罚通知
   */
  static async notifySlothPenalty(
    userId: number,
    deductedMerit: number,
    inactiveActivities: string[],
    userName?: string
  ): Promise<void> {
    const title = `⚡ 懈怠惩罚`;
    const activities = inactiveActivities.join("、");
    const content = `您在 ${activities} 等 ${inactiveActivities.length} 项活动上未达标，扣除 ${deductedMerit} 点功德。`;

    console.log(`[Notification] Sloth penalty for user ${userId}: -${deductedMerit} merit`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} - ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });
  }

  /**
   * 发送阶段达成通知
   */
  static async notifyStageAchieved(
    userId: number,
    activityName: string,
    stage: number,
    totalMerit: number,
    userName?: string
  ): Promise<void> {
    const title = `🌟 阶段达成！`;
    const content = `${activityName} 已达到第 ${stage} 阶段，累计获得 ${totalMerit} 点功德！`;

    console.log(`[Notification] Stage achieved for user ${userId}: ${activityName} stage ${stage}`);

    // 通知应用所有者
    await notifyOwner({
      title,
      content: `用户 ${userName || userId} - ${content}`,
    }).catch(err => {
      console.error("[Notification] Failed to notify owner:", err);
    });

    // 发送推送通知到用户设备
    await this.sendPushNotificationToUser(userId, {
      title,
      body: content,
      type: "stage_achieved",
      data: {
        activityName,
        stage,
        totalMerit,
        userName,
      },
    });
  }

  // MARK: - 推送通知方法

  /**
   * 向用户设备发送推送通知
   */
  static async sendPushNotificationToUser(
    userId: number,
    notification: {
      title: string;
      body: string;
      type: "badge_unlocked" | "daily_settlement" | "heart_rate_alert" | "sloth_penalty" | "achievement_unlocked" | "stage_achieved";
      badge?: number;
      sound?: string;
      data?: Record<string, unknown>;
    }
  ): Promise<void> {
    try {
      // 获取用户设备令牌
      const deviceTokens = await getUserDeviceTokens(userId);
      
      if (deviceTokens.length === 0) {
        console.log(`[Push Notification] 用户 ${userId} 没有注册设备令牌`);
        return;
      }

      console.log(`[Push Notification] 向用户 ${userId} 的 ${deviceTokens.length} 个设备发送通知`);

      // 向每个设备令牌发送通知
      const promises = deviceTokens.map(async (deviceToken) => {
        if (deviceToken.platform === "ios") {
          const result = await APNsService.sendNotification({
            deviceToken: deviceToken.deviceToken,
            title: notification.title,
            body: notification.body,
            badge: notification.badge || 1,
            sound: notification.sound || "default",
            type: notification.type,
            data: notification.data,
          });

          if (!result.success) {
            console.error(`[Push Notification] 向设备 ${deviceToken.deviceToken.substring(0, 10)}... 发送失败: ${result.message}`);
            
            // 如果APNs返回无效令牌错误，停用该令牌
            if (result.message?.includes("BadDeviceToken") || result.message?.includes("Unregistered")) {
              console.log(`[Push Notification] 设备令牌无效，将停用: ${deviceToken.id}`);
              // 这里可以调用 deactivateDeviceToken(deviceToken.id)
            }
          }

          return result;
        }
        // 可以添加Android推送支持
        return { success: false, message: "不支持的平台" };
      });

      await Promise.allSettled(promises);
    } catch (error) {
      console.error("[Push Notification] 发送推送通知时出错:", error);
    }
  }

  /**
   * 注册设备令牌
   */
  static async registerDeviceToken(
    userId: number,
    deviceToken: string,
    platform: "ios" | "android" = "ios"
  ): Promise<boolean> {
    try {
      const result = await upsertDeviceToken(userId, deviceToken, platform);
      return result !== null;
    } catch (error) {
      console.error("[Push Notification] 注册设备令牌失败:", error);
      return false;
    }
  }

  /**
   * 增强的通知方法 - 同时发送给所有者和用户设备
   */
  
  static async notifyBadgeUnlockedWithPush(
    userId: number,
    badge: Badge,
    userName?: string
  ): Promise<void> {
    // 原有逻辑
    await this.notifyBadgeUnlocked(userId, badge, userName);
    
    // 推送通知
    const badgeNames: Record<string, string> = {
      "steps_first": "步数初缘",
      "steps_gold": "步数金级",
      "sleep_silver": "睡眠银级",
      "weekly_merit": "周功德",
      "monthly_merit": "月功德",
      "yearly_merit": "年功德",
      "running_diamond": "跑步钻石",
      "swimming_pearl": "游泳珍珠",
      "mindfulness_enlightenment": "正念开悟",
      "cycling_emerald": "自行车翡翠",
    };

    const badgeName = badgeNames[badge.badgeType] || badge.badgeType;
    const title = `🏆 恭喜获得新奖章！`;
    const body = `您已解锁 ${badgeName} 奖章，继续修行，功德圆满不远矣！`;

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "badge_unlocked",
      data: {
        badgeName,
        badgeType: badge.badgeType,
        userName,
      },
    });
  }

  static async notifyDailySettlementWithPush(
    userId: number,
    dailyRecord: DailyMeritRecord,
    userName?: string,
    newBadges?: Badge[]
  ): Promise<void> {
    // 原有逻辑
    await this.notifyDailySettlement(userId, dailyRecord, userName, newBadges);
    
    // 推送通知
    const totalMerit = dailyRecord.netMerit || 0;
    const title = `✨ 今日功德结算`;
    let body = `今日获得 ${totalMerit} 点功德`;

    if (newBadges && newBadges.length > 0) {
      const badgeCount = newBadges.length;
      body += `，并解锁了 ${badgeCount} 个新奖章`;
    }

    body += "。坚持修行，功德圆满在即！";

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "daily_settlement",
      data: {
        totalMerit,
        badgeCount: newBadges?.length || 0,
        userName,
      },
    });
  }

  static async notifyHeartRateAlertWithPush(
    userId: number,
    heartRate: number,
    threshold: number,
    gender: string,
    userName?: string
  ): Promise<void> {
    // 原有逻辑
    await this.notifyHeartRateAlert(userId, heartRate, threshold, gender, userName);
    
    // 推送通知
    const title = `⚠️ 心率预警`;
    const body = `您的心率 ${heartRate} bpm 超过了安全阈值 ${threshold} bpm，请放松身心，调整呼吸。`;

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "heart_rate_alert",
      data: {
        heartRate,
        threshold,
        gender,
        userName,
      },
    });
  }

  static async notifySlothPenaltyWithPush(
    userId: number,
    deductedMerit: number,
    inactiveActivities: string[],
    userName?: string
  ): Promise<void> {
    // 原有逻辑
    await this.notifySlothPenalty(userId, deductedMerit, inactiveActivities, userName);
    
    // 推送通知
    const title = `⚡ 懈怠惩罚`;
    const activities = inactiveActivities.join("、");
    const body = `您在 ${activities} 等 ${inactiveActivities.length} 项活动上未达标，扣除 ${deductedMerit} 点功德。`;

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "sloth_penalty",
      data: {
        deductedMerit,
        inactiveActivities,
        inactiveCount: inactiveActivities.length,
        userName,
      },
    });
  }

  static async notifyAchievementUnlockedWithPush(
    userId: number,
    achievementName: string,
    achievementDescription: string,
    userName?: string
  ): Promise<void> {
    // 原有逻辑
    await this.notifyAchievementUnlocked(userId, achievementName, achievementDescription, userName);
    
    // 推送通知
    const title = `🎯 成就达成！`;
    const body = `您已达成成就：${achievementName} - ${achievementDescription}`;

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "achievement_unlocked",
      data: {
        achievementName,
        achievementDescription,
        userName,
      },
    });
  }

  static async notifyStageAchievedWithPush(
    userId: number,
    activityName: string,
    stage: number,
    totalMerit: number,
    userName?: string
  ): Promise<void> {
    // 原有逻辑
    await this.notifyStageAchieved(userId, activityName, stage, totalMerit, userName);
    
    // 推送通知
    const title = `🌟 阶段达成！`;
    const body = `${activityName} 已达到第 ${stage} 阶段，累计获得 ${totalMerit} 点功德！`;

    await this.sendPushNotificationToUser(userId, {
      title,
      body,
      type: "stage_achieved",
      data: {
        activityName,
        stage,
        totalMerit,
        userName,
      },
    });
  }
}

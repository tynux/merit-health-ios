import { notifyOwner } from "./_core/notification";
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
  }
}

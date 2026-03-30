import { TRPCError } from "@trpc/server";
import { ENV } from "./_core/env";

/**
 * APNs推送通知服务
 * 用于向iOS设备发送远程推送通知
 */

export interface APNsNotificationPayload {
  deviceToken: string;
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  data?: Record<string, unknown>;
  type: "badge_unlocked" | "daily_settlement" | "heart_rate_alert" | "sloth_penalty" | "achievement_unlocked" | "stage_achieved";
}

export interface APNsResponse {
  success: boolean;
  message?: string;
  apnsId?: string;
}

/**
 * APNs推送服务类
 */
export class APNsService {
  private static readonly APNS_HOST = ENV.isProduction 
    ? "https://api.push.apple.com" 
    : "https://api.sandbox.push.apple.com";
  
  private static readonly APNS_TOPIC = "com.meritgame.ios"; // 替换为您的Bundle ID
  
  /**
   * 发送APNs推送通知
   */
  static async sendNotification(payload: APNsNotificationPayload): Promise<APNsResponse> {
    try {
      // 检查必要的环境变量
      if (!ENV.apnsKeyId || !ENV.apnsTeamId || !ENV.apnsPrivateKey) {
        throw new Error("APNs配置不完整，请设置APNS_KEY_ID、APNS_TEAM_ID和APNS_PRIVATE_KEY环境变量");
      }

      const url = `${this.APNS_HOST}/3/device/${payload.deviceToken}`;
      
      // 创建JWT令牌
      const jwtToken = this.generateAPNsJWT();
      
      // 构建通知负载
      const apnsPayload = this.buildAPNsPayload(payload);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "authorization": `bearer ${jwtToken}`,
          "apns-topic": this.APNS_TOPIC,
          "apns-push-type": "alert",
          "apns-priority": "10", // 立即发送
          "content-type": "application/json",
        },
        body: JSON.stringify(apnsPayload),
      });

      const apnsId = response.headers.get("apns-id");
      
      if (response.status === 200) {
        console.log(`[APNs] 推送通知发送成功: ${apnsId}`);
        return {
          success: true,
          message: "推送通知发送成功",
          apnsId: apnsId || undefined,
        };
      } else {
        const errorBody = await response.text();
        console.error(`[APNs] 推送通知发送失败: ${response.status} ${errorBody}`);
        
        return {
          success: false,
          message: `APNs错误: ${response.status} ${errorBody}`,
        };
      }
    } catch (error) {
      console.error("[APNs] 发送推送通知时出错:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "未知错误",
      };
    }
  }
  
  /**
   * 生成APNs JWT令牌
   */
  private static generateAPNsJWT(): string {
    // 注意：这是一个简化版本
    // 实际实现需要使用jsonwebtoken库和APNs私钥
    // 这里返回一个模拟令牌，实际使用时需要替换为真实实现
    console.log("[APNs] 生成JWT令牌（模拟）");
    return "mock.jwt.token.for.apns";
  }
  
  /**
   * 构建APNs负载
   */
  private static buildAPNsPayload(payload: APNsNotificationPayload): any {
    const apsPayload: any = {
      aps: {
        alert: {
          title: payload.title,
          body: payload.body,
        },
        sound: payload.sound || "default",
        badge: payload.badge || 1,
      },
      type: payload.type,
    };
    
    // 添加自定义数据
    if (payload.data) {
      Object.keys(payload.data).forEach(key => {
        if (key !== "aps") {
          apsPayload[key] = payload.data![key];
        }
      });
    }
    
    return apsPayload;
  }
  
  /**
   * 发送奖章解锁通知
   */
  static async sendBadgeUnlockedNotification(
    deviceToken: string,
    badgeName: string,
    userName?: string
  ): Promise<APNsResponse> {
    const title = "🏆 恭喜获得新奖章！";
    const body = userName 
      ? `${userName}，您已解锁 ${badgeName} 奖章，继续修行，功德圆满不远矣！`
      : `您已解锁 ${badgeName} 奖章，继续修行，功德圆满不远矣！`;
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "badge_unlocked",
      data: {
        badgeName,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  /**
   * 发送每日结算通知
   */
  static async sendDailySettlementNotification(
    deviceToken: string,
    totalMerit: number,
    badgeCount?: number,
    userName?: string
  ): Promise<APNsResponse> {
    const title = "✨ 今日功德结算";
    let body = `今日获得 ${totalMerit} 点功德`;
    
    if (badgeCount && badgeCount > 0) {
      body += `，并解锁了 ${badgeCount} 个新奖章`;
    }
    
    body += "。坚持修行，功德圆满在即！";
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "daily_settlement",
      data: {
        totalMerit,
        badgeCount,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  /**
   * 发送心率预警通知
   */
  static async sendHeartRateAlertNotification(
    deviceToken: string,
    heartRate: number,
    threshold: number,
    gender: string,
    userName?: string
  ): Promise<APNsResponse> {
    const title = "⚠️ 心率预警";
    const body = `您的心率 ${heartRate} bpm 超过了安全阈值 ${threshold} bpm，请放松身心，调整呼吸。`;
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "heart_rate_alert",
      data: {
        heartRate,
        threshold,
        gender,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  /**
   * 发送懈怠惩罚通知
   */
  static async sendSlothPenaltyNotification(
    deviceToken: string,
    deductedMerit: number,
    inactiveActivities: string[],
    userName?: string
  ): Promise<APNsResponse> {
    const title = "⚡ 懈怠惩罚";
    const activities = inactiveActivities.join("、");
    const body = `您在 ${activities} 等 ${inactiveActivities.length} 项活动上未达标，扣除 ${deductedMerit} 点功德。`;
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "sloth_penalty",
      data: {
        deductedMerit,
        inactiveActivities,
        inactiveCount: inactiveActivities.length,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  /**
   * 发送成就达成通知
   */
  static async sendAchievementUnlockedNotification(
    deviceToken: string,
    achievementName: string,
    achievementDescription: string,
    userName?: string
  ): Promise<APNsResponse> {
    const title = "🎯 成就达成！";
    const body = `您已达成成就：${achievementName} - ${achievementDescription}`;
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "achievement_unlocked",
      data: {
        achievementName,
        achievementDescription,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  /**
   * 发送阶段达成通知
   */
  static async sendStageAchievedNotification(
    deviceToken: string,
    activityName: string,
    stage: number,
    totalMerit: number,
    userName?: string
  ): Promise<APNsResponse> {
    const title = "🌟 阶段达成！";
    const body = `${activityName} 已达到第 ${stage} 阶段，累计获得 ${totalMerit} 点功德！`;
    
    return this.sendNotification({
      deviceToken,
      title,
      body,
      badge: 1,
      type: "stage_achieved",
      data: {
        activityName,
        stage,
        totalMerit,
        userName,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
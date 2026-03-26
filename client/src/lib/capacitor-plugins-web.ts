import { WebPlugin } from '@capacitor/core';
import type { HealthKitPlugin, NotificationPlugin } from './capacitor-plugins';

/**
 * HealthKit 插件的 Web 实现（用于开发和测试）
 */
export class HealthKitPluginWeb extends WebPlugin implements HealthKitPlugin {
  async requestAuthorization(): Promise<{ authorized: boolean }> {
    console.log('[HealthKit] Authorization requested (Web)');
    return { authorized: true };
  }

  async getTodaySteps(): Promise<{ steps: number }> {
    return { steps: Math.floor(Math.random() * 15000) };
  }

  async getTodaySleep(): Promise<{ sleepHours: number }> {
    return { sleepHours: 6 + Math.random() * 3 };
  }

  async getTodayEnergyBurned(): Promise<{ energyBurned: number }> {
    return { energyBurned: 300 + Math.random() * 400 };
  }

  async getTodayHeartRate(): Promise<{ avgHeartRate: number; maxHeartRate: number }> {
    const avgHeartRate = 60 + Math.random() * 40;
    const maxHeartRate = avgHeartRate + Math.random() * 30;
    return { avgHeartRate: Math.floor(avgHeartRate), maxHeartRate: Math.floor(maxHeartRate) };
  }

  async getDistanceData(options: { activityType: string }): Promise<{ distance: number; unit: string }> {
    return { distance: Math.random() * 10, unit: 'km' };
  }

  async getStandingTime(): Promise<{ standingHours: number }> {
    return { standingHours: Math.floor(Math.random() * 8) };
  }

  async getAllTodayHealthData(): Promise<{
    date: string;
    steps?: number;
    sleepHours?: number;
    energyBurned?: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    walkingDistance?: number;
    cyclingDistance?: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      steps: Math.floor(Math.random() * 15000),
      sleepHours: 6 + Math.random() * 3,
      energyBurned: 300 + Math.random() * 400,
      avgHeartRate: Math.floor(60 + Math.random() * 40),
      maxHeartRate: Math.floor(90 + Math.random() * 50),
      walkingDistance: Math.random() * 5,
      cyclingDistance: Math.random() * 10,
    };
  }
}

/**
 * 通知插件的 Web 实现（用于开发和测试）
 */
export class NotificationPluginWeb extends WebPlugin implements NotificationPlugin {
  private pendingNotifications: Map<string, any> = new Map();

  async requestPermission(): Promise<{ granted: boolean }> {
    console.log('[Notification] Permission requested (Web)');
    return { granted: true };
  }

  async sendLocalNotification(options: {
    title: string;
    body: string;
    delay?: number;
    data?: Record<string, any>;
  }): Promise<{ scheduled: boolean }> {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = {
      id,
      title: options.title,
      body: options.body,
      data: options.data,
    };

    this.pendingNotifications.set(id, notification);

    const delay = (options.delay || 5) * 1000;
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          tag: id,
        });
      } else {
        console.log(`[Notification] ${options.title}: ${options.body}`);
      }
      this.pendingNotifications.delete(id);
    }, delay);

    return { scheduled: true };
  }

  async getPendingNotifications(): Promise<{
    notifications: Array<{
      id: string;
      title: string;
      body: string;
      trigger?: number;
    }>;
  }> {
    const notifications = Array.from(this.pendingNotifications.values()).map(n => ({
      id: n.id,
      title: n.title,
      body: n.body,
    }));
    return { notifications };
  }

  async clearAllNotifications(): Promise<{ cleared: boolean }> {
    this.pendingNotifications.clear();
    return { cleared: true };
  }

  async clearNotification(options: { id: string }): Promise<{ cleared: boolean }> {
    this.pendingNotifications.delete(options.id);
    return { cleared: true };
  }

  async getBadgeNumber(): Promise<{ badge: number }> {
    return { badge: 0 };
  }

  async setBadgeNumber(options: { badge: number }): Promise<{ badge: number }> {
    if (options.badge > 0) {
      document.title = `(${options.badge}) 功德圆满`;
    } else {
      document.title = '功德圆满';
    }
    return { badge: options.badge };
  }
}

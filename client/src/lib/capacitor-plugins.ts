import { registerPlugin } from '@capacitor/core';
import type { Plugin } from '@capacitor/core';

/**
 * HealthKit 插件接口
 */
export interface HealthKitPlugin extends Plugin {
  requestAuthorization(): Promise<{ authorized: boolean }>;
  getTodaySteps(): Promise<{ steps: number }>;
  getTodaySleep(): Promise<{ sleepHours: number }>;
  getTodayEnergyBurned(): Promise<{ energyBurned: number }>;
  getTodayHeartRate(): Promise<{ avgHeartRate: number; maxHeartRate: number }>;
  getDistanceData(options: { activityType: string }): Promise<{ distance: number; unit: string }>;
  getStandingTime(): Promise<{ standingHours: number }>;
  getAllTodayHealthData(): Promise<{
    date: string;
    steps?: number;
    sleepHours?: number;
    energyBurned?: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    walkingDistance?: number;
    cyclingDistance?: number;
  }>;
}

/**
 * 通知插件接口
 */
export interface NotificationPlugin extends Plugin {
  requestPermission(): Promise<{ granted: boolean }>;
  sendLocalNotification(options: {
    title: string;
    body: string;
    delay?: number;
    data?: Record<string, any>;
  }): Promise<{ scheduled: boolean }>;
  getPendingNotifications(): Promise<{
    notifications: Array<{
      id: string;
      title: string;
      body: string;
      trigger?: number;
    }>;
  }>;
  clearAllNotifications(): Promise<{ cleared: boolean }>;
  clearNotification(options: { id: string }): Promise<{ cleared: boolean }>;
  getBadgeNumber(): Promise<{ badge: number }>;
  setBadgeNumber(options: { badge: number }): Promise<{ badge: number }>;
}

/**
 * 注册 HealthKit 插件
 */
export const HealthKit = registerPlugin<HealthKitPlugin>('HealthKitPlugin', {
  web: () => import('./capacitor-plugins-web').then(m => new m.HealthKitPluginWeb()),
});

/**
 * 注册通知插件
 */
export const Notification = registerPlugin<NotificationPlugin>('NotificationPlugin', {
  web: () => import('./capacitor-plugins-web').then(m => new m.NotificationPluginWeb()),
});

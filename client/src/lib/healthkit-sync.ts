import { Capacitor } from "@capacitor/core";

/**
 * HealthKit 数据同步客户端
 */

export interface HealthKitSyncData {
  date: string;
  steps?: number;
  energyBurned?: number;
  sleepHours?: number;
  walkingDistance?: number;
  swimmingDistance?: number;
  cyclingDistance?: number;
  runningDistance?: number;
  standingHours?: number;
  mindfulnessMinutes?: number;
  sunExposureMinutes?: number;
  handwashCount?: number;
  stairsClimbed?: number;
  maxHeartRate?: number;
  avgHeartRate?: number;
}

/**
 * 从 iOS HealthKit 获取今日数据
 */
export async function fetchHealthKitData(): Promise<HealthKitSyncData | null> {
  if (Capacitor.getPlatform() !== "ios") {
    console.warn("[HealthKit Sync] HealthKit is only available on iOS");
    return null;
  }

  try {
    const { HealthKit } = await import("../lib/capacitor-plugins");

    const authResult = await HealthKit.requestAuthorization();
    if (!authResult.authorized) {
      console.warn("[HealthKit Sync] HealthKit authorization denied");
      return null;
    }

    const data = await HealthKit.getAllTodayHealthData();

    console.log("[HealthKit Sync] Fetched HealthKit data:", data);
    return data;
  } catch (error) {
    console.error("[HealthKit Sync] Error fetching HealthKit data:", error);
    return null;
  }
}

/**
 * 同步 HealthKit 数据到服务器
 */
export async function syncHealthKitDataToServer(
  data: HealthKitSyncData
): Promise<{ success: boolean; message?: string; errors?: string[]; warnings?: string[] }> {
  try {
    // 直接调用 API
    const response = await fetch("/api/trpc/health.syncHealthKitData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: data }),
    });
    const result = await response.json();
    return result.result?.data || { success: false, errors: ["API error"] };
  } catch (error) {
    console.error("[HealthKit Sync] Error syncing to server:", error);
    return {
      success: false,
      errors: ["Failed to sync data to server"],
    };
  }
}

/**
 * 完整的 HealthKit 数据同步流程
 */
export async function performFullHealthKitSync(): Promise<{
  success: boolean;
  message?: string;
  warnings?: string[];
  errors?: string[];
}> {
  try {
    const healthData = await fetchHealthKitData();
    if (!healthData) {
      return {
        success: false,
        errors: ["Failed to fetch HealthKit data"],
      };
    }

    const syncResult = await syncHealthKitDataToServer(healthData);

    if (!syncResult.success) {
      return {
        success: false,
        errors: syncResult.errors,
      };
    }

    return {
      success: true,
      message: "HealthKit data synced successfully",
      warnings: syncResult.warnings,
    };
  } catch (error) {
    console.error("[HealthKit Sync] Error during full sync:", error);
    return {
      success: false,
      errors: ["Unexpected error during sync"],
    };
  }
}

/**
 * 设置定时同步（每小时）
 */
export function setupPeriodicHealthKitSync(intervalMinutes: number = 60) {
  performFullHealthKitSync();

  const intervalId = setInterval(() => {
    performFullHealthKitSync();
  }, intervalMinutes * 60 * 1000);

  return () => clearInterval(intervalId);
}

/**
 * 手动触发同步
 */
export async function manualSyncHealthKit(): Promise<{
  success: boolean;
  message?: string;
  errors?: string[];
}> {
  console.log("[HealthKit Sync] Starting manual sync...");
  const result = await performFullHealthKitSync();

  if (result.success) {
    console.log("[HealthKit Sync] Manual sync completed successfully");
  } else {
    console.error("[HealthKit Sync] Manual sync failed:", result.errors);
  }

  return {
    success: result.success,
    message: result.message,
    errors: result.errors,
  };
}

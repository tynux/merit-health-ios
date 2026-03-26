import { getDb } from "./db";
import { dailyHealthData, dailyMeritRecord } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { settleDailyMerit } from "./merit-engine";

/**
 * HealthKit 数据同步服务
 * 处理来自 iOS 应用的 HealthKit 数据并保存到数据库
 */

export interface HealthKitData {
  userId: number;
  date: string; // YYYY-MM-DD format
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
 * 同步 HealthKit 数据到数据库
 */
export async function syncHealthKitData(data: HealthKitData): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[HealthKit Sync] Database not available");
    throw new Error("Database not available");
  }

  try {
    // 准备数据
    const healthDataRecord = {
      userId: data.userId,
      date: data.date,
      steps: data.steps || 0,
      energyBurned: String(data.energyBurned || 0),
      sleepHours: String(data.sleepHours || 0),
      walkingDistance: String(data.walkingDistance || 0),
      swimmingDistance: String(data.swimmingDistance || 0),
      cyclingDistance: String(data.cyclingDistance || 0),
      runningDistance: String(data.runningDistance || 0),
      standingHours: data.standingHours || 0,
      mindfulnessMinutes: data.mindfulnessMinutes || 0,
      sunExposureMinutes: data.sunExposureMinutes || 0,
      handwashCount: data.handwashCount || 0,
      stairsClimbed: data.stairsClimbed || 0,
      maxHeartRate: data.maxHeartRate || 0,
      avgHeartRate: data.avgHeartRate || 0,
    };

    // 检查是否存在该日期的数据
    const existing = await db
      .select()
      .from(dailyHealthData)
      .where(
        and(
          eq(dailyHealthData.userId, data.userId),
          eq(dailyHealthData.date, data.date)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // 更新现有数据
      await db
        .update(dailyHealthData)
        .set({
          ...healthDataRecord,
        })
        .where(
          and(
            eq(dailyHealthData.userId, data.userId),
            eq(dailyHealthData.date, data.date)
          )
        );

      console.log(
        `[HealthKit Sync] Updated health data for user ${data.userId} on ${data.date}`
      );
    } else {
      // 插入新数据
      await db.insert(dailyHealthData).values({
        ...healthDataRecord,
      });

      console.log(
        `[HealthKit Sync] Inserted health data for user ${data.userId} on ${data.date}`
      );
    }

    // 自动结算该日的功德
    await settleDailyMerit(data.userId, data.date);

    console.log(
      `[HealthKit Sync] Successfully synced HealthKit data for user ${data.userId} on ${data.date}`
    );
  } catch (error) {
    console.error("[HealthKit Sync] Error syncing data:", error);
    throw error;
  }
}

/**
 * 批量同步 HealthKit 数据
 */
export async function syncBatchHealthKitData(
  dataList: HealthKitData[]
): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;

  for (const data of dataList) {
    try {
      await syncHealthKitData(data);
      successCount++;
    } catch (error) {
      console.error(`[HealthKit Sync] Failed to sync data for ${data.date}:`, error);
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

/**
 * 获取用户的历史健康数据
 */
export async function getUserHealthHistory(
  userId: number,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.error("[HealthKit Sync] Database not available");
    return [];
  }

  try {
    const records = await db
      .select()
      .from(dailyHealthData)
      .where(
        and(
          eq(dailyHealthData.userId, userId),
          // 简单的日期范围比较（需要根据数据库类型调整）
        )
      );

    return records.filter(
      (r) => r.date >= startDate && r.date <= endDate
    );
  } catch (error) {
    console.error("[HealthKit Sync] Error fetching history:", error);
    return [];
  }
}

/**
 * 验证 HealthKit 数据的有效性
 */
export function validateHealthKitData(data: HealthKitData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 验证日期格式
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push("Invalid date format. Expected YYYY-MM-DD");
  }

  // 验证步数
  if (data.steps !== undefined && data.steps < 0) {
    errors.push("Steps cannot be negative");
  }
  if (data.steps !== undefined && data.steps > 100000) {
    errors.push("Steps value seems unrealistic (> 100000)");
  }

  // 验证睡眠时间
  if (data.sleepHours !== undefined && (data.sleepHours < 0 || data.sleepHours > 24)) {
    errors.push("Sleep hours must be between 0 and 24");
  }

  // 验证心率
  if (data.maxHeartRate !== undefined && (data.maxHeartRate < 30 || data.maxHeartRate > 220)) {
    errors.push("Max heart rate seems unrealistic");
  }
  if (data.avgHeartRate !== undefined && (data.avgHeartRate < 30 || data.avgHeartRate > 200)) {
    errors.push("Average heart rate seems unrealistic");
  }

  // 验证距离
  if (data.walkingDistance !== undefined && data.walkingDistance < 0) {
    errors.push("Walking distance cannot be negative");
  }
  if (data.cyclingDistance !== undefined && data.cyclingDistance < 0) {
    errors.push("Cycling distance cannot be negative");
  }
  if (data.swimmingDistance !== undefined && data.swimmingDistance < 0) {
    errors.push("Swimming distance cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 检测异常数据
 */
export function detectAnomalies(data: HealthKitData): string[] {
  const warnings: string[] = [];

  // 检测极端步数
  if (data.steps && data.steps > 50000) {
    warnings.push("Unusually high step count detected");
  }

  // 检测极端心率
  if (data.maxHeartRate && data.maxHeartRate > 180) {
    warnings.push("Heart rate exceeds safe threshold");
  }

  // 检测睡眠不足
  if (data.sleepHours && data.sleepHours < 4) {
    warnings.push("Sleep duration is critically low");
  }

  // 检测睡眠过多
  if (data.sleepHours && data.sleepHours > 10) {
    warnings.push("Sleep duration is unusually high");
  }

  // 检测高心率（按性别）
  if (data.maxHeartRate && data.maxHeartRate > 160) {
    warnings.push("Heart rate is elevated");
  }

  return warnings;
}

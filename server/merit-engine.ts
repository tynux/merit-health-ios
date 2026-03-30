import {
  ACTIVITY_CONFIGS,
  HEART_RATE_THRESHOLDS,
  HEART_RATE_DEDUCTION,
  LAZINESS_THRESHOLD,
  LAZINESS_MINIMUM_PERCENT,
  LAZINESS_DEDUCTION,
  PERIOD_BADGE_THRESHOLDS,
  calculateActivityMerit,
  getNextMilestone,
  getCurrentStage,
  type ActivityType,
} from "@shared/merit-config";
import {
  getDailyHealthData,
  getDailyMeritRecord,
  createDailyMeritRecord,
  updateDailyMeritRecord,
  createActivityMeritRecord,
  getActivityProgress,
  upsertActivityProgress,
  createHeartRateAlert,
  createBadge,
  getBadge,
  updateUserTotalMerit,
  getUserById,
  upsertDailyHealthData,
} from "./db";
import { NotificationService } from "./notification-service";

/**
 * Daily merit settlement engine
 * Calculates all merit earned and deductions for a given day
 */
export async function settleDailyMerit(userId: number, date: string) {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const healthData = await getDailyHealthData(userId, date);
  if (!healthData) {
    // Create empty health data for the day
    await upsertDailyHealthData(userId, date, {});
    return null;
  }

  // Calculate merit from each activity
  const activityResults: {
    type: ActivityType;
    merit: number;
    firstAchievement: boolean;
    firstAchievementBonus: number;
  }[] = [];

  let totalBaseMerit = 0;
  let totalBonusMerit = 0;
  let activitiesUnderTarget = 0;

  const activities: ActivityType[] = [
    "steps",
    "energyBurned",
    "sleep",
    "walking",
    "swimming",
    "cycling",
    "running",
    "standing",
    "mindfulness",
    "sunExposure",
    "handwash",
    "stairs",
  ];

  for (const activityType of activities) {
    const dataValue = getActivityDataValue(healthData, activityType);
    const config = ACTIVITY_CONFIGS[activityType];

    // Check if activity meets minimum threshold
    const minThreshold = config.dailyTarget * LAZINESS_MINIMUM_PERCENT;
    if (dataValue < minThreshold) {
      activitiesUnderTarget++;
    }

    const { baseMerit, bonusMerit } = calculateActivityMerit(activityType, dataValue);
    totalBaseMerit += baseMerit;
    totalBonusMerit += bonusMerit;

    // Check for first achievement
    const progress = await getActivityProgress(userId, activityType);
    const totalData = progress?.totalData ? parseFloat(progress.totalData.toString()) : 0;
    const isFirstAchievement = !progress || totalData === 0;

    let firstAchievementBonus = 0;
    if (isFirstAchievement && dataValue > 0) {
      firstAchievementBonus = config.firstAchievementBonus;
      totalBonusMerit += firstAchievementBonus;

      // Create first achievement badge
      await createBadgeIfNotExists(
        userId,
        `${activityType}_first`,
        `首次${config.name}`,
        `首次完成${config.name}活动`
      );
    }

    // Record activity merit
    await createActivityMeritRecord({
      userId,
      date,
      activityType,
      dataValue,
      unit: config.unit,
      baseMerit,
      bonusMerit,
      totalMerit: baseMerit + bonusMerit,
      isFirstAchievement,
      firstAchievementBonus,
    });

    // Update activity progress
    const previousTotal = progress?.totalData ? parseFloat(progress.totalData.toString()) : 0;
    const newTotal = previousTotal + dataValue;
    const currentStage = getCurrentStage(activityType, newTotal);
    const previousStage = progress ? getCurrentStage(activityType, previousTotal) : 0;

    await upsertActivityProgress(userId, activityType, {
      totalData: newTotal.toString(),
      currentStage,
    });

    // Check for milestone achievements
    if (currentStage > previousStage) {
      for (let stage = previousStage + 1; stage <= currentStage; stage++) {
        const badgeType = `${activityType}_${stage}`;
        const badgeName = `${config.name}精进奖章 (${stage}/10)`;
        const badgeDesc = `${config.name}累积达到第 ${stage} 阶段`;

        await createBadgeIfNotExists(userId, badgeType, badgeName, badgeDesc);
      }
    }

    activityResults.push({
      type: activityType,
      merit: baseMerit + bonusMerit,
      firstAchievement: isFirstAchievement,
      firstAchievementBonus,
    });
  }

  // Calculate deductions
  let totalDeducted = 0;
  const deductionReasons: string[] = [];

  // Heart rate deduction
  const maxHeartRate = healthData.maxHeartRate || 0;
  if (maxHeartRate > 0) {
    const threshold = user.gender === "female" ? HEART_RATE_THRESHOLDS.female : HEART_RATE_THRESHOLDS.male;
    if (maxHeartRate > threshold) {
      totalDeducted += HEART_RATE_DEDUCTION;
      deductionReasons.push(`心率过高 (${maxHeartRate} bpm)`);

      // Record heart rate alert
      await createHeartRateAlert({
        userId,
        date,
        heartRate: maxHeartRate,
        threshold,
        meritDeducted: HEART_RATE_DEDUCTION,
      });
    }
  }

  // Laziness deduction
  if (activitiesUnderTarget >= LAZINESS_THRESHOLD) {
    totalDeducted += LAZINESS_DEDUCTION;
    deductionReasons.push(`懈怠惩罚 (${activitiesUnderTarget} 项活动未达标)`);
  }

  // Create or update daily merit record
  const totalEarned = totalBaseMerit + totalBonusMerit;
  const netMerit = totalEarned - totalDeducted;

  const existingRecord = await getDailyMeritRecord(userId, date);
  if (existingRecord) {
    await updateDailyMeritRecord(userId, date, {
      baseMerit: totalBaseMerit,
      bonusMerit: totalBonusMerit,
      totalEarned,
      heartRateDeduction: maxHeartRate > (user.gender === "female" ? HEART_RATE_THRESHOLDS.female : HEART_RATE_THRESHOLDS.male) ? HEART_RATE_DEDUCTION : 0,
      lazinessDeduction: activitiesUnderTarget >= LAZINESS_THRESHOLD ? LAZINESS_DEDUCTION : 0,
      totalDeducted,
      netMerit,
      deductionReasons,
    });
  } else {
    await createDailyMeritRecord(userId, date, {
      baseMerit: totalBaseMerit,
      bonusMerit: totalBonusMerit,
      totalEarned,
      heartRateDeduction: maxHeartRate > (user.gender === "female" ? HEART_RATE_THRESHOLDS.female : HEART_RATE_THRESHOLDS.male) ? HEART_RATE_DEDUCTION : 0,
      lazinessDeduction: activitiesUnderTarget >= LAZINESS_THRESHOLD ? LAZINESS_DEDUCTION : 0,
      totalDeducted,
      netMerit,
      deductionReasons,
    });
  }

  // Update user total merit
  const newTotalMerit = (user.totalMerit || 0) + netMerit;
  await updateUserTotalMerit(userId, newTotalMerit);

  // Check for period badges
  await checkPeriodBadges(userId, newTotalMerit);

  // Send notifications
  try {
    // Notify daily settlement (with push notification)
    await NotificationService.notifyDailySettlementWithPush(
      userId,
      { date, netMerit, baseMerit: totalBaseMerit, bonusMerit: totalBonusMerit, totalEarned, heartRateDeduction: 0, lazinessDeduction: 0, totalDeducted, deductionReasons, createdAt: new Date(), updatedAt: new Date(), userId } as any,
      user.name || undefined
    );

    // Notify heart rate alert if applicable
    if (maxHeartRate > 0) {
      const threshold = user.gender === "female" ? HEART_RATE_THRESHOLDS.female : HEART_RATE_THRESHOLDS.male;
      if (maxHeartRate > threshold) {
        await NotificationService.notifyHeartRateAlertWithPush(
          userId,
          maxHeartRate,
          threshold,
          user.gender || "male",
          user.name || undefined
        );
      }
    }

    // Notify laziness penalty if applicable
    if (activitiesUnderTarget >= LAZINESS_THRESHOLD) {
      const inactiveActivities: string[] = [];
      for (const activityType of activities) {
        const dataValue = getActivityDataValue(healthData, activityType);
        const config = ACTIVITY_CONFIGS[activityType];
        const minThreshold = config.dailyTarget * LAZINESS_MINIMUM_PERCENT;
        if (dataValue < minThreshold) {
          inactiveActivities.push(config.name);
        }
      }
      await NotificationService.notifySlothPenaltyWithPush(
        userId,
        LAZINESS_DEDUCTION,
        inactiveActivities,
        user.name || undefined
      );
    }
  } catch (error) {
    console.error("[Merit Engine] Failed to send notifications:", error);
  }

  return {
    date,
    totalEarned,
    totalDeducted,
    netMerit,
    newTotalMerit,
    deductionReasons,
    activityResults,
  };
}

/**
 * Get activity data value from daily health data
 */
function getActivityDataValue(healthData: any, activityType: ActivityType): number {
  const mapping: Record<ActivityType, string> = {
    steps: "steps",
    energyBurned: "energyBurned",
    sleep: "sleepHours",
    walking: "walkingDistance",
    swimming: "swimmingDistance",
    cycling: "cyclingDistance",
    running: "runningDistance",
    standing: "standingHours",
    mindfulness: "mindfulnessMinutes",
    sunExposure: "sunExposureMinutes",
    handwash: "handwashCount",
    stairs: "stairsClimbed",
  };

  const value = healthData[mapping[activityType]];
  return value ? parseFloat(value.toString()) : 0;
}

/**
 * Create badge if it doesn't exist
 */
async function createBadgeIfNotExists(
  userId: number,
  badgeType: string,
  name: string,
  description: string
) {
  const existing = await getBadge(userId, badgeType);
  if (!existing) {
    await createBadge({
      userId,
      badgeType,
      name,
      description,
      unlockedAt: new Date(),
    });
  }
}

/**
 * Check and award period badges (weekly, monthly, yearly)
 */
async function checkPeriodBadges(userId: number, totalMerit: number) {
  if (totalMerit >= PERIOD_BADGE_THRESHOLDS.weekly) {
    await createBadgeIfNotExists(userId, "weekly", "周功德奖章", "单周总功德分数超过 5000");
  }

  if (totalMerit >= PERIOD_BADGE_THRESHOLDS.monthly) {
    await createBadgeIfNotExists(userId, "monthly", "月功德奖章", "单月总功德分数超过 20000");
  }

  if (totalMerit >= PERIOD_BADGE_THRESHOLDS.yearly) {
    await createBadgeIfNotExists(userId, "yearly", "年功德奖章", "单年总功德分数超过 200000");
  }
}

/**
 * Simulate health data for a user (for testing/demo purposes)
 */
export async function simulateHealthData(userId: number, date: string) {
  const simulatedData = {
    steps: Math.floor(Math.random() * 15000) + 5000,
    energyBurned: (Math.floor(Math.random() * 800) + 300).toString(),
    sleepHours: (Math.random() * 3 + 6).toString(),
    walkingDistance: (Math.random() * 5 + 1).toString(),
    swimmingDistance: (Math.random() * 1 + 0.2).toString(),
    cyclingDistance: (Math.random() * 10 + 2).toString(),
    runningDistance: (Math.random() * 5 + 1).toString(),
    standingHours: Math.floor(Math.random() * 8) + 4,
    mindfulnessMinutes: Math.floor(Math.random() * 30) + 5,
    sunExposureMinutes: Math.floor(Math.random() * 60) + 10,
    handwashCount: Math.floor(Math.random() * 12) + 4,
    stairsClimbed: Math.floor(Math.random() * 30) + 5,
    maxHeartRate: Math.floor(Math.random() * 40) + 60,
    avgHeartRate: Math.floor(Math.random() * 30) + 50,
  };

  return await upsertDailyHealthData(userId, date, simulatedData);
}

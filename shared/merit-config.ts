/**
 * Merit Game Configuration
 * Defines all activity targets, bonus coefficients, and milestone thresholds
 */

export type ActivityType = 
  | "steps"
  | "energyBurned"
  | "sleep"
  | "walking"
  | "swimming"
  | "cycling"
  | "running"
  | "standing"
  | "mindfulness"
  | "sunExposure"
  | "handwash"
  | "stairs";

export interface ActivityConfig {
  name: string;
  unit: string;
  dailyTarget: number;
  baseMerit: number;
  bonusCoefficient: number; // Merit per unit above target
  firstAchievementBonus: number;
  milestones: number[]; // 10 stage targets
  heartRateThreshold?: number; // For deduction
}

export const ACTIVITY_CONFIGS: Record<ActivityType, ActivityConfig> = {
  steps: {
    name: "步数",
    unit: "步",
    dailyTarget: 8000,
    baseMerit: 100,
    bonusCoefficient: 1 / 100,
    firstAchievementBonus: 500,
    milestones: [50000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000],
  },
  energyBurned: {
    name: "能量消耗",
    unit: "kcal",
    dailyTarget: 500,
    baseMerit: 100,
    bonusCoefficient: 1 / 5,
    firstAchievementBonus: 500,
    milestones: [10000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000],
  },
  sleep: {
    name: "睡眠",
    unit: "小时",
    dailyTarget: 7,
    baseMerit: 100,
    bonusCoefficient: 10 / 15 / 60, // 10 merit per 15 minutes
    firstAchievementBonus: 500,
    milestones: [50, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
  },
  walking: {
    name: "走路",
    unit: "km",
    dailyTarget: 3,
    baseMerit: 100,
    bonusCoefficient: 10,
    firstAchievementBonus: 500,
    milestones: [30, 100, 300, 500, 1000, 2000, 5000, 10000, 20000, 50000],
  },
  swimming: {
    name: "游泳",
    unit: "km",
    dailyTarget: 0.5,
    baseMerit: 100,
    bonusCoefficient: 20,
    firstAchievementBonus: 500,
    milestones: [5, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
  },
  cycling: {
    name: "自行车",
    unit: "km",
    dailyTarget: 5,
    baseMerit: 100,
    bonusCoefficient: 10,
    firstAchievementBonus: 500,
    milestones: [50, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
  },
  running: {
    name: "跑步",
    unit: "km",
    dailyTarget: 3,
    baseMerit: 100,
    bonusCoefficient: 20,
    firstAchievementBonus: 500,
    milestones: [30, 100, 300, 500, 1000, 2000, 5000, 10000, 20000, 50000],
  },
  standing: {
    name: "站立",
    unit: "小时",
    dailyTarget: 12,
    baseMerit: 100,
    bonusCoefficient: 10,
    firstAchievementBonus: 500,
    milestones: [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000],
  },
  mindfulness: {
    name: "正念",
    unit: "分钟",
    dailyTarget: 10,
    baseMerit: 100,
    bonusCoefficient: 5,
    firstAchievementBonus: 500,
    milestones: [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000],
  },
  sunExposure: {
    name: "晒太阳",
    unit: "分钟",
    dailyTarget: 15,
    baseMerit: 100,
    bonusCoefficient: 5,
    firstAchievementBonus: 500,
    milestones: [150, 750, 1500, 3000, 7500, 15000, 30000, 60000, 150000, 300000],
  },
  handwash: {
    name: "洗手",
    unit: "次",
    dailyTarget: 6,
    baseMerit: 100,
    bonusCoefficient: 5,
    firstAchievementBonus: 500,
    milestones: [50, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
  },
  stairs: {
    name: "爬楼梯",
    unit: "层",
    dailyTarget: 10,
    baseMerit: 100,
    bonusCoefficient: 5,
    firstAchievementBonus: 500,
    milestones: [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000],
  },
};

// Heart rate thresholds for deduction
export const HEART_RATE_THRESHOLDS = {
  male: 180,
  female: 160,
};

export const HEART_RATE_DEDUCTION = 50;

// Laziness penalty: if 3+ activities don't meet 20% of daily target
export const LAZINESS_THRESHOLD = 3;
export const LAZINESS_MINIMUM_PERCENT = 0.2;
export const LAZINESS_DEDUCTION = 100;

// Period badge thresholds
export const PERIOD_BADGE_THRESHOLDS = {
  weekly: 5000,
  monthly: 20000,
  yearly: 200000,
};

// Badge level names (for 10-stage progression)
export const BADGE_LEVELS = [
  "铜",
  "银",
  "金",
  "琉璃",
  "翡翠",
  "玛瑙",
  "琥珀",
  "珍珠",
  "钻石",
  "功德圆满"
];

export function getMeritConfig(activityType: ActivityType): ActivityConfig {
  return ACTIVITY_CONFIGS[activityType];
}

export function calculateActivityMerit(
  activityType: ActivityType,
  dataValue: number
): { baseMerit: number; bonusMerit: number; totalMerit: number } {
  const config = getMeritConfig(activityType);
  
  let baseMerit = 0;
  let bonusMerit = 0;

  if (dataValue >= config.dailyTarget) {
    baseMerit = config.baseMerit;
    const excess = dataValue - config.dailyTarget;
    const coefficient = typeof config.bonusCoefficient === 'number' ? config.bonusCoefficient : 0;
    bonusMerit = Math.floor(excess * coefficient);
  } else {
    // Partial credit for not meeting target
    const percentage = dataValue / config.dailyTarget;
    baseMerit = Math.floor(config.baseMerit * percentage);
  }

  return {
    baseMerit,
    bonusMerit,
    totalMerit: baseMerit + bonusMerit,
  };
}

export function getNextMilestone(
  activityType: ActivityType,
  currentTotal: number
): { milestone: number; stage: number } | null {
  const config = getMeritConfig(activityType);
  
  for (let i = 0; i < config.milestones.length; i++) {
    if (currentTotal < config.milestones[i]) {
      return { milestone: config.milestones[i], stage: i + 1 };
    }
  }

  return null;
}

export function getCurrentStage(
  activityType: ActivityType,
  currentTotal: number
): number {
  const config = getMeritConfig(activityType);
  
  let stage = 0;
  for (let i = 0; i < config.milestones.length; i++) {
    if (currentTotal >= config.milestones[i]) {
      stage = i + 1;
    } else {
      break;
    }
  }

  return stage;
}

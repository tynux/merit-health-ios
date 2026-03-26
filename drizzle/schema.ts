import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with merit game specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Merit game specific fields
  gender: mysqlEnum("gender", ["male", "female"]).default("male"),
  totalMerit: int("totalMerit").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Daily health data for each activity
 * Stores simulated HealthKit data
 */
export const dailyHealthData = mysqlTable("daily_health_data", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  
  // 12 health activities
  steps: int("steps").default(0),
  energyBurned: decimal("energyBurned", { precision: 10, scale: 2 }).default("0"),
  sleepHours: decimal("sleepHours", { precision: 5, scale: 2 }).default("0"),
  walkingDistance: decimal("walkingDistance", { precision: 10, scale: 2 }).default("0"), // km
  swimmingDistance: decimal("swimmingDistance", { precision: 10, scale: 2 }).default("0"), // km
  cyclingDistance: decimal("cyclingDistance", { precision: 10, scale: 2 }).default("0"), // km
  runningDistance: decimal("runningDistance", { precision: 10, scale: 2 }).default("0"), // km
  standingHours: int("standingHours").default(0),
  mindfulnessMinutes: int("mindfulnessMinutes").default(0),
  sunExposureMinutes: int("sunExposureMinutes").default(0),
  handwashCount: int("handwashCount").default(0),
  stairsClimbed: int("stairsClimbed").default(0),
  
  // Heart rate monitoring
  maxHeartRate: int("maxHeartRate").default(0),
  avgHeartRate: int("avgHeartRate").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyHealthData = typeof dailyHealthData.$inferSelect;
export type InsertDailyHealthData = typeof dailyHealthData.$inferInsert;

/**
 * Daily merit calculation and deduction record
 */
export const dailyMeritRecord = mysqlTable("daily_merit_record", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  
  // Merit earned from activities
  baseMerit: int("baseMerit").default(0),
  bonusMerit: int("bonusMerit").default(0),
  totalEarned: int("totalEarned").default(0),
  
  // Merit deductions
  heartRateDeduction: int("heartRateDeduction").default(0),
  lazinessDeduction: int("lazinessDeduction").default(0),
  totalDeducted: int("totalDeducted").default(0),
  
  // Net merit for the day
  netMerit: int("netMerit").default(0),
  
  // Details of deductions
  deductionReasons: json("deductionReasons").$type<string[]>().default([]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyMeritRecord = typeof dailyMeritRecord.$inferSelect;
export type InsertDailyMeritRecord = typeof dailyMeritRecord.$inferInsert;

/**
 * Activity-specific merit earned
 * Tracks merit earned from each activity per day
 */
export const activityMeritRecord = mysqlTable("activity_merit_record", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  
  activityType: mysqlEnum("activityType", [
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
    "stairs"
  ]).notNull(),
  
  // Data achieved
  dataValue: decimal("dataValue", { precision: 15, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  
  // Merit calculation
  baseMerit: int("baseMerit").default(0),
  bonusMerit: int("bonusMerit").default(0),
  totalMerit: int("totalMerit").default(0),
  
  // First achievement flag
  isFirstAchievement: boolean("isFirstAchievement").default(false),
  firstAchievementBonus: int("firstAchievementBonus").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityMeritRecord = typeof activityMeritRecord.$inferSelect;
export type InsertActivityMeritRecord = typeof activityMeritRecord.$inferInsert;

/**
 * Activity cumulative progress towards 10-stage milestones
 */
export const activityProgress = mysqlTable("activity_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  activityType: mysqlEnum("activityType", [
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
    "stairs"
  ]).notNull(),
  
  // Cumulative data
  totalData: decimal("totalData", { precision: 20, scale: 2 }).default("0"),
  
  // Stage progress (1-10)
  currentStage: int("currentStage").default(0),
  
  // Milestone achievements
  milestonesReached: json("milestonesReached").$type<number[]>().default([]),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActivityProgress = typeof activityProgress.$inferSelect;
export type InsertActivityProgress = typeof activityProgress.$inferInsert;

/**
 * User badges/medals system
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  badgeType: mysqlEnum("badgeType", [
    // First achievement badges
    "steps_first",
    "energyBurned_first",
    "sleep_first",
    "walking_first",
    "swimming_first",
    "cycling_first",
    "running_first",
    "standing_first",
    "mindfulness_first",
    "sunExposure_first",
    "handwash_first",
    "stairs_first",
    // Progress badges (1-10 levels)
    "steps_1", "steps_2", "steps_3", "steps_4", "steps_5", "steps_6", "steps_7", "steps_8", "steps_9", "steps_10",
    "energyBurned_1", "energyBurned_2", "energyBurned_3", "energyBurned_4", "energyBurned_5", "energyBurned_6", "energyBurned_7", "energyBurned_8", "energyBurned_9", "energyBurned_10",
    "sleep_1", "sleep_2", "sleep_3", "sleep_4", "sleep_5", "sleep_6", "sleep_7", "sleep_8", "sleep_9", "sleep_10",
    "walking_1", "walking_2", "walking_3", "walking_4", "walking_5", "walking_6", "walking_7", "walking_8", "walking_9", "walking_10",
    "swimming_1", "swimming_2", "swimming_3", "swimming_4", "swimming_5", "swimming_6", "swimming_7", "swimming_8", "swimming_9", "swimming_10",
    "cycling_1", "cycling_2", "cycling_3", "cycling_4", "cycling_5", "cycling_6", "cycling_7", "cycling_8", "cycling_9", "cycling_10",
    "running_1", "running_2", "running_3", "running_4", "running_5", "running_6", "running_7", "running_8", "running_9", "running_10",
    "standing_1", "standing_2", "standing_3", "standing_4", "standing_5", "standing_6", "standing_7", "standing_8", "standing_9", "standing_10",
    "mindfulness_1", "mindfulness_2", "mindfulness_3", "mindfulness_4", "mindfulness_5", "mindfulness_6", "mindfulness_7", "mindfulness_8", "mindfulness_9", "mindfulness_10",
    "sunExposure_1", "sunExposure_2", "sunExposure_3", "sunExposure_4", "sunExposure_5", "sunExposure_6", "sunExposure_7", "sunExposure_8", "sunExposure_9", "sunExposure_10",
    "handwash_1", "handwash_2", "handwash_3", "handwash_4", "handwash_5", "handwash_6", "handwash_7", "handwash_8", "handwash_9", "handwash_10",
    "stairs_1", "stairs_2", "stairs_3", "stairs_4", "stairs_5", "stairs_6", "stairs_7", "stairs_8", "stairs_9", "stairs_10",
    // Period badges
    "weekly",
    "monthly",
    "yearly"
  ]).notNull(),
  
  // Badge metadata
  name: text("name").notNull(),
  description: text("description"),
  iconUrl: text("iconUrl"),
  
  // Achievement tracking
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Heart rate alert records for deduction tracking
 */
export const heartRateAlerts = mysqlTable("heart_rate_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  
  heartRate: int("heartRate").notNull(),
  threshold: int("threshold").notNull(),
  meritDeducted: int("meritDeducted").default(50),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HeartRateAlert = typeof heartRateAlerts.$inferSelect;
export type InsertHeartRateAlert = typeof heartRateAlerts.$inferInsert;

/**
 * LLM-generated health suggestions
 */
export const healthSuggestions = mysqlTable("health_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  suggestion: text("suggestion").notNull(),
  meritStrategy: text("meritStrategy"),
  
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthSuggestion = typeof healthSuggestions.$inferSelect;
export type InsertHealthSuggestion = typeof healthSuggestions.$inferInsert;

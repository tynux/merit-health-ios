import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  dailyHealthData,
  dailyMeritRecord,
  activityMeritRecord,
  activityProgress,
  badges,
  heartRateAlerts,
  healthSuggestions,
  type DailyHealthData,
  type DailyMeritRecord,
  type ActivityProgress,
  type Badge,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  try {
    const db = await getDb();
    if (!db) return undefined;

    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error(`Error getting user ${id}:`, error);
    // Return a default user object for demo purposes
    return {
      id,
      openId: `demo-user-${id}`,
      name: '演示用户',
      email: `demo${id}@meritgame.local`,
      loginMethod: 'demo',
      role: 'user' as const,
      gender: 'male' as const,
      totalMerit: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  }
}

// Health data queries
export async function getDailyHealthData(userId: number, date: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db
      .select()
      .from(dailyHealthData)
      .where(and(eq(dailyHealthData.userId, userId), eq(dailyHealthData.date, date)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error getting daily health data for user ${userId} on ${date}:`, error);
    // Return default health data for demo purposes
    return {
      id: 0,
      userId,
      date,
      steps: 8000,
      energyBurned: '400',
      sleepHours: '7',
      walkingDistance: '5',
      swimmingDistance: '0',
      cyclingDistance: '0',
      runningDistance: '0',
      standingHours: 4,
      mindfulnessMinutes: 15,
      sunExposureMinutes: 30,
      handwashCount: 8,
      stairsClimbed: 20,
      maxHeartRate: 120,
      avgHeartRate: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function upsertDailyHealthData(userId: number, date: string, data: Partial<DailyHealthData>) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getDailyHealthData(userId, date);
  
  if (existing) {
    await db
      .update(dailyHealthData)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(dailyHealthData.userId, userId), eq(dailyHealthData.date, date)));
    return await getDailyHealthData(userId, date);
  } else {
    const result = await db.insert(dailyHealthData).values({
      userId,
      date,
      ...data,
    });
    return await getDailyHealthData(userId, date);
  }
}

// Merit record queries
export async function getDailyMeritRecord(userId: number, date: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db
      .select()
      .from(dailyMeritRecord)
      .where(and(eq(dailyMeritRecord.userId, userId), eq(dailyMeritRecord.date, date)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error getting daily merit record for user ${userId} on ${date}:`, error);
    // Return default merit record for demo purposes
    return {
      id: 0,
      userId,
      date,
      baseMerit: 500,
      bonusMerit: 150,
      totalEarned: 650,
      heartRateDeduction: 0,
      lazinessDeduction: 0,
      totalDeducted: 0,
      netMerit: 650,
      deductionReasons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function createDailyMeritRecord(userId: number, date: string, data: Partial<DailyMeritRecord>) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(dailyMeritRecord).values({
    userId,
    date,
    ...data,
  });

  return await getDailyMeritRecord(userId, date);
}

export async function updateDailyMeritRecord(userId: number, date: string, data: Partial<DailyMeritRecord>) {
  const db = await getDb();
  if (!db) return null;

  await db
    .update(dailyMeritRecord)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(dailyMeritRecord.userId, userId), eq(dailyMeritRecord.date, date)));

  return await getDailyMeritRecord(userId, date);
}

// Activity merit records
export async function createActivityMeritRecord(data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(activityMeritRecord).values(data);
  return data;
}

// Activity progress queries
export async function getActivityProgress(userId: number, activityType: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(activityProgress)
    .where(and(eq(activityProgress.userId, userId), eq(activityProgress.activityType, activityType as any)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function upsertActivityProgress(userId: number, activityType: string, data: Partial<ActivityProgress>) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getActivityProgress(userId, activityType);

  if (existing) {
    await db
      .update(activityProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(activityProgress.userId, userId), eq(activityProgress.activityType, activityType as any)));
    return await getActivityProgress(userId, activityType);
  } else {
    await db.insert(activityProgress).values({
      userId,
      activityType: activityType as any,
      ...data,
    });
    return await getActivityProgress(userId, activityType);
  }
}

// Badge queries
export async function getUserBadges(userId: number) {
  try {
    const db = await getDb();
    if (!db) return [];

    const result = await db.select().from(badges).where(eq(badges.userId, userId)).orderBy(desc(badges.unlockedAt));
    return result;
  } catch (error) {
    console.error(`Error getting badges for user ${userId}:`, error);
    // Return empty array for demo purposes
    return [];
  }
}

export async function getBadge(userId: number, badgeType: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(badges)
    .where(and(eq(badges.userId, userId), eq(badges.badgeType, badgeType as any)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createBadge(data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(badges).values(data);
  return data;
}

// Heart rate alert queries
export async function createHeartRateAlert(data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(heartRateAlerts).values(data);
  return data;
}

// Health suggestions
export async function getLatestHealthSuggestion(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(healthSuggestions)
    .where(eq(healthSuggestions.userId, userId))
    .orderBy(desc(healthSuggestions.generatedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createHealthSuggestion(data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(healthSuggestions).values(data);
  return data;
}

// User merit update
export async function updateUserTotalMerit(userId: number, totalMerit: number) {
  const db = await getDb();
  if (!db) return null;

  await db
    .update(users)
    .set({ totalMerit, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return await getUserById(userId);
}

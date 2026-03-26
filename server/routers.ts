import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getUserById,
  getDailyHealthData,
  upsertDailyHealthData,
  getDailyMeritRecord,
  getUserBadges,
  getActivityProgress,
} from "./db";
import { settleDailyMerit, simulateHealthData } from "./merit-engine";
import { generateHealthAdvice, generateDailySummary, generateBadgeMessage } from "./health-advisor";
import { syncHealthKitData, validateHealthKitData, detectAnomalies } from "./healthkit-sync";

const DEMO_USER_ID = 1; // Demo user ID for public access

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User profile and merit
  user: router({
    getProfile: publicProcedure.query(async () => {
      const user = await getUserById(DEMO_USER_ID);
      return user;
    }),

    updateGender: publicProcedure
      .input(z.enum(["male", "female"]))
      .mutation(async ({ input }) => {
        // TODO: Implement gender update
        return { success: true };
      }),
  }),

  // Health data management
  health: router({
    getDailyData: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const data = await getDailyHealthData(DEMO_USER_ID, input);
        return data;
      }),

    updateDailyData: publicProcedure
      .input(
        z.object({
          date: z.string(),
          steps: z.number().optional(),
          energyBurned: z.string().optional(),
          sleepHours: z.string().optional(),
          walkingDistance: z.string().optional(),
          swimmingDistance: z.string().optional(),
          cyclingDistance: z.string().optional(),
          runningDistance: z.string().optional(),
          standingHours: z.number().optional(),
          mindfulnessMinutes: z.number().optional(),
          sunExposureMinutes: z.number().optional(),
          handwashCount: z.number().optional(),
          stairsClimbed: z.number().optional(),
          maxHeartRate: z.number().optional(),
          avgHeartRate: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { date, ...data } = input;
        const updated = await upsertDailyHealthData(DEMO_USER_ID, date, data);
        return updated;
      }),

    simulateData: publicProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        const simulated = await simulateHealthData(DEMO_USER_ID, input);
        return simulated;
      }),

    syncHealthKitData: publicProcedure
      .input(
        z.object({
          date: z.string(),
          steps: z.number().optional(),
          energyBurned: z.number().optional(),
          sleepHours: z.number().optional(),
          walkingDistance: z.number().optional(),
          swimmingDistance: z.number().optional(),
          cyclingDistance: z.number().optional(),
          runningDistance: z.number().optional(),
          standingHours: z.number().optional(),
          mindfulnessMinutes: z.number().optional(),
          sunExposureMinutes: z.number().optional(),
          handwashCount: z.number().optional(),
          stairsClimbed: z.number().optional(),
          maxHeartRate: z.number().optional(),
          avgHeartRate: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const validation = validateHealthKitData({
            userId: DEMO_USER_ID,
            ...input,
          });

          if (!validation.valid) {
            return {
              success: false,
              errors: validation.errors,
            };
          }

          const anomalies = detectAnomalies({
            userId: DEMO_USER_ID,
            ...input,
          });

          await syncHealthKitData({
            userId: DEMO_USER_ID,
            ...input,
          });

          return {
            success: true,
            message: "HealthKit data synced successfully",
            warnings: anomalies,
          };
        } catch (error) {
          console.error("Error syncing HealthKit data:", error);
          return {
            success: false,
            errors: ["Data sync failed"],
          };
        }
      }),
  }),

  // Merit settlement and calculation
  merit: router({
    settleDailyMerit: publicProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        const result = await settleDailyMerit(DEMO_USER_ID, input);
        return result;
      }),

    getDailyRecord: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const record = await getDailyMeritRecord(DEMO_USER_ID, input);
        return record;
      }),

    getUserStats: publicProcedure.query(async () => {
      const user = await getUserById(DEMO_USER_ID);
      const badges = await getUserBadges(DEMO_USER_ID);
      
      return {
        totalMerit: user?.totalMerit || 0,
        badgeCount: badges.length,
        badges,
      };
    }),
  }),

  // Activity progress tracking
  activity: router({
    getProgress: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const progress = await getActivityProgress(DEMO_USER_ID, input);
        return progress;
      }),
  }),

  // Badges and achievements
  badges: router({
    getUserBadges: publicProcedure.query(async () => {
      const badges = await getUserBadges(DEMO_USER_ID);
      return badges;
    }),
  }),

  // Health advisor with LLM
  advisor: router({
    getPersonalizedAdvice: publicProcedure.query(async () => {
      try {
        const user = await getUserById(DEMO_USER_ID);
        const badges = await getUserBadges(DEMO_USER_ID);
        
        // Mock activities data for demo
        const activities = [
          { type: "steps", name: "步数", totalData: 250000, currentStage: 5, dailyAverage: 8333, target: 8000 },
          { type: "sleep", name: "睡眠", totalData: 210, currentStage: 3, dailyAverage: 7, target: 7 },
          { type: "running", name: "跑步", totalData: 50, currentStage: 2, dailyAverage: 1.67, target: 3 },
        ];

        const profile = {
          userId: DEMO_USER_ID,
          totalMerit: user?.totalMerit || 0,
          badgeCount: badges.length,
          activities,
          recentAchievements: badges.slice(0, 3).map(b => b.name),
        };

        const advice = await generateHealthAdvice(profile);
        return advice;
      } catch (error) {
        console.error("Error generating advice:", error);
        return "感谢你的坚持修行。继续保持健康的生活方式，功德自然会圆满。";
      }
    }),

    getDailySummary: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          const record = await getDailyMeritRecord(DEMO_USER_ID, input);
          
          // Mock activities for demo
          const activities = [
            { name: "步数", achieved: true, progress: 10000, target: 8000 },
            { name: "睡眠", achieved: true, progress: 7.5, target: 7 },
            { name: "跑步", achieved: false, progress: 2, target: 3 },
          ];

          const summary = await generateDailySummary(
            activities,
            record?.totalEarned || 0,
            record?.totalDeducted || 0,
          );
          return summary;
        } catch (error) {
          console.error("Error generating summary:", error);
          return "感谢今日的修行。每一步都是向功德圆满迈进的过程。";
        }
      }),

    getBadgeMessage: publicProcedure
      .input(z.object({ badgeName: z.string(), activityName: z.string() }))
      .query(async ({ input }) => {
        try {
          const message = await generateBadgeMessage(input.badgeName, input.activityName);
          return message;
        } catch (error) {
          console.error("Error generating badge message:", error);
          return `恭喜获得 ${input.badgeName}！继续坚持修行。`;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

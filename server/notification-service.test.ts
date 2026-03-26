import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationService } from "./notification-service";
import * as notificationModule from "./_core/notification";

// Mock the notifyOwner function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

describe("NotificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("notifyBadgeUnlocked", () => {
    it("should send badge unlocked notification", async () => {
      const mockBadge = {
        id: 1,
        userId: 1,
        badgeType: "steps_first",
        name: "步数初缘",
        description: "首次完成步数活动",
        iconUrl: null,
        unlockedAt: new Date(),
        createdAt: new Date(),
      };

      await NotificationService.notifyBadgeUnlocked(1, mockBadge as any, "张三");

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("恭喜获得新奖章"),
          content: expect.stringContaining("步数初缘"),
        })
      );
    });

    it("should handle unknown badge types", async () => {
      const mockBadge = {
        id: 1,
        userId: 1,
        badgeType: "unknown_badge",
        name: "未知奖章",
        description: "未知奖章描述",
        iconUrl: null,
        unlockedAt: new Date(),
        createdAt: new Date(),
      };

      await NotificationService.notifyBadgeUnlocked(1, mockBadge as any);

      expect(notificationModule.notifyOwner).toHaveBeenCalled();
    });
  });

  describe("notifyDailySettlement", () => {
    it("should send daily settlement notification", async () => {
      const mockRecord = {
        id: 1,
        userId: 1,
        date: "2026-02-05",
        baseMerit: 100,
        bonusMerit: 50,
        totalEarned: 150,
        heartRateDeduction: 0,
        lazinessDeduction: 0,
        totalDeducted: 0,
        netMerit: 150,
        deductionReasons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await NotificationService.notifyDailySettlement(1, mockRecord as any, "李四");

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("今日功德结算"),
          content: expect.stringContaining("150"),
        })
      );
    });

    it("should include badge count in notification", async () => {
      const mockRecord = {
        id: 1,
        userId: 1,
        date: "2026-02-05",
        baseMerit: 100,
        bonusMerit: 50,
        totalEarned: 150,
        heartRateDeduction: 0,
        lazinessDeduction: 0,
        totalDeducted: 0,
        netMerit: 150,
        deductionReasons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockBadges = [
        {
          id: 1,
          userId: 1,
          badgeType: "steps_first",
          name: "步数初缘",
          description: "首次完成步数活动",
          iconUrl: null,
          unlockedAt: new Date(),
          createdAt: new Date(),
        },
      ];

      await NotificationService.notifyDailySettlement(
        1,
        mockRecord as any,
        "王五",
        mockBadges as any
      );

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("1 个新奖章"),
        })
      );
    });
  });

  describe("notifyHeartRateAlert", () => {
    it("should send heart rate alert notification", async () => {
      await NotificationService.notifyHeartRateAlert(1, 185, 180, "male", "赵六");

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("心率预警"),
          content: expect.stringContaining("185"),
        })
      );
    });

    it("should include threshold in notification", async () => {
      await NotificationService.notifyHeartRateAlert(1, 165, 160, "female");

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("160"),
        })
      );
    });
  });

  describe("notifySlothPenalty", () => {
    it("should send sloth penalty notification", async () => {
      const inactiveActivities = ["步数", "睡眠", "跑步"];

      await NotificationService.notifySlothPenalty(
        1,
        50,
        inactiveActivities,
        "孙七"
      );

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("懈怠惩罚"),
          content: expect.stringContaining("50"),
        })
      );
    });

    it("should list all inactive activities", async () => {
      const inactiveActivities = ["步数", "睡眠"];

      await NotificationService.notifySlothPenalty(1, 50, inactiveActivities);

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("步数"),
        })
      );
    });
  });

  describe("notifyStageAchieved", () => {
    it("should send stage achievement notification", async () => {
      await NotificationService.notifyStageAchieved(
        1,
        "步数",
        5,
        500,
        "周八"
      );

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("阶段达成"),
          content: expect.stringContaining("步数"),
        })
      );
    });

    it("should include stage number and merit in notification", async () => {
      await NotificationService.notifyStageAchieved(1, "跑步", 3, 300);

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("第 3 阶段"),
        })
      );
    });
  });

  describe("notifyAchievementUnlocked", () => {
    it("should send achievement unlocked notification", async () => {
      await NotificationService.notifyAchievementUnlocked(
        1,
        "健康达人",
        "连续 7 天达成所有活动目标",
        "周九"
      );

      expect(notificationModule.notifyOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("成就达成"),
          content: expect.stringContaining("健康达人"),
        })
      );
    });
  });
});

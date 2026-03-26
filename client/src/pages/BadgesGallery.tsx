import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Award, Lock } from "lucide-react";
import { useState } from "react";

const BADGE_LEVELS = ["铜", "银", "金", "琉璃", "翡翠", "玛瑙", "琥珀", "珍珠", "钻石", "功德圆满"];

const ACTIVITY_TYPES = [
  { key: "steps", name: "步数", icon: "👣" },
  { key: "energyBurned", name: "能量消耗", icon: "🔥" },
  { key: "sleep", name: "睡眠", icon: "😴" },
  { key: "walking", name: "走路", icon: "🚶" },
  { key: "swimming", name: "游泳", icon: "🏊" },
  { key: "cycling", name: "自行车", icon: "🚴" },
  { key: "running", name: "跑步", icon: "🏃" },
  { key: "standing", name: "站立", icon: "🧍" },
  { key: "mindfulness", name: "正念", icon: "🧘" },
  { key: "sunExposure", name: "晒太阳", icon: "☀️" },
  { key: "handwash", name: "洗手", icon: "🧼" },
  { key: "stairs", name: "爬楼梯", icon: "🪜" },
];

export default function BadgesGallery() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Fetch user badges
  const { data: badges = [], isLoading, error } = trpc.badges.getUserBadges.useQuery(undefined, {
    retry: false,
  });

  const badgeTypeSet = new Set(badges.map((b) => b.badgeType as string));

  const getActivityBadges = (activityKey: string) => {
    const firstBadge = `${activityKey}_first`;
    const progressBadges = Array.from({ length: 10 }, (_, i) => `${activityKey}_${i + 1}`);

    return {
      first: {
        type: firstBadge,
        name: `首次${ACTIVITY_TYPES.find((a) => a.key === activityKey)?.name}`,
        unlocked: badgeTypeSet.has(firstBadge as any),
      },
      progress: progressBadges.map((type, idx) => ({
        type,
        name: `${ACTIVITY_TYPES.find((a) => a.key === activityKey)?.name}${BADGE_LEVELS[idx]}`,
        level: BADGE_LEVELS[idx],
        unlocked: badgeTypeSet.has(type as any),
      })),
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">✨</div>
          <p className="text-muted-foreground">加载奖章中...</p>
        </div>
      </div>
    );
  }

  // 如果有错误，使用演示数据
  if (error) {
    console.log("[Badges] Using demo mode - API error:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">奖章陈列室</h1>
          <p className="text-muted-foreground">
            已获得 {badges.length} 个奖章 • 继续修行，收集更多奖章
          </p>
        </div>

        {/* Activity Selection */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4">选择活动类型</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ACTIVITY_TYPES.map((activity) => (
              <button
                key={activity.key}
                onClick={() =>
                  setSelectedActivity(selectedActivity === activity.key ? null : activity.key)
                }
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedActivity === activity.key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">{activity.icon}</div>
                <p className="text-xs font-medium line-clamp-1">{activity.name}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Period Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">周期成就</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: "weekly", name: "周功德奖章", desc: "单周功德 ≥ 5000" },
              { type: "monthly", name: "月功德奖章", desc: "单月功德 ≥ 20000" },
              { type: "yearly", name: "年功德奖章", desc: "单年功德 ≥ 200000" },
            ].map((period) => {
              const unlocked = badgeTypeSet.has(period.type);
              return (
                <Card
                  key={period.type}
                  className={`p-6 text-center transition-all ${
                    unlocked
                      ? "bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30"
                      : "bg-muted/5 border-muted/30 opacity-60"
                  }`}
                >
                  <div className="text-5xl mb-3">{unlocked ? "🏆" : "🔒"}</div>
                  <h3 className="font-semibold mb-1">{period.name}</h3>
                  <p className="text-sm text-muted-foreground">{period.desc}</p>
                  {unlocked && (
                    <p className="text-xs text-secondary mt-2 font-semibold">已解锁</p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Activity-specific Badges */}
        {selectedActivity ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {ACTIVITY_TYPES.find((a) => a.key === selectedActivity)?.name} 奖章进度
              </h2>

              {/* First Achievement Badge */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">初缘纪念</h3>
                <div className="grid grid-cols-1 gap-4">
                  {(() => {
                    const activityBadges = getActivityBadges(selectedActivity!);
                    const unlocked = activityBadges.first.unlocked;
                    return (
                      <Card
                        className={`p-6 text-center transition-all ${
                          unlocked
                            ? "bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30"
                            : "bg-muted/5 border-muted/30 opacity-60"
                        }`}
                      >
                        <div className="text-6xl mb-3">{unlocked ? "🌟" : "⭐"}</div>
                        <h4 className="font-semibold mb-1">{activityBadges.first.name}</h4>
                        <p className="text-sm text-muted-foreground">首次完成该活动</p>
                        {unlocked && (
                          <p className="text-xs text-secondary mt-2 font-semibold">已解锁</p>
                        )}
                      </Card>
                    );
                  })()}
                </div>
              </div>

              {/* Progress Badges */}
              <h3 className="text-lg font-semibold mb-3">精进阶段</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {getActivityBadges(selectedActivity).progress.map((badge) => (
                  <Card
                    key={badge.type}
                    className={`p-4 text-center transition-all ${
                      badge.unlocked
                        ? "bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30"
                        : "bg-muted/5 border-muted/30 opacity-60"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.unlocked ? "🏅" : "🔒"}</div>
                    <p className="text-xs font-semibold mb-1">{badge.level}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{badge.name}</p>
                    {badge.unlocked && (
                      <p className="text-xs text-secondary mt-1 font-semibold">已解锁</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">选择一个活动类型查看对应的奖章进度</p>
          </Card>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{badges.length}</div>
            <p className="text-sm text-muted-foreground">已获得奖章</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {ACTIVITY_TYPES.length * 11 + 3 - badges.length}
            </div>
            <p className="text-sm text-muted-foreground">待解锁奖章</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {Math.round((badges.length / (ACTIVITY_TYPES.length * 11 + 3)) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">完成度</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

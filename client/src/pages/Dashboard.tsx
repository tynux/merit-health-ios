// import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Activity, Award, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const ACTIVITIES = [
  { type: "steps", name: "步数", icon: "👣", target: 8000, unit: "步" },
  { type: "energyBurned", name: "能量消耗", icon: "🔥", target: 500, unit: "kcal" },
  { type: "sleep", name: "睡眠", icon: "😴", target: 7, unit: "小时" },
  { type: "walking", name: "走路", icon: "🚶", target: 3, unit: "km" },
  { type: "swimming", name: "游泳", icon: "🏊", target: 0.5, unit: "km" },
  { type: "cycling", name: "自行车", icon: "🚴", target: 5, unit: "km" },
  { type: "running", name: "跑步", icon: "🏃", target: 3, unit: "km" },
  { type: "standing", name: "站立", icon: "🧍", target: 12, unit: "小时" },
  { type: "mindfulness", name: "正念", icon: "🧘", target: 10, unit: "分钟" },
  { type: "sunExposure", name: "晒太阳", icon: "☀️", target: 15, unit: "分钟" },
  { type: "handwash", name: "洗手", icon: "🧼", target: 6, unit: "次" },
  { type: "stairs", name: "爬楼梯", icon: "🪜", target: 10, unit: "层" },
];

export default function Dashboard() {
  // const { user } = useAuth();
  const user = { name: "访客" };
  const [todayDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = trpc.merit.getUserStats.useQuery();

  // Fetch today's health data
  const { data: healthData } = trpc.health.getDailyData.useQuery(todayDate);

  // Fetch today's merit record
  const { data: meritRecord } = trpc.merit.getDailyRecord.useQuery(todayDate);

  // Simulate data mutation
  const simulateDataMutation = trpc.health.simulateData.useMutation();
  const settleMeritMutation = trpc.merit.settleDailyMerit.useMutation();

  const handleSimulateData = async () => {
    try {
      await simulateDataMutation.mutateAsync(todayDate);
      // After simulating, settle the merit
      await settleMeritMutation.mutateAsync(todayDate);
    } catch (error) {
      console.error("Error simulating data:", error);
    }
  };

  const getActivityProgress = (activityType: string) => {
    if (!healthData) return 0;

    const mapping: Record<string, string> = {
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

    const value = healthData[mapping[activityType] as keyof typeof healthData];
    return value ? parseFloat(value.toString()) : 0;
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">✨</div>
          <p className="text-muted-foreground">加载功德数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">功德圆满</h1>
          <p className="text-muted-foreground">欢迎回来，{user.name}</p>
        </div>

        {/* Total Merit Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 p-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{stats?.totalMerit || 0}</div>
            <p className="text-lg text-muted-foreground mb-4">总功德分数</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleSimulateData} disabled={simulateDataMutation.isPending}>
                {simulateDataMutation.isPending ? "模拟中..." : "模拟今日数据"}
              </Button>
              <Button
                variant="outline"
                onClick={() => settleMeritMutation.mutate(todayDate)}
                disabled={settleMeritMutation.isPending}
              >
                {settleMeritMutation.isPending ? "结算中..." : "结算功德"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Today's Summary */}
        {meritRecord && (
          <Card className="mb-8 p-6">
            <h2 className="text-2xl font-serif font-semibold mb-4">今日功德结算</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat-box">
                <div className="stat-value text-green-600">{meritRecord.totalEarned || 0}</div>
                <div className="stat-label">获得功德</div>
              </div>
              <div className="stat-box">
                <div className="stat-value text-red-600">{meritRecord.totalDeducted || 0}</div>
                <div className="stat-label">扣减功德</div>
              </div>
              <div className="stat-box">
                <div className="stat-value text-primary">{meritRecord.netMerit || 0}</div>
                <div className="stat-label">净功德</div>
              </div>
              <div className="stat-box">
                <div className="stat-value text-secondary">{stats?.badgeCount || 0}</div>
                <div className="stat-label">已获奖章</div>
              </div>
            </div>
            {meritRecord.deductionReasons && meritRecord.deductionReasons.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-semibold text-destructive mb-2">扣减原因：</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {(meritRecord.deductionReasons as string[]).map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Activities Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">今日活动进度</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.map((activity) => {
              const progress = getActivityProgress(activity.type);
              const percentage = Math.min((progress / activity.target) * 100, 100);

              return (
                <Card key={activity.type} className="merit-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-2xl mb-1">{activity.icon}</p>
                      <h3 className="font-semibold text-foreground">{activity.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {progress.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.unit}</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="merit-progress">
                      <div
                        className="merit-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>目标: {activity.target} {activity.unit}</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Badges Preview */}
        {stats?.badges && stats.badges.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary" />
              最近获得的奖章
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg border border-secondary/20 hover:border-secondary/50 transition-colors"
                >
                  <div className="text-4xl">🏅</div>
                  <p className="text-xs text-center font-semibold line-clamp-2">{badge.name}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

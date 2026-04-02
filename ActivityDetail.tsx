import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ACTIVITY_CONFIGS, BADGE_LEVELS } from "@shared/merit-config";

const ACTIVITIES = {
  steps: { name: "步数", icon: "👣", unit: "步", target: 8000 },
  energyBurned: { name: "能量消耗", icon: "🔥", unit: "kcal", target: 500 },
  sleep: { name: "睡眠", icon: "😴", unit: "小时", target: 7 },
  walking: { name: "走路", icon: "🚶", unit: "km", target: 3 },
  swimming: { name: "游泳", icon: "🏊", unit: "km", target: 0.5 },
  cycling: { name: "自行车", icon: "🚴", unit: "km", target: 5 },
  running: { name: "跑步", icon: "🏃", unit: "km", target: 3 },
  standing: { name: "站立", icon: "🧍", unit: "小时", target: 12 },
  mindfulness: { name: "正念", icon: "🧘", unit: "分钟", target: 10 },
  sunExposure: { name: "晒太阳", icon: "☀️", unit: "分钟", target: 15 },
  handwash: { name: "洗手", icon: "🧼", unit: "次", target: 6 },
  stairs: { name: "爬楼梯", icon: "🪜", unit: "层", target: 10 },
} as const;

type ActivityKey = keyof typeof ACTIVITIES;

export default function ActivityDetail() {
  const [, params] = useRoute("/activity/:type");
  const activityType = (params?.type as ActivityKey) || "steps";
  const activity = ACTIVITIES[activityType];

  // Fetch activity progress
  const { data: progress, isLoading, error } = trpc.activity.getProgress.useQuery(activityType, {
    retry: false,
  });

  if (error) {
    console.log("[Activity] Using demo mode - API error:", error);
  }

  // Mock historical data
  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    value: Math.floor(Math.random() * activity.target * 1.5) + activity.target * 0.5,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">✨</div>
          <p className="text-muted-foreground">加载活动数据中...</p>
        </div>
      </div>
    );
  }

  const currentStage = progress?.currentStage || 0;
  const totalData = progress?.totalData ? parseFloat(progress.totalData.toString()) : 0;
  // Bug Fix: Use activity-specific milestones from shared config instead of hardcoded steps values
  const activityMilestones = ACTIVITY_CONFIGS[activityType]?.milestones ?? [50000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
  const nextMilestone = currentStage < activityMilestones.length
    ? activityMilestones[currentStage]
    : activityMilestones[activityMilestones.length - 1];
  const progressToNextMilestone = Math.min((totalData / nextMilestone) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary">
              {activity.icon} {activity.name}
            </h1>
            <p className="text-muted-foreground">详细进度和历史数据</p>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <p className="text-sm text-muted-foreground mb-2">累积数据</p>
            <p className="text-4xl font-bold text-primary mb-1">
              {totalData.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.unit}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/10">
            <p className="text-sm text-muted-foreground mb-2">当前阶段</p>
            <p className="text-4xl font-bold text-secondary mb-1">{currentStage}/10</p>
            <p className="text-xs text-muted-foreground">精进级别</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10">
            <p className="text-sm text-muted-foreground mb-2">日均数据</p>
            <p className="text-4xl font-bold text-accent mb-1">
              {(totalData / 30).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.unit}/天</p>
          </Card>
        </div>

        {/* Progress to Next Milestone */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4">下一阶段进度</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {totalData.toFixed(0)} / {nextMilestone.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-primary">{Math.round(progressToNextMilestone)}%</span>
            </div>
            <div className="merit-progress">
              <div
                className="merit-progress-fill"
                style={{ width: `${progressToNextMilestone}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            还需要 {Math.max(0, nextMilestone - totalData).toFixed(0)} {activity.unit} 即可升级
          </p>
        </Card>

        {/* Historical Chart */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            近30天趋势
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                dot={{ fill: "var(--primary)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Badge Progress */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">奖章进度</h2>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center border-2 transition-all ${
                  currentStage > i
                    ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50"
                    : "bg-muted/5 border-muted/30 opacity-50"
                }`}
              >
                <div className="text-2xl mb-2">{currentStage > i ? "🏅" : "🔒"}</div>
                <p className="text-xs font-semibold">{BADGE_LEVELS[i]}</p>
                <p className="text-xs text-muted-foreground">{(activityMilestones[i] ?? 0).toLocaleString()} {activity.unit}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function HealthAdvisor() {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user stats
  const { data: stats, error: statsError } = trpc.merit.getUserStats.useQuery(undefined, {
    retry: false,
  });

  // Fetch health advice
  const { data: advice, refetch: refetchAdvice, error: adviceError } = trpc.advisor.getPersonalizedAdvice.useQuery(
    undefined,
    { enabled: !!stats, retry: false },
  );

  if (statsError) {
    console.log("[Advisor] Using demo mode - stats error:", statsError);
  }
  if (adviceError) {
    console.log("[Advisor] Using demo mode - advice error:", adviceError);
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refetchAdvice();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">健康顾问</h1>
          <p className="text-muted-foreground">
            基于你的修行数据，获得个性化的健康建议和功德提升策略
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{stats.totalMerit}</div>
              <p className="text-xs text-muted-foreground">总功德分数</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{stats.badgeCount}</div>
              <p className="text-xs text-muted-foreground">已获奖章</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {stats.totalMerit > 50000 ? "优秀" : stats.totalMerit > 20000 ? "良好" : "进行中"}
              </div>
              <p className="text-xs text-muted-foreground">修行等级</p>
            </Card>
          </div>
        )}

        {/* Main Advice Card */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">✨</div>
            <div>
              <h2 className="text-2xl font-serif font-semibold text-primary mb-1">
                你的个性化健康建议
              </h2>
              <p className="text-sm text-muted-foreground">
                基于你的健康数据和修行进度生成
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin mr-2">⚡</div>
              <p className="text-muted-foreground">生成建议中...</p>
            </div>
          ) : advice ? (
            <div className="prose prose-sm max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {advice}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">点击下方按钮生成你的个性化建议</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button onClick={handleRefresh} disabled={isLoading} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              {isLoading ? "生成中..." : "生成建议"}
            </Button>
            <Button variant="outline" className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              分享建议
            </Button>
          </div>
        </Card>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              功德提升技巧
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 保持每日活动的一致性，稳定的习惯带来持续的功德</li>
              <li>• 优先完成多个活动的基础目标，而非单一活动的极限</li>
              <li>• 关注心率预警，保持健康的运动强度</li>
              <li>• 每周回顾进度，调整策略以适应你的生活节奏</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              修行境界
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">初心者 (0-5000)</p>
                <p className="text-muted-foreground">开始你的修行之旅</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">精进者 (5000-50000)</p>
                <p className="text-muted-foreground">稳定的健康习惯</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">功德圆满 (50000+)</p>
                <p className="text-muted-foreground">达到身心灵平衡</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/10 rounded-lg border border-muted/20">
          <p className="text-xs text-muted-foreground">
            💬 本建议由 AI 生成，仅供参考。如有健康问题，请咨询专业医疗人士。功德修行是一个长期的过程，请耐心坚持。
          </p>
        </div>
      </div>
    </div>
  );
}

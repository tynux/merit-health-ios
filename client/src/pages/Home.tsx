import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Award, Activity, Zap, Heart } from "lucide-react";

export default function Home() {
  // 演示模式：直接显示已认证的内容
  const user = { name: "访客" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-primary">功德圆满</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Link href="/dashboard">
              <Button>进入仪表盘</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container py-20">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-serif font-bold text-primary mb-4">
            通过健康修行 获得功德圆满
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            将日常健康活动转化为功德分数，收集奖章，实现身心灵的完美平衡。
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                开始修行
              </Button>
            </Link>
            <Link href="/badges">
              <Button size="lg" variant="outline">
                查看奖章
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-16">
        <h3 className="text-3xl font-serif font-bold text-primary mb-12 text-center">
          核心功能
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Activity className="w-8 h-8" />,
              title: "健康追踪",
              desc: "同步 12 项健康指标，实时追踪日常活动",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "功德积累",
              desc: "每项活动都能获得功德分数，越努力收获越多",
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "奖章系统",
              desc: "135 个独特奖章，见证您的修行之路",
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "智能建议",
              desc: "AI 生成个性化健康建议，优化修行策略",
            },
          ].map((feature, idx) => (
            <Card key={idx} className="merit-card p-6">
              <div className="text-primary mb-4">{feature.icon}</div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="container py-16">
        <h3 className="text-3xl font-serif font-bold text-primary mb-12 text-center">
          12 项健康活动
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: "👣", name: "步数" },
            { icon: "🔥", name: "能量消耗" },
            { icon: "😴", name: "睡眠" },
            { icon: "🚶", name: "走路" },
            { icon: "🏊", name: "游泳" },
            { icon: "🚴", name: "自行车" },
            { icon: "🏃", name: "跑步" },
            { icon: "🧍", name: "站立" },
            { icon: "🧘", name: "正念" },
            { icon: "☀️", name: "晒太阳" },
            { icon: "🧼", name: "洗手" },
            { icon: "🪜", name: "爬楼梯" },
          ].map((activity, idx) => (
            <Card key={idx} className="p-4 text-center hover:border-primary/50 transition-colors">
              <div className="text-4xl mb-2">{activity.icon}</div>
              <p className="text-sm font-medium">{activity.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-12 text-center">
          <h3 className="text-3xl font-serif font-bold text-primary mb-4">
            准备好开始修行了吗？
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            每一次健康的选择都会为您积累功德，让我们一起走向功德圆满的境界。
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              立即开始
            </Button>
          </Link>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>功德圆满 • 通过健康修行实现身心灵平衡</p>
        </div>
      </div>
    </div>
  );
}

import { invokeLLM } from "./_core/llm";

/**
 * User health profile for generating personalized advice
 */
export interface UserHealthProfile {
  userId: number;
  totalMerit: number;
  badgeCount: number;
  activities: {
    type: string;
    name: string;
    totalData: number;
    currentStage: number;
    dailyAverage: number;
    target: number;
  }[];
  recentAchievements: string[];
  deductionReasons?: string[];
}

/**
 * Generate personalized health advice using LLM
 */
export async function generateHealthAdvice(profile: UserHealthProfile): Promise<string> {
  const activitySummary = profile.activities
    .map(
      (a) =>
        `${a.name}: 累计 ${a.totalData.toFixed(1)} ${a.type === "sleep" ? "小时" : a.type === "mindfulness" || a.type === "sunExposure" ? "分钟" : a.type === "handwash" ? "次" : "单位"}, 日均 ${a.dailyAverage.toFixed(1)}, 目标 ${a.target}`,
    )
    .join("\n");

  const deductionInfo =
    profile.deductionReasons && profile.deductionReasons.length > 0
      ? `\n最近的扣减原因：${profile.deductionReasons.join("、")}`
      : "";

  const prompt = `你是一位专业的健康顾问和功德修行指导师。基于用户的健康数据和修行进度，提供个性化的健康建议和功德提升策略。

用户信息：
- 总功德分数：${profile.totalMerit}
- 已获奖章：${profile.badgeCount} 个
- 最近成就：${profile.recentAchievements.length > 0 ? profile.recentAchievements.join("、") : "暂无"}${deductionInfo}

健康活动数据：
${activitySummary}

请基于以上数据，用温暖、鼓励的语气，用中文提供：
1. 对用户当前健康状态的评价（1-2句）
2. 3-5 条具体的、可行的健康改进建议
3. 针对未达标活动的优化策略
4. 关于功德修行的哲学性建议（1-2句，体现禅意）

回复应该温暖、鼓励、具有启发性，长度控制在 300-400 字以内。`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "你是一位温暖、富有同情心的健康顾问和功德修行指导师。你的建议应该既实用又富有启发性，帮助用户改善健康并实现功德圆满。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }

    return "感谢你的坚持修行。继续保持健康的生活方式，功德自然会圆满。";
  } catch (error) {
    console.error("Error generating health advice:", error);
    return "感谢你的坚持修行。继续保持健康的生活方式，功德自然会圆满。";
  }
}

/**
 * Generate achievement summary for daily settlement
 */
export async function generateDailySummary(
  activities: {
    name: string;
    achieved: boolean;
    progress: number;
    target: number;
  }[],
  totalMeritEarned: number,
  totalMeritDeducted: number,
): Promise<string> {
  const achievedActivities = activities.filter((a) => a.achieved).map((a) => a.name);
  const unachievedActivities = activities.filter((a) => !a.achieved).map((a) => a.name);

  const prompt = `作为功德修行的见证者，请根据以下今日修行数据生成一份简短的、鼓励性的每日总结。

今日成就：
- 达成活动：${achievedActivities.length > 0 ? achievedActivities.join("、") : "暂无"}
- 未达成活动：${unachievedActivities.length > 0 ? unachievedActivities.join("、") : "全部达成"}
- 获得功德：${totalMeritEarned}
- 扣减功德：${totalMeritDeducted}
- 净功德：${totalMeritEarned - totalMeritDeducted}

请用温暖、鼓励的语气，用中文提供一份 50-100 字的每日修行总结，包含：
1. 对今日表现的评价
2. 一句鼓励的话语
3. 对明天的期许

语气应该温暖、禅意、富有启发性。`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "你是一位温暖的功德修行指导师。你的总结应该既肯定用户的努力，又温柔地鼓励他们继续前进。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }

    return "感谢今日的修行。每一步都是向功德圆满迈进的过程。明天继续加油！";
  } catch (error) {
    console.error("Error generating daily summary:", error);
    return "感谢今日的修行。每一步都是向功德圆满迈进的过程。明天继续加油！";
  }
}

/**
 * Generate personalized badge achievement message
 */
export async function generateBadgeMessage(badgeName: string, activityName: string): Promise<string> {
  const prompt = `你是一位功德修行的见证者。用户刚刚获得了一个新的功德奖章。

奖章名称：${badgeName}
相关活动：${activityName}

请用温暖、庄严、鼓励的语气，用中文提供一条 30-50 字的祝贺信息，表达对用户这项成就的认可，并鼓励他们继续修行。`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "你是一位温暖、庄严的功德修行见证者。你的祝贺应该既真挚又富有启发性，帮助用户感受到他们成就的意义。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }

    return `恭喜获得 ${badgeName}！这是你在 ${activityName} 修行中的重要里程碑。继续坚持，功德圆满指日可待。`;
  } catch (error) {
    console.error("Error generating badge message:", error);
    return `恭喜获得 ${badgeName}！这是你在 ${activityName} 修行中的重要里程碑。继续坚持，功德圆满指日可待。`;
  }
}

import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";

/**
 * Badge metadata for different types
 */
export interface BadgeMetadata {
  type: string;
  name: string;
  description: string;
  style: "first" | "progress" | "period";
  activity?: string;
  level?: number;
}

/**
 * Generate prompt for badge image based on metadata
 */
function generateBadgePrompt(metadata: BadgeMetadata): string {
  const baseStyle =
    "新中式禅意风格，精致优雅，柔和的薰衣草紫、腮红粉和淡薄荷绿色调，高质量插画，透明背景";

  if (metadata.style === "first") {
    return `${baseStyle}。设计一个"初缘纪念"奖章，代表首次完成${metadata.activity}活动。使用星形或花朵形状，中央有${metadata.activity}的象征性图案，周围有细致的几何装饰纹样。`;
  }

  if (metadata.style === "progress") {
    const levelNames = [
      "铜",
      "银",
      "金",
      "琉璃",
      "翡翠",
      "玛瑙",
      "琥珀",
      "珍珠",
      "钻石",
      "功德圆满",
    ];
    const levelName = levelNames[metadata.level! - 1] || "功德圆满";
    return `${baseStyle}。设计一个"${levelName}级"进阶奖章，代表${metadata.activity}活动的第${metadata.level}阶段成就。使用圆形或盾形设计，中央展示${levelName}的视觉特征（如${levelName}的颜色和质感），周围有${metadata.level}个装饰星点。`;
  }

  if (metadata.style === "period") {
    const periodName =
      metadata.type === "weekly"
        ? "周"
        : metadata.type === "monthly"
          ? "月"
          : "年";
    return `${baseStyle}。设计一个"${periodName}功德奖章"，代表${periodName}度功德成就。使用皇冠或奖杯形状，中央有${periodName}字或相关时间象征，周围有光晕和精致的装饰元素。`;
  }

  return baseStyle;
}

/**
 * Generate badge image and upload to S3
 */
export async function generateAndUploadBadge(
  userId: number,
  metadata: BadgeMetadata
): Promise<{ url: string; key: string } | null> {
  try {
    // Generate image using LLM
    const prompt = generateBadgePrompt(metadata);
    const { url: imageUrl } = await generateImage({
      prompt,
    });

    if (!imageUrl) {
      console.error("Failed to generate badge image");
      return null;
    }

    // Download the image and upload to S3
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Create unique key for badge
    const badgeKey = `badges/${userId}/${metadata.type}-${Date.now()}.png`;

    // Upload to S3
    const { url, key } = await storagePut(badgeKey, Buffer.from(buffer), "image/png");

    return { url, key };
  } catch (error) {
    console.error("Error generating badge:", error);
    return null;
  }
}

/**
 * Generate all badge types for a user
 */
export async function generateUserBadges(userId: number): Promise<void> {
  const activities = [
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
    "stairs",
  ];

  const levelNames = [
    "铜",
    "银",
    "金",
    "琉璃",
    "翡翠",
    "玛瑙",
    "琥珀",
    "珍珠",
    "钻石",
    "功德圆满",
  ];

  // Generate first achievement badges
  for (const activity of activities) {
    await generateAndUploadBadge(userId, {
      type: `${activity}_first`,
      name: `首次${activity}`,
      description: `首次完成${activity}活动`,
      style: "first",
      activity,
    });
  }

  // Generate progress badges
  for (const activity of activities) {
    for (let level = 1; level <= 10; level++) {
      await generateAndUploadBadge(userId, {
        type: `${activity}_${level}`,
        name: `${activity}${levelNames[level - 1]}`,
        description: `${activity}活动第${level}阶段`,
        style: "progress",
        activity,
        level,
      });
    }
  }

  // Generate period badges
  for (const period of ["weekly", "monthly", "yearly"]) {
    await generateAndUploadBadge(userId, {
      type: period,
      name: `${period}功德奖章`,
      description: `${period}度功德成就`,
      style: "period",
    });
  }
}

/**
 * Get badge icon URL (fallback to emoji if generation fails)
 */
export function getBadgeIcon(badgeType: string): string {
  // Map badge types to emoji icons
  const iconMap: Record<string, string> = {
    // First achievement badges
    steps_first: "👣",
    energyBurned_first: "🔥",
    sleep_first: "😴",
    walking_first: "🚶",
    swimming_first: "🏊",
    cycling_first: "🚴",
    running_first: "🏃",
    standing_first: "🧍",
    mindfulness_first: "🧘",
    sunExposure_first: "☀️",
    handwash_first: "🧼",
    stairs_first: "🪜",

    // Period badges
    weekly: "📅",
    monthly: "📊",
    yearly: "🏆",
  };

  // Check if it's a progress badge (activity_level)
  const progressMatch = badgeType.match(/^(\w+)_(\d+)$/);
  if (progressMatch) {
    const activity = progressMatch[1];
    const level = parseInt(progressMatch[2]);
    const levelEmoji = ["🥉", "🥈", "🥇", "💎", "💚", "🌟", "✨", "🎆", "👑", "🌈"];
    return levelEmoji[level - 1] || "🏅";
  }

  return iconMap[badgeType] || "🏅";
}

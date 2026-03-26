CREATE TABLE `activity_merit_record` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`activityType` enum('steps','energyBurned','sleep','walking','swimming','cycling','running','standing','mindfulness','sunExposure','handwash','stairs') NOT NULL,
	`dataValue` decimal(15,2) NOT NULL,
	`unit` varchar(20) NOT NULL,
	`baseMerit` int DEFAULT 0,
	`bonusMerit` int DEFAULT 0,
	`totalMerit` int DEFAULT 0,
	`isFirstAchievement` boolean DEFAULT false,
	`firstAchievementBonus` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_merit_record_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityType` enum('steps','energyBurned','sleep','walking','swimming','cycling','running','standing','mindfulness','sunExposure','handwash','stairs') NOT NULL,
	`totalData` decimal(20,2) DEFAULT '0',
	`currentStage` int DEFAULT 0,
	`milestonesReached` json DEFAULT ('[]'),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activity_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('steps_first','energyBurned_first','sleep_first','walking_first','swimming_first','cycling_first','running_first','standing_first','mindfulness_first','sunExposure_first','handwash_first','stairs_first','steps_1','steps_2','steps_3','steps_4','steps_5','steps_6','steps_7','steps_8','steps_9','steps_10','energyBurned_1','energyBurned_2','energyBurned_3','energyBurned_4','energyBurned_5','energyBurned_6','energyBurned_7','energyBurned_8','energyBurned_9','energyBurned_10','sleep_1','sleep_2','sleep_3','sleep_4','sleep_5','sleep_6','sleep_7','sleep_8','sleep_9','sleep_10','walking_1','walking_2','walking_3','walking_4','walking_5','walking_6','walking_7','walking_8','walking_9','walking_10','swimming_1','swimming_2','swimming_3','swimming_4','swimming_5','swimming_6','swimming_7','swimming_8','swimming_9','swimming_10','cycling_1','cycling_2','cycling_3','cycling_4','cycling_5','cycling_6','cycling_7','cycling_8','cycling_9','cycling_10','running_1','running_2','running_3','running_4','running_5','running_6','running_7','running_8','running_9','running_10','standing_1','standing_2','standing_3','standing_4','standing_5','standing_6','standing_7','standing_8','standing_9','standing_10','mindfulness_1','mindfulness_2','mindfulness_3','mindfulness_4','mindfulness_5','mindfulness_6','mindfulness_7','mindfulness_8','mindfulness_9','mindfulness_10','sunExposure_1','sunExposure_2','sunExposure_3','sunExposure_4','sunExposure_5','sunExposure_6','sunExposure_7','sunExposure_8','sunExposure_9','sunExposure_10','handwash_1','handwash_2','handwash_3','handwash_4','handwash_5','handwash_6','handwash_7','handwash_8','handwash_9','handwash_10','stairs_1','stairs_2','stairs_3','stairs_4','stairs_5','stairs_6','stairs_7','stairs_8','stairs_9','stairs_10','weekly','monthly','yearly') NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`iconUrl` text,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_health_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`steps` int DEFAULT 0,
	`energyBurned` decimal(10,2) DEFAULT '0',
	`sleepHours` decimal(5,2) DEFAULT '0',
	`walkingDistance` decimal(10,2) DEFAULT '0',
	`swimmingDistance` decimal(10,2) DEFAULT '0',
	`cyclingDistance` decimal(10,2) DEFAULT '0',
	`runningDistance` decimal(10,2) DEFAULT '0',
	`standingHours` int DEFAULT 0,
	`mindfulnessMinutes` int DEFAULT 0,
	`sunExposureMinutes` int DEFAULT 0,
	`handwashCount` int DEFAULT 0,
	`stairsClimbed` int DEFAULT 0,
	`maxHeartRate` int DEFAULT 0,
	`avgHeartRate` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_health_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_merit_record` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`baseMerit` int DEFAULT 0,
	`bonusMerit` int DEFAULT 0,
	`totalEarned` int DEFAULT 0,
	`heartRateDeduction` int DEFAULT 0,
	`lazinessDeduction` int DEFAULT 0,
	`totalDeducted` int DEFAULT 0,
	`netMerit` int DEFAULT 0,
	`deductionReasons` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_merit_record_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `health_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`suggestion` text NOT NULL,
	`meritStrategy` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `health_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `heart_rate_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`heartRate` int NOT NULL,
	`threshold` int NOT NULL,
	`meritDeducted` int DEFAULT 50,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `heart_rate_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `gender` enum('male','female') DEFAULT 'male';--> statement-breakpoint
ALTER TABLE `users` ADD `totalMerit` int DEFAULT 0 NOT NULL;
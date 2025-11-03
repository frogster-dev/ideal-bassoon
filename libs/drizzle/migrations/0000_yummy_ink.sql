CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`difficulty` integer NOT NULL,
	`number_of_exercices` integer NOT NULL,
	`exercise_duration` integer NOT NULL,
	`pause_duration` integer NOT NULL,
	`total_duration` integer NOT NULL,
	`exercices` text NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

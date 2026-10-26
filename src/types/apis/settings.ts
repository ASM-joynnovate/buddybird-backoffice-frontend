import { timeSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const sleepSchema = z.object({ sleep_at: timeSchema, wake_at: timeSchema });

const communitySettingsSchema = z.object({
	leaderboard_enabled: z.boolean(),
	feed_enabled: z.boolean(),
});

export const settingsSchema = z.object({ sleep: sleepSchema, community: communitySettingsSchema });

export type Settings = z.infer<typeof settingsSchema>;

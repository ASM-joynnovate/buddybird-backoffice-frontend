import { timeSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const sleepSchema = z.object({ sleep_at: timeSchema, wake_at: timeSchema });

export const settingsSchema = z.object({
	sleep: sleepSchema,
	notifications: z.object({
		push_enabled: z.boolean(),
		announcement_enabled: z.boolean(),
		report_enabled: z.boolean(),
		marketing_enabled: z.boolean(),
		marketing_night_enabled: z.boolean(),
	}),
});

export type Settings = z.infer<typeof settingsSchema>;

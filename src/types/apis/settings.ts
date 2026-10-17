import { timeSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const sleepSchema = z.object({ sleep_at: timeSchema, wake_at: timeSchema });

export const settingsSchema = z.object({ sleep: sleepSchema });

export type Settings = z.infer<typeof settingsSchema>;

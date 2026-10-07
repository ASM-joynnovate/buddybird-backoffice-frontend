import { i18nSchema } from '@/types/apis/common';

import { z } from 'zod';

export const platformSchema = z.enum(['ios', 'android']);

export const appUpdateSchema = z.object({
	latest: z.object({ version: z.string(), release_notes: i18nSchema.nullable() }),
	min_supported: z.object({ version: z.string() }),
});

export type Platform = z.infer<typeof platformSchema>;
export type AppUpdate = z.infer<typeof appUpdateSchema>;

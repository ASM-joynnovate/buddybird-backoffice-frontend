import { i18nSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const platformSchema = z.enum(['ios', 'android']);

export const appUpdateSchema = z.object({
	id: uuidSchema,
	platform: platformSchema,
	version: z.string(),
	is_forced: z.boolean(),
	release_notes: i18nSchema.nullable(),
	created_at: timestampSchema,
});

const createAppUpdateRequestSchema = z.object({
	platform: platformSchema,
	version: z.string(),
	is_forced: z.boolean(),
	release_notes: i18nSchema.nullable(),
});

const updateAppUpdateRequestSchema = createAppUpdateRequestSchema.omit({ platform: true }).partial();

export type Platform = z.infer<typeof platformSchema>;
export type AppUpdate = z.infer<typeof appUpdateSchema>;
export type CreateAppUpdateRequest = z.infer<typeof createAppUpdateRequestSchema>;
export type UpdateAppUpdateRequest = z.infer<typeof updateAppUpdateRequestSchema>;

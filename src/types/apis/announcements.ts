import { i18nSchema } from '@/types/apis/common';
import { timeSchema, timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const announcementSchema = z.object({
	id: uuidSchema,
	title: i18nSchema,
	body: i18nSchema.nullable(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
	push_enabled: z.boolean(),
	push_local_time: timeSchema.nullable(),
	push_prepared_at: timestampSchema.nullable(),
	images: z.array(z.object({ id: uuidSchema, url: z.string() })),
});

const updateAnnouncementRequestSchema = z.object({
	title: i18nSchema,
	body: i18nSchema.nullable(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
});

const createAnnouncementRequestSchema = updateAnnouncementRequestSchema.extend({
	push_enabled: z.boolean(),
	push_local_time: timeSchema.nullable(),
});

export type Announcement = z.infer<typeof announcementSchema>;
export type CreateAnnouncementRequest = z.infer<typeof createAnnouncementRequestSchema>;
export type UpdateAnnouncementRequest = z.infer<typeof updateAnnouncementRequestSchema>;

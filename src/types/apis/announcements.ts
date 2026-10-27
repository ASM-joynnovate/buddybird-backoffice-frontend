import { i18nSchema, type SortOrder } from '@/types/apis/common';
import { countrySchema, timeSchema, timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const announcementSortSchema = z.enum(['starts_at', 'read_count']);

export const announcementSchema = z.object({
	id: uuidSchema,
	title: i18nSchema,
	body: i18nSchema.nullable(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
	countries: z.array(countrySchema),
	push_enabled: z.boolean(),
	push_local_time: timeSchema.nullable(),
	push_prepared_at: timestampSchema.nullable(),
	images: z.array(z.object({ id: uuidSchema, file_id: uuidSchema, url: z.string() })),
});

export const announcementListItemSchema = announcementSchema.extend({
	read_count: z.number().int(),
	user_count: z.number().int(),
});

const updateAnnouncementRequestSchema = z.object({
	title: i18nSchema,
	body: i18nSchema.nullable(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
	countries: z.array(countrySchema).optional(),
	image_file_ids: z.array(uuidSchema),
	push_enabled: z.boolean().optional(),
	push_local_time: timeSchema.nullable().optional(),
});

const createAnnouncementRequestSchema = updateAnnouncementRequestSchema.extend({
	countries: z.array(countrySchema),
	push_enabled: z.boolean(),
	push_local_time: timeSchema.nullable(),
});

export type AnnouncementSort = z.infer<typeof announcementSortSchema>;
export type Announcement = z.infer<typeof announcementSchema>;
export type AnnouncementListItem = z.infer<typeof announcementListItemSchema>;
export type CreateAnnouncementRequest = z.infer<typeof createAnnouncementRequestSchema>;
export type UpdateAnnouncementRequest = z.infer<typeof updateAnnouncementRequestSchema>;

export interface AnnouncementListParams {
	page: number;
	count_by_page?: number;
	is_ended: boolean;
	sort?: AnnouncementSort;
	order?: SortOrder;
}

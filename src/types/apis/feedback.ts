import type { Platform } from '@/types/apis/app-updates';
import { fileSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const feedbackLocaleSchema = z.enum(['ko-KR', 'en-US']);

export const feedbackSchema = z.object({
	id: uuidSchema,
	user_id: uuidSchema,
	device_id: uuidSchema,
	message: z.string(),
	app_version: z.string(),
	created_at: timestampSchema,
	is_unsupported: z.boolean(),
	user: z.object({
		nickname: z.string().nullable(),
		email: z.string().nullable(),
		is_anonymous: z.boolean(),
		is_deleted: z.boolean(),
		photo_file: fileSchema.nullable(),
	}),
	device: z.object({ platform: z.string(), os_version: z.string(), model: z.string(), locale: z.string() }),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export interface FeedbackListParams {
	page: number;
	count_by_page?: number;
	user_id?: string;
	keyword?: string;
	created_from?: string;
	created_to?: string;
	app_version?: string;
	platform?: Platform;
	locale?: z.infer<typeof feedbackLocaleSchema>;
}

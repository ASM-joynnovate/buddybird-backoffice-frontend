import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const feedbackSchema = z.object({
	id: uuidSchema,
	user_id: uuidSchema,
	device_id: uuidSchema,
	message: z.string(),
	app_version: z.string(),
	created_at: timestampSchema,
});

export type Feedback = z.infer<typeof feedbackSchema>;

export interface FeedbackListParams {
	page: number;
	count_by_page?: number;
	user_id?: string;
}

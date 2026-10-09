import { fileSchema, type SortOrder } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const withdrawalSortSchema = z.enum(['created_at', 'usage_period', 'session_count']);

export const withdrawalSchema = z.object({
	user_id: uuidSchema,
	providers: z.array(
		z.object({
			provider: z.enum(['google', 'apple', 'kakao']),
			status: z.enum(['not_required', 'pending', 'completed', 'unconfirmed']),
		}),
	),
	attempt_count: z.number().int(),
	last_error_code: z.string().nullable(),
	next_attempt_at: timestampSchema.nullable(),
	completed_at: timestampSchema.nullable(),
	created_at: timestampSchema,
});

export const withdrawalListItemSchema = withdrawalSchema.extend({
	status: z.enum(['running', 'retrying', 'stopped', 'completed']),
	steps: z.array(
		z.object({
			step: z.enum(['apple', 'google', 'kakao', 'account']),
			status: z.enum(['waiting', 'running', 'failed', 'completed', 'unconfirmed']),
		}),
	),
	user: z.object({
		nickname: z.string().nullable(),
		email: z.string().nullable(),
		is_anonymous: z.boolean(),
		photo_file: fileSchema.nullable(),
		created_at: timestampSchema,
		session_count: z.number().int(),
		last_session_started_at: timestampSchema.nullable(),
		last_seen_device: z
			.object({
				platform: z.string(),
				app_version: z.string(),
				is_unsupported: z.boolean(),
				last_seen_at: timestampSchema.nullable(),
			})
			.nullable(),
		device_count: z.number().int(),
		feedback_count: z.number().int(),
		last_feedback_message: z.string().nullable(),
	}),
});

export type WithdrawalSort = z.infer<typeof withdrawalSortSchema>;
export type WithdrawalListItem = z.infer<typeof withdrawalListItemSchema>;
export type WithdrawalStep = WithdrawalListItem['steps'][number];

export interface WithdrawalListParams {
	page: number;
	count_by_page?: number;
	is_completed?: boolean;
	created_from?: string;
	created_to?: string;
	sort?: WithdrawalSort;
	order?: SortOrder;
}

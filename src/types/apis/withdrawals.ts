import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

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

export type Withdrawal = z.infer<typeof withdrawalSchema>;

export interface WithdrawalListParams {
	page: number;
	is_completed?: boolean;
}

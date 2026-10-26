import { fileSchema } from '@/types/apis/common';
import { feedItemKindSchema } from '@/types/apis/feed';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { parrotSchema, userSchema } from '@/types/apis/users';

import { z } from 'zod';

export const abuseReportSchema = z.object({
	id: uuidSchema,
	reporter: userSchema.omit({ photo_file: true }),
	reported_user: userSchema.extend({ parrots: z.array(parrotSchema) }),
	feed_item: z
		.object({
			id: uuidSchema,
			kind: feedItemKindSchema,
			word_name: z.string().nullable(),
			file: fileSchema.nullable(),
			threshold: z.number().int().nullable(),
			is_deleted: z.boolean(),
		})
		.nullable(),
	reason: z.enum(['spam', 'inappropriate_content', 'harassment', 'other']),
	description: z.string().nullable(),
	handled_at: timestampSchema.nullable(),
	created_at: timestampSchema,
});

export type AbuseReport = z.infer<typeof abuseReportSchema>;

export interface AbuseReportListParams {
	page: number;
	count_by_page?: number;
	is_handled: boolean;
}

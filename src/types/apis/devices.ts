import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const deviceSchema = z.object({
	id: uuidSchema,
	client_device_id: uuidSchema,
	timezone: z.string().nullable(),
	locale: z.enum(['ko-KR', 'en-US']),
	last_seen_at: timestampSchema.nullable(),
	client: z.object({
		platform: z.string(),
		os_version: z.string(),
		model: z.string(),
		app_version: z.string(),
	}),
	push_registered: z.boolean(),
});

export type Device = z.infer<typeof deviceSchema>;

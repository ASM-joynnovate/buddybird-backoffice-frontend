import { timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { sleepSchema } from '@/types/apis/settings';

import { z } from 'zod';

export const sessionSchema = z.object({
	id: uuidSchema,
	status: z.enum(['running', 'finished']),
	station: z.object({ device_id: uuidSchema }),
	word: z.object({ id: uuidSchema }),
	schedule: z.object({
		ends_at: timestampSchema.nullable(),
		sleep: sleepSchema.nullable(),
	}),
	progress: z.object({
		current_phase: z.enum(['learning', 'rest', 'stress_care', 'sleeping']).nullable(),
		phase_started_at: timestampSchema.nullable(),
		last_heartbeat_at: timestampSchema.nullable(),
	}),
	period: z.object({
		started_at: timestampSchema,
		ended_at: timestampSchema.nullable(),
		ended_by: z.enum(['user', 'server']).nullable(),
	}),
	judgment: z.object({ status: z.enum(['pending', 'done']) }),
});

export type Session = z.infer<typeof sessionSchema>;

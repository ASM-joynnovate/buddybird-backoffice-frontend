import { timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { sleepSchema } from '@/types/apis/settings';

import { z } from 'zod';

export const sessionPhaseSchema = z.enum(['learning', 'rest', 'stress_care', 'sleeping']);

const sessionWordSchema = z.object({ id: uuidSchema, name: z.string() });

const sessionEndedReasonSchema = z.enum([
	'user',
	'scheduled',
	'heartbeat_expired',
	'logout',
	'device_deleted',
	'device_released',
]);

export const sessionSchema = z.object({
	id: uuidSchema,
	status: z.enum(['running', 'finished']),
	station: z.object({ device_id: uuidSchema }),
	word: sessionWordSchema,
	schedule: z.object({
		ends_at: timestampSchema.nullable(),
		sleep: sleepSchema.nullable(),
	}),
	progress: z.object({
		current_phase: sessionPhaseSchema.nullable(),
		phase_started_at: timestampSchema.nullable(),
		last_heartbeat_at: timestampSchema.nullable(),
	}),
	period: z.object({
		started_at: timestampSchema,
		ended_at: timestampSchema.nullable(),
		ended_by: z.enum(['user', 'server']).nullable(),
		ended_reason: sessionEndedReasonSchema.nullable(),
	}),
	judgment: z.object({ status: z.enum(['pending', 'done']) }),
	sounds: z.object({ parrot_count: z.number().int(), mimicry_count: z.number().int() }),
	disconnections: z.array(z.object({ started_at: timestampSchema, ended_at: timestampSchema.nullable() })),
	emergency_detections: z.array(timestampSchema),
});

export const sessionEventSchema = z.object({
	id: uuidSchema,
	kind: z.enum([
		'session_started',
		'learning_started',
		'learning_toggled',
		'learning_finished',
		'word_changed',
		'station_disconnected',
		'station_reconnected',
		'emergency_detected',
		'session_finished',
	]),
	occurred_at: timestampSchema,
	word: sessionWordSchema.nullable(),
	is_learning: z.boolean().nullable(),
});

export const sessionSoundSchema = z.object({ captured_at: timestampSchema, is_mimicry: z.boolean() });

export type SessionPhase = z.infer<typeof sessionPhaseSchema>;
export type SessionEndedReason = z.infer<typeof sessionEndedReasonSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type SessionEvent = z.infer<typeof sessionEventSchema>;
export type SessionSound = z.infer<typeof sessionSoundSchema>;

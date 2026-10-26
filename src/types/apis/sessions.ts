import { fileSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { sleepSchema } from '@/types/apis/settings';

import { z } from 'zod';

export const sessionPhaseSchema = z.enum(['learning', 'rest', 'stress_care', 'sleeping']);
export const correctnessSchema = z.enum(['correct', 'incorrect', 'none']);
export const sessionSoundKindSchema = z.enum(['not_parrot', 'parrot', 'mimic']);
export const sessionSoundLabelTargetSchema = z.enum(['parrot', 'mimic']);

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
	sounds: z.object({
		vad_count: z.number().int(),
		parrot_count: z.number().int(),
		mimic_count: z.number().int(),
	}),
	disconnections: z.array(z.object({ started_at: timestampSchema, ended_at: timestampSchema.nullable() })),
	distress_call_detections: z.array(timestampSchema),
	parrot_disappearances: z.array(timestampSchema),
});

const sessionEventUserReviewSchema = z.object({ is_correct: z.boolean(), updated_at: timestampSchema });

export const sessionEventSchema = z.object({
	id: uuidSchema,
	// 모르는 종류는 unknown으로 변환
	kind: z
		.enum([
			'session_started',
			'learning_started',
			'learning_toggled',
			'learning_finished',
			'word_changed',
			'station_disconnected',
			'station_reconnected',
			'distress_call_detected',
			'parrot_disappeared',
			'parrot_appeared',
			'session_finished',
			'unknown',
		])
		.catch('unknown'),
	occurred_at: timestampSchema,
	ended_at: timestampSchema.nullable(),
	word: sessionWordSchema.nullable(),
	sound_ids: z.array(uuidSchema),
	image: fileSchema.nullable(),
	video: fileSchema.nullable(),
	user_review: sessionEventUserReviewSchema.nullable(),
	is_learning: z.boolean().nullable(),
	is_correct: z.boolean().nullable(),
});

export const sessionEventDetailSchema = z.object({
	id: uuidSchema,
	is_correct: z.boolean().nullable(),
	labels: z.array(
		z.object({
			id: uuidSchema,
			is_correct: z.boolean().nullable(),
			operator_name: z.string(),
			memo: z.string().nullable(),
			created_at: timestampSchema,
		}),
	),
	user_review: sessionEventUserReviewSchema.nullable(),
});

export const sessionSoundSchema = z.object({
	id: uuidSchema,
	captured_at: timestampSchema,
	audio_file: fileSchema,
	duration_ms: z.number().int().nullable(),
	kind: sessionSoundKindSchema.nullable(),
	final_parrot_score: z.number().nullable(),
	final_mimic_score: z.number().nullable(),
	is_labeled: z.boolean(),
	user_review: z
		.object({ is_correct: z.boolean(), kind: sessionSoundKindSchema, updated_at: timestampSchema })
		.nullable(),
});

export const sessionSoundDetailSchema = sessionSoundSchema.extend({
	parrot_detections: z.array(
		z.object({
			model_version: z.string(),
			is_parrot: z.boolean(),
			score: z.number(),
			call_count: z.number().int(),
			chirp_count: z.number().int(),
			analyzed_at: timestampSchema,
		}),
	),
	mimic_judgments: z.array(
		z.object({
			model_version: z.string(),
			word_id: uuidSchema.nullable(),
			score: z.number(),
			judged_at: timestampSchema,
		}),
	),
	labels: z.array(
		z.object({
			id: uuidSchema,
			target: sessionSoundLabelTargetSchema,
			is_positive: z.boolean().nullable(),
			score: z.number().nullable(),
			operator_name: z.string(),
			memo: z.string().nullable(),
			created_at: timestampSchema,
		}),
	),
});

const cancelSessionLabelRequestSchema = z.object({
	memo: z.string().nullable(),
	operator_name: z.string(),
});

const updateSessionEventLabelRequestSchema = cancelSessionLabelRequestSchema.extend({ is_correct: z.boolean() });

const updateSessionSoundLabelRequestSchema = cancelSessionLabelRequestSchema.extend({
	is_positive: z.boolean(),
	score: z.number(),
});

export type SessionPhase = z.infer<typeof sessionPhaseSchema>;
export type Correctness = z.infer<typeof correctnessSchema>;
export type SessionSoundKind = z.infer<typeof sessionSoundKindSchema>;
export type SessionSoundLabelTarget = z.infer<typeof sessionSoundLabelTargetSchema>;
export type SessionEndedReason = z.infer<typeof sessionEndedReasonSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type SessionEvent = z.infer<typeof sessionEventSchema>;
export type SessionEventDetail = z.infer<typeof sessionEventDetailSchema>;
export type SessionSound = z.infer<typeof sessionSoundSchema>;
export type SessionSoundDetail = z.infer<typeof sessionSoundDetailSchema>;
export type CancelSessionLabelRequest = z.infer<typeof cancelSessionLabelRequestSchema>;
export type UpdateSessionEventLabelRequest = z.infer<typeof updateSessionEventLabelRequestSchema>;
export type UpdateSessionSoundLabelRequest = z.infer<typeof updateSessionSoundLabelRequestSchema>;

export interface SessionEventListParams {
	label?: Correctness[];
}

export interface SessionSoundListParams {
	kind?: SessionSoundKind[];
	user_review?: Correctness[];
}

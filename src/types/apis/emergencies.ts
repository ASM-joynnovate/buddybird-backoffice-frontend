import type { Platform } from '@/types/apis/app-updates';
import { fileSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const emergencyKindSchema = z.enum(['sound_emergency_detected', 'parrot_disappeared']);
export const emergencyNotificationStateSchema = z.enum(['read', 'unread', 'none']);

const emergencyNotificationSchema = z.object({ sent_at: timestampSchema, read_at: timestampSchema.nullable() });

const emergencySoundSchema = z.object({
	id: uuidSchema,
	captured_at: timestampSchema,
	audio_file: fileSchema,
	duration_ms: z.number().int().nullable(),
	analysis: z.object({ score: z.number() }).nullable(),
});

export const emergencySchema = z.object({
	id: uuidSchema,
	kind: emergencyKindSchema,
	occurred_at: timestampSchema,
	ended_at: timestampSchema.nullable(),
	session: z.object({
		id: uuidSchema,
		status: z.enum(['running', 'finished']),
		started_at: timestampSchema,
		ended_at: timestampSchema.nullable(),
	}),
	user: z.object({
		id: uuidSchema,
		nickname: z.string().nullable(),
		email: z.string().nullable(),
		is_anonymous: z.boolean(),
		is_deleted: z.boolean(),
		photo_file: fileSchema.nullable(),
	}),
	parrot: z.object({ name: z.string(), species: z.string(), photo_file: fileSchema.nullable() }).nullable(),
	parrot_count: z.number().int(),
	device: z.object({ platform: z.string(), model: z.string(), app_version: z.string() }),
	sound: z.object({ sounds: z.array(emergencySoundSchema), chirp_count: z.number().int() }).nullable(),
	vision: z
		.object({
			image: fileSchema.nullable(),
			video: fileSchema.nullable(),
			notification: emergencyNotificationSchema.nullable(),
			appeared: z
				.object({
					occurred_at: timestampSchema,
					image: fileSchema.nullable(),
					notification: emergencyNotificationSchema.nullable(),
				})
				.nullable(),
		})
		.nullable(),
});

export type EmergencyKind = z.infer<typeof emergencyKindSchema>;
export type EmergencyNotificationState = z.infer<typeof emergencyNotificationStateSchema>;
export type EmergencyNotification = z.infer<typeof emergencyNotificationSchema>;
export type EmergencySound = z.infer<typeof emergencySoundSchema>;
export type Emergency = z.infer<typeof emergencySchema>;

export interface EmergencyListParams {
	page: number;
	count_by_page?: number;
	user_id?: string;
	keyword?: string;
	occurred_from?: string;
	occurred_to?: string;
	kind?: EmergencyKind;
	is_ongoing?: boolean;
	notification?: EmergencyNotificationState;
	platform?: Platform;
}

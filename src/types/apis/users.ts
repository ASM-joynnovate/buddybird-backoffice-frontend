import { fileSchema, type SortOrder } from '@/types/apis/common';
import { deviceSchema } from '@/types/apis/devices';
import { localDateSchema, timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { sessionPhaseSchema } from '@/types/apis/sessions';
import { settingsSchema } from '@/types/apis/settings';
import { withdrawalSchema } from '@/types/apis/withdrawals';

import { z } from 'zod';

export const providerSchema = z.enum(['google', 'apple', 'kakao']);
export const userLastSessionSchema = z.enum(['today', 'within_7_days', 'within_30_days', 'over_30_days', 'none']);
export const userSortSchema = z.enum([
	'created_at',
	'recent_duration',
	'session_count',
	'status',
	'app_version',
	'parrot_count',
]);

const userSchema = z.object({
	id: uuidSchema,
	email: z.string().nullable(),
	nickname: z.string().nullable(),
	is_anonymous: z.boolean(),
	is_deleted: z.boolean(),
	created_at: timestampSchema,
	photo_file: fileSchema.nullable(),
});

export const userListItemSchema = userSchema.extend({
	first_parrot: z.object({ name: z.string(), species: z.string(), photo_file: fileSchema.nullable() }).nullable(),
	parrot_count: z.number().int(),
	running_session: z.object({ current_phase: sessionPhaseSchema.nullable() }).nullable(),
	last_seen_device: z
		.object({
			platform: z.string(),
			app_version: z.string(),
			is_unsupported: z.boolean(),
			last_seen_at: timestampSchema.nullable(),
		})
		.nullable(),
	device_count: z.number().int(),
	session_count: z.number().int(),
	daily_durations: z.array(z.object({ date: localDateSchema, duration_ms: z.number().int() })),
	is_pushable: z.boolean(),
	is_announcement_enabled: z.boolean(),
	is_marketing_enabled: z.boolean(),
});

const parrotSchema = z.object({
	id: uuidSchema,
	name: z.string(),
	species: z.string(),
	birthdate: localDateSchema.nullable(),
	photo_file: fileSchema.nullable(),
	created_at: timestampSchema,
});

export const userDetailSchema = userSchema.extend({
	providers: z.array(providerSchema),
	settings: settingsSchema.nullable(),
	parrots: z.array(parrotSchema),
	devices: z.array(deviceSchema),
	withdrawal: withdrawalSchema.nullable(),
});

export type Provider = z.infer<typeof providerSchema>;
export type UserLastSession = z.infer<typeof userLastSessionSchema>;
export type UserSort = z.infer<typeof userSortSchema>;
export type UserListItem = z.infer<typeof userListItemSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
export type Parrot = z.infer<typeof parrotSchema>;

export interface UserListParams {
	page: number;
	count_by_page?: number;
	user_ids?: string[];
	keyword?: string;
	is_deleted?: boolean;
	last_session?: UserLastSession;
	created_from?: string;
	created_to?: string;
	provider?: Provider;
	is_anonymous?: boolean;
	platform?: 'ios' | 'android';
	has_unsupported_device?: boolean;
	is_pushable?: boolean;
	is_marketing_enabled?: boolean;
	issue?: 'heartbeat_expired' | 'emergency_detected' | 'withdrawal_failed';
	sort?: UserSort;
	order?: SortOrder;
}

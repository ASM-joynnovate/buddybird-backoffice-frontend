import { i18nSchema } from '@/types/apis/common';
import { notificationKindSchema } from '@/types/apis/notifications';
import { localDateSchema, timestampSchema, uuidSchema } from '@/types/apis/primitives';
import { sessionPhaseSchema } from '@/types/apis/sessions';
import { providerSchema, userLastSessionSchema } from '@/types/apis/users';

import { z } from 'zod';

const dailyCountSchema = z.object({ date: localDateSchema, count: z.number().int() });

const dashboardNotificationSchema = z.object({
	kind: notificationKindSchema,
	title: i18nSchema,
	sent_at: timestampSchema,
	recipient_count: z.number().int(),
	read_count: z.number().int(),
});

export const dashboardSchema = z.object({
	sessions: z.object({
		count: z.number().int(),
		previous_count: z.number().int(),
		duration_ms: z.number().int(),
		average_duration_ms: z.number().int().nullable(),
		daily: z.array(dailyCountSchema),
	}),
	users: z.object({
		total_count: z.number().int(),
		active_count: z.number().int(),
		signup_count: z.number().int(),
		previous_signup_count: z.number().int(),
		daily_signups: z.array(dailyCountSchema),
	}),
	withdrawals: z.object({ count: z.number().int(), daily: z.array(dailyCountSchema) }),
	feedback: z.object({ count: z.number().int(), previous_count: z.number().int() }),
	notifications: z.object({
		kinds: z.array(
			z.object({ kind: notificationKindSchema, sent_count: z.number().int(), read_count: z.number().int() }),
		),
		recent: z.array(dashboardNotificationSchema),
		scheduled: z.array(dashboardNotificationSchema),
	}),
	announcements: z.array(
		z.object({ id: uuidSchema, title: i18nSchema, starts_at: timestampSchema, read_count: z.number().int() }),
	),
	devices: z.object({
		versions: z.array(z.object({ app_version: z.string(), count: z.number().int() })),
		unsupported_count: z.number().int(),
	}),
});

export const dashboardLiveSchema = z.object({
	generated_at: timestampSchema,
	sessions: z.object({
		running: z.object({
			count: z.number().int(),
			average_duration_ms: z.number().int().nullable(),
			phases: z.array(z.object({ phase: sessionPhaseSchema, count: z.number().int() })),
		}),
		today: z.object({
			started_count: z.number().int(),
			ended_count: z.number().int(),
			hourly: z.array(z.object({ start: timestampSchema, count: z.number().int() })),
		}),
		last_24_hours: z.object({
			heartbeat_expired_count: z.number().int(),
			emergency_detected_count: z.number().int(),
			judgment_failed_count: z.number().int(),
		}),
	}),
	withdrawals: z.object({ failed_count: z.number().int() }),
});

export const userDashboardSchema = z.object({
	users: z.object({
		total_count: z.number().int(),
		signup_count: z.number().int(),
		previous_signup_count: z.number().int(),
	}),
	withdrawals: z.object({ count: z.number().int(), previous_count: z.number().int() }),
	daily: z.array(
		z.object({
			date: localDateSchema,
			total_count: z.number().int(),
			signup_count: z.number().int(),
			withdrawal_count: z.number().int(),
			running_user_count: z.number().int(),
		}),
	),
	last_sessions: z.array(z.object({ last_session: userLastSessionSchema, count: z.number().int() })),
	accounts: z.object({
		providers: z.array(z.object({ provider: providerSchema, count: z.number().int() })),
		anonymous_count: z.number().int(),
	}),
	platforms: z.array(z.object({ platform: z.string(), count: z.number().int() })),
	push: z.object({ pushable_count: z.number().int(), unpushable_count: z.number().int() }),
	parrots: z.object({
		total_count: z.number().int(),
		species: z.array(z.object({ species: z.string(), count: z.number().int() })),
	}),
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DashboardLive = z.infer<typeof dashboardLiveSchema>;
export type UserDashboard = z.infer<typeof userDashboardSchema>;

export interface DashboardParams {
	date_from: string;
	date_to: string;
}

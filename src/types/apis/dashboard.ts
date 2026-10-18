import { fileSchema, i18nSchema } from '@/types/apis/common';
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
			distress_call_detected_count: z.number().int(),
			parrot_disappeared_count: z.number().int(),
			parrot_detection_failed_count: z.number().int(),
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
			dau: z.number().int(),
			wau: z.number().int(),
			mau: z.number().int(),
		}),
	),
	countries: z.array(z.object({ country: z.string().nullable(), count: z.number().int() })),
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

export const emergencyDashboardSchema = z.object({
	emergencies: z.object({
		count: z.number().int(),
		previous_count: z.number().int(),
		sound_count: z.number().int(),
		vision_count: z.number().int(),
	}),
	daily: z.array(z.object({ date: localDateSchema, sound_count: z.number().int(), vision_count: z.number().int() })),
	hourly: z.array(z.object({ hour: z.number().int(), count: z.number().int() })),
	users: z.array(
		z.object({
			id: uuidSchema,
			nickname: z.string().nullable(),
			photo_file: fileSchema.nullable(),
			sound_count: z.number().int(),
			vision_count: z.number().int(),
		}),
	),
	ongoing_count: z.number().int(),
	notifications: z.object({
		read_count: z.number().int(),
		unread_count: z.number().int(),
		none_count: z.number().int(),
	}),
	platforms: z.array(z.object({ platform: z.string(), count: z.number().int() })),
	session_count: z.number().int(),
	analyzed_sound_count: z.number().int(),
});

export const feedbackDashboardSchema = z.object({
	feedback: z.object({
		count: z.number().int(),
		previous_count: z.number().int(),
		writer_count: z.number().int(),
	}),
	daily: z.array(dailyCountSchema),
	app_versions: z.array(z.object({ app_version: z.string(), count: z.number().int() })),
	platforms: z.array(z.object({ platform: z.string(), count: z.number().int() })),
	locales: z.array(z.object({ locale: z.string(), count: z.number().int() })),
});

export const withdrawalDashboardSchema = z.object({
	withdrawals: z.object({ count: z.number().int(), previous_count: z.number().int() }),
	signup_count: z.number().int(),
	daily: z.array(dailyCountSchema),
	accounts: z.object({
		providers: z.array(z.object({ provider: providerSchema, count: z.number().int() })),
		anonymous_count: z.number().int(),
	}),
	platforms: z.array(z.object({ platform: z.string(), count: z.number().int() })),
	app_versions: z.array(z.object({ app_version: z.string(), count: z.number().int() })),
	usage_periods: z.array(
		z.object({
			usage_period: z.enum(['same_day', 'within_7_days', 'within_30_days', 'over_30_days']),
			count: z.number().int(),
		}),
	),
	session_ranges: z.array(
		z.object({ session_range: z.enum(['none', 'one_to_four', 'five_or_more']), count: z.number().int() }),
	),
	parrots: z.object({ registered_count: z.number().int(), unregistered_count: z.number().int() }),
	errors: z.array(z.object({ error_code: z.string(), count: z.number().int() })),
});

export const notificationDashboardSchema = z.object({
	notifications: z.object({ count: z.number().int(), previous_count: z.number().int() }),
	kinds: z.array(
		z.object({
			kind: notificationKindSchema,
			sent_count: z.number().int(),
			read_count: z.number().int(),
			push_sent_count: z.number().int(),
		}),
	),
	daily: z.array(
		z.object({
			date: localDateSchema,
			report_count: z.number().int(),
			announcement_count: z.number().int(),
			marketing_count: z.number().int(),
			urgent_count: z.number().int(),
			emergency_count: z.number().int(),
		}),
	),
});

export const appUpdateDashboardSchema = z.object({
	versions: z.array(z.object({ app_version: z.string(), count: z.number().int() })),
});

export const consentDashboardSchema = z.object({
	users: z.object({ total_count: z.number().int() }),
	decisions: z.object({
		granted_count: z.number().int(),
		denied_count: z.number().int(),
		waiting_count: z.number().int(),
	}),
	daily: z.array(
		z.object({ date: localDateSchema, granted_count: z.number().int(), denied_count: z.number().int() }),
	),
	versions: z.array(
		z.object({ version: z.number().int(), granted_count: z.number().int(), user_count: z.number().int() }),
	),
	platforms: z.array(
		z.object({ platform: z.string(), granted_count: z.number().int(), user_count: z.number().int() }),
	),
	locales: z.array(z.object({ locale: z.string(), granted_count: z.number().int(), user_count: z.number().int() })),
});

export const analyticsDashboardSchema = z.object({
	platforms: z.array(z.object({ platform: z.string(), count: z.number().int() })),
	app_versions: z.array(z.object({ app_version: z.string(), count: z.number().int() })),
	events: z.array(z.object({ name: z.string(), count: z.number().int(), user_count: z.number().int() })),
	onboarding: z.array(
		z.object({ step: z.string(), viewed_count: z.number().int(), completed_count: z.number().int() }),
	),
});

export const stabilityIssueSortSchema = z.enum(['date', 'freq', 'user']);
export const stabilityEnvironmentSchema = z.enum(['prod', 'dev', 'local']);
export const stabilityIssueLevelSchema = z.enum(['fatal', 'error', 'warning', 'info']);
export const stabilityIssuePrioritySchema = z.enum(['high', 'medium', 'low']);

const booleanTextSchema = z.enum(['true', 'false']).transform((value) => value === 'true');

// 주소의 쿼리에서 읽는 이슈 필터, 형식이 다른 값은 버림
export const stabilityIssueFiltersSchema = z.object({
	environment: stabilityEnvironmentSchema.optional().catch(undefined),
	project: z.string().regex(/^\S+$/).optional().catch(undefined),
	release: z.string().regex(/^\S+$/).optional().catch(undefined),
	level: stabilityIssueLevelSchema.optional().catch(undefined),
	priority: stabilityIssuePrioritySchema.optional().catch(undefined),
	min_user_count: z.coerce.number().int().min(1).optional().catch(undefined),
	is_new: booleanTextSchema.optional().catch(undefined),
	is_unhandled: booleanTextSchema.optional().catch(undefined),
	is_regressed: booleanTextSchema.optional().catch(undefined),
});

export const stabilityDashboardSchema = z.object({
	projects: z.array(
		z.object({
			project: z.string(),
			crash_free_user_rate: z.number().nullable(),
			crash_free_session_rate: z.number().nullable(),
			error_count: z.number().int(),
		}),
	),
	releases: z.array(
		z.object({
			release: z.string(),
			crash_free_user_rate: z.number().nullable(),
			user_count: z.number().int(),
		}),
	),
	issue_releases: z.array(z.object({ project: z.string(), release: z.string() })),
	issues: z.array(
		z.object({
			short_id: z.string(),
			project: z.string(),
			title: z.string(),
			culprit: z.string().nullable(),
			level: z.string(),
			substatus: z.string(),
			is_unhandled: z.boolean(),
			release: z.string().nullable(),
			count: z.number().int(),
			user_count: z.number().int(),
			first_seen: timestampSchema,
			last_seen: timestampSchema,
			url: z.string(),
		}),
	),
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DashboardLive = z.infer<typeof dashboardLiveSchema>;
export type UserDashboard = z.infer<typeof userDashboardSchema>;
export type FeedbackDashboard = z.infer<typeof feedbackDashboardSchema>;
export type EmergencyDashboard = z.infer<typeof emergencyDashboardSchema>;
export type WithdrawalDashboard = z.infer<typeof withdrawalDashboardSchema>;
export type NotificationDashboard = z.infer<typeof notificationDashboardSchema>;
export type AppUpdateDashboard = z.infer<typeof appUpdateDashboardSchema>;
export type ConsentDashboard = z.infer<typeof consentDashboardSchema>;
export type AnalyticsDashboard = z.infer<typeof analyticsDashboardSchema>;
export type StabilityIssueSort = z.infer<typeof stabilityIssueSortSchema>;
export type StabilityEnvironment = z.infer<typeof stabilityEnvironmentSchema>;
export type StabilityIssuePriority = z.infer<typeof stabilityIssuePrioritySchema>;
export type StabilityIssueFilters = z.infer<typeof stabilityIssueFiltersSchema>;
export type StabilityDashboard = z.infer<typeof stabilityDashboardSchema>;

export interface DashboardParams {
	date_from: string;
	date_to: string;
}

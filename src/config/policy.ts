import { DAY, MEGABYTE, MINUTE, SECOND } from '@/config/units';

export const API_TIMEOUT_MS = 30 * SECOND;

export const DEFAULT_STALE_TIME_MS = MINUTE;
export const DASHBOARD_LIVE_REFETCH_INTERVAL_MS = MINUTE;
export const USER_SESSION_REFETCH_INTERVAL_MS = 10 * SECOND;

export const PASSWORD_COOKIE_MAX_AGE_MS = 3 * DAY;
export const THEME_COOKIE_MAX_AGE_MS = 365 * DAY;

export const DASHBOARD_PERIODS = [7, 14, 30, 90];
export const DEFAULT_DASHBOARD_PERIOD = 14;
export const DASHBOARD_MAX_PERIOD_DAYS = 180;

export const USER_RECENT_ITEM_COUNT = 5;
export const VISIBLE_SPECIES_COUNT = 6;

export const PHASE_CYCLE = [
	{ phase: 'learning', durationMs: 10 * MINUTE },
	{ phase: 'rest', durationMs: 5 * MINUTE },
	{ phase: 'stress_care', durationMs: 5 * MINUTE },
] as const;

export const TIMELINE_MIN_VISIBLE_MS = 30 * MINUTE;
export const TIMELINE_MAX_SOUND_BAR_COUNT = 480;

export const DISPLAY_TIME_ZONE = 'Asia/Seoul';

export const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png'];
export const PRESET_WORD_AUDIO_CONTENT_TYPES = [
	'audio/mp4',
	'audio/x-m4a',
	'audio/m4a',
	'audio/wav',
	'audio/x-wav',
	'audio/mpeg',
];
export const PRESET_WORD_AUDIO_MAX_BYTES = 5 * MEGABYTE;

export const TITLE_MAX_LENGTH = 100;
export const NOTIFICATION_BODY_MAX_LENGTH = 500;
export const CONSENT_KIND_MAX_LENGTH = 50;
export const APP_VERSION_MAX_LENGTH = 12;
export const PRESET_WORD_NAME_MAX_LENGTH = 50;
export const KEYWORD_MAX_LENGTH = 100;
export const BROADCAST_MAX_USER_COUNT = 1000;

export const UUID_PATTERN = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';

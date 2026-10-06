import { DAY, MINUTE, SECOND } from '@/config/units';

export const API_TIMEOUT_MS = 30 * SECOND;

export const DEFAULT_STALE_TIME_MS = MINUTE;

export const PASSWORD_COOKIE_MAX_AGE_MS = 3 * DAY;

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

export const TITLE_MAX_LENGTH = 100;
export const NOTIFICATION_BODY_MAX_LENGTH = 500;
export const CONSENT_KIND_MAX_LENGTH = 50;
export const APP_VERSION_MAX_LENGTH = 12;
export const PRESET_WORD_NAME_MAX_LENGTH = 50;
export const USER_KEYWORD_MAX_LENGTH = 100;
export const BROADCAST_MAX_USER_COUNT = 1000;

export const UUID_PATTERN = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';

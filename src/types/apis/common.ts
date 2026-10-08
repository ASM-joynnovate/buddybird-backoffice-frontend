import { z } from 'zod';

export const apiErrorCodes = [
	'COMMON__RESOURCE_NOT_FOUND',
	'COMMON__FILE_SIZE_EXCEEDED',
	'COMMON__REQUEST_VALIDATION_ERROR',
	'COMMON__RESPONSE_VALIDATION_ERROR',
	'COMMON__INTERNAL_SERVER_ERROR',
	'BACKOFFICE__PASSWORD_MISSING',
	'BACKOFFICE__PASSWORD_INVALID',
	'AUTH__INVALID_TOKEN',
	'AUTH__SERVICE_UNAVAILABLE',
	'AUTH__WITHDRAWAL_SAVE_UNAVAILABLE',
	'USER__INVALID_PROFILE_PHOTO',
	'WORD__INVALID_RECORDING',
	'ANNOUNCEMENT__INVALID_PERIOD',
	'ANNOUNCEMENT__INVALID_BODY',
	'ANNOUNCEMENT__SAVE_UNAVAILABLE',
	'APP_UPDATE__SAVE_UNAVAILABLE',
	'CONSENT__ALREADY_PUBLISHED',
	'CONSENT__SAVE_UNAVAILABLE',
	'NOTIFICATION__SEND_FAILED',
	'NOTIFICATION__SAVE_UNAVAILABLE',
	'PRESET_WORD__DUPLICATE_NAME',
	'PRESET_WORD__SAVE_UNAVAILABLE',
] as const;

const clientErrorCodes = [
	'CLIENT__NETWORK',
	'CLIENT__TIMEOUT',
	'CLIENT__INVALID_RESPONSE',
	'CLIENT__UNKNOWN_ERROR',
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number] | (typeof clientErrorCodes)[number];

export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly code: ApiErrorCode,
		message: string,
	) {
		super(message);
		this.name = 'ApiError';
	}

	get retryable() {
		return this.status === 0 || this.status === 408 || this.status === 429 || this.status === 503;
	}

	get passwordRejected() {
		return this.code === 'BACKOFFICE__PASSWORD_MISSING' || this.code === 'BACKOFFICE__PASSWORD_INVALID';
	}
}

export const envelopeSchema = z.object({
	message: z.string(),
	data: z.unknown(),
	meta: z.unknown(),
});

export const errorBodySchema = z.object({
	error_code: z.string(),
	message: z.string(),
});

export const pageMetaSchema = z.object({
	current_page: z.number().int(),
	total_page_count: z.number().int(),
	is_first: z.boolean(),
	is_last: z.boolean(),
});

export const fileSchema = z.object({ url: z.string(), status: z.enum(['pending', 'uploaded', 'rejected']) });

export const i18nSchema = z.object({ ko_kr: z.string().nullable(), en_us: z.string() });

export type PageMeta = z.infer<typeof pageMetaSchema>;
export type I18nText = z.infer<typeof i18nSchema>;

export interface Page<T> {
	data: T[];
	meta: PageMeta;
}

export const countedPageMetaSchema = pageMetaSchema.extend({ total_count: z.number().int() });

export type CountedPageMeta = z.infer<typeof countedPageMetaSchema>;

export interface CountedPage<T> {
	data: T[];
	meta: CountedPageMeta;
}

import { i18nSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const consentSchema = z.object({
	id: uuidSchema,
	kind: z.string(),
	version: z.number().int(),
	title: i18nSchema,
	body: i18nSchema,
	is_required: z.boolean(),
	published_at: timestampSchema,
});

export const userConsentSchema = z.object({
	consent_id: uuidSchema,
	kind: z.string(),
	version: z.number().int(),
	status: z.enum(['granted', 'denied']),
	decided_at: timestampSchema,
	title: i18nSchema,
});

const updateConsentRequestSchema = z.object({
	title: i18nSchema,
	body: i18nSchema,
	is_required: z.boolean(),
	published_at: timestampSchema,
});

const createConsentRequestSchema = updateConsentRequestSchema.extend({ kind: z.string() });

export type Consent = z.infer<typeof consentSchema>;
export type UserConsent = z.infer<typeof userConsentSchema>;
export type CreateConsentRequest = z.infer<typeof createConsentRequestSchema>;
export type UpdateConsentRequest = z.infer<typeof updateConsentRequestSchema>;

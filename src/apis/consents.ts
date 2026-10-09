import {
	type Consent,
	consentSchema,
	type CreateConsentRequest,
	type UpdateConsentRequest,
} from '@/types/apis/consents';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getConsentList = async (): Promise<Consent[]> => {
	const { data: consents } = await apiRequest('/api/v1/backoffice/consents', z.array(consentSchema));

	return consents;
};

export const postConsent = async ({
	data,
	idempotencyKey,
}: {
	data: CreateConsentRequest;
	idempotencyKey: string;
}): Promise<Consent> => {
	const { data: consent } = await apiRequest('/api/v1/backoffice/consents', consentSchema, {
		method: 'POST',
		json: data,
		idempotencyKey,
	});

	return consent;
};

export const patchConsent = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateConsentRequest;
	idempotencyKey: string;
}): Promise<Consent> => {
	const { data: consent } = await apiRequest(`/api/v1/backoffice/consents/${id}`, consentSchema, {
		method: 'PATCH',
		json: data,
		idempotencyKey,
	});

	return consent;
};

export const deleteConsent = async ({ id, idempotencyKey }: { id: string; idempotencyKey: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/consents/${id}`, z.unknown(), { method: 'DELETE', idempotencyKey });
};

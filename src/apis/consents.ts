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

export const postConsent = async ({ data }: { data: CreateConsentRequest }): Promise<Consent> => {
	const { data: consent } = await apiRequest('/api/v1/backoffice/consents', consentSchema, {
		method: 'POST',
		json: data,
	});

	return consent;
};

export const patchConsent = async ({ id, data }: { id: string; data: UpdateConsentRequest }): Promise<Consent> => {
	const { data: consent } = await apiRequest(`/api/v1/backoffice/consents/${id}`, consentSchema, {
		method: 'PATCH',
		json: data,
	});

	return consent;
};

export const deleteConsent = async ({ id }: { id: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/consents/${id}`, z.unknown(), { method: 'DELETE' });
};

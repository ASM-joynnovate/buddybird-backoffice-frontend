import {
	type CancelSessionLabelRequest,
	type SessionEvent,
	type SessionEventDetail,
	sessionEventDetailSchema,
	type SessionEventListParams,
	sessionEventSchema,
	type SessionSound,
	type SessionSoundDetail,
	sessionSoundDetailSchema,
	type SessionSoundLabelTarget,
	type SessionSoundListParams,
	sessionSoundSchema,
	type UpdateSessionEventLabelRequest,
	type UpdateSessionSoundLabelRequest,
} from '@/types/apis/sessions';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

import { API_TIMEOUT_MS } from '@/config';

export const getSessionEventList = async ({
	id,
	...listParams
}: { id: string } & SessionEventListParams): Promise<SessionEvent[]> => {
	const { data: sessionEvents } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/events`,
		z.array(sessionEventSchema),
		{ searchParams: { ...listParams } },
	);

	return sessionEvents;
};

export const getSessionEvent = async ({
	id,
	eventId,
}: {
	id: string;
	eventId: string;
}): Promise<SessionEventDetail> => {
	const { data: sessionEvent } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/events/${eventId}`,
		sessionEventDetailSchema,
	);

	return sessionEvent;
};

export const putSessionEventLabel = async ({
	id,
	eventId,
	data,
	idempotencyKey,
}: {
	id: string;
	eventId: string;
	data: UpdateSessionEventLabelRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/sessions/${id}/events/${eventId}/label`, z.unknown(), {
		method: 'PUT',
		json: data,
		idempotencyKey,
	});
};

export const postSessionEventLabelCancel = async ({
	id,
	eventId,
	data,
	idempotencyKey,
}: {
	id: string;
	eventId: string;
	data: CancelSessionLabelRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/sessions/${id}/events/${eventId}/label/cancel`, z.unknown(), {
		method: 'POST',
		json: data,
		idempotencyKey,
	});
};

export const getSessionSoundList = async ({
	id,
	...listParams
}: { id: string } & SessionSoundListParams): Promise<SessionSound[]> => {
	const { data: sessionSounds } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/sounds`,
		z.array(sessionSoundSchema),
		{ searchParams: { ...listParams } },
	);

	return sessionSounds;
};

export const getSessionSound = async ({
	id,
	soundId,
}: {
	id: string;
	soundId: string;
}): Promise<SessionSoundDetail> => {
	const { data: sessionSound } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/sounds/${soundId}`,
		sessionSoundDetailSchema,
	);

	return sessionSound;
};

export const putSessionSoundLabel = async ({
	id,
	soundId,
	target,
	data,
	idempotencyKey,
}: {
	id: string;
	soundId: string;
	target: SessionSoundLabelTarget;
	data: UpdateSessionSoundLabelRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/sessions/${id}/sounds/${soundId}/labels/${target}`, z.unknown(), {
		method: 'PUT',
		json: data,
		idempotencyKey,
	});
};

export const postSessionSoundLabelCancel = async ({
	id,
	soundId,
	target,
	data,
	idempotencyKey,
}: {
	id: string;
	soundId: string;
	target: SessionSoundLabelTarget;
	data: CancelSessionLabelRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/sessions/${id}/sounds/${soundId}/labels/${target}/cancel`, z.unknown(), {
		method: 'POST',
		json: data,
		idempotencyKey,
	});
};

export const postSessionSoundMimicJudgment = async ({
	id,
	soundId,
	idempotencyKey,
}: {
	id: string;
	soundId: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/sessions/${id}/sounds/${soundId}/mimic-judgments`, z.unknown(), {
		method: 'POST',
		idempotencyKey,
	});
};

export const getSessionSoundFiles = async ({ urls }: { urls: string[] }): Promise<ArrayBuffer[]> => {
	return Promise.all(
		urls.map(async (url) => {
			const response = await fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });

			if (!response.ok) {
				throw new Error(`Download failed (HTTP ${response.status})`);
			}

			return response.arrayBuffer();
		}),
	);
};

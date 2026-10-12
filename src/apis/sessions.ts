import { type SessionEvent, sessionEventSchema, type SessionSound, sessionSoundSchema } from '@/types/apis/sessions';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

import { API_TIMEOUT_MS } from '@/config';

export const getSessionEventList = async ({ id }: { id: string }): Promise<SessionEvent[]> => {
	const { data: sessionEvents } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/events`,
		z.array(sessionEventSchema),
	);

	return sessionEvents;
};

export const getSessionSoundList = async ({ id }: { id: string }): Promise<SessionSound[]> => {
	const { data: sessionSounds } = await apiRequest(
		`/api/v1/backoffice/sessions/${id}/sounds`,
		z.array(sessionSoundSchema),
	);

	return sessionSounds;
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

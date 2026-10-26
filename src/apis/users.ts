import { type CountedPage, countedPageMetaSchema } from '@/types/apis/common';
import { type UserConsent, userConsentSchema } from '@/types/apis/consents';
import { type UserNotificationSettings, userNotificationSettingsSchema } from '@/types/apis/notification-settings';
import { type Session, sessionSchema } from '@/types/apis/sessions';
import {
	type UpdateParrotRequest,
	type UpdateUserRequest,
	type UserDetail,
	userDetailSchema,
	type UserListItem,
	userListItemSchema,
	type UserListParams,
} from '@/types/apis/users';
import { type UserWord, userWordSchema } from '@/types/apis/words';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

import { USER_RECENT_ITEM_COUNT } from '@/config';

export const getUserList = async (listParams: UserListParams): Promise<CountedPage<UserListItem>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/users', z.array(userListItemSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

export const getUser = async ({ id }: { id: string }): Promise<UserDetail> => {
	const { data: user } = await apiRequest(`/api/v1/backoffice/users/${id}`, userDetailSchema);

	return user;
};

export const deleteUser = async ({ id, idempotencyKey }: { id: string; idempotencyKey: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}`, z.unknown(), { method: 'DELETE', idempotencyKey });
};

export const patchUser = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateUserRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}`, z.unknown(), { method: 'PATCH', json: data, idempotencyKey });
};

export const deleteUserPhoto = async ({
	id,
	idempotencyKey,
}: {
	id: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}/photo`, z.unknown(), { method: 'DELETE', idempotencyKey });
};

export const patchUserParrot = async ({
	id,
	parrotId,
	data,
	idempotencyKey,
}: {
	id: string;
	parrotId: string;
	data: UpdateParrotRequest;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}/parrots/${parrotId}`, z.unknown(), {
		method: 'PATCH',
		json: data,
		idempotencyKey,
	});
};

export const deleteUserParrotPhoto = async ({
	id,
	parrotId,
	idempotencyKey,
}: {
	id: string;
	parrotId: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}/parrots/${parrotId}/photo`, z.unknown(), {
		method: 'DELETE',
		idempotencyKey,
	});
};

export const getUserSessionList = async ({
	id,
	page,
	sessionId,
}: {
	id: string;
	page: number;
	sessionId?: string;
}): Promise<CountedPage<Session>> => {
	const { data, meta } = await apiRequest(`/api/v1/backoffice/users/${id}/sessions`, z.array(sessionSchema), {
		searchParams: { page, count_by_page: USER_RECENT_ITEM_COUNT, session_id: sessionId },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

export const getUserWordList = async ({ id }: { id: string }): Promise<UserWord[]> => {
	const { data: userWords } = await apiRequest(`/api/v1/backoffice/users/${id}/words`, z.array(userWordSchema));

	return userWords;
};

export const getUserConsentList = async ({ id }: { id: string }): Promise<UserConsent[]> => {
	const { data: userConsents } = await apiRequest(
		`/api/v1/backoffice/users/${id}/consents`,
		z.array(userConsentSchema),
	);

	return userConsents;
};

export const getUserNotificationSettings = async ({ id }: { id: string }): Promise<UserNotificationSettings> => {
	const { data: userNotificationSettings } = await apiRequest(
		`/api/v1/backoffice/users/${id}/settings/notifications`,
		userNotificationSettingsSchema,
	);

	return userNotificationSettings;
};

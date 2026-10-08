import { type CountedPage, countedPageMetaSchema } from '@/types/apis/common';
import { type UserConsent, userConsentSchema } from '@/types/apis/consents';
import { type Session, sessionSchema } from '@/types/apis/sessions';
import {
	type UserDetail,
	userDetailSchema,
	type UserListItem,
	userListItemSchema,
	type UserListParams,
} from '@/types/apis/users';
import { type UserWord, userWordSchema } from '@/types/apis/words';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

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

export const deleteUser = async ({ id }: { id: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}`, z.unknown(), { method: 'DELETE' });
};

export const getUserSessionList = async ({ id, page }: { id: string; page: number }): Promise<CountedPage<Session>> => {
	const { data, meta } = await apiRequest(`/api/v1/backoffice/users/${id}/sessions`, z.array(sessionSchema), {
		searchParams: { page },
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

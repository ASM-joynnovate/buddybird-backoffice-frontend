import { type Page, pageMetaSchema } from '@/types/apis/common';
import { type Session, sessionSchema } from '@/types/apis/sessions';
import { type User, type UserDetail, userDetailSchema, type UserListParams, userSchema } from '@/types/apis/users';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getUserList = async ({ page, keyword, is_deleted }: UserListParams): Promise<Page<User>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/users', z.array(userSchema), {
		searchParams: { page, keyword, is_deleted },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

export const getUser = async ({ id }: { id: string }): Promise<UserDetail> => {
	const { data: user } = await apiRequest(`/api/v1/backoffice/users/${id}`, userDetailSchema);

	return user;
};

export const deleteUser = async ({ id }: { id: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/users/${id}`, z.unknown(), { method: 'DELETE' });
};

export const getUserSessionList = async ({ id, page }: { id: string; page: number }): Promise<Page<Session>> => {
	const { data, meta } = await apiRequest(`/api/v1/backoffice/users/${id}/sessions`, z.array(sessionSchema), {
		searchParams: { page },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

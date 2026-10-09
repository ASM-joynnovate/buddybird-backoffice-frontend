import {
	type AppUpdate,
	appUpdateSchema,
	type CreateAppUpdateRequest,
	type Platform,
	type UpdateAppUpdateRequest,
} from '@/types/apis/app-updates';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getAppUpdateList = async ({ platform }: { platform: Platform }): Promise<AppUpdate[]> => {
	const { data: appUpdates } = await apiRequest('/api/v1/backoffice/app-updates', z.array(appUpdateSchema), {
		searchParams: { platform },
	});

	return appUpdates;
};

export const postAppUpdate = async ({
	data,
	idempotencyKey,
}: {
	data: CreateAppUpdateRequest;
	idempotencyKey: string;
}): Promise<AppUpdate> => {
	const { data: appUpdate } = await apiRequest('/api/v1/backoffice/app-updates', appUpdateSchema, {
		method: 'POST',
		json: data,
		idempotencyKey,
	});

	return appUpdate;
};

export const patchAppUpdate = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateAppUpdateRequest;
	idempotencyKey: string;
}): Promise<AppUpdate> => {
	const { data: appUpdate } = await apiRequest(`/api/v1/backoffice/app-updates/${id}`, appUpdateSchema, {
		method: 'PATCH',
		json: data,
		idempotencyKey,
	});

	return appUpdate;
};

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

export const postAppUpdate = async ({ data }: { data: CreateAppUpdateRequest }): Promise<AppUpdate> => {
	const { data: appUpdate } = await apiRequest('/api/v1/backoffice/app-updates', appUpdateSchema, {
		method: 'POST',
		json: data,
	});

	return appUpdate;
};

export const patchAppUpdate = async ({
	id,
	data,
}: {
	id: string;
	data: UpdateAppUpdateRequest;
}): Promise<AppUpdate> => {
	const { data: appUpdate } = await apiRequest(`/api/v1/backoffice/app-updates/${id}`, appUpdateSchema, {
		method: 'PATCH',
		json: data,
	});

	return appUpdate;
};

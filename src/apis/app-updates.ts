import { type AppUpdate, appUpdateSchema, type Platform } from '@/types/apis/app-updates';
import { ApiError } from '@/types/apis/common';

import { apiRequest } from '@/lib/api';

export const getAppUpdate = async ({ platform }: { platform: Platform }): Promise<AppUpdate | null> => {
	try {
		const { data: appUpdate } = await apiRequest(`/api/v1/backoffice/app-updates/${platform}`, appUpdateSchema);

		return appUpdate;
	} catch (e) {
		if (e instanceof ApiError && e.code === 'COMMON__RESOURCE_NOT_FOUND') {
			return null;
		}

		throw e;
	}
};

export const putAppUpdate = async ({ platform, data }: { platform: Platform; data: AppUpdate }): Promise<AppUpdate> => {
	const { data: appUpdate } = await apiRequest(`/api/v1/backoffice/app-updates/${platform}`, appUpdateSchema, {
		method: 'PUT',
		json: data,
	});

	return appUpdate;
};

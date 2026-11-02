import { postAdImageUpload, putUploadFile } from '@/apis/uploads';

import {
	type Ad,
	type AdImageKind,
	type AdListParams,
	type AdStat,
	type AdStatsParams,
	type AdTotalStat,
	adSchema,
	adStatSchema,
	adTotalStatSchema,
	type CreateAdRequest,
	type UpdateAdRequest,
} from '@/types/apis/ads';
import { type Page, pageMetaSchema } from '@/types/apis/common';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getAdList = async (listParams: AdListParams): Promise<Page<Ad>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/ads', z.array(adSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

export const postAd = async ({
	data,
	idempotencyKey,
}: {
	data: CreateAdRequest;
	idempotencyKey: string;
}): Promise<Ad> => {
	const { data: ad } = await apiRequest('/api/v1/backoffice/ads', adSchema, {
		method: 'POST',
		json: data,
		idempotencyKey,
	});

	return ad;
};

export const patchAd = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateAdRequest;
	idempotencyKey: string;
}): Promise<Ad> => {
	const { data: ad } = await apiRequest(`/api/v1/backoffice/ads/${id}`, adSchema, {
		method: 'PATCH',
		json: data,
		idempotencyKey,
	});

	return ad;
};

export const deleteAd = async ({ id, idempotencyKey }: { id: string; idempotencyKey: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/ads/${id}`, z.unknown(), { method: 'DELETE', idempotencyKey });
};

export const putAdOrder = async ({ ids, idempotencyKey }: { ids: string[]; idempotencyKey: string }): Promise<Ad[]> => {
	const { data: ads } = await apiRequest('/api/v1/backoffice/ads/order', z.array(adSchema), {
		method: 'PUT',
		json: { ids },
		idempotencyKey,
	});

	return ads;
};

export const getAdStats = async (id: string, statsParams: AdStatsParams): Promise<AdStat[]> => {
	const { data: stats } = await apiRequest(`/api/v1/backoffice/ads/${id}/stats`, z.array(adStatSchema), {
		searchParams: { ...statsParams },
	});

	return stats;
};

export const getAdTotalStats = async (statsParams: AdStatsParams): Promise<AdTotalStat[]> => {
	const { data: stats } = await apiRequest('/api/v1/backoffice/ads/stats', z.array(adTotalStatSchema), {
		searchParams: { ...statsParams },
	});

	return stats;
};

export const postAdImage = async ({
	file,
	kind,
	idempotencyKey,
}: {
	file: File;
	kind: AdImageKind;
	idempotencyKey: string;
}): Promise<string> => {
	const upload = await postAdImageUpload({ file, kind, idempotencyKey });

	await putUploadFile({ upload, file });

	return upload.file_id;
};

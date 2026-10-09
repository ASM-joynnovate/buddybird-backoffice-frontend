import { postAnnouncementImageUpload, putUploadFile } from '@/apis/uploads';

import {
	type Announcement,
	type AnnouncementListParams,
	announcementListItemSchema,
	type AnnouncementPage,
	announcementPageMetaSchema,
	announcementSchema,
	type CreateAnnouncementRequest,
	type UpdateAnnouncementRequest,
} from '@/types/apis/announcements';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getAnnouncementList = async (listParams: AnnouncementListParams): Promise<AnnouncementPage> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/announcements', z.array(announcementListItemSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: announcementPageMetaSchema.parse(meta) };
};

export const postAnnouncement = async ({
	data,
	idempotencyKey,
}: {
	data: CreateAnnouncementRequest;
	idempotencyKey: string;
}): Promise<Announcement> => {
	const { data: announcement } = await apiRequest('/api/v1/backoffice/announcements', announcementSchema, {
		method: 'POST',
		json: data,
		idempotencyKey,
	});

	return announcement;
};

export const patchAnnouncement = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateAnnouncementRequest;
	idempotencyKey: string;
}): Promise<Announcement> => {
	const { data: announcement } = await apiRequest(`/api/v1/backoffice/announcements/${id}`, announcementSchema, {
		method: 'PATCH',
		json: data,
		idempotencyKey,
	});

	return announcement;
};

export const deleteAnnouncement = async ({
	id,
	idempotencyKey,
}: {
	id: string;
	idempotencyKey: string;
}): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/announcements/${id}`, z.unknown(), { method: 'DELETE', idempotencyKey });
};

export const postAnnouncementImage = async ({
	id,
	file,
	idempotencyKey,
}: {
	id: string;
	file: File;
	idempotencyKey: string;
}): Promise<void> => {
	const upload = await postAnnouncementImageUpload({ id, file, idempotencyKey });

	await putUploadFile({ upload, file });
};

export const deleteAnnouncementImage = async ({
	id,
	imageId,
	idempotencyKey,
}: {
	id: string;
	imageId: string;
	idempotencyKey: string;
}): Promise<Announcement> => {
	const { data: announcement } = await apiRequest(
		`/api/v1/backoffice/announcements/${id}/images/${imageId}`,
		announcementSchema,
		{ method: 'DELETE', idempotencyKey },
	);

	return announcement;
};

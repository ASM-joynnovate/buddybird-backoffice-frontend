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

export const postAnnouncement = async ({ data }: { data: CreateAnnouncementRequest }): Promise<Announcement> => {
	const { data: announcement } = await apiRequest('/api/v1/backoffice/announcements', announcementSchema, {
		method: 'POST',
		json: data,
	});

	return announcement;
};

export const patchAnnouncement = async ({
	id,
	data,
}: {
	id: string;
	data: UpdateAnnouncementRequest;
}): Promise<Announcement> => {
	const { data: announcement } = await apiRequest(`/api/v1/backoffice/announcements/${id}`, announcementSchema, {
		method: 'PATCH',
		json: data,
	});

	return announcement;
};

export const deleteAnnouncement = async ({ id }: { id: string }): Promise<void> => {
	await apiRequest(`/api/v1/backoffice/announcements/${id}`, z.unknown(), { method: 'DELETE' });
};

export const postAnnouncementImage = async ({ id, file }: { id: string; file: File }): Promise<void> => {
	const upload = await postAnnouncementImageUpload({ id, file });

	await putUploadFile({ upload, file });
};

export const deleteAnnouncementImage = async ({
	id,
	imageId,
}: {
	id: string;
	imageId: string;
}): Promise<Announcement> => {
	const { data: announcement } = await apiRequest(
		`/api/v1/backoffice/announcements/${id}/images/${imageId}`,
		announcementSchema,
		{ method: 'DELETE' },
	);

	return announcement;
};

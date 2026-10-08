import { postNotificationImageUpload, putUploadFile } from '@/apis/uploads';

import { type CountedPage, countedPageMetaSchema, type Page, pageMetaSchema } from '@/types/apis/common';
import {
	type BroadcastNotificationRequest,
	type BroadcastResult,
	broadcastResultSchema,
	type DispatchCancelResult,
	dispatchCancelResultSchema,
	type Notification,
	type NotificationAudience,
	notificationAudienceSchema,
	type NotificationDispatch,
	type NotificationDispatchDetail,
	notificationDispatchDetailSchema,
	type NotificationDispatchListParams,
	notificationDispatchSchema,
	type NotificationListParams,
	notificationSchema,
	type PushDelivery,
	type PushDeliveryListParams,
	pushDeliverySchema,
	type SendableNotificationKind,
} from '@/types/apis/notifications';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getNotificationList = async (listParams: NotificationListParams): Promise<CountedPage<Notification>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/notifications', z.array(notificationSchema), {
		searchParams: { ...listParams },
	});

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

export const getNotificationDispatchList = async (
	listParams: NotificationDispatchListParams,
): Promise<CountedPage<NotificationDispatch>> => {
	const { data, meta } = await apiRequest(
		'/api/v1/backoffice/notifications/dispatches',
		z.array(notificationDispatchSchema),
		{ searchParams: { ...listParams } },
	);

	return { data, meta: countedPageMetaSchema.parse(meta) };
};

export const getNotificationDispatch = async ({ id }: { id: string }): Promise<NotificationDispatchDetail> => {
	const { data: notificationDispatch } = await apiRequest(
		`/api/v1/backoffice/notifications/dispatches/${id}`,
		notificationDispatchDetailSchema,
	);

	return notificationDispatch;
};

export const postNotificationDispatchCancel = async ({ id }: { id: string }): Promise<DispatchCancelResult> => {
	const { data: dispatchCancelResult } = await apiRequest(
		`/api/v1/backoffice/notifications/dispatches/${id}/cancel`,
		dispatchCancelResultSchema,
		{ method: 'POST' },
	);

	return dispatchCancelResult;
};

export const getNotificationAudience = async ({
	kind,
}: {
	kind: SendableNotificationKind;
}): Promise<NotificationAudience> => {
	const { data: notificationAudience } = await apiRequest(
		'/api/v1/backoffice/notifications/audience',
		notificationAudienceSchema,
		{ searchParams: { kind } },
	);

	return notificationAudience;
};

export const getPushDeliveryList = async ({ device_id, page }: PushDeliveryListParams): Promise<Page<PushDelivery>> => {
	const { data, meta } = await apiRequest(
		'/api/v1/backoffice/notifications/deliveries',
		z.array(pushDeliverySchema),
		{ searchParams: { device_id, page } },
	);

	return { data, meta: pageMetaSchema.parse(meta) };
};

export const postNotificationBroadcast = async ({
	data,
}: {
	data: BroadcastNotificationRequest;
}): Promise<BroadcastResult> => {
	const { data: broadcastResult } = await apiRequest(
		'/api/v1/backoffice/notifications/broadcast',
		broadcastResultSchema,
		{ method: 'POST', json: data },
	);

	return broadcastResult;
};

export const postNotificationImage = async ({ file }: { file: File }): Promise<string> => {
	const upload = await postNotificationImageUpload({ file });

	await putUploadFile({ upload, file });

	return upload.file_id;
};

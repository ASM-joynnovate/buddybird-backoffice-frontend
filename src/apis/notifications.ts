import { postNotificationImageUpload, putUploadFile } from '@/apis/uploads';

import { type Page, pageMetaSchema } from '@/types/apis/common';
import {
	type BroadcastNotificationRequest,
	type BroadcastResult,
	broadcastResultSchema,
	type Notification,
	type NotificationListParams,
	notificationSchema,
	type PushDelivery,
	type PushDeliveryListParams,
	pushDeliverySchema,
	type SendNotificationRequest,
} from '@/types/apis/notifications';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getNotificationList = async ({
	page,
	user_id,
	kind,
}: NotificationListParams): Promise<Page<Notification>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/notifications', z.array(notificationSchema), {
		searchParams: { page, user_id, kind },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};

export const getPushDeliveryList = async ({ device_id, page }: PushDeliveryListParams): Promise<Page<PushDelivery>> => {
	const { data, meta } = await apiRequest(
		'/api/v1/backoffice/notifications/deliveries',
		z.array(pushDeliverySchema),
		{ searchParams: { device_id, page } },
	);

	return { data, meta: pageMetaSchema.parse(meta) };
};

export const postNotification = async ({ data }: { data: SendNotificationRequest }): Promise<Notification | null> => {
	const { data: notification } = await apiRequest('/api/v1/backoffice/notifications', notificationSchema.nullable(), {
		method: 'POST',
		json: data,
	});

	return notification;
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

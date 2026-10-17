import {
	type CreateNotificationSettingGroupRequest,
	type CreateNotificationSettingItemRequest,
	type NotificationSettingGroup,
	notificationSettingGroupSchema,
	type NotificationSettingItem,
	type NotificationSettingItemOrderRequest,
	notificationSettingItemSchema,
	type UpdateNotificationSettingGroupRequest,
	type UpdateNotificationSettingItemRequest,
} from '@/types/apis/notification-settings';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getNotificationSettingGroupList = async (): Promise<NotificationSettingGroup[]> => {
	const { data: groups } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/groups',
		z.array(notificationSettingGroupSchema),
	);

	return groups;
};

export const postNotificationSettingGroup = async ({
	data,
	idempotencyKey,
}: {
	data: CreateNotificationSettingGroupRequest;
	idempotencyKey: string;
}): Promise<NotificationSettingGroup> => {
	const { data: group } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/groups',
		notificationSettingGroupSchema,
		{ method: 'POST', json: data, idempotencyKey },
	);

	return group;
};

export const patchNotificationSettingGroup = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateNotificationSettingGroupRequest;
	idempotencyKey: string;
}): Promise<NotificationSettingGroup> => {
	const { data: group } = await apiRequest(
		`/api/v1/backoffice/notifications/settings/groups/${id}`,
		notificationSettingGroupSchema,
		{ method: 'PATCH', json: data, idempotencyKey },
	);

	return group;
};

export const putNotificationSettingGroupOrder = async ({
	ids,
	idempotencyKey,
}: {
	ids: string[];
	idempotencyKey: string;
}): Promise<NotificationSettingGroup[]> => {
	const { data: groups } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/groups/order',
		z.array(notificationSettingGroupSchema),
		{ method: 'PUT', json: { ids }, idempotencyKey },
	);

	return groups;
};

export const getNotificationSettingItemList = async (): Promise<NotificationSettingItem[]> => {
	const { data: items } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/items',
		z.array(notificationSettingItemSchema),
	);

	return items;
};

export const postNotificationSettingItem = async ({
	data,
	idempotencyKey,
}: {
	data: CreateNotificationSettingItemRequest;
	idempotencyKey: string;
}): Promise<NotificationSettingItem> => {
	const { data: item } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/items',
		notificationSettingItemSchema,
		{ method: 'POST', json: data, idempotencyKey },
	);

	return item;
};

export const patchNotificationSettingItem = async ({
	id,
	data,
	idempotencyKey,
}: {
	id: string;
	data: UpdateNotificationSettingItemRequest;
	idempotencyKey: string;
}): Promise<NotificationSettingItem> => {
	const { data: item } = await apiRequest(
		`/api/v1/backoffice/notifications/settings/items/${id}`,
		notificationSettingItemSchema,
		{ method: 'PATCH', json: data, idempotencyKey },
	);

	return item;
};

export const putNotificationSettingItemOrder = async ({
	data,
	idempotencyKey,
}: {
	data: NotificationSettingItemOrderRequest;
	idempotencyKey: string;
}): Promise<NotificationSettingItem[]> => {
	const { data: items } = await apiRequest(
		'/api/v1/backoffice/notifications/settings/items/order',
		z.array(notificationSettingItemSchema),
		{ method: 'PUT', json: data, idempotencyKey },
	);

	return items;
};

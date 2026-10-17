import { i18nSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const notificationSettingKindSchema = z.enum([
	'announcement',
	'report',
	'emergency',
	'marketing',
	'marketing_night',
]);

export const notificationSettingGroupSchema = z.object({
	id: uuidSchema,
	title: i18nSchema,
	description: i18nSchema.nullable(),
	sort_order: z.number().int(),
});

export const notificationSettingItemSchema = z.object({
	id: uuidSchema,
	group_id: uuidSchema.nullable(),
	kind: notificationSettingKindSchema,
	title: i18nSchema,
	description: i18nSchema.nullable(),
	default_enabled: z.boolean(),
	sort_order: z.number().int(),
});

const userNotificationSettingItemSchema = z.object({
	id: uuidSchema,
	kind: notificationSettingKindSchema,
	title: i18nSchema,
	description: i18nSchema.nullable(),
	enabled: z.boolean(),
	decided_at: timestampSchema.nullable(),
});

export const userNotificationSettingsSchema = z.object({
	push_enabled: z.boolean(),
	groups: z.array(
		z.object({
			id: uuidSchema,
			title: i18nSchema,
			description: i18nSchema.nullable(),
			items: z.array(userNotificationSettingItemSchema),
		}),
	),
	items: z.array(userNotificationSettingItemSchema),
});

const createNotificationSettingGroupRequestSchema = z.object({
	title: i18nSchema,
	description: i18nSchema.nullable(),
});

const updateNotificationSettingGroupRequestSchema = z.object({
	title: i18nSchema.partial().optional(),
	description: i18nSchema.nullable().optional(),
});

const createNotificationSettingItemRequestSchema = createNotificationSettingGroupRequestSchema.extend({
	group_id: uuidSchema.nullable(),
	kind: notificationSettingKindSchema,
	default_enabled: z.boolean(),
});

const notificationSettingItemOrderRequestSchema = z.object({
	items: z.array(z.object({ id: uuidSchema, group_id: uuidSchema.nullable() })),
});

export type NotificationSettingKind = z.infer<typeof notificationSettingKindSchema>;
export type NotificationSettingGroup = z.infer<typeof notificationSettingGroupSchema>;
export type NotificationSettingItem = z.infer<typeof notificationSettingItemSchema>;
export type UserNotificationSettingItem = z.infer<typeof userNotificationSettingItemSchema>;
export type UserNotificationSettings = z.infer<typeof userNotificationSettingsSchema>;
export type CreateNotificationSettingGroupRequest = z.infer<typeof createNotificationSettingGroupRequestSchema>;
export type UpdateNotificationSettingGroupRequest = z.infer<typeof updateNotificationSettingGroupRequestSchema>;
export type CreateNotificationSettingItemRequest = z.infer<typeof createNotificationSettingItemRequestSchema>;
export type UpdateNotificationSettingItemRequest = UpdateNotificationSettingGroupRequest;
export type NotificationSettingItemOrderRequest = z.infer<typeof notificationSettingItemOrderRequestSchema>;

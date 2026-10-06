import { i18nSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const sendableNotificationKindSchema = z.enum(['announcement', 'urgent', 'marketing']);
export const notificationKindSchema = z.enum([...sendableNotificationKindSchema.options, 'report']);

export const notificationSchema = z.object({
	id: uuidSchema,
	user_id: uuidSchema,
	kind: notificationKindSchema,
	data_id: uuidSchema.nullable(),
	title: i18nSchema,
	body: i18nSchema,
	image: z.object({ url: z.string() }).nullable(),
	sent_at: timestampSchema,
	read_at: timestampSchema.nullable(),
});

export const pushDeliverySchema = z.object({
	id: uuidSchema,
	notification_id: uuidSchema.nullable(),
	announcement_id: uuidSchema.nullable(),
	kind: notificationKindSchema,
	title: i18nSchema,
	body: i18nSchema.nullable(),
	scheduled_at: timestampSchema,
	sent_at: timestampSchema,
});

export const broadcastResultSchema = z.object({ notification_count: z.number().int() });

const broadcastNotificationRequestSchema = z.object({
	kind: sendableNotificationKindSchema,
	title: i18nSchema,
	body: i18nSchema,
	image_file_id: uuidSchema.nullable(),
	user_ids: z.array(uuidSchema).optional(),
	all_users: z.boolean(),
	recipient_local_datetime: z.string().nullable(),
});

const sendNotificationRequestSchema = broadcastNotificationRequestSchema
	.pick({ kind: true, title: true, body: true, image_file_id: true })
	.extend({ user_id: uuidSchema });

export type NotificationKind = z.infer<typeof notificationKindSchema>;
export type SendableNotificationKind = z.infer<typeof sendableNotificationKindSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type PushDelivery = z.infer<typeof pushDeliverySchema>;
export type BroadcastResult = z.infer<typeof broadcastResultSchema>;
export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>;
export type BroadcastNotificationRequest = z.infer<typeof broadcastNotificationRequestSchema>;

export interface NotificationListParams {
	page: number;
	user_id?: string;
	kind?: NotificationKind;
}

export interface PushDeliveryListParams {
	device_id: string;
	page: number;
}

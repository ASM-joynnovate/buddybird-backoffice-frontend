import { fileSchema, i18nSchema } from '@/types/apis/common';
import { timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const sendableNotificationKindSchema = z.enum(['announcement', 'urgent', 'marketing']);
export const notificationKindSchema = z.enum([...sendableNotificationKindSchema.options, 'report']);

const notificationImageSchema = z.object({ url: z.string() });

export const notificationSchema = z.object({
	id: uuidSchema,
	user_id: uuidSchema,
	kind: notificationKindSchema,
	data_id: uuidSchema.nullable(),
	title: i18nSchema,
	body: i18nSchema,
	image: notificationImageSchema.nullable(),
	image_file_id: uuidSchema.nullable(),
	sent_at: timestampSchema,
	read_at: timestampSchema.nullable(),
	user: z.object({
		nickname: z.string().nullable(),
		email: z.string().nullable(),
		is_anonymous: z.boolean(),
		photo_file: fileSchema.nullable(),
	}),
	push_sent_at: timestampSchema.nullable(),
});

export const notificationDispatchSchema = z.object({
	id: uuidSchema,
	kind: sendableNotificationKindSchema,
	title: i18nSchema,
	body: i18nSchema,
	image: notificationImageSchema.nullable(),
	image_file_id: uuidSchema.nullable(),
	target: z.enum(['all', 'selected']),
	recipient_local_datetime: z.iso.datetime({ local: true }).nullable(),
	created_at: timestampSchema,
	status: z.enum(['scheduled', 'sending', 'sent']),
	recipient_count: z.number().int(),
	sent_count: z.number().int(),
	read_count: z.number().int(),
	push_sent_count: z.number().int(),
	push_waiting_count: z.number().int(),
	send_times: z.array(z.object({ sent_at: timestampSchema, count: z.number().int() })),
	recipient: z
		.object({
			user_id: uuidSchema,
			nickname: z.string().nullable(),
			email: z.string().nullable(),
			is_anonymous: z.boolean(),
			photo_file: fileSchema.nullable(),
			read_at: timestampSchema.nullable(),
			push_sent_at: timestampSchema.nullable(),
		})
		.nullable(),
});

export const notificationDispatchDetailSchema = notificationDispatchSchema.extend({
	hourly_reads: z.array(z.object({ hour: z.number().int(), count: z.number().int() })),
});

export const dispatchCancelResultSchema = z.object({ canceled_count: z.number().int() });

export const notificationAudienceSchema = z.object({
	user_count: z.number().int(),
	recipient_count: z.number().int(),
	pushable_count: z.number().int(),
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

export type NotificationKind = z.infer<typeof notificationKindSchema>;
export type SendableNotificationKind = z.infer<typeof sendableNotificationKindSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationDispatch = z.infer<typeof notificationDispatchSchema>;
export type NotificationDispatchDetail = z.infer<typeof notificationDispatchDetailSchema>;
export type DispatchCancelResult = z.infer<typeof dispatchCancelResultSchema>;
export type NotificationAudience = z.infer<typeof notificationAudienceSchema>;
export type PushDelivery = z.infer<typeof pushDeliverySchema>;
export type BroadcastResult = z.infer<typeof broadcastResultSchema>;
export type BroadcastNotificationRequest = z.infer<typeof broadcastNotificationRequestSchema>;

export interface NotificationListParams {
	page: number;
	count_by_page?: number;
	user_id?: string;
	kind?: NotificationKind;
	is_sent?: boolean;
	keyword?: string;
	sent_from?: string;
	sent_to?: string;
}

export interface NotificationDispatchListParams {
	page: number;
	count_by_page?: number;
	is_sent?: boolean;
	kind?: SendableNotificationKind;
	keyword?: string;
	sent_from?: string;
	sent_to?: string;
}

export interface PushDeliveryListParams {
	device_id: string;
	page: number;
}

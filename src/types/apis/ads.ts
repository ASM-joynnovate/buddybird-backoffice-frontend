import { i18nSchema } from '@/types/apis/common';
import type { DashboardParams } from '@/types/apis/dashboard';
import { countrySchema, timestampSchema, uuidSchema } from '@/types/apis/primitives';

import { z } from 'zod';

export const adKindSchema = z.enum(['home_banner', 'feed']);
export const adStatusSchema = z.enum(['scheduled', 'active', 'ended', 'disabled']);
export const adImageKindSchema = z.enum(['home_banner', 'feed', 'advertiser']);
export const adEventKindSchema = z.enum(['impression', 'click']);
export const adStatIntervalSchema = z.enum(['hour', 'day']);

const adFileSchema = z.object({ file_id: uuidSchema, url: z.string() });
const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const adSchema = z.object({
	id: uuidSchema,
	kind: adKindSchema,
	status: adStatusSchema,
	is_ad: z.boolean(),
	is_enabled: z.boolean(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
	weight: z.number().int(),
	display_order: z.number().int().nullable(),
	countries: z.array(countrySchema),
	advertiser_name: i18nSchema,
	advertiser_description: i18nSchema.nullable(),
	advertiser_photo_file: adFileSchema.nullable(),
	link_url: i18nSchema,
	image_file: adFileSchema,
	body: i18nSchema.nullable(),
	button_text: i18nSchema.nullable(),
	button_color: colorSchema.nullable(),
	button_text_color: colorSchema.nullable(),
	event_counts: z.array(z.object({ kind: adEventKindSchema, count: z.number().int() })),
});

export const adStatSchema = z.object({
	started_at: timestampSchema,
	kind: adEventKindSchema,
	count: z.number().int(),
});

export const adTotalStatSchema = adStatSchema.extend({ ad_kind: adKindSchema });

const createAdRequestSchema = z.object({
	kind: adKindSchema,
	is_ad: z.boolean(),
	is_enabled: z.boolean(),
	starts_at: timestampSchema,
	ends_at: timestampSchema.nullable(),
	weight: z.number().int().min(1).max(100),
	countries: z.array(countrySchema),
	advertiser_name: i18nSchema,
	advertiser_description: i18nSchema.nullable(),
	advertiser_photo_file_id: uuidSchema.nullable(),
	link_url: i18nSchema,
	image_file_id: uuidSchema,
	body: i18nSchema.nullable(),
	button_text: i18nSchema.nullable(),
	button_color: colorSchema.nullable(),
	button_text_color: colorSchema.nullable(),
});

const updateAdRequestSchema = createAdRequestSchema.omit({ kind: true }).partial();

export type AdKind = z.infer<typeof adKindSchema>;
export type AdStatus = z.infer<typeof adStatusSchema>;
export type AdImageKind = z.infer<typeof adImageKindSchema>;
export type Ad = z.infer<typeof adSchema>;
export type AdEventKind = z.infer<typeof adEventKindSchema>;
export type AdStat = z.infer<typeof adStatSchema>;
export type AdTotalStat = z.infer<typeof adTotalStatSchema>;
export type AdStatInterval = z.infer<typeof adStatIntervalSchema>;
export type CreateAdRequest = z.infer<typeof createAdRequestSchema>;
export type UpdateAdRequest = z.infer<typeof updateAdRequestSchema>;

export interface AdListParams {
	page: number;
	count_by_page?: number;
	kind?: AdKind;
	status?: AdStatus;
	is_ad?: boolean;
	country?: string;
}

export interface AdStatsParams extends DashboardParams {
	interval: AdStatInterval;
}

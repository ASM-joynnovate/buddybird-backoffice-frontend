import type { AdEventKind, AdImageKind, AdKind, AdStatus } from '@/types/apis/ads';

import { TITLE_MAX_LENGTH } from '@/config/policy';

export const AD_KINDS = {
	home_banner: { label: '홈 배너', color: 'var(--chart-4)' },
	feed: { label: '피드 광고', color: 'var(--chart-3)' },
} satisfies Record<AdKind, { label: string; color: string }>;

export const AD_STATUSES = {
	active: '노출 중',
	scheduled: '예약',
	ended: '종료',
	disabled: '꺼짐',
} satisfies Record<AdStatus, string>;

export const AD_TYPES = { ad: '광고', info: '정보' };

export const AD_EVENT_KINDS = {
	impression: '노출',
	click: '클릭',
} satisfies Record<AdEventKind, string>;

export const AD_IMAGE_NAMES = {
	home_banner: '배너',
	feed: '피드',
	advertiser: '광고주',
} satisfies Record<AdImageKind, string>;

export const AD_IMAGE_SHAPES = {
	home_banner: { ratioWidth: 3, ratioHeight: 1, minWidth: 1200, minHeight: 400 },
	feed: { ratioWidth: 16, ratioHeight: 9, minWidth: 1280, minHeight: 720 },
	advertiser: { ratioWidth: 1, ratioHeight: 1, minWidth: 240, minHeight: 240 },
} satisfies Record<AdImageKind, { ratioWidth: number; ratioHeight: number; minWidth: number; minHeight: number }>;

export const AD_TEXT_FIELDS: Record<
	'advertiser_name' | 'advertiser_description' | 'body' | 'button_text' | 'link_url',
	{ label: string; required: boolean; maxLength?: number; multiline?: boolean; placeholder?: string }
> = {
	advertiser_name: { label: '광고주 이름', required: true, maxLength: TITLE_MAX_LENGTH },
	advertiser_description: { label: '광고주 설명', required: false },
	body: { label: '본문', required: true, multiline: true },
	button_text: { label: '버튼 문구', required: true, maxLength: TITLE_MAX_LENGTH },
	link_url: { label: '링크', required: true, placeholder: 'https://' },
};

export type AdTextName = keyof typeof AD_TEXT_FIELDS;

// 앱 화면의 위에서 아래 순서
export const AD_TEXT_NAMES = {
	home_banner: ['advertiser_name', 'advertiser_description', 'link_url'],
	feed: ['advertiser_name', 'advertiser_description', 'body', 'button_text', 'link_url'],
} satisfies Record<AdKind, AdTextName[]>;

export const AD_FILTER_LABELS = { kind: '종류', status: '상태', is_ad: '광고 여부', country: '국가' };

export const AD_MIN_WEIGHT = 1;
export const AD_MAX_WEIGHT = 100;

import type { UserListParams } from '@/types/apis/users';

interface UserFilterOption {
	value: string;
	label: string;
	listParams?: Partial<UserListParams>;
	createdDayCount?: number;
}

interface UserFilterGroup {
	name: string;
	label: string;
	options: UserFilterOption[];
}

export type UserFilters = Record<string, string | undefined>;

export const USER_FILTER_GROUPS: UserFilterGroup[] = [
	{
		name: 'last_session',
		label: '마지막 세션',
		options: [
			{ value: 'today', label: '오늘', listParams: { last_session: 'today' } },
			{ value: 'within_7_days', label: '7일 이내', listParams: { last_session: 'within_7_days' } },
			{ value: 'within_30_days', label: '30일 이내', listParams: { last_session: 'within_30_days' } },
			{ value: 'over_30_days', label: '30일 초과', listParams: { last_session: 'over_30_days' } },
			{ value: 'none', label: '없음', listParams: { last_session: 'none' } },
		],
	},
	{
		name: 'created',
		label: '가입',
		options: [
			{ value: 'today', label: '오늘', createdDayCount: 1 },
			{ value: 'within_7_days', label: '7일 이내', createdDayCount: 7 },
			{ value: 'within_30_days', label: '30일 이내', createdDayCount: 30 },
		],
	},
	{
		name: 'account',
		label: '계정',
		options: [
			{ value: 'google', label: 'Google', listParams: { provider: 'google' } },
			{ value: 'kakao', label: 'Kakao', listParams: { provider: 'kakao' } },
			{ value: 'apple', label: 'Apple', listParams: { provider: 'apple' } },
			{ value: 'anonymous', label: '익명', listParams: { is_anonymous: true } },
		],
	},
	{
		name: 'device',
		label: '기기',
		options: [
			{ value: 'ios', label: 'iOS', listParams: { platform: 'ios' } },
			{ value: 'android', label: 'Android', listParams: { platform: 'android' } },
			{ value: 'unsupported', label: '업데이트 필요', listParams: { has_unsupported_device: true } },
		],
	},
	{
		name: 'notification',
		label: '알림',
		options: [
			{ value: 'pushable', label: '푸시 가능', listParams: { is_pushable: true } },
			{ value: 'unpushable', label: '푸시 불가', listParams: { is_pushable: false } },
			{ value: 'marketing', label: '마케팅 동의', listParams: { is_marketing_enabled: true } },
		],
	},
	{
		name: 'issue',
		label: '확인 필요',
		options: [
			{ value: 'heartbeat_expired', label: '신호 끊김', listParams: { issue: 'heartbeat_expired' } },
			{ value: 'emergency_detected', label: '응급 감지', listParams: { issue: 'emergency_detected' } },
			{ value: 'withdrawal_failed', label: '탈퇴 실패', listParams: { issue: 'withdrawal_failed' } },
		],
	},
];

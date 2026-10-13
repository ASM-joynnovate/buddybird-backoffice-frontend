import type { EmergencyKind, EmergencyNotificationState } from '@/types/apis/emergencies';

export const EMERGENCY_KINDS = {
	sound_emergency_detected: { label: '오디오', color: 'var(--chart-1)' },
	parrot_disappeared: { label: '비전', color: 'var(--chart-2)' },
} satisfies Record<EmergencyKind, { label: string; color: string }>;

export const EMERGENCY_NOTIFICATION_STATES = {
	read: '읽음',
	unread: '읽지 않음',
	none: '미발송',
} satisfies Record<EmergencyNotificationState, string>;

export const EMERGENCY_STATES = { ongoing: '진행 중', ended: '종료' };

export const EMERGENCY_FILTER_LABELS = { kind: '종류', is_ongoing: '상태', notification: '알림', platform: '기기' };

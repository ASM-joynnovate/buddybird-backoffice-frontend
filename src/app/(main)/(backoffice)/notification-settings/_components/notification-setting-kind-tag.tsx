import type { NotificationSettingKind } from '@/types/apis/notification-settings';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';

export const NOTIFICATION_SETTING_KINDS = {
	announcement: { label: '공지', color: 'var(--chart-2)' },
	report: { label: '리포트', color: 'var(--chart-1)' },
	emergency: { label: '응급', color: 'var(--destructive-dot)' },
	marketing: { label: '마케팅', color: 'var(--chart-3)' },
	marketing_night: { label: '야간 마케팅', color: 'var(--chart-3)' },
} satisfies Record<NotificationSettingKind, { label: string; color: string }>;

interface Props {
	kind: NotificationSettingKind;
}

/**
 * 알림 설정 종류 태그 컴포넌트
 * @param kind 알림 설정 종류
 */
const NotificationSettingKindTag = ({ kind }: Props) => {
	return <ColorTag color={NOTIFICATION_SETTING_KINDS[kind].color}>{NOTIFICATION_SETTING_KINDS[kind].label}</ColorTag>;
};

export default NotificationSettingKindTag;

import type { NotificationKind } from '@/types/apis/notifications';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';

export const NOTIFICATION_KINDS = {
	report: { label: '리포트', color: 'var(--chart-1)' },
	announcement: { label: '공지', color: 'var(--chart-2)' },
	marketing: { label: '마케팅', color: 'var(--chart-3)' },
	urgent: { label: '긴급', color: 'var(--chart-4)' },
} satisfies Record<NotificationKind, { label: string; color: string }>;

interface Props {
	kind: NotificationKind;
}

/**
 * 알림 종류 태그 컴포넌트
 * @param kind 알림 종류
 */
const NotificationKindTag = ({ kind }: Props) => {
	return <ColorTag color={NOTIFICATION_KINDS[kind].color}>{NOTIFICATION_KINDS[kind].label}</ColorTag>;
};

export default NotificationKindTag;

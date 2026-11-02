import type { AdStatus } from '@/types/apis/ads';

import { cn } from '@/lib/utils';

import { CircleCheck, CirclePlay, Clock } from 'lucide-react';

import { AD_STATUSES } from '@/config/ad';

const statusIcons = {
	active: { icon: CirclePlay, className: 'text-success' },
	scheduled: { icon: Clock, className: 'text-info' },
	ended: { icon: CircleCheck, className: 'text-muted-foreground' },
};

interface Props {
	status: AdStatus;
	className?: string;
}

/**
 * 광고의 노출 상태 아이콘 컴포넌트
 * @param status 광고의 노출 상태
 * @param className 아이콘에 더할 class
 */
const AdStatusIcon = ({ status, className }: Props) => {
	// 꺼진 광고는 스위치로 표시
	if (status === 'disabled') {
		return null;
	}

	const StatusIcon = statusIcons[status].icon;

	return (
		<StatusIcon
			aria-label={AD_STATUSES[status]}
			className={cn('size-4.5', statusIcons[status].className, className)}
		>
			<title>{AD_STATUSES[status]}</title>
		</StatusIcon>
	);
};

export default AdStatusIcon;

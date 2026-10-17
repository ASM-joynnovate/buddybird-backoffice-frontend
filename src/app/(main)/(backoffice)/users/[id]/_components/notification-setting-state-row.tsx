import { cn } from '@/lib/utils';

import { formatDateTime } from '@/utils/date';

interface Props {
	label: string;
	enabled: boolean;
	decidedAt?: string | null;
}

/**
 * 알림 설정 하나의 켜짐 여부 행 컴포넌트
 * @param label 설정 이름
 * @param enabled 켜짐 여부
 * @param decidedAt 사용자가 결정한 일시, null이면 기본값 사용
 */
const NotificationSettingStateRow = ({ label, enabled, decidedAt }: Props) => {
	return (
		<li className="flex items-center justify-between gap-3 py-2 last:pb-0">
			<span className="grid">
				<span className="text-muted-foreground">{label}</span>
				{decidedAt !== undefined && (
					<span className="text-[12.5px] text-muted-foreground tabular-nums">
						{decidedAt ? formatDateTime(decidedAt) : '-'}
					</span>
				)}
			</span>

			<span className="sr-only">{enabled ? '켬' : '끔'}</span>
			<span
				aria-hidden
				className={cn(
					'relative h-4 w-7 shrink-0 rounded-full bg-chart-neutral after:absolute after:top-0.5 after:left-0.5 after:size-3 after:rounded-full after:bg-card',
					enabled && 'bg-foreground after:left-3.5',
				)}
			/>
		</li>
	);
};

export default NotificationSettingStateRow;

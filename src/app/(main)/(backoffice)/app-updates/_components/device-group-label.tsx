import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { TriangleAlert } from 'lucide-react';

import type { DeviceGroups } from '@/utils/app-update';

export const DEVICE_GROUPS: Record<
	keyof DeviceGroups,
	{
		label: string;
		ariaLabel: string;
		className: string;
		barClassName: string;
		trackClassName: string;
		labelClassName?: string;
		marker: ReactNode;
	}
> = {
	latest: {
		label: '최신 버전',
		ariaLabel: '최신 버전을 사용하는 기기',
		className: 'bg-[color-mix(in_srgb,var(--chart-2)_9%,var(--card))]',
		barClassName: 'bg-chart-2',
		trackClassName: 'bg-chart-2/22',
		marker: <span className="size-2 shrink-0 rounded-full bg-chart-2" />,
	},
	optional: {
		label: '선택 업데이트',
		ariaLabel: '선택 업데이트 대상인 기기',
		className: 'bg-muted',
		barClassName: 'bg-[color-mix(in_srgb,var(--chart-2)_50%,var(--card))]',
		trackClassName: 'bg-foreground/8',
		marker: (
			<span className="size-2 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--chart-2)_50%,var(--card))]" />
		),
	},
	forced: {
		label: '강제 업데이트',
		ariaLabel: '강제 업데이트 대상인 기기',
		className: 'bg-warning/10',
		barClassName: 'bg-warning-dot',
		trackClassName: 'bg-warning-dot/22',
		labelClassName: 'font-semibold text-warning',
		marker: <TriangleAlert aria-hidden className="size-3.5 shrink-0" />,
	},
};

interface Props {
	deviceGroup: keyof DeviceGroups;
}

/**
 * 기기 묶음의 이름 컴포넌트
 * @param deviceGroup 이름을 표시할 기기 묶음
 */
const DeviceGroupLabel = ({ deviceGroup }: Props) => {
	const { label, labelClassName, marker } = DEVICE_GROUPS[deviceGroup];

	return (
		<span
			className={cn(
				'flex items-center gap-1.5 text-[12.5px] leading-[19px] text-muted-foreground',
				labelClassName,
			)}
		>
			{marker}
			{label}
		</span>
	);
};

export default DeviceGroupLabel;

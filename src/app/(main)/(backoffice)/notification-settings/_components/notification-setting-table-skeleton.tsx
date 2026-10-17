import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import {
	notificationSettingGridClassName,
	notificationSettingRowClassName,
} from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-item-row';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 7;

/** "항목" 카드를 불러오는 동안 보이는 컴포넌트 */
const NotificationSettingTableSkeleton = () => {
	return (
		<TitledCard title="항목" action=<Skeleton className="h-3.5 w-5" />>
			<div
				className={cn(
					notificationSettingGridClassName,
					'font-medium whitespace-nowrap text-muted-foreground max-md:hidden',
				)}
			>
				<span className="pb-2 [grid-area:title]">제목</span>
				<span className="pb-2 [grid-area:kind]">종류</span>
				<span className="pb-2 [grid-area:def]">기본값</span>
			</div>

			<div>
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<div
						key={index}
						className={cn(
							notificationSettingGridClassName,
							notificationSettingRowClassName,
							'max-md:first:before:hidden',
						)}
					>
						<SkeletonText className="w-2/5 [grid-area:title]" />
						<Skeleton className="h-5 w-16 [grid-area:kind]" />
						<Skeleton className="size-4 [grid-area:def]" />
					</div>
				))}
			</div>
		</TitledCard>
	);
};

export default NotificationSettingTableSkeleton;

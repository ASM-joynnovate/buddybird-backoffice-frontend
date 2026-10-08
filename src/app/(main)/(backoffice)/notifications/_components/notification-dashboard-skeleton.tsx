import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_KIND_COUNT = 4;

/** 알림 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const NotificationDashboardSkeleton = () => {
	return (
		<>
			<TitledCard title="알림 추이">
				<Skeleton className="h-12 w-35" />
				<Skeleton className="mt-2 h-5 w-37.5" />
				<Skeleton className="mt-3.5 h-38" />
				<Skeleton className="mt-3.5 h-15.5" />
			</TitledCard>

			<TitledCard title="종류별 읽음">
				<div className="grid gap-2">
					{Array.from({ length: PLACEHOLDER_KIND_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-11" />
					))}
				</div>
			</TitledCard>
		</>
	);
};

export default NotificationDashboardSkeleton;

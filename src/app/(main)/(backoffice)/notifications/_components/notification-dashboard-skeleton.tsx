import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_KIND_COUNT = 4;

/** 알림 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const NotificationDashboardSkeleton = () => {
	return (
		<>
			<TitledCard title="알림 추이">
				<SkeletonText className="w-35 text-[44px] leading-[1.1]" />
				<SkeletonText className="mt-1.5 w-37.5 text-[13px]" />
				<Skeleton className="mt-3.5 h-38" />
				<dl className="mt-3.5 grid grid-cols-2 gap-2">
					<StatCell label="읽음">
						<SkeletonText className="w-12" />
					</StatCell>
					<StatCell label="푸시 발송">
						<SkeletonText className="w-12" />
					</StatCell>
				</dl>
			</TitledCard>

			<TitledCard title="종류별 읽음">
				<ul className="divide-y">
					{Array.from({ length: PLACEHOLDER_KIND_COUNT }, (_, index) => (
						<li key={index} className="grid gap-2 py-3 first:pt-0 last:pb-0">
							<SkeletonText className="h-5.25" />
							<Skeleton className="h-2 rounded-full" />
						</li>
					))}
				</ul>
			</TitledCard>
		</>
	);
};

export default NotificationDashboardSkeleton;

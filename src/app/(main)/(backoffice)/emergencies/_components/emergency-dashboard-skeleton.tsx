import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_USER_COUNT = 5;

/** 응급 상황 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const EmergencyDashboardSkeleton = () => {
	return (
		<>
			<TitledCard title="응급 상황 추이">
				<SkeletonText className="w-30 text-[44px] leading-[1.1]" />
				<SkeletonText className="mt-1.5 w-38 text-[13px]" />
				<Skeleton className="mt-3.5 h-38" />
			</TitledCard>

			<TitledCard title="시간대">
				<Skeleton className="h-16" />
				<SkeletonText className="mt-1.5 text-[11.5px]" />
			</TitledCard>

			<TitledCard title="사용자">
				<div className="grid gap-0.5">
					{Array.from({ length: PLACEHOLDER_USER_COUNT }, (_, index) => (
						<div key={index} className="grid gap-1 py-2">
							<SkeletonText className="w-24" />
							<Skeleton className="h-2 rounded-full" />
						</div>
					))}
				</div>
			</TitledCard>
		</>
	);
};

export default EmergencyDashboardSkeleton;

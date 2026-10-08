import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_GROUP_COUNT = 3;

/** 피드백 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const FeedbackDashboardSkeleton = () => {
	return (
		<>
			<TitledCard title="피드백 추이">
				<Skeleton className="h-12 w-30" />
				<Skeleton className="mt-2 h-5 w-38" />
				<Skeleton className="mt-3.5 h-38" />
				<Skeleton className="mt-3.5 h-16" />
			</TitledCard>

			<TitledCard title="구성">
				<div className="grid gap-4.5">
					{Array.from({ length: PLACEHOLDER_GROUP_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-14" />
					))}
				</div>
			</TitledCard>
		</>
	);
};

export default FeedbackDashboardSkeleton;

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_GROUP_COUNT = 6;

/** 탈퇴 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const WithdrawalDashboardSkeleton = () => {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
			<TitledCard title="탈퇴 추이">
				<Skeleton className="h-12 w-30" />
				<Skeleton className="mt-2 h-5 w-38" />
				<Skeleton className="mt-3.5 h-38" />
				<Skeleton className="mt-3.5 h-16" />
			</TitledCard>

			<TitledCard title="구성">
				<div className="grid grid-cols-1 gap-x-6 gap-y-4.5 md:grid-cols-3 xl:grid-cols-2">
					{Array.from({ length: PLACEHOLDER_GROUP_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-14" />
					))}
				</div>
			</TitledCard>

			<TitledCard title="오류">
				<Skeleton className="h-30" />
			</TitledCard>
		</div>
	);
};

export default WithdrawalDashboardSkeleton;

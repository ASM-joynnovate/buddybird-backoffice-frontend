import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 6;

/** 사용자 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const UserDashboardSkeleton = () => {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
			<TitledCard title="사용자 추이" className="xl:col-span-2">
				<div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)] md:gap-7">
					<div className="space-y-3">
						<Skeleton className="h-12 w-36" />
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-24" />
					</div>

					<Skeleton className="h-65" />
				</div>
			</TitledCard>

			<TitledCard title="마지막 세션">
				<div className="space-y-3">
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-5" />
					))}
				</div>
			</TitledCard>

			<TitledCard title="활성 사용자">
				<Skeleton className="h-65" />
			</TitledCard>

			<TitledCard title="구성">
				<div className="space-y-3">
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-5" />
					))}
				</div>
			</TitledCard>

			<TitledCard title="앵무새 종">
				<div className="space-y-3">
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-5" />
					))}
				</div>
			</TitledCard>
		</div>
	);
};

export default UserDashboardSkeleton;

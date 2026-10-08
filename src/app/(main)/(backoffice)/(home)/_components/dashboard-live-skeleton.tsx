import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PHASE_COUNT = 4;
const CHECK_ITEM_COUNT = 4;

/** 현재 상태 카드를 불러오는 동안 보이는 컴포넌트 */
const DashboardLiveSkeleton = () => {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
				{/*현재 개수 및 단계별 개수 자리*/}
				<div className="grid content-between gap-4.5 p-4 md:px-5.5 md:py-5">
					<CardTitle className="font-bold">실행 중인 세션</CardTitle>

					<div className="grid items-center gap-3.5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
						<Skeleton className="h-14 w-28 md:h-17" />

						<div className="grid grid-cols-2 gap-2">
							{Array.from({ length: PHASE_COUNT }, (_, index) => (
								<Skeleton key={index} className="h-22 rounded-lg" />
							))}
						</div>
					</div>
				</div>

				{/*오늘의 시작, 종료 및 시간대별 개수 자리*/}
				<div className="grid content-between gap-4 border-t bg-card-inset p-4 md:px-5.5 md:py-5 xl:border-t-0 xl:border-l">
					<div className="flex items-baseline justify-between gap-3">
						<CardTitle className="font-bold">오늘</CardTitle>
						<p className="text-[13px] text-muted-foreground">시간대별 실행 중인 세션</p>
					</div>

					<Skeleton className="h-12 w-56" />
					<Skeleton className="h-27" />
				</div>
			</Card>

			<TitledCard title="확인할 항목">
				<div className="space-y-2.5">
					{Array.from({ length: CHECK_ITEM_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-8" />
					))}
				</div>
			</TitledCard>
		</div>
	);
};

export default DashboardLiveSkeleton;

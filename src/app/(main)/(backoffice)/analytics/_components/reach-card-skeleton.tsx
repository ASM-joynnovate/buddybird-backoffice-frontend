import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** 활성 사용자 및 국가 카드를 불러오는 동안 보이는 컴포넌트 */
const ReachCardSkeleton = () => {
	return (
		<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
			<div className="min-w-0 px-5 py-4.5">
				<div className="mb-3.5 flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">활성 사용자</CardTitle>
					<p className="text-[13px] text-muted-foreground">접속 기준</p>
				</div>

				{/*기준별 그래프 세 줄 자리*/}
				<Skeleton className="h-121" />
			</div>

			<div className="grid min-w-0 content-start gap-3 border-t bg-card-inset px-5 py-4.5 xl:border-t-0 xl:border-l">
				<CardTitle className="font-bold">국가</CardTitle>

				<Skeleton className="h-75 rounded-lg max-md:h-55" />
				<Skeleton className="h-30" />
			</div>
		</Card>
	);
};

export default ReachCardSkeleton;

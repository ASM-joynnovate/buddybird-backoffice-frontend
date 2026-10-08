import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 6;

/** 피드백 목록을 불러오는 동안 보이는 컴포넌트 */
const FeedbackListSkeleton = () => {
	return (
		<Card className="gap-0 px-5 py-4.5">
			{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
				<div
					key={index}
					className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[196px_minmax(0,1fr)_auto]"
				>
					<Skeleton className="h-9" />
					<Skeleton className="h-14 max-md:col-span-full" />
					<Skeleton className="h-9 w-16 max-md:col-start-2 max-md:row-start-1" />
				</div>
			))}
		</Card>
	);
};

export default FeedbackListSkeleton;

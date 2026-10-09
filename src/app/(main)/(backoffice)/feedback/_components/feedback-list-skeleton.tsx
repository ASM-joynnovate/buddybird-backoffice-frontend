import { Card } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

/** 피드백 목록을 불러오는 동안 보이는 컴포넌트 */
const FeedbackListSkeleton = () => {
	return (
		<>
			<Card className="gap-0 px-5 py-4.5">
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<div
						key={index}
						className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[196px_minmax(0,1fr)_auto]"
					>
						<div className="flex items-center gap-2.5">
							<Skeleton className="size-9 rounded-full" />
							<div>
								<SkeletonText className="h-5 w-20" />
								<SkeletonText className="w-32 text-[13px]" />
							</div>
						</div>
						<div className="grid justify-items-start gap-1.5 max-md:col-span-full">
							<SkeletonText className="h-5 w-full max-w-100" />
							<SkeletonText className="w-56 text-[13px]" />
						</div>
						<div className="grid justify-items-end max-md:col-start-2 max-md:row-start-1">
							<SkeletonText className="h-5 w-16" />
							<SkeletonText className="w-12 text-[12.5px]" />
						</div>
					</div>
				))}
			</Card>

			{/*페이지 이동 링크*/}
			<Skeleton className="mx-auto h-9 w-60" />
		</>
	);
};

export default FeedbackListSkeleton;

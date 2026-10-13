import { cn } from '@/lib/utils';

import { emergencyGridClassName } from '@/app/(main)/(backoffice)/emergencies/_components/emergency-row';

import { Card } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 12;

/** 응급 상황 목록을 불러오는 동안 보이는 컴포넌트 */
const EmergencyListSkeleton = () => {
	return (
		<>
			<Card className="@container gap-0 px-2 pt-1 pb-2 md:px-3 md:pt-2 md:pb-3">
				<div className="border-b px-2 py-2 @max-[659px]:hidden">
					<SkeletonText className="w-8" />
				</div>

				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<div key={index} className="border-t py-1 first:border-t-0">
						<div className={cn(emergencyGridClassName, 'px-2 py-1.5')}>
							<div>
								<SkeletonText className="w-8 text-[12.5px]" />
								<SkeletonText className="w-15" />
							</div>
							<Skeleton className="size-4 @max-[659px]:row-start-2" />
							<div className="flex items-center gap-2.5">
								<Skeleton className="size-7 rounded-full" />
								<div>
									<SkeletonText className="w-14" />
									<SkeletonText className="w-20 text-[13px]" />
								</div>
							</div>
							<Skeleton className="h-9 w-full max-w-60 @max-[659px]:col-span-2 @max-[659px]:row-start-2" />
							<SkeletonText className="w-8 @max-[659px]:col-start-3 @max-[659px]:row-start-1" />
						</div>
					</div>
				))}
			</Card>

			{/*페이지 이동 링크*/}
			<Skeleton className="mx-auto h-9 w-60" />
		</>
	);
};

export default EmergencyListSkeleton;

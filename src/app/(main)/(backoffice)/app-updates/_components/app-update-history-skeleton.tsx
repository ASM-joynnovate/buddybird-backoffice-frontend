'use client';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { appUpdateGridClassName } from '@/app/(main)/(backoffice)/app-updates/_components/app-update-row';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

/** "업데이트 내역" 카드를 불러오는 동안 보이는 컴포넌트 */
const AppUpdateHistorySkeleton = () => {
	return (
		<TitledCard title="업데이트 내역" action=<Skeleton className="h-3.5 w-5" />>
			<div
				className={cn(
					appUpdateGridClassName,
					'font-medium whitespace-nowrap text-muted-foreground max-md:hidden',
				)}
			>
				<span className="pb-2">버전</span>
				<span className="pb-2">출시 노트</span>
				<span className="pb-2">강제</span>
				<span className="pb-2">등록 일시</span>
			</div>

			<div>
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<div
						key={index}
						className={cn(
							appUpdateGridClassName,
							'relative py-2.5 before:absolute before:inset-x-0 before:top-0 before:border-t before:border-border max-md:gap-y-3 max-md:first:before:hidden',
						)}
					>
						<SkeletonText className="w-10 [grid-area:ver]" />
						<SkeletonText className="w-3/5 [grid-area:notes]" />
						<Skeleton className="size-4 [grid-area:forced]" />
						{/*등록 일시 줄 및 상대 시각 줄*/}
						<div className="[grid-area:when]">
							<SkeletonText className="w-20" />
							<SkeletonText className="w-12 text-[12.5px] max-md:hidden" />
						</div>
					</div>
				))}
			</div>
		</TitledCard>
	);
};

export default AppUpdateHistorySkeleton;

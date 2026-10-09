import SessionTimelineSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/session-timeline-skeleton';
import { USER_RECENT_ITEM_COUNT } from '@/config';

import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** 세션 목록 및 고른 세션의 타임라인 카드를 불러오는 동안 보이는 컴포넌트 */
const UserSessionCardSkeleton = () => {
	return (
		<Card className="grid gap-0 py-0 md:grid-cols-[288px_minmax(0,1fr)]">
			<div className="grid content-start gap-0.5 border-b bg-card-inset p-3 md:border-r md:border-b-0">
				<div className="flex items-center justify-between gap-3 px-2 pt-2 pb-2.5">
					<CardTitle className="font-bold">세션</CardTitle>
					<SkeletonText className="w-14 text-[13px]" />
				</div>

				{Array.from({ length: USER_RECENT_ITEM_COUNT }, (_, index) => (
					<div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-0.5 px-2 pt-2.5 pb-3">
						<SkeletonText className="h-5 w-32" />
						<Skeleton className="h-5 w-14" />
						<SkeletonText className="col-span-2 mb-1.5 w-20 text-[13px]" />
						<Skeleton className="col-span-2 h-1.5 rounded-full" />
					</div>
				))}

				<div className="mx-2 mt-2.5 mb-1 flex justify-end gap-1.5">
					<Skeleton className="h-7 w-11" />
					<Skeleton className="h-7 w-11" />
				</div>
			</div>

			<SessionTimelineSkeleton />
		</Card>
	);
};

export default UserSessionCardSkeleton;

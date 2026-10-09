import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** 완료되지 않은 탈퇴 카드를 불러오는 동안 보이는 컴포넌트 */
const IncompleteWithdrawalSkeleton = () => {
	return (
		<TitledCard title="처리 중" action=<Skeleton className="h-3 w-48 max-md:hidden" />>
			<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 md:grid-cols-[196px_minmax(0,1fr)_auto]">
				<div className="flex items-center gap-2.5">
					<Skeleton className="size-9 rounded-full" />
					<div>
						<SkeletonText className="h-5 w-20" />
						<SkeletonText className="w-32 text-[13px]" />
					</div>
				</div>
				<div className="grid justify-items-start gap-2.5 max-md:col-span-full">
					<Skeleton className="h-5 w-56" />
					<Skeleton className="h-7 w-64" />
					<SkeletonText className="w-48 text-[13px]" />
				</div>
				<div className="grid justify-items-end max-md:col-start-2 max-md:row-start-1">
					<SkeletonText className="h-5 w-16" />
					<SkeletonText className="w-12 text-[12.5px]" />
				</div>
			</div>
		</TitledCard>
	);
};

export default IncompleteWithdrawalSkeleton;

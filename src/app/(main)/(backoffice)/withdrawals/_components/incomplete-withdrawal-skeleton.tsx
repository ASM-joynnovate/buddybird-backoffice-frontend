import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

/** 완료되지 않은 탈퇴 카드를 불러오는 동안 보이는 컴포넌트 */
const IncompleteWithdrawalSkeleton = () => {
	return (
		<TitledCard title="처리 중">
			<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 md:grid-cols-[196px_minmax(0,1fr)_auto]">
				<Skeleton className="h-9" />
				<Skeleton className="h-19 max-md:col-span-full" />
				<Skeleton className="h-9 w-16 max-md:col-start-2 max-md:row-start-1" />
			</div>
		</TitledCard>
	);
};

export default IncompleteWithdrawalSkeleton;

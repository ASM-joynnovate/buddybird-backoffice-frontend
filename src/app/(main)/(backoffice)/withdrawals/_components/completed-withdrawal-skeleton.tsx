import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 6;

/** 완료된 탈퇴 카드를 불러오는 동안 보이는 컴포넌트 */
const CompletedWithdrawalSkeleton = () => {
	return (
		<TitledCard title="완료">
			<div className="space-y-3">
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<Skeleton key={index} className="h-9" />
				))}
			</div>
		</TitledCard>
	);
};

export default CompletedWithdrawalSkeleton;

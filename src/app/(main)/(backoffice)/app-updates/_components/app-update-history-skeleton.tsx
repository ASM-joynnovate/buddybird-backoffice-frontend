import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

/** "업데이트 내역" 카드를 불러오는 동안 보이는 컴포넌트 */
const AppUpdateHistorySkeleton = () => {
	return (
		<TitledCard title="업데이트 내역">
			<div className="grid gap-2">
				{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
					<Skeleton key={index} className="h-11" />
				))}
			</div>
		</TitledCard>
	);
};

export default AppUpdateHistorySkeleton;

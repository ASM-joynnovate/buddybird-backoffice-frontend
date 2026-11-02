import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_BANNER_COUNT = 3;

/** 홈 배너 순서 카드를 불러오는 동안 표시하는 컴포넌트 */
const HomeBannerOrderSkeleton = () => {
	return (
		<TitledCard title="홈 배너 순서">
			<div className="flex flex-wrap items-center gap-2">
				{Array.from({ length: PLACEHOLDER_BANNER_COUNT }, (_, index) => (
					<Skeleton key={index} className="aspect-3/1 w-48 rounded-md" />
				))}
			</div>
		</TitledCard>
	);
};

export default HomeBannerOrderSkeleton;

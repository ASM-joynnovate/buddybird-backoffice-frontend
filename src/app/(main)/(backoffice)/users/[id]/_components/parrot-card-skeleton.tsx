import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_PARROT_COUNT = 2;

/** 앵무새 카드를 불러오는 동안 보이는 컴포넌트 */
const ParrotCardSkeleton = () => {
	return (
		<TitledCard title="앵무새" action=<Skeleton className="h-4 w-9" />>
			<ul className="divide-y">
				{Array.from({ length: PLACEHOLDER_PARROT_COUNT }, (_, index) => (
					<li key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
						<Skeleton className="size-14 rounded-lg" />

						<div className="grid gap-1.5">
							<SkeletonText className="h-5 w-16" />
							<Skeleton className="h-4 w-20" />
						</div>

						<SkeletonText className="ml-auto h-5 w-20" />
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default ParrotCardSkeleton;

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_RECORDING_COUNT = 3;
const PLACEHOLDER_CLOSED_WORD_COUNT = 2;

/** 단어 및 녹음 카드를 불러오는 동안 보이는 컴포넌트 */
const WordCardSkeleton = () => {
	return (
		<TitledCard title="단어" action=<Skeleton className="h-4 w-6" />>
			<div className="divide-y">
				{/*첫 단어는 펼친 상태로 표시*/}
				<div>
					<div className="flex items-center justify-between gap-2 pb-2.5">
						<SkeletonText className="h-5 w-14" />
						<SkeletonText className="h-5 w-20" />
					</div>

					<ul className="pb-2.5">
						{Array.from({ length: PLACEHOLDER_RECORDING_COUNT }, (_, index) => (
							<li key={index} className="flex items-center gap-2.5 py-1">
								<Skeleton className="size-7 rounded-full" />
								<Skeleton className="h-1 flex-1 rounded-full" />
							</li>
						))}
					</ul>
				</div>

				{Array.from({ length: PLACEHOLDER_CLOSED_WORD_COUNT }, (_, index) => (
					<div key={index} className="flex items-center justify-between gap-2 py-2.5">
						<SkeletonText className="h-5 w-14" />
						<SkeletonText className="h-5 w-20" />
					</div>
				))}
			</div>
		</TitledCard>
	);
};

export default WordCardSkeleton;

import { adEventKindSchema } from '@/types/apis/ads';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** 노출 수 및 클릭 수 그래프를 불러오는 동안 표시하는 컴포넌트 */
const AdStatChartsSkeleton = () => {
	return (
		<div className="grid gap-4.5">
			{adEventKindSchema.options.map((kind) => (
				<div key={kind} className="grid gap-2">
					<div className="flex items-baseline justify-between gap-2">
						<SkeletonText className="w-12 text-[13px]" />
						<SkeletonText className="w-16" />
					</div>

					<Skeleton className="h-38" />
				</div>
			))}
		</div>
	);
};

export default AdStatChartsSkeleton;

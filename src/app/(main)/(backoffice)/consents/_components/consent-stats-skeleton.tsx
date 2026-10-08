import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_LEGEND_COUNT = 3;
const PLACEHOLDER_RATE_GROUP_COUNT = 3;

/** 동의 통계를 불러오는 동안 보이는 컴포넌트 */
const ConsentStatsSkeleton = () => {
	return (
		<div className="mt-4 grid rounded-lg border md:grid-cols-[264px_minmax(0,1fr)]">
			<div className="px-4 pt-3.5 pb-4">
				<Skeleton className="h-5 w-16" />
				<Skeleton className="mx-auto mt-3.5 h-26 w-52.5 max-w-full rounded-t-full" />
				<div className="mt-3 space-y-2.5">
					{Array.from({ length: PLACEHOLDER_LEGEND_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-5" />
					))}
				</div>
			</div>

			<div className="grid content-start max-md:border-t md:border-l">
				<div className="px-4 pt-3.5 pb-4">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="mt-2.5 h-30" />
				</div>

				<div className="border-t px-4 pt-3.5 pb-4">
					<Skeleton className="h-5 w-16" />
					<div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(132px,1fr))] gap-x-6 gap-y-3">
						{Array.from({ length: PLACEHOLDER_RATE_GROUP_COUNT }, (_, index) => (
							<Skeleton key={index} className="h-16" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsentStatsSkeleton;

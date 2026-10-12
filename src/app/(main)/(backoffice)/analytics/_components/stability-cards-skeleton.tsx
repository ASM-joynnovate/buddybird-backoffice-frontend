import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ISSUE_COUNT = 10;
const PLACEHOLDER_ROW_COUNT = 4;

/** Sentry 카드를 불러오는 동안 보이는 컴포넌트 */
const StabilityCardsSkeleton = () => {
	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<TitledCard title="이슈" action=<span className="text-[13px] text-muted-foreground">Sentry</span>>
				<p className="border-b pb-2 font-medium text-muted-foreground">이슈</p>

				<ul className="divide-y">
					{Array.from({ length: PLACEHOLDER_ISSUE_COUNT }, (_, index) => (
						<li key={index} className="py-2.5 last:pb-0">
							{/*제목 줄 및 등급, 프로젝트 줄*/}
							<SkeletonText className="w-3/5" />
							<SkeletonText className="w-2/5 text-[12.5px]" />
						</li>
					))}
				</ul>
			</TitledCard>

			<div className="grid gap-4">
				<TitledCard
					title="충돌 없는 사용자"
					action=<span className="text-[13px] text-muted-foreground">Sentry</span>
				>
					<SkeletonText className="mb-4.5 w-28 text-[30px] leading-[1.2]" />

					<h3 className="text-[13px] font-semibold">릴리스</h3>

					<ul className="mt-2 grid gap-2.5">
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
							<li key={index}>
								<SkeletonText />
							</li>
						))}
					</ul>
				</TitledCard>

				<TitledCard
					title="프로젝트별 오류"
					action=<span className="text-[13px] text-muted-foreground">Sentry</span>
				>
					<ul className="grid gap-2.5">
						{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
							<li key={index} className="grid grid-cols-[156px_minmax(0,1fr)_48px] items-center gap-2.5">
								<SkeletonText className="w-28" />
								<Skeleton className="h-2 rounded-full" />
								<SkeletonText className="ml-auto w-8" />
							</li>
						))}
					</ul>
				</TitledCard>
			</div>
		</div>
	);
};

export default StabilityCardsSkeleton;

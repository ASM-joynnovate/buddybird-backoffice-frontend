import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 5;

/** 수면 시간 및 알림 설정 카드를 불러오는 동안 보이는 컴포넌트 */
const SettingsCardSkeleton = () => {
	return (
		<TitledCard title="설정">
			<div className="border-b pb-4">
				<div className="mb-2.5 flex justify-between gap-3">
					<span className="text-muted-foreground">수면 시간</span>
					<SkeletonText className="h-5 w-24" />
				</div>

				<Skeleton className="h-2 rounded-full" />

				<ol
					aria-hidden
					className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums"
				>
					<li>0시</li>
					<li>6시</li>
					<li>12시</li>
					<li>18시</li>
					<li>24시</li>
				</ol>
			</div>

			<section className="pt-3">
				<h3 className="mb-1 font-bold">알림</h3>

				<ul className="divide-y">
					<li className="flex items-center justify-between gap-3 py-2">
						<span className="text-muted-foreground">전체 알림</span>
						<Skeleton className="h-4 w-7 rounded-full" />
					</li>

					{/*알림 설정 이름 줄 및 결정 일시 줄*/}
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<li key={index} className="flex items-center justify-between gap-3 py-2 last:pb-0">
							<div className="grid">
								<SkeletonText className="w-24" />
								<SkeletonText className="w-28 text-[12.5px]" />
							</div>
							<Skeleton className="h-4 w-7 rounded-full" />
						</li>
					))}
				</ul>
			</section>
		</TitledCard>
	);
};

export default SettingsCardSkeleton;

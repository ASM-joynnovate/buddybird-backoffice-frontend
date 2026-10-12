import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { VISIBLE_EVENT_COUNT } from '@/config';
import { ONBOARDING_STEPS } from '@/config/analytics';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const COMPOSITION_TITLES = ['기기', '앱 버전'];

/** Google Analytics 카드를 불러오는 동안 보이는 컴포넌트 */
const AnalyticsCardsSkeleton = () => {
	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<TitledCard
				title="이벤트"
				action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>
			>
				<p className="flex h-10 items-center border-b font-medium text-muted-foreground">이벤트</p>

				<ul className="divide-y">
					{Array.from({ length: VISIBLE_EVENT_COUNT }, (_, index) => (
						<li key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 py-2.5">
							<SkeletonText className="w-28" />
							<Skeleton className="my-1.5 h-2 rounded-full" />
						</li>
					))}
				</ul>
			</TitledCard>

			<div className="grid gap-4">
				<TitledCard
					title="온보딩"
					action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>
				>
					<SkeletonText className="w-20 text-[30px] leading-[1.2]" />
					<SkeletonText className="mb-4 w-44 text-[13px]" />

					<ol className="grid gap-2.5">
						{ONBOARDING_STEPS.map(({ step, label }) => (
							<li
								key={step}
								className="grid grid-cols-[132px_minmax(0,1fr)_56px_40px] items-center gap-2.5"
							>
								<span className="truncate text-[13px] text-muted-foreground">{label}</span>
								<Skeleton className="h-2 rounded-full" />
								<SkeletonText className="col-span-2 ml-auto w-16" />
							</li>
						))}
					</ol>
				</TitledCard>

				<TitledCard
					title="구성"
					action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>
				>
					<div className="grid gap-4.5">
						{COMPOSITION_TITLES.map((title) => (
							<section key={title}>
								<h3 className="mb-2 text-[13px] font-semibold">{title}</h3>
								<Skeleton className="h-3 rounded-full" />
								<SkeletonText className="mt-2 w-40 text-[13px]" />
							</section>
						))}
					</div>
				</TitledCard>
			</div>
		</div>
	);
};

export default AnalyticsCardsSkeleton;

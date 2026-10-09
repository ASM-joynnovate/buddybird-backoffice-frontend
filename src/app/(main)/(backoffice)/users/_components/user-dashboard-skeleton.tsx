import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import UserFilterIcon from '@/app/(main)/(backoffice)/users/_components/user-filter-icon';
import { VISIBLE_SPECIES_COUNT } from '@/config';
import { USER_FILTER_GROUPS } from '@/config/user-filters';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const TREND_SERIES = [
	{ label: '전체', colorClassName: 'bg-foreground' },
	{ label: '가입', colorClassName: 'bg-chart-1' },
	{ label: '탈퇴', colorClassName: 'bg-chart-2' },
];
const TREND_STAT_LABELS = ['가입', '탈퇴', '변화'];
// 구성 카드에 보통 표시되는 값
const COMPOSITIONS = [
	{ name: 'account', values: ['google', 'apple', 'kakao', 'anonymous'] },
	{ name: 'device', values: ['ios', 'android'] },
	{ name: 'notification', values: ['pushable', 'unpushable'] },
];

/** 사용자 대시보드 카드를 불러오는 동안 보이는 컴포넌트 */
const UserDashboardSkeleton = () => {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
			<TitledCard
				title="사용자 추이"
				className="xl:col-span-2"
				action=<div className="flex gap-4 text-[13px] text-muted-foreground max-md:hidden">
					{TREND_SERIES.map((trendSeries) => (
						<span key={trendSeries.label} className="inline-flex items-center gap-1.5">
							<span className={`size-2 rounded-full ${trendSeries.colorClassName}`} />
							{trendSeries.label}
						</span>
					))}
				</div>
			>
				<div className="grid items-start gap-2 md:grid-cols-[210px_minmax(0,1fr)] md:gap-7">
					<div>
						<SkeletonText className="w-40 text-[44px] leading-[1.1]" />
						<SkeletonText className="mt-1.5 mb-4 w-32 text-[13px]" />

						<dl className="divide-y">
							{TREND_STAT_LABELS.map((label) => (
								<div
									key={label}
									className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
								>
									<dt className="text-muted-foreground">{label}</dt>
									<dd>
										<SkeletonText className="h-5 w-14" />
									</dd>
								</div>
							))}
						</dl>
					</div>

					{/*전체 사용자 수 및 가입, 탈퇴 그래프 자리*/}
					<Skeleton className="h-66" />
				</div>
			</TitledCard>

			<TitledCard title="마지막 세션">
				<Skeleton className="h-3 rounded-full" />

				<ul className="mt-3.5 grid gap-0.5">
					{USER_FILTER_GROUPS[0].options.map((filterOption) => (
						<li key={filterOption.value} className="flex items-center gap-2 py-1.5">
							<span className="size-2 shrink-0 rounded-full bg-muted" />
							{filterOption.label}
							<SkeletonText className="ml-auto h-5 w-20" />
						</li>
					))}
				</ul>
			</TitledCard>

			<TitledCard
				title="활성 사용자"
				action=<span className="text-[13px] text-muted-foreground">세션 실행 기준</span>
			>
				<Skeleton className="h-65" />
			</TitledCard>

			<TitledCard title="구성">
				<div className="grid gap-4.5">
					{COMPOSITIONS.map((composition) => {
						const filterGroup = USER_FILTER_GROUPS.find(({ name }) => name === composition.name);

						return (
							<section key={composition.name}>
								<h3 className="mb-2 text-[13px] font-semibold">{filterGroup?.label}</h3>
								<Skeleton className="h-3 rounded-full" />

								{/*줄바꿈 위치가 같도록 실제 이름 및 로고 표시*/}
								<ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px]">
									{composition.values.map((value) => {
										const filterOption = filterGroup?.options.find(
											(option) => option.value === value,
										);

										return (
											<li key={value}>
												<span className="inline-flex items-center gap-1.5 text-muted-foreground">
													<span className="size-2 shrink-0 rounded-full bg-muted" />
													<UserFilterIcon listParams={filterOption?.listParams} />
													{filterOption?.label}
													<Skeleton className="h-3.5 w-6" />
												</span>
											</li>
										);
									})}
								</ul>
							</section>
						);
					})}
				</div>
			</TitledCard>

			<TitledCard title="앵무새 종" action=<Skeleton className="h-3.5 w-20" />>
				<ul className="grid gap-2.5">
					{Array.from({ length: VISIBLE_SPECIES_COUNT }, (_, index) => (
						<li key={index} className="grid grid-cols-[104px_minmax(0,1fr)_40px] items-center gap-2.5">
							<SkeletonText className="h-5 w-20" />
							<Skeleton className="h-2 rounded-full" />
							<SkeletonText className="ml-auto h-5 w-8" />
						</li>
					))}
				</ul>
			</TitledCard>
		</div>
	);
};

export default UserDashboardSkeleton;

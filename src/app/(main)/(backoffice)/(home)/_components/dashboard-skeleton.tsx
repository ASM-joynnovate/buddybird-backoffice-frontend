import { Activity, MessageSquare, Play, TriangleAlert, UsersRound } from 'lucide-react';

import KpiCard from '@/app/(main)/(backoffice)/(home)/_components/kpi-card';
import RecentFeedbackCard from '@/app/(main)/(backoffice)/(home)/_components/recent-feedback-card';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { VISIBLE_VERSION_COUNT } from '@/config';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const ANNOUNCEMENT_ROW_COUNT = 3;
const NOTIFICATION_KIND_ROW_COUNT = 3;
const NOTIFICATION_SECTIONS = [
	{ title: '발송 예정', rowCount: 2 },
	{ title: '최근 발송', rowCount: 3 },
];

/** 기간별 카드를 불러오는 동안 보이는 컴포넌트 */
const DashboardSkeleton = () => {
	return (
		<>
			<div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
				<KpiCard label="사용자" icon={UsersRound} href="/users" linkLabel="사용자 화면 열기">
					<SkeletonText className="w-24 text-2xl leading-tight md:text-3xl" />
					<SkeletonText className="w-20 text-[13px]" />
				</KpiCard>

				<KpiCard label="활성 사용자" icon={Activity}>
					<SkeletonText className="w-24 text-2xl leading-tight md:text-3xl" />
					<p className="text-[13px] text-muted-foreground">세션을 시작한 사용자</p>
				</KpiCard>

				<KpiCard label="세션" icon={Play}>
					<SkeletonText className="w-24 text-2xl leading-tight md:text-3xl" />
					<SkeletonText className="w-32 text-[13px]" />
				</KpiCard>

				<KpiCard label="피드백" icon={MessageSquare} href="/feedback" linkLabel="피드백 화면 열기">
					<SkeletonText className="w-24 text-2xl leading-tight md:text-3xl" />
					<SkeletonText className="w-32 text-[13px]" />
				</KpiCard>
			</div>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="contents xl:grid xl:gap-4">
					<TitledCard title="세션">
						<dl className="mb-4.5 grid grid-cols-3 gap-2">
							<StatCell label="하루 평균">
								<SkeletonText className="my-0.5 h-6 w-16 *:bg-background" />
							</StatCell>
							<StatCell label="시간 합계">
								<SkeletonText className="my-0.5 h-6 w-16 *:bg-background" />
							</StatCell>
							<StatCell label="평균 시간">
								{/*좁은 화면에서는 실제 값이 두 줄로 줄바꿈*/}
								<SkeletonText className="my-0.5 h-6 w-16 *:bg-background" />
								{/*앞 줄과 겹치는 여백만큼 위 여백을 늘림*/}
								<SkeletonText className="mt-1 mb-0.5 h-6 w-16 *:bg-background sm:hidden" />
							</StatCell>
						</dl>

						<Skeleton className="h-65" />
					</TitledCard>

					<TitledCard
						title="가입 및 탈퇴"
						action=<div className="flex gap-4 text-[13px] text-muted-foreground max-md:hidden">
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-chart-1" />
								가입
								<Skeleton className="h-3.5 w-8" />
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-chart-2" />
								탈퇴
								<Skeleton className="h-3.5 w-8" />
							</span>
						</div>
					>
						<Skeleton className="h-55" />
					</TitledCard>

					<RecentFeedbackCard />
				</div>

				<div className="contents xl:grid xl:gap-4">
					<TitledCard title="공지" href="/announcements" linkLabel="공지 관리">
						<ul className="divide-y">
							{Array.from({ length: ANNOUNCEMENT_ROW_COUNT }, (_, index) => (
								<li
									key={index}
									className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-2.5 first:pt-0 last:pb-0"
								>
									<SkeletonText className="h-5 w-40" />
									<Skeleton className="h-5 w-12" />
									<SkeletonText className="col-span-2 w-28 text-[13px]" />
								</li>
							))}
						</ul>
					</TitledCard>

					<TitledCard title="앱 버전" href="/app-updates" linkLabel="앱 업데이트">
						{/*최신 버전의 행 및 나머지를 합친 행*/}
						<ul className="divide-y">
							{Array.from({ length: VISIBLE_VERSION_COUNT + 1 }, (_, index) => (
								<li key={index} className="py-3 first:pt-0">
									<div className="flex items-baseline gap-2">
										<SkeletonText className="mr-auto w-12" />
										<SkeletonText className="w-18 text-[13px]" />
									</div>
									<Skeleton className="mt-2 h-2 rounded-full" />
								</li>
							))}
						</ul>

						<div className="mt-1 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px]">
							<TriangleAlert className="size-4 text-warning" />
							최소 지원 버전보다 낮은 기기
							<Skeleton className="ml-auto h-3.5 w-10" />
						</div>
					</TitledCard>

					<TitledCard title="알림" href="/notifications" linkLabel="발송 이력">
						<Skeleton className="mx-auto mt-1 h-26 w-52.5 max-w-full rounded-t-full" />

						<ul className="mt-3.5 divide-y">
							{Array.from({ length: NOTIFICATION_KIND_ROW_COUNT }, (_, index) => (
								<li key={index} className="py-1.5">
									<SkeletonText className="h-5" />
								</li>
							))}

							<li className="flex items-center gap-2 py-1.5">
								전체
								<SkeletonText className="mr-13 ml-auto h-5 w-12" />
							</li>
						</ul>

						{NOTIFICATION_SECTIONS.map((notificationSection) => (
							<section key={notificationSection.title} className="mt-3.5 border-t pt-3">
								<h3 className="text-[12.5px] font-semibold text-muted-foreground">
									{notificationSection.title}
								</h3>

								<ul className="divide-y">
									{Array.from({ length: notificationSection.rowCount }, (_, index) => (
										<li
											key={index}
											className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-2.5 last:pb-0"
										>
											<SkeletonText className="h-5 w-40" />
											<SkeletonText className="h-5 w-12" />
											<SkeletonText className="col-span-2 w-36 text-[13px]" />
										</li>
									))}
								</ul>
							</section>
						))}
					</TitledCard>
				</div>
			</div>
		</>
	);
};

export default DashboardSkeleton;

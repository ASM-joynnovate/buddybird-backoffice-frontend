import { Activity, MessageSquare, Play, UsersRound } from 'lucide-react';

import KpiCard from '@/app/(main)/(backoffice)/(home)/_components/kpi-card';
import RecentFeedbackCard from '@/app/(main)/(backoffice)/(home)/_components/recent-feedback-card';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 3;

/** 기간별 카드를 불러오는 동안 보이는 컴포넌트 */
const DashboardSkeleton = () => {
	return (
		<>
			<div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
				<KpiCard label="가입" icon={UsersRound} href="/users" linkLabel="사용자 화면 열기">
					<Skeleton className="h-8 w-24 md:h-9" />
					<Skeleton className="h-5 w-32" />
				</KpiCard>

				<KpiCard label="활성 사용자" icon={Activity}>
					<Skeleton className="h-8 w-24 md:h-9" />
					<Skeleton className="h-5 w-32" />
				</KpiCard>

				<KpiCard label="세션" icon={Play}>
					<Skeleton className="h-8 w-24 md:h-9" />
					<Skeleton className="h-5 w-32" />
				</KpiCard>

				<KpiCard label="피드백" icon={MessageSquare} href="/feedback" linkLabel="피드백 화면 열기">
					<Skeleton className="h-8 w-24 md:h-9" />
					<Skeleton className="h-5 w-32" />
				</KpiCard>
			</div>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="contents xl:grid xl:gap-4">
					<TitledCard title="세션">
						<dl className="mb-4.5 grid grid-cols-3 gap-2">
							<StatCell label="하루 평균">
								<Skeleton className="my-0.5 h-6 w-16 bg-background" />
							</StatCell>
							<StatCell label="시간 합계">
								<Skeleton className="my-0.5 h-6 w-16 bg-background" />
							</StatCell>
							<StatCell label="평균 시간">
								<Skeleton className="my-0.5 h-6 w-16 bg-background" />
							</StatCell>
						</dl>

						<Skeleton className="h-65" />
					</TitledCard>

					<TitledCard title="가입 및 탈퇴">
						<Skeleton className="h-55" />
					</TitledCard>

					<RecentFeedbackCard />
				</div>

				<div className="contents xl:grid xl:gap-4">
					<TitledCard title="공지" href="/announcements" linkLabel="공지 관리">
						<div className="space-y-2.5">
							{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
								<Skeleton key={index} className="h-11" />
							))}
						</div>
					</TitledCard>

					<TitledCard title="앱 버전" href="/app-updates" linkLabel="앱 업데이트">
						<div className="space-y-2.5">
							{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
								<Skeleton key={index} className="h-11" />
							))}

							<Skeleton className="h-10 rounded-lg" />
						</div>
					</TitledCard>

					<TitledCard title="알림" href="/notifications" linkLabel="발송 이력">
						<Skeleton className="mx-auto mt-1 h-26 w-52 max-w-full rounded-t-full" />

						<div className="mt-3.5 space-y-2">
							{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
								<Skeleton key={index} className="h-6" />
							))}
						</div>
					</TitledCard>
				</div>
			</div>
		</>
	);
};

export default DashboardSkeleton;

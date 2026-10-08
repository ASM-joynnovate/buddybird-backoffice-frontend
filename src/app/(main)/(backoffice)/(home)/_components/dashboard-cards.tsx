'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetDashboard } from '@/hooks/apis/dashboard';

import { Activity, MessageSquare, Play, UsersRound } from 'lucide-react';

import AnnouncementCard from '@/app/(main)/(backoffice)/(home)/_components/announcement-card';
import AppVersionCard from '@/app/(main)/(backoffice)/(home)/_components/app-version-card';
import KpiCard from '@/app/(main)/(backoffice)/(home)/_components/kpi-card';
import KpiCount from '@/app/(main)/(backoffice)/(home)/_components/kpi-count';
import NotificationCard from '@/app/(main)/(backoffice)/(home)/_components/notification-card';
import RecentFeedbackCard from '@/app/(main)/(backoffice)/(home)/_components/recent-feedback-card';
import SessionCard from '@/app/(main)/(backoffice)/(home)/_components/session-card';
import SignupWithdrawalCard from '@/app/(main)/(backoffice)/(home)/_components/signup-withdrawal-card';
import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import { countDays } from '@/utils/date';

interface Props {
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 기간별 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const DashboardCards = ({ dashboardParams, today }: Props) => {
	const { data: dashboardData } = useGetDashboard(dashboardParams);

	const dayCount = countDays(dashboardParams.date_from, dashboardParams.date_to);

	return (
		<>
			<div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
				<KpiCard label="가입" icon={UsersRound} href="/users" linkLabel="사용자 화면 열기">
					<KpiCount count={dashboardData.users.signup_count} unit="명" />
					<CountChange
						count={dashboardData.users.signup_count}
						previousCount={dashboardData.users.previous_signup_count}
						dayCount={dayCount}
						unit="명"
					/>
				</KpiCard>

				<KpiCard label="활성 사용자" icon={Activity}>
					<KpiCount count={dashboardData.users.active_count} unit="명" />
					<p className="text-[13px] text-muted-foreground">세션을 시작한 사용자</p>
				</KpiCard>

				<KpiCard label="세션" icon={Play}>
					<KpiCount count={dashboardData.sessions.count} unit="회" />
					<CountChange
						count={dashboardData.sessions.count}
						previousCount={dashboardData.sessions.previous_count}
						dayCount={dayCount}
						unit="회"
					/>
				</KpiCard>

				<KpiCard label="피드백" icon={MessageSquare} href="/feedback" linkLabel="피드백 화면 열기">
					<KpiCount count={dashboardData.feedback.count} unit="건" />
					<CountChange
						count={dashboardData.feedback.count}
						previousCount={dashboardData.feedback.previous_count}
						dayCount={dayCount}
						unit="건"
					/>
				</KpiCard>
			</div>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="contents xl:grid xl:gap-4">
					<SessionCard sessions={dashboardData.sessions} today={today} />
					<SignupWithdrawalCard
						users={dashboardData.users}
						withdrawals={dashboardData.withdrawals}
						today={today}
					/>
					<RecentFeedbackCard />
				</div>

				<div className="contents xl:grid xl:gap-4">
					<AnnouncementCard
						announcements={dashboardData.announcements}
						userCount={dashboardData.users.total_count}
					/>
					<AppVersionCard devices={dashboardData.devices} />
					<NotificationCard notifications={dashboardData.notifications} />
				</div>
			</div>
		</>
	);
};

export default DashboardCards;

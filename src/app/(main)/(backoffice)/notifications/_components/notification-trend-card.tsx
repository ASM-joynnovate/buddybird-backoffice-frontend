'use client';

import { useRouter } from 'next/navigation';

import type { DashboardParams, NotificationDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { NOTIFICATION_KINDS } from '@/config/notification';
import { addDays, countDays } from '@/utils/date';
import { toNotificationKindDisplay } from '@/utils/notification';
import { toToggledQuery, toUrlSearchParams } from '@/utils/search-params';

interface Props {
	notificationDashboard: NotificationDashboard;
	dashboardParams: DashboardParams;
	selectedDate?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 알림 추이 카드 컴포넌트
 * @param notificationDashboard 알림 대시보드 집계
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param selectedDate 목록에 표시할 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const NotificationTrendCard = ({ notificationDashboard, dashboardParams, selectedDate, query, today }: Props) => {
	const router = useRouter();

	const { notifications, kinds, daily } = notificationDashboard;

	const readCount = kinds.reduce((sum, kindCount) => sum + kindCount.read_count, 0);
	const pushSentCount = kinds.reduce((sum, kindCount) => sum + kindCount.push_sent_count, 0);
	const dates = Array.from({ length: countDays(dashboardParams.date_from, dashboardParams.date_to) }, (_, index) =>
		addDays(dashboardParams.date_from, index),
	);
	// 아래부터 리포트, 공지, 마케팅, 긴급, 응급 순서로 쌓음
	const kindSeries = [
		...new Set([...Object.keys(NOTIFICATION_KINDS), ...daily.map((dailyCount) => dailyCount.kind)]),
	].map((kind) => ({
		dataKey: kind,
		name: toNotificationKindDisplay(kind).label,
		color: toNotificationKindDisplay(kind).color,
	}));
	// 알림이 없는 날짜는 0
	const dailyCounts = dates.map((date) => ({
		date,
		...Object.fromEntries(
			kindSeries.map(({ dataKey }) => [
				dataKey,
				daily.find((dailyCount) => dailyCount.date === date && dailyCount.kind === dataKey)?.count ?? 0,
			]),
		),
	}));

	/** 알림 수 대비 비율 문구를 반환하는 함수 */
	const toPercentText = (count: number) => {
		return `${notifications.count ? Math.round((count / notifications.count) * 100) : 0}%`;
	};

	const handleToggleDate = (date: string) => {
		router.push(`/notifications?${toUrlSearchParams(toToggledQuery(query, 'date', date))}`, { scroll: false });
	};

	return (
		<TitledCard title="알림 추이">
			<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
				{notifications.count.toLocaleString('ko-KR')}
				<span className="ml-0.5 text-lg font-semibold tracking-normal text-muted-foreground">건</span>
			</p>

			<div className="mt-1.5">
				<CountChange
					count={notifications.count}
					previousCount={notifications.previous_count}
					dayCount={dates.length}
					unit="건"
				/>
			</div>

			<div className="mt-3.5">
				{/*선택한 날짜, 없으면 오늘만 진하게 표시*/}
				<DailyCountChart
					daily={dailyCounts}
					title="일별 알림 수"
					series={kindSeries}
					unit="건"
					highlightedDate={selectedDate ?? today}
					today={today}
					onSelectDate={handleToggleDate}
				/>
			</div>

			<dl className="mt-3.5 grid grid-cols-2 gap-2">
				<StatCell label="읽음">{toPercentText(readCount)}</StatCell>
				<StatCell label="푸시 발송">{toPercentText(pushSentCount)}</StatCell>
			</dl>
		</TitledCard>
	);
};

export default NotificationTrendCard;

'use client';

import { useRouter } from 'next/navigation';

import type { NotificationDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toToggledQuery } from '@/utils/search-params';

// 아래부터 리포트, 공지, 마케팅, 긴급 순서로 쌓음
const KIND_SERIES = Object.entries(NOTIFICATION_KINDS).map(([kind, { label, color }]) => ({
	dataKey: kind,
	name: label,
	color,
}));

interface Props {
	notificationDashboard: NotificationDashboard;
	selectedDate?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 알림 추이 카드 컴포넌트
 * @param notificationDashboard 알림 대시보드 집계
 * @param selectedDate 목록에 표시할 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const NotificationTrendCard = ({ notificationDashboard, selectedDate, query, today }: Props) => {
	const router = useRouter();

	const { notifications, kinds, daily } = notificationDashboard;

	const readCount = kinds.reduce((sum, kindCount) => sum + kindCount.read_count, 0);
	const pushSentCount = kinds.reduce((sum, kindCount) => sum + kindCount.push_sent_count, 0);
	const dailyCounts = daily.map((dailyCount) => ({
		date: dailyCount.date,
		report: dailyCount.report_count,
		announcement: dailyCount.announcement_count,
		marketing: dailyCount.marketing_count,
		urgent: dailyCount.urgent_count,
	}));

	/** 알림 수에 대한 비율 문구를 반환하는 함수 */
	const toPercentText = (count: number) => {
		return `${notifications.count ? Math.round((count / notifications.count) * 100) : 0}%`;
	};

	const handleToggleDate = (date: string) => {
		const searchParams = new URLSearchParams(
			Object.entries(toToggledQuery(query, 'date', date)).map(([name, value]) => [name, String(value)]),
		);

		router.push(`/notifications?${searchParams.toString()}`, { scroll: false });
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
					dayCount={daily.length}
					unit="건"
				/>
			</div>

			<div className="mt-3.5">
				{/*고른 날짜, 없으면 오늘만 진하게 표시*/}
				<DailyCountChart
					daily={dailyCounts}
					title="일별 알림 수"
					series={KIND_SERIES}
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

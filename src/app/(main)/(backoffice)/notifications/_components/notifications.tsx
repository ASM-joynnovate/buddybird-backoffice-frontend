import type { DashboardParams } from '@/types/apis/dashboard';
import type { NotificationDispatchListParams, NotificationListParams } from '@/types/apis/notifications';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import dayjs from 'dayjs';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import SearchBar from '@/app/(main)/(backoffice)/_components/search-bar';
import DispatchResultCount from '@/app/(main)/(backoffice)/notifications/_components/dispatch-result-count';
import NotificationDashboardCards from '@/app/(main)/(backoffice)/notifications/_components/notification-dashboard-cards';
import NotificationDashboardSkeleton from '@/app/(main)/(backoffice)/notifications/_components/notification-dashboard-skeleton';
import NotificationFeed from '@/app/(main)/(backoffice)/notifications/_components/notification-feed';
import NotificationResultCount from '@/app/(main)/(backoffice)/notifications/_components/notification-result-count';
import SendNotificationButton from '@/app/(main)/(backoffice)/notifications/_components/send-notification-button';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	scheduledListParams?: NotificationDispatchListParams;
	dispatchListParams?: NotificationDispatchListParams;
	notificationListParams: NotificationListParams;
	recipientNickname?: string;
	date?: string;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 알림 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param scheduledListParams "발송 예정" 조회 조건
 * @param dispatchListParams 발송 목록 조회 조건
 * @param notificationListParams 알림 목록 조회 조건
 * @param recipientNickname 고른 받는 사람의 닉네임
 * @param date "알림 추이"에서 고른 날짜
 * @param listQuery 기간 및 날짜를 뺀 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Notifications = ({
	period,
	dashboardParams,
	scheduledListParams,
	dispatchListParams,
	notificationListParams,
	recipientNickname,
	date,
	listQuery,
	query,
	today,
	now,
}: Props) => {
	const { keyword, kind } = notificationListParams;

	const selectedFilters: SelectedFilter[] = [
		...(recipientNickname ? [{ name: 'user_id', groupLabel: '받는 사람', label: recipientNickname }] : []),
		...(kind ? [{ name: 'kind', groupLabel: '종류', label: NOTIFICATION_KINDS[kind].label }] : []),
		...(date ? [{ name: 'date', groupLabel: '날짜', label: dayjs(date).format('M월 D일') }] : []),
	];

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">알림</h1>

				<PeriodFilter
					pathname="/notifications"
					query={listQuery}
					period={period}
					dashboardParams={dashboardParams}
					today={today}
				/>
			</div>

			<SearchBar
				pathname="/notifications"
				placeholder="제목, 본문, 사용자 ID"
				keyword={keyword}
				query={query}
				selectedFilters={selectedFilters}
			>
				{(!!keyword || selectedFilters.length > 0) && (
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
						{dispatchListParams ? (
							<DispatchResultCount listParams={dispatchListParams} />
						) : (
							<NotificationResultCount listParams={notificationListParams} />
						)}
					</ErrorHandlingWrapper>
				)}

				<SendNotificationButton className="ml-auto max-md:w-full" />
			</SearchBar>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="@container min-w-0">
					<NotificationFeed
						scheduledListParams={scheduledListParams}
						dispatchListParams={dispatchListParams}
						notificationListParams={notificationListParams}
						filterSelected={selectedFilters.length > 0}
						query={query}
						initialNow={now}
					/>
				</div>

				<div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:sticky xl:top-15">
					{/*조회 기간이 바뀌면 다시 마운트*/}
					<ErrorHandlingWrapper
						key={[dashboardParams.date_from, dashboardParams.date_to].join(':')}
						fallbackComponent={QueryError}
						suspenseFallback=<NotificationDashboardSkeleton />
					>
						<NotificationDashboardCards
							dashboardParams={dashboardParams}
							date={date}
							query={query}
							today={today}
						/>
					</ErrorHandlingWrapper>
				</div>
			</div>
		</>
	);
};

export default Notifications;

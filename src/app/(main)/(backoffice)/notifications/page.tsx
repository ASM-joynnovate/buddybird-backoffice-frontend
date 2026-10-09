import { redirect } from 'next/navigation';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { notificationKindSchema } from '@/types/apis/notifications';
import { localDateSchema, uuidSchema } from '@/types/apis/primitives';

import { getNotificationDashboardOptions } from '@/hooks/apis/dashboard';
import { getNotificationDispatchListOptions, getNotificationListOptions } from '@/hooks/apis/notifications';
import { getUserOptions } from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import Notifications from '@/app/(main)/(backoffice)/notifications/_components/notifications';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod, toOptionalText, toPageNumber } from '@/utils/search-params';

const SCHEDULED_DISPATCH_COUNT = 100;

/** 알림 페이지 */
export default async function Page(props: PageProps<'/notifications'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();
	const keyword = toOptionalText(searchParams.keyword);

	// 사용자 ID로 검색하면 그 사용자가 받은 알림 조회
	if (uuidSchema.safeParse(keyword).success) {
		redirect(`/notifications?user_id=${keyword}`);
	}

	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const kind = notificationKindSchema.safeParse(searchParams.kind).data;
	const user_id = uuidSchema.safeParse(searchParams.user_id).data;
	// 조회 기간 밖의 날짜는 무시
	const date = localDateSchema
		.refine((value) => value >= dashboardParams.date_from && value <= dashboardParams.date_to)
		.safeParse(searchParams.date).data;

	const sentListParams = {
		page: toPageNumber(searchParams.page),
		is_sent: true,
		keyword,
		sent_from: date ?? dashboardParams.date_from,
		sent_to: date ?? dashboardParams.date_to,
	};
	const notificationListParams = { ...sentListParams, kind, user_id };
	// 사용자 및 리포트가 아니면 발송 단위로 조회
	const dispatchListParams = !user_id && kind !== 'report' ? { ...sentListParams, kind } : undefined;
	const scheduledListParams = dispatchListParams && {
		page: 1,
		is_sent: false,
		count_by_page: SCHEDULED_DISPATCH_COUNT,
		kind: dispatchListParams.kind,
	};

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = { keyword, kind, user_id };
	const query = { ...(customDashboardParams ?? { period }), ...listQuery, date };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getNotificationDashboardOptions(dashboardParams));

	if (dispatchListParams && scheduledListParams) {
		void queryClient.prefetchQuery(getNotificationDispatchListOptions(dispatchListParams));
		void queryClient.prefetchQuery(getNotificationDispatchListOptions(scheduledListParams));
	} else {
		void queryClient.prefetchQuery(getNotificationListOptions(notificationListParams));
	}

	// "받는 사람" 칩에 표시할 닉네임, 조회에 실패하면 사용자 ID 앞부분
	const recipientNickname = user_id
		? await queryClient
				.fetchQuery(getUserOptions({ id: user_id }))
				.then((recipient) => recipient.nickname ?? '닉네임 없음')
				.catch(() => user_id.slice(0, 8))
		: undefined;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Notifications
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				scheduledListParams={scheduledListParams}
				dispatchListParams={dispatchListParams}
				notificationListParams={notificationListParams}
				recipientNickname={recipientNickname}
				date={date}
				listQuery={listQuery}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}

import type { DashboardParams } from '@/types/apis/dashboard';
import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import type { SearchParamValue } from '@/lib/api';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import CompletedWithdrawalCard from '@/app/(main)/(backoffice)/withdrawals/_components/completed-withdrawal-card';
import CompletedWithdrawalSkeleton from '@/app/(main)/(backoffice)/withdrawals/_components/completed-withdrawal-skeleton';
import IncompleteWithdrawalCard from '@/app/(main)/(backoffice)/withdrawals/_components/incomplete-withdrawal-card';
import IncompleteWithdrawalSkeleton from '@/app/(main)/(backoffice)/withdrawals/_components/incomplete-withdrawal-skeleton';
import WithdrawalDashboardCards from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawal-dashboard-cards';
import WithdrawalDashboardSkeleton from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawal-dashboard-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	incompleteListParams: WithdrawalListParams;
	completedListParams: WithdrawalListParams;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 탈퇴 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param incompleteListParams 완료되지 않은 탈퇴의 조회 조건
 * @param completedListParams 완료된 탈퇴의 조회 조건
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Withdrawals = ({
	period,
	dashboardParams,
	incompleteListParams,
	completedListParams,
	query,
	today,
	now,
}: Props) => {
	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">탈퇴</h1>

				<PeriodFilter pathname="/withdrawals" period={period} dashboardParams={dashboardParams} today={today} />
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<IncompleteWithdrawalSkeleton />>
				<IncompleteWithdrawalCard listParams={incompleteListParams} initialNow={now} />
			</ErrorHandlingWrapper>

			{/*조회 기간이 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={[dashboardParams.date_from, dashboardParams.date_to].join(':')}
				fallbackComponent={QueryError}
				suspenseFallback=<WithdrawalDashboardSkeleton />
			>
				<WithdrawalDashboardCards dashboardParams={dashboardParams} today={today} />
			</ErrorHandlingWrapper>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<CompletedWithdrawalSkeleton />>
				<CompletedWithdrawalCard listParams={completedListParams} query={query} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default Withdrawals;

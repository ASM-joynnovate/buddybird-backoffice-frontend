import type { DashboardParams } from '@/types/apis/dashboard';

import DashboardCards from '@/app/(main)/(backoffice)/(home)/_components/dashboard-cards';
import DashboardLiveCards from '@/app/(main)/(backoffice)/(home)/_components/dashboard-live-cards';
import DashboardLiveSkeleton from '@/app/(main)/(backoffice)/(home)/_components/dashboard-live-skeleton';
import DashboardSkeleton from '@/app/(main)/(backoffice)/(home)/_components/dashboard-skeleton';
import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 홈 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const Home = ({ period, dashboardParams, today }: Props) => {
	return (
		<>
			<h1 className="text-2xl font-bold">홈</h1>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<DashboardLiveSkeleton />>
				<DashboardLiveCards />
			</ErrorHandlingWrapper>

			<PeriodFilter pathname="/" period={period} dashboardParams={dashboardParams} today={today} />

			{/*조회 기간이 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={[dashboardParams.date_from, dashboardParams.date_to].join(':')}
				fallbackComponent={QueryError}
				suspenseFallback=<DashboardSkeleton />
			>
				<DashboardCards dashboardParams={dashboardParams} today={today} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default Home;

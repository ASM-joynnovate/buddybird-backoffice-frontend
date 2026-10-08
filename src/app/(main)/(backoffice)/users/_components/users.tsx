import type { DashboardParams } from '@/types/apis/dashboard';
import type { UserListParams } from '@/types/apis/users';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import SearchBar from '@/app/(main)/(backoffice)/_components/search-bar';
import UserDashboardCards from '@/app/(main)/(backoffice)/users/_components/user-dashboard-cards';
import UserDashboardSkeleton from '@/app/(main)/(backoffice)/users/_components/user-dashboard-skeleton';
import UserFilterIcon from '@/app/(main)/(backoffice)/users/_components/user-filter-icon';
import UserFilterPanel from '@/app/(main)/(backoffice)/users/_components/user-filter-panel';
import UserTable from '@/app/(main)/(backoffice)/users/_components/user-table';
import UserTableSkeleton from '@/app/(main)/(backoffice)/users/_components/user-table-skeleton';
import { USER_FILTER_GROUPS, type UserFilters } from '@/config/user-filters';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	listParams: UserListParams;
	userFilters: UserFilters;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 사용자 목록 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param listParams 목록 조회 조건
 * @param userFilters 필터에서 고른 값
 * @param listQuery 기간을 뺀 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Users = ({ period, dashboardParams, listParams, userFilters, listQuery, query, today, now }: Props) => {
	const selectedFilters: SelectedFilter[] = [
		...USER_FILTER_GROUPS.flatMap((filterGroup) => {
			const filterOption = filterGroup.options.find(({ value }) => value === userFilters[filterGroup.name]);

			return filterOption
				? [
						{
							name: filterGroup.name,
							groupLabel: filterGroup.label,
							label: filterOption.label,
							icon: <UserFilterIcon listParams={filterOption.listParams} />,
						},
					]
				: [];
		}),
		...(query.is_deleted ? [{ name: 'is_deleted', label: '삭제됨' }] : []),
	];

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">사용자</h1>

				<PeriodFilter
					pathname="/users"
					query={listQuery}
					period={period}
					dashboardParams={dashboardParams}
					today={today}
				/>
			</div>

			{/*조회 기간이 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={[dashboardParams.date_from, dashboardParams.date_to].join(':')}
				fallbackComponent={QueryError}
				suspenseFallback=<UserDashboardSkeleton />
			>
				<UserDashboardCards dashboardParams={dashboardParams} query={query} today={today} />
			</ErrorHandlingWrapper>

			<SearchBar
				pathname="/users"
				placeholder="닉네임, 이메일, 사용자 ID"
				keyword={listParams.keyword}
				query={query}
				selectedFilters={selectedFilters}
				filterCount={selectedFilters.length}
				filterPanel=<UserFilterPanel dashboardParams={dashboardParams} query={query} />
			/>

			{/*조건이 바뀌어도 이전 목록을 유지해 행 이동 전환 실행*/}
			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<UserTableSkeleton />>
				<UserTable listParams={listParams} query={query} initialNow={now} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default Users;

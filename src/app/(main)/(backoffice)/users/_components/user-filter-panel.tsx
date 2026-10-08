'use client';

import { Fragment } from 'react';

import Link from 'next/link';

import type { DashboardParams } from '@/types/apis/dashboard';
import { providerSchema } from '@/types/apis/users';

import { useGetUserDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import ProviderIcon from '@/app/(main)/(backoffice)/_components/provider-icon';
import { USER_FILTER_GROUPS, type UserFilters } from '@/config/user-filters';
import { toLinkQuery, toToggledQuery } from '@/utils/search-params';

const optionClassName =
	'group inline-flex h-7 items-center gap-1.5 rounded-full border bg-card px-2.5 text-[13px] font-semibold whitespace-nowrap hover:border-chart-neutral hover:bg-muted aria-[current]:border-foreground aria-[current]:bg-foreground aria-[current]:text-card';

interface Props {
	dashboardParams: DashboardParams;
	userFilters: UserFilters;
	selectedCount: number;
	query: Record<string, SearchParamValue>;
}

/**
 * 사용자 필터 패널 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param userFilters 필터에서 고른 값
 * @param selectedCount 고른 조건의 개수
 * @param query 현재 주소의 쿼리
 */
const UserFilterPanel = ({ dashboardParams, userFilters, selectedCount, query }: Props) => {
	const { data: userDashboardData } = useGetUserDashboard(dashboardParams);

	const clearedQuery = Object.fromEntries(USER_FILTER_GROUPS.map((filterGroup) => [filterGroup.name, undefined]));

	return (
		<div
			id="user-filter-panel"
			className="absolute top-[calc(100%+6px)] left-0 z-10 w-[min(560px,calc(100vw-32px))] rounded-xl bg-card p-4 text-sm shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] ring-1 ring-border"
		>
			<dl className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5">
				{USER_FILTER_GROUPS.map((filterGroup) => (
					<Fragment key={filterGroup.name}>
						<dt className="text-[13px] text-muted-foreground">{filterGroup.label}</dt>
						<dd className="flex flex-wrap gap-1.5">
							{filterGroup.options.map((filterOption) => {
								const provider = providerSchema.safeParse(filterOption.value).data;
								const lastSession = userDashboardData.last_sessions.find(
									({ last_session }) => last_session === filterOption.listParams?.last_session,
								);

								return (
									<Link
										key={filterOption.value}
										href={{
											pathname: '/users',
											query: toToggledQuery(query, filterGroup.name, filterOption.value),
										}}
										scroll={false}
										aria-current={
											userFilters[filterGroup.name] === filterOption.value ? 'true' : undefined
										}
										className={optionClassName}
									>
										{!!provider && <ProviderIcon provider={provider} className="size-4" />}
										{filterOption.label}
										{!!lastSession && (
											<span className="font-medium text-muted-foreground tabular-nums group-aria-[current]:text-card/70">
												{lastSession.count.toLocaleString('ko-KR')}
											</span>
										)}
									</Link>
								);
							})}
						</dd>
					</Fragment>
				))}

				<dt className="text-[13px] text-muted-foreground">계정 상태</dt>
				<dd>
					<Link
						href={{ pathname: '/users', query: toToggledQuery(query, 'is_deleted', true) }}
						scroll={false}
						aria-current={query.is_deleted ? 'true' : undefined}
						className={optionClassName}
					>
						삭제됨
					</Link>
				</dd>
			</dl>

			{selectedCount > 0 && (
				<footer className="mt-3.5 flex justify-end border-t pt-3">
					<Link
						href={{
							pathname: '/users',
							query: toLinkQuery({ ...query, ...clearedQuery, is_deleted: undefined }),
						}}
						scroll={false}
						className="text-[13px] font-semibold text-muted-foreground hover:underline hover:underline-offset-3"
					>
						모두 지우기
					</Link>
				</footer>
			)}
		</div>
	);
};

export default UserFilterPanel;

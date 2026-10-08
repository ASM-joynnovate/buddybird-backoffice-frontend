'use client';

import { type SyntheticEvent, useEffect, useRef } from 'react';

import Form from 'next/form';

import type { DashboardParams } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { DASHBOARD_MAX_PERIOD_DAYS, DASHBOARD_PERIODS } from '@/config';
import { addDays } from '@/utils/date';
import { toLinkQuery } from '@/utils/search-params';

interface Props {
	pathname: string;
	query?: Record<string, SearchParamValue>;
	period?: number;
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 조회 기간 선택 컴포넌트
 * @param pathname 기간을 고르면 이동할 경로
 * @param query 기간과 함께 유지할 쿼리 값
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const PeriodFilter = ({ pathname, query = {}, period, dashboardParams, today }: Props) => {
	const formRef = useRef<HTMLFormElement>(null);

	const linkQuery = toLinkQuery(query);
	const maxPeriodEnd = addDays(dashboardParams.date_from, DASHBOARD_MAX_PERIOD_DAYS - 1);

	/** 바뀐 조회 기간을 날짜 입력에 반영 */
	useEffect(() => {
		formRef.current?.reset();
	}, [dashboardParams.date_from, dashboardParams.date_to]);

	const handleChangePeriod = (event: SyntheticEvent<HTMLFormElement>) => {
		if (!event.currentTarget.checkValidity()) {
			return;
		}

		event.currentTarget.requestSubmit();
	};

	return (
		<div className="flex flex-wrap items-center gap-2.5 text-sm">
			<SegmentedControl
				label="조회 기간"
				options={DASHBOARD_PERIODS.map((dashboardPeriod) => ({
					value: dashboardPeriod,
					label: `${dashboardPeriod}일`,
					href: { pathname, query: { ...linkQuery, period: dashboardPeriod } },
				}))}
				value={period}
			/>

			<Form
				ref={formRef}
				action={pathname}
				scroll={false}
				className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-1.5 text-muted-foreground"
				onChange={handleChangePeriod}
			>
				{Object.entries(linkQuery).map(([name, value]) => (
					<input key={name} type="hidden" name={name} value={String(value)} />
				))}
				<input
					type="date"
					name="date_from"
					aria-label="조회 시작일"
					required
					defaultValue={dashboardParams.date_from}
					min={addDays(dashboardParams.date_to, 1 - DASHBOARD_MAX_PERIOD_DAYS)}
					max={dashboardParams.date_to}
					className="h-7 rounded-sm bg-transparent px-1 font-semibold text-foreground tabular-nums hover:bg-muted"
				/>
				~
				<input
					type="date"
					name="date_to"
					aria-label="조회 종료일"
					required
					defaultValue={dashboardParams.date_to}
					min={dashboardParams.date_from}
					max={maxPeriodEnd < today ? maxPeriodEnd : today}
					className="h-7 rounded-sm bg-transparent px-1 font-semibold text-foreground tabular-nums hover:bg-muted"
				/>
			</Form>
		</div>
	);
};

export default PeriodFilter;

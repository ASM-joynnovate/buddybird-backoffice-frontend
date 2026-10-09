'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import type { DashboardParams } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import dayjs from 'dayjs';
import { CalendarDays } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { DASHBOARD_MAX_PERIOD_DAYS, DASHBOARD_PERIODS } from '@/config';
import { toLinkQuery, toUrlSearchParams } from '@/utils/search-params';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
	const router = useRouter();

	const [calendarOpen, setCalendarOpen] = useState(false);
	const [selectedRange, setSelectedRange] = useState<DateRange>();

	const linkQuery = toLinkQuery(query);
	// 시작일만 고른 동안에는 최대 기간 밖의 날짜를 막음
	const rangeStart = selectedRange?.to ? undefined : selectedRange?.from;

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setSelectedRange({
				from: dayjs(dashboardParams.date_from).toDate(),
				to: dayjs(dashboardParams.date_to).toDate(),
			});
		}

		setCalendarOpen(nextOpen);
	};

	const handleSelectDate = (date: Date) => {
		if (!rangeStart) {
			setSelectedRange({ from: date, to: undefined });

			return;
		}

		const [dateFrom, dateTo] = [rangeStart, date].toSorted((a, b) => a.getTime() - b.getTime());
		const searchParams = toUrlSearchParams({
			...linkQuery,
			date_from: dayjs(dateFrom).format('YYYY-MM-DD'),
			date_to: dayjs(dateTo).format('YYYY-MM-DD'),
		});

		setCalendarOpen(false);
		router.push(`${pathname}?${searchParams}`, { scroll: false });
	};

	return (
		<div className="ml-auto flex flex-wrap items-center justify-end gap-2.5 text-sm">
			<SegmentedControl
				label="조회 기간"
				options={DASHBOARD_PERIODS.map((dashboardPeriod) => ({
					value: dashboardPeriod,
					label: `${dashboardPeriod}일`,
					href: { pathname, query: { ...linkQuery, period: dashboardPeriod } },
				}))}
				value={period}
			/>

			<Popover open={calendarOpen} onOpenChange={handleOpenChange}>
				<PopoverTrigger
					aria-label="조회 기간 선택"
					className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-3 font-semibold tabular-nums hover:bg-muted"
				>
					<CalendarDays className="size-4 text-muted-foreground" />
					{dayjs(dashboardParams.date_from).format('YYYY. MM. DD.')}
					<span className="text-muted-foreground">~</span>
					{dayjs(dashboardParams.date_to).format('YYYY. MM. DD.')}
				</PopoverTrigger>

				<PopoverContent align="end" sideOffset={12} className="w-auto p-1">
					{/*좁은 화면에서는 종료일이 있는 달만 표시*/}
					<Calendar
						mode="range"
						locale={ko}
						numberOfMonths={2}
						showOutsideDays={false}
						selected={selectedRange}
						defaultMonth={dayjs(dashboardParams.date_to).subtract(1, 'month').toDate()}
						className="max-md:[&_.rdp-month:has(+.rdp-month)]:hidden"
						disabled={[
							{ after: dayjs(today).toDate() },
							...(rangeStart
								? [
										{
											before: dayjs(rangeStart)
												.subtract(DASHBOARD_MAX_PERIOD_DAYS - 1, 'day')
												.toDate(),
										},
										{
											after: dayjs(rangeStart)
												.add(DASHBOARD_MAX_PERIOD_DAYS - 1, 'day')
												.toDate(),
										},
									]
								: []),
						]}
						onSelect={(_, date) => handleSelectDate(date)}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default PeriodFilter;

import type { AbuseReportListParams } from '@/types/apis/abuse-reports';

import type { SearchParamValue } from '@/lib/api';

import AbuseReportList from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-report-list';
import AbuseReportListSkeleton from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-report-list-skeleton';
import AbuseReportStatusFilter from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-report-status-filter';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	listParams: AbuseReportListParams;
	query: Record<string, SearchParamValue>;
	now: number;
}

/**
 * 신고 화면 컴포넌트
 * @param listParams 목록 조회 조건
 * @param query 현재 주소의 쿼리
 * @param now 서버가 화면을 그린 시각
 */
const AbuseReports = ({ listParams, query, now }: Props) => {
	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">신고</h1>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<Skeleton className="h-9 w-44" />>
					<AbuseReportStatusFilter handled={listParams.is_handled} />
				</ErrorHandlingWrapper>
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<AbuseReportListSkeleton />>
				<AbuseReportList listParams={listParams} query={query} initialNow={now} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default AbuseReports;

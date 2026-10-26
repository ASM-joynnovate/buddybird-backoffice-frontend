'use client';

import { ViewTransition } from 'react';

import type { AbuseReportListParams } from '@/types/apis/abuse-reports';

import { useGetAbuseReportList } from '@/hooks/apis/abuse-reports';
import { useNow } from '@/hooks/use-now';

import type { SearchParamValue } from '@/lib/api';

import { Check } from 'lucide-react';

import AbuseReportRow from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-report-row';

import PageNavigation from '@/components/page-navigation';
import { Card } from '@/components/ui/card';

interface Props {
	listParams: AbuseReportListParams;
	query: Record<string, SearchParamValue>;
	initialNow: number;
}

/**
 * 신고 목록 컴포넌트
 * @param listParams 목록 조회 조건
 * @param query 현재 주소의 쿼리
 * @param initialNow 서버가 화면을 렌더링한 시각
 */
const AbuseReportList = ({ listParams, query, initialNow }: Props) => {
	const { data: abuseReportListData } = useGetAbuseReportList(listParams);

	const now = useNow(initialNow);

	if (abuseReportListData.data.length === 0) {
		return (
			<Card className="grid justify-items-center gap-1.5 px-4 pt-14 pb-12 text-center">
				<Check className="size-5.5 text-success" />
				<strong className="text-base font-bold">
					{listParams.is_handled ? '처리한 신고가 없습니다' : '처리할 신고가 없습니다'}
				</strong>
			</Card>
		);
	}

	return (
		<>
			<Card className="gap-0 px-5 py-4.5">
				{abuseReportListData.data.map((abuseReport) => (
					<ViewTransition key={abuseReport.id} name={`abuse-report-${abuseReport.id}`}>
						<AbuseReportRow abuseReport={abuseReport} now={now} />
					</ViewTransition>
				))}
			</Card>

			<PageNavigation meta={abuseReportListData.meta} pathname="/abuse-reports" query={query} />
		</>
	);
};

export default AbuseReportList;

'use client';

import { useState } from 'react';

import type { Ad, AdListParams, AdStatsParams } from '@/types/apis/ads';

import { useGetAdList } from '@/hooks/apis/ads';

import type { SearchParamValue } from '@/lib/api';

import AdFormDialog from '@/app/(main)/(backoffice)/ads/_components/ad-form-dialog';
import AdRow from '@/app/(main)/(backoffice)/ads/_components/ad-row';
import AdTableHeader, { adTableClassName } from '@/app/(main)/(backoffice)/ads/_components/ad-table-header';

import PageNavigation from '@/components/page-navigation';
import { Card } from '@/components/ui/card';
import { TableBody } from '@/components/ui/table';

interface Props {
	listParams: AdListParams;
	statsParams: AdStatsParams;
	period?: number;
	filterSelected: boolean;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 광고 표 컴포넌트
 * @param listParams 목록 조회 조건
 * @param statsParams 통계 조회 조건
 * @param period 선택된 기간 버튼의 일수
 * @param filterSelected 필터 조건을 선택했는지 여부
 * @param listQuery 기간을 제외한 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const AdTable = ({ listParams, statsParams, period, filterSelected, listQuery, query, today }: Props) => {
	const { data: adListData } = useGetAdList(listParams);

	const [expandedAdId, setExpandedAdId] = useState<string | null>(null);
	const [editingAd, setEditingAd] = useState<Ad>();

	if (adListData.data.length === 0) {
		return (
			<Card className="px-5 py-4.5">
				<p className="text-muted-foreground">
					{filterSelected ? '조건에 맞는 광고가 없습니다.' : '광고가 없습니다.'}
				</p>
			</Card>
		);
	}

	return (
		<>
			<Card className="gap-0 p-4">
				{/*펼친 행의 폭 기준*/}
				<div className="@container overflow-x-auto rounded-lg border">
					<table className={adTableClassName}>
						<AdTableHeader />

						<TableBody className="[&_tr:last-child>td]:border-b-0">
							{adListData.data.map((ad) => (
								<AdRow
									key={ad.id}
									ad={ad}
									expanded={expandedAdId === ad.id}
									statsParams={statsParams}
									period={period}
									listQuery={listQuery}
									today={today}
									onToggle={() => setExpandedAdId((prev) => (prev === ad.id ? null : ad.id))}
									onEdit={() => setEditingAd(ad)}
								/>
							))}
						</TableBody>
					</table>
				</div>
			</Card>

			{adListData.meta.total_page_count > 1 && (
				<PageNavigation meta={adListData.meta} pathname="/ads" query={query} />
			)}

			{/*목록이 변경되어도 저장 완료까지 유지*/}
			{!!editingAd && <AdFormDialog ad={editingAd} onClose={() => setEditingAd(undefined)} />}
		</>
	);
};

export default AdTable;

'use client';

import { useState } from 'react';

import type { DashboardParams } from '@/types/apis/dashboard';
import type { EmergencyListParams } from '@/types/apis/emergencies';

import { useGetEmergencyList } from '@/hooks/apis/emergencies';
import useAudioPlaylist from '@/hooks/use-audio-playlist';
import { useNow } from '@/hooks/use-now';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import EmergencyEmptyCard from '@/app/(main)/(backoffice)/emergencies/_components/emergency-empty-card';
import EmergencyRow, { emergencyGridClassName } from '@/app/(main)/(backoffice)/emergencies/_components/emergency-row';

import PageNavigation from '@/components/page-navigation';
import { Card } from '@/components/ui/card';

interface Props {
	dashboardParams: DashboardParams;
	listParams: EmergencyListParams;
	keyword?: string;
	filterSelected: boolean;
	query: Record<string, SearchParamValue>;
	initialNow: number;
}

/**
 * 응급 상황 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param listParams 목록 조회 조건
 * @param keyword 검색 입력에 적은 검색어
 * @param filterSelected 날짜, 종류, 상태, 알림, 기기 조건을 선택했는지 여부
 * @param query 현재 주소의 쿼리
 * @param initialNow 서버가 화면을 그린 시각
 */
const EmergencyList = ({ dashboardParams, listParams, keyword, filterSelected, query, initialNow }: Props) => {
	const { data: emergencyListData } = useGetEmergencyList(listParams);

	const now = useNow(initialNow);

	const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

	const player = useAudioPlaylist(emergencyListData.data.flatMap((emergency) => emergency.sound?.sounds ?? []));

	if (emergencyListData.data.length === 0 && keyword) {
		return (
			<Card className="grid justify-items-center gap-2.5 px-4 pt-11 pb-9 text-center">
				<strong className="text-base font-bold">‘{keyword}’에 맞는 응급 상황이 없습니다</strong>
				<p className="text-muted-foreground">검색어를 줄이거나 조회 기간을 늘려 보세요.</p>
			</Card>
		);
	}

	if (emergencyListData.data.length === 0 && filterSelected) {
		return (
			<Card className="grid justify-items-center gap-2.5 px-4 pt-11 pb-9 text-center">
				<strong className="text-base font-bold">조건에 맞는 응급 상황이 없습니다</strong>
				<p className="text-muted-foreground">위에서 고른 조건을 지우면 다른 응급 상황이 보입니다.</p>
			</Card>
		);
	}

	if (emergencyListData.data.length === 0) {
		return <EmergencyEmptyCard dashboardParams={dashboardParams} />;
	}

	return (
		<>
			<Card className="@container gap-0 px-2 pt-1 pb-2 md:px-3 md:pt-2 md:pb-3">
				<audio preload="none" {...player.audioProps}>
					<track kind="captions" />
				</audio>

				<div
					aria-hidden
					className={cn(
						emergencyGridClassName,
						'border-b px-2 py-2 font-medium whitespace-nowrap text-muted-foreground @max-[659px]:hidden',
					)}
				>
					<span>발생</span>
					<span />
					<span>사용자</span>
					<span>감지 내용</span>
					<span>길이</span>
					<span>알림</span>
				</div>

				{emergencyListData.data.map((emergency) => (
					<EmergencyRow
						key={emergency.id}
						emergency={emergency}
						expanded={expandedRowId === emergency.id}
						now={now}
						player={player}
						onToggle={() => setExpandedRowId((prev) => (prev === emergency.id ? null : emergency.id))}
					/>
				))}
			</Card>

			<PageNavigation meta={emergencyListData.meta} pathname="/emergencies" query={query} />
		</>
	);
};

export default EmergencyList;

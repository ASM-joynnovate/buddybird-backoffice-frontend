'use client';

import { useState } from 'react';

import type { AnalyticsDashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { VISIBLE_EVENT_COUNT } from '@/config';
import { ANALYTICS_EVENT_NAMES } from '@/config/analytics';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	events: AnalyticsDashboard['events'];
}

/**
 * 이벤트별 사용자 수 및 횟수 카드 컴포넌트
 * @param events 이벤트별 횟수 및 사용자 수
 */
const EventCard = ({ events }: Props) => {
	const [allEventsVisible, setAllEventsVisible] = useState(false);

	const sortedEvents = events.toSorted((a, b) => b.user_count - a.user_count);
	const visibleEvents = allEventsVisible ? sortedEvents : sortedEvents.slice(0, VISIBLE_EVENT_COUNT);
	const maxUserCount = Math.max(1, ...events.map((event) => event.user_count));

	return (
		<TitledCard title="이벤트" action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>>
			{events.length === 0 ? (
				<p className="text-muted-foreground">조회 기간에 수집된 이벤트가 없습니다.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-0 text-muted-foreground">이벤트</TableHead>
							<TableHead className="text-right text-muted-foreground">사용자</TableHead>
							<TableHead className="text-right text-muted-foreground">횟수</TableHead>
							<TableHead className="pr-0 text-right text-muted-foreground">1인당</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{visibleEvents.map((event) => (
							<TableRow key={event.name} className="hover:bg-transparent">
								{/*한국어 이름이 없는 이벤트는 서버의 이름 그대로 표시*/}
								<TableCell
									className={cn(
										'py-2.5 pl-0',
										!ANALYTICS_EVENT_NAMES[event.name] && 'font-mono text-[12.5px]',
									)}
								>
									{ANALYTICS_EVENT_NAMES[event.name] ?? event.name}
								</TableCell>
								<TableCell className="py-2.5">
									<div className="grid min-w-37.5 grid-cols-[minmax(0,1fr)_48px] items-center gap-2.5">
										<div aria-hidden className="h-2 rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-chart-1"
												style={{ width: `${(event.user_count / maxUserCount) * 100}%` }}
											/>
										</div>
										<strong className="text-right font-bold tabular-nums">
											{event.user_count.toLocaleString('ko-KR')}
										</strong>
									</div>
								</TableCell>
								<TableCell className="py-2.5 text-right tabular-nums">
									{event.count.toLocaleString('ko-KR')}
								</TableCell>
								<TableCell className="py-2.5 pr-0 text-right text-muted-foreground tabular-nums">
									{event.user_count > 0 ? (event.count / event.user_count).toFixed(1) : '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{!allEventsVisible && sortedEvents.length > VISIBLE_EVENT_COUNT && (
				<div className="mt-3 flex justify-center">
					<Button variant="outline" size="sm" onClick={() => setAllEventsVisible(true)}>
						전체보기
					</Button>
				</div>
			)}
		</TitledCard>
	);
};

export default EventCard;

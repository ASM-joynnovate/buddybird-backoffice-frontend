'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useGetUser, useGetUserSessionList } from '@/hooks/apis/users';
import { useNow } from '@/hooks/use-now';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import SessionTimeline from '@/app/(main)/(backoffice)/users/[id]/_components/session-timeline';
import SessionTrack from '@/app/(main)/(backoffice)/users/[id]/_components/session-track';
import { SESSION_ENDED_REASONS } from '@/config/session';
import { formatDateTime, toHoursAndMinutes } from '@/utils/date';
import { toSessionPeriod } from '@/utils/session';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_ROW_COUNT = 7;

interface Props {
	id: string;
	page: number;
	initialNow: number;
}

/**
 * 세션 목록 및 고른 세션의 타임라인 카드 컴포넌트
 * @param id 조회할 사용자 ID
 * @param page 세션 목록의 페이지 번호
 * @param initialNow 서버가 화면을 그린 시각
 */
const UserSessionCard = ({ id, page, initialNow }: Props) => {
	const { data: userData } = useGetUser({ id });

	const { data: userSessionListData } = useGetUserSessionList({ id, page });

	const now = useNow(initialNow);

	const [selectedSessionId, setSelectedSessionId] = useState(userSessionListData.data[0]?.id);

	const { meta } = userSessionListData;
	// 스테이션 기기의 시간대로 수면 구간 계산
	const sessions = userSessionListData.data.map((session) => ({
		session,
		sessionPeriod: toSessionPeriod(session, now),
		timeZone: userData.devices.find((device) => device.id === session.station.device_id)?.timezone ?? 'UTC',
	}));
	const selectedSession = sessions.find(({ session }) => session.id === selectedSessionId) ?? sessions[0];

	if (!selectedSession) {
		return (
			<TitledCard title="세션">
				<p className="text-muted-foreground">세션이 없습니다.</p>
			</TitledCard>
		);
	}

	return (
		<Card className="grid gap-0 py-0 md:grid-cols-[288px_minmax(0,1fr)]">
			{/*세션 목록*/}
			<div className="grid content-start gap-0.5 border-b bg-card-inset p-3 md:border-r md:border-b-0">
				<div className="flex items-baseline justify-between gap-3 px-2 pt-2 pb-2.5">
					<CardTitle className="font-bold">세션</CardTitle>
					<p className="text-[13px] text-muted-foreground">
						전체 {meta.total_count.toLocaleString('ko-KR')}회
					</p>
				</div>

				{sessions.map(({ session, sessionPeriod, timeZone }) => {
					const duration = toHoursAndMinutes(sessionPeriod.endMs - sessionPeriod.startMs);
					const endedReason = session.period.ended_reason;

					return (
						<button
							key={session.id}
							type="button"
							aria-pressed={session.id === selectedSession.session.id}
							className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-0.5 rounded-md px-2 pt-2.5 pb-3 text-left hover:bg-card hover:ring-1 hover:ring-border aria-pressed:bg-card aria-pressed:ring-1 aria-pressed:ring-border"
							onClick={() => setSelectedSessionId(session.id)}
						>
							<strong className="font-semibold tabular-nums">
								{formatDateTime(session.period.started_at)}
							</strong>

							{session.status === 'running' ? (
								<Badge className="rounded-sm bg-success/10 font-bold text-success">실행 중</Badge>
							) : (
								<Badge
									className={cn(
										'rounded-sm bg-muted font-bold text-muted-foreground',
										endedReason === 'heartbeat_expired' && 'bg-destructive/10 text-destructive',
									)}
								>
									{endedReason ? SESSION_ENDED_REASONS[endedReason].label : '종료'}
								</Badge>
							)}

							<span className="col-span-2 mb-1.5 text-[13px] text-muted-foreground">
								{duration.hours}시간 {duration.minutes}분
							</span>

							<SessionTrack
								session={session}
								sessionPeriod={sessionPeriod}
								timeZone={timeZone}
								className="col-span-2 h-1.5"
							/>
						</button>
					);
				})}

				<div className="mx-2 mt-2.5 mb-1 flex justify-end gap-1.5">
					<Link
						href={{ pathname: `/users/${id}`, query: { session_page: meta.current_page - 1 } }}
						scroll={false}
						aria-disabled={meta.is_first}
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							meta.is_first && 'pointer-events-none opacity-50',
						)}
					>
						이전
					</Link>
					<Link
						href={{ pathname: `/users/${id}`, query: { session_page: meta.current_page + 1 } }}
						scroll={false}
						aria-disabled={meta.is_last}
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							meta.is_last && 'pointer-events-none opacity-50',
						)}
					>
						다음
					</Link>
				</div>
			</div>

			{/*고른 세션이 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={selectedSession.session.id}
				fallbackComponent={QueryError}
				suspenseFallback=<div className="grid content-start gap-3 p-4 md:px-5.5 md:py-5">
					{Array.from({ length: PLACEHOLDER_ROW_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-6" />
					))}
				</div>
			>
				<SessionTimeline
					session={selectedSession.session}
					sessionPeriod={selectedSession.sessionPeriod}
					timeZone={selectedSession.timeZone}
				/>
			</ErrorHandlingWrapper>
		</Card>
	);
};

export default UserSessionCard;

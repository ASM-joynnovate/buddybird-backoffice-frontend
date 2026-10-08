import type { CSSProperties } from 'react';

import Link from 'next/link';

import type { NotificationDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toToggledQuery } from '@/utils/search-params';

import { Badge } from '@/components/ui/badge';

const KIND_ORDER = Object.keys(NOTIFICATION_KINDS);

interface Props {
	notificationDashboard: NotificationDashboard;
	query: Record<string, SearchParamValue>;
}

/**
 * 종류별 읽은 비율 카드 컴포넌트
 * @param notificationDashboard 알림 대시보드 집계
 * @param query 현재 주소의 쿼리
 */
const KindReadCard = ({ notificationDashboard, query }: Props) => {
	// 리포트, 공지, 마케팅, 긴급 순서
	const kindCounts = notificationDashboard.kinds.toSorted(
		(a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
	);

	return (
		<TitledCard title="종류별 읽음">
			{notificationDashboard.notifications.count === 0 ? (
				<p className="text-muted-foreground">알림이 없습니다.</p>
			) : (
				<ul className="divide-y">
					{kindCounts.map((kindCount) => {
						const readPercent = Math.round((kindCount.read_count / kindCount.sent_count) * 100);
						const kindSelected = query.kind === kindCount.kind;

						return (
							<li key={kindCount.kind} className="first:*:pt-0 last:*:pb-0">
								<Link
									href={{
										pathname: '/notifications',
										query: toToggledQuery(query, 'kind', kindCount.kind),
									}}
									scroll={false}
									aria-pressed={kindSelected}
									className={cn(
										'group grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-2 rounded-sm py-3 tabular-nums transition-opacity',
										!!query.kind && !kindSelected && 'opacity-40',
									)}
									style={
										{ '--kind-color': NOTIFICATION_KINDS[kindCount.kind].color } as CSSProperties
									}
								>
									<span className="flex items-center gap-2 font-semibold">
										<span className="size-2 shrink-0 rounded-full bg-(--kind-color)" />
										<span className="group-hover:underline group-hover:underline-offset-3">
											{NOTIFICATION_KINDS[kindCount.kind].label}
										</span>
										{kindCount.kind === 'report' && (
											<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">
												자동
											</Badge>
										)}
									</span>

									<b className="font-bold">{readPercent}%</b>
									<span className="min-w-14 text-right text-[13px] text-muted-foreground">
										{kindCount.sent_count.toLocaleString('ko-KR')}건
									</span>

									<span className="col-span-full h-2 rounded-full bg-muted">
										<span
											className="block h-full rounded-full bg-(--kind-color)"
											style={{ width: `${readPercent}%` }}
										/>
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</TitledCard>
	);
};

export default KindReadCard;

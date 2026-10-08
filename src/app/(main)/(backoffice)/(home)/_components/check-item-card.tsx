import Link from 'next/link';

import type { DashboardLive } from '@/types/apis/dashboard';

import { ChevronRight } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

interface Props {
	dashboardLive: DashboardLive;
}

/**
 * 확인할 항목 카드 컴포넌트
 * @param dashboardLive 대시보드의 현재 상태
 */
const CheckItemCard = ({ dashboardLive }: Props) => {
	const { heartbeat_expired_count, emergency_detected_count, judgment_failed_count } =
		dashboardLive.sessions.last_24_hours;

	const checkItems = [
		{ label: '신호가 끊긴 세션', count: heartbeat_expired_count, dotClassName: 'bg-destructive-dot' },
		{ label: '응급 상황 감지', count: emergency_detected_count, dotClassName: 'bg-destructive-dot' },
		{
			label: '탈퇴 실패',
			count: dashboardLive.withdrawals.failed_count,
			dotClassName: 'bg-destructive-dot',
			href: '/withdrawals',
		},
		{ label: '모사 판정 실패', count: judgment_failed_count, dotClassName: 'bg-warning-dot' },
	];
	const totalCount = checkItems.reduce((total, checkItem) => total + checkItem.count, 0);

	return (
		<TitledCard
			title="확인할 항목"
			action=<span className="text-[13px] font-bold text-destructive">{totalCount}건</span>
		>
			<ul className="divide-y">
				{checkItems.map((checkItem) => {
					const checkItemContent = (
						<>
							<span className={`size-2 shrink-0 rounded-full ${checkItem.dotClassName}`} />
							{checkItem.label}
							<strong className="ml-auto font-bold tabular-nums">{checkItem.count}</strong>
						</>
					);

					return (
						<li key={checkItem.label}>
							{checkItem.href ? (
								<Link
									href={checkItem.href}
									className="-mx-2 flex h-10.5 items-center gap-2.5 rounded-md px-2 hover:bg-muted"
								>
									{checkItemContent}
									<ChevronRight className="size-3.5 text-muted-foreground" />
								</Link>
							) : (
								<div className="flex h-10.5 items-center gap-2.5 pr-6">{checkItemContent}</div>
							)}
						</li>
					);
				})}
			</ul>
		</TitledCard>
	);
};

export default CheckItemCard;

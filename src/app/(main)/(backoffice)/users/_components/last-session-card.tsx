import Link from 'next/link';

import type { UserDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_FILTER_GROUPS } from '@/config/user-filters';
import { toToggledQuery } from '@/utils/search-params';

const colorClassNames = ['bg-chart-1', 'bg-chart-1/62', 'bg-chart-1/30', 'bg-chart-neutral', 'bg-chart-neutral/45'];

interface Props {
	lastSessions: UserDashboard['last_sessions'];
	userCount: number;
	query: Record<string, SearchParamValue>;
}

/**
 * 마지막 세션 카드 컴포넌트
 * @param lastSessions 마지막 세션 구간별 사용자 수
 * @param userCount 전체 사용자 수
 * @param query 현재 주소의 쿼리
 */
const LastSessionCard = ({ lastSessions, userCount, query }: Props) => {
	const lastSessionGroups = lastSessions.map(({ last_session, count }, index) => ({
		value: last_session,
		count,
		label: USER_FILTER_GROUPS[0].options.find(({ value }) => value === last_session)?.label,
		colorClassName: colorClassNames[index],
		// 다른 구간을 골랐으면 옅게 표시
		dimmed: !!query.last_session && query.last_session !== last_session,
		href: { pathname: '/users', query: toToggledQuery(query, 'last_session', last_session) },
	}));

	return (
		<TitledCard title="마지막 세션">
			<div className="flex h-3 gap-0.75">
				{lastSessionGroups.map((lastSessionGroup) => (
					<Link
						key={lastSessionGroup.value}
						href={lastSessionGroup.href}
						scroll={false}
						aria-label={`${lastSessionGroup.label} ${lastSessionGroup.count}명`}
						className={cn(
							'min-w-1.5 basis-0 rounded-full transition-opacity',
							lastSessionGroup.colorClassName,
							lastSessionGroup.dimmed && 'opacity-40',
						)}
						style={{ flexGrow: lastSessionGroup.count }}
					/>
				))}
			</div>

			<ul className="mt-3.5 grid gap-0.5 tabular-nums">
				{lastSessionGroups.map((lastSessionGroup) => (
					<li key={lastSessionGroup.value}>
						<Link
							href={lastSessionGroup.href}
							scroll={false}
							aria-current={query.last_session === lastSessionGroup.value ? 'true' : undefined}
							className={cn(
								'-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 transition-opacity hover:bg-muted aria-[current]:bg-muted',
								lastSessionGroup.dimmed && 'opacity-40',
							)}
						>
							<span className={cn('size-2 shrink-0 rounded-full', lastSessionGroup.colorClassName)} />
							{lastSessionGroup.label}
							<strong className="ml-auto font-bold">
								{lastSessionGroup.count.toLocaleString('ko-KR')}
							</strong>
							<span className="w-10 text-right text-muted-foreground">
								{userCount ? Math.round((lastSessionGroup.count / userCount) * 100) : 0}%
							</span>
						</Link>
					</li>
				))}
			</ul>
		</TitledCard>
	);
};

export default LastSessionCard;

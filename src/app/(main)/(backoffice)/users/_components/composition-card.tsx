import Link from 'next/link';

import type { UserDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_FILTER_GROUPS } from '@/config/user-filters';
import { toToggledQuery } from '@/utils/search-params';

const colorClassNames: Record<string, string> = {
	google: 'bg-chart-2',
	kakao: 'bg-chart-1',
	apple: 'bg-chart-4',
	ios: 'bg-chart-2',
	android: 'bg-chart-3',
	pushable: 'bg-chart-1',
};

interface Props {
	userDashboard: UserDashboard;
	query: Record<string, SearchParamValue>;
}

/**
 * 계정, 기기, 알림의 구성 카드 컴포넌트
 * @param userDashboard 사용자 대시보드 집계
 * @param query 현재 주소의 쿼리
 */
const CompositionCard = ({ userDashboard, query }: Props) => {
	const { accounts, platforms, push } = userDashboard;

	const compositions = [
		{
			name: 'account',
			counts: [
				...accounts.providers.map(({ provider, count }) => ({ value: provider as string, count })),
				{ value: 'anonymous', count: accounts.anonymous_count },
			],
		},
		{ name: 'device', counts: platforms.map(({ platform, count }) => ({ value: platform, count })) },
		{
			name: 'notification',
			counts: [
				{ value: 'pushable', count: push.pushable_count },
				{ value: 'unpushable', count: push.unpushable_count },
			],
		},
	].map((composition) => {
		const filterGroup = USER_FILTER_GROUPS.find(({ name }) => name === composition.name);
		const totalCount = composition.counts.reduce((total, { count }) => total + count, 0);

		return {
			name: composition.name,
			title: filterGroup?.label,
			parts: composition.counts.map(({ value, count }) => ({
				value,
				label: filterGroup?.options.find((filterOption) => filterOption.value === value)?.label ?? value,
				percent: totalCount ? Math.round((count / totalCount) * 100) : 0,
				colorClassName: colorClassNames[value] ?? 'bg-chart-neutral',
				// 다른 값을 골랐으면 옅게 표시
				dimmed: !!query[composition.name] && query[composition.name] !== value,
				href: { pathname: '/users', query: toToggledQuery(query, composition.name, value) },
			})),
		};
	});

	return (
		<TitledCard title="구성">
			<div className="grid gap-4.5">
				{compositions.map((composition) => (
					<section key={composition.name}>
						<h3 className="mb-2 text-[13px] font-semibold">{composition.title}</h3>

						<div className="flex h-3 gap-0.75">
							{composition.parts.map((part) => (
								<Link
									key={part.value}
									href={part.href}
									scroll={false}
									aria-label={`${part.label} ${part.percent}%`}
									className={cn(
										'min-w-1.5 basis-0 rounded-full transition-opacity',
										part.colorClassName,
										part.dimmed && 'opacity-40',
									)}
									style={{ flexGrow: part.percent }}
								/>
							))}
						</div>

						<ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px]">
							{composition.parts.map((part) => (
								<li key={part.value}>
									<Link
										href={part.href}
										scroll={false}
										className={cn(
											'inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-opacity hover:text-foreground',
											part.dimmed && 'opacity-40',
										)}
									>
										<span className={cn('size-2 shrink-0 rounded-full', part.colorClassName)} />
										{part.label}
										<strong className="font-bold text-foreground tabular-nums">
											{part.percent}%
										</strong>
									</Link>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</TitledCard>
	);
};

export default CompositionCard;

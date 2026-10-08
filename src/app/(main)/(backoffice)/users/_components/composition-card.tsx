import type { UserDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CompositionGroup from '@/app/(main)/(backoffice)/_components/composition-group';
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
					<CompositionGroup key={composition.name} title={composition.title} parts={composition.parts} />
				))}
			</div>
		</TitledCard>
	);
};

export default CompositionCard;

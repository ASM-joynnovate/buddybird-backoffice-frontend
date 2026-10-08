import type { WithdrawalDashboard } from '@/types/apis/dashboard';

import CompositionGroup, {
	STACKED_RATIO_COLOR_CLASS_NAMES,
} from '@/app/(main)/(backoffice)/_components/composition-group';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import ProviderIcon, { PROVIDER_LABELS } from '@/app/(main)/(backoffice)/_components/provider-icon';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toPlatformName } from '@/utils/platform';

const accountProviders = [
	{ provider: 'google', colorClassName: 'bg-chart-2' },
	{ provider: 'kakao', colorClassName: 'bg-chart-1' },
	{ provider: 'apple', colorClassName: 'bg-chart-4' },
] as const;
const platforms = [
	{ platform: 'ios', colorClassName: 'bg-chart-2' },
	{ platform: 'android', colorClassName: 'bg-chart-3' },
];
const usagePeriodLabels = {
	same_day: '0일',
	within_7_days: '7일 이내',
	within_30_days: '30일 이내',
	over_30_days: '30일 초과',
};
const sessionRanges = {
	five_or_more: { label: '5회 이상', colorClassName: 'bg-chart-1' },
	one_to_four: { label: '1~4회', colorClassName: 'bg-chart-1/45' },
	none: { label: '없음', colorClassName: 'bg-chart-neutral' },
};

interface Props {
	withdrawalDashboard: WithdrawalDashboard;
}

/**
 * 탈퇴한 사용자의 구성 카드 컴포넌트
 * @param withdrawalDashboard 탈퇴 대시보드 집계
 */
const CompositionCard = ({ withdrawalDashboard }: Props) => {
	const { accounts, usage_periods, session_ranges, app_versions, parrots } = withdrawalDashboard;

	const compositions = [
		{
			title: '계정',
			counts: [
				...accountProviders.map(({ provider, colorClassName }) => ({
					label: PROVIDER_LABELS[provider],
					count: accounts.providers.find((providerCount) => providerCount.provider === provider)?.count ?? 0,
					icon: <ProviderIcon provider={provider} className="size-4" />,
					colorClassName,
				})),
				{ label: '익명', count: accounts.anonymous_count, colorClassName: 'bg-chart-neutral' },
			],
		},
		{
			title: '기기',
			counts: platforms.map(({ platform, colorClassName }) => ({
				label: toPlatformName(platform),
				count:
					withdrawalDashboard.platforms.find((platformCount) => platformCount.platform === platform)?.count ??
					0,
				icon: <PlatformIcon platform={platform} />,
				colorClassName,
			})),
		},
		{
			title: '사용 기간',
			counts: usage_periods.map(({ usage_period, count }, index) => ({
				label: usagePeriodLabels[usage_period],
				count,
				colorClassName: STACKED_RATIO_COLOR_CLASS_NAMES[index],
			})),
		},
		{
			title: '세션',
			// 세션이 많은 범위부터 나열
			counts: session_ranges
				.toReversed()
				.map(({ session_range, count }) => ({ ...sessionRanges[session_range], count })),
		},
		{
			title: '앱 버전',
			// 높은 버전부터 옅어지는 색
			counts: app_versions
				.toSorted((a, b) => b.app_version.localeCompare(a.app_version, undefined, { numeric: true }))
				.map(({ app_version, count }, index) => ({
					label: app_version,
					count,
					colorClassName:
						STACKED_RATIO_COLOR_CLASS_NAMES[Math.min(index, STACKED_RATIO_COLOR_CLASS_NAMES.length - 1)],
				})),
		},
		{
			title: '앵무새',
			counts: [
				{ label: '등록', count: parrots.registered_count, colorClassName: 'bg-chart-1' },
				{ label: '등록 전', count: parrots.unregistered_count, colorClassName: 'bg-chart-neutral' },
			],
		},
	].map(({ title, counts }) => {
		const totalCount = counts.reduce((total, { count }) => total + count, 0);

		return {
			title,
			parts: counts
				.filter(({ count }) => count > 0)
				.map(({ count, ...part }) => ({
					...part,
					value: part.label,
					percent: Math.round((count / totalCount) * 100),
					dimmed: false,
				})),
		};
	});

	return (
		<TitledCard title="구성">
			{withdrawalDashboard.withdrawals.count === 0 ? (
				<p className="text-muted-foreground">탈퇴가 없습니다.</p>
			) : (
				<div className="grid grid-cols-1 content-start gap-x-6 gap-y-4.5 md:grid-cols-3 xl:grid-cols-2">
					{compositions.map((composition) => (
						<CompositionGroup key={composition.title} title={composition.title} parts={composition.parts} />
					))}
				</div>
			)}
		</TitledCard>
	);
};

export default CompositionCard;

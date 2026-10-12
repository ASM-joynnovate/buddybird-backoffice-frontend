import type { AnalyticsDashboard } from '@/types/apis/dashboard';

import CompositionGroup, {
	STACKED_RATIO_COLOR_CLASS_NAMES,
} from '@/app/(main)/(backoffice)/_components/composition-group';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toPlatformName } from '@/utils/platform';

const platformColorClassNames: Record<string, string> = { ios: 'bg-chart-2', android: 'bg-chart-3' };

interface Props {
	platforms: AnalyticsDashboard['platforms'];
	appVersions: AnalyticsDashboard['app_versions'];
}

/**
 * 활성 사용자의 기기 및 앱 버전 구성 카드 컴포넌트
 * @param platforms 기기 종류별 활성 사용자 수
 * @param appVersions 앱 버전별 활성 사용자 수
 */
const CompositionCard = ({ platforms, appVersions }: Props) => {
	const platformUserCount = platforms.reduce((total, { count }) => total + count, 0);
	const appVersionUserCount = appVersions.reduce((total, { count }) => total + count, 0);

	const compositions = [
		{
			title: '기기',
			parts: platforms.map(({ platform, count }) => {
				// Google Analytics는 "iOS", "Android"로 응답
				const platformValue = platform.toLowerCase();

				return {
					value: platform,
					label: toPlatformName(platformValue),
					percent: Math.round((count / platformUserCount) * 100),
					icon: <PlatformIcon platform={platformValue} />,
					colorClassName: platformColorClassNames[platformValue] ?? 'bg-chart-neutral',
					dimmed: false,
				};
			}),
		},
		{
			title: '앱 버전',
			// 사용자가 많은 버전부터 옅어지는 색
			parts: appVersions.map(({ app_version, count }, index) => ({
				value: app_version,
				label: app_version,
				percent: Math.round((count / appVersionUserCount) * 100),
				colorClassName:
					STACKED_RATIO_COLOR_CLASS_NAMES[Math.min(index, STACKED_RATIO_COLOR_CLASS_NAMES.length - 1)],
				dimmed: false,
			})),
		},
	];

	return (
		<TitledCard title="구성" action=<span className="text-[13px] text-muted-foreground">Google Analytics</span>>
			{platforms.length === 0 && appVersions.length === 0 ? (
				<p className="text-muted-foreground">조회 기간의 접속 기록이 없습니다.</p>
			) : (
				<div className="grid gap-4.5">
					{compositions.map((composition) => (
						<CompositionGroup key={composition.title} title={composition.title} parts={composition.parts} />
					))}
				</div>
			)}
		</TitledCard>
	);
};

export default CompositionCard;

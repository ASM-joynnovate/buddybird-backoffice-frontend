import { type Platform, platformSchema } from '@/types/apis/app-updates';

import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { toPlatformName } from '@/utils/platform';

interface Props {
	platform: Platform;
	latestVersions?: Partial<Record<Platform, string>>;
}

/**
 * 플랫폼 선택 컴포넌트
 * @param platform 선택된 플랫폼
 * @param latestVersions 플랫폼별 최신 버전
 */
const PlatformFilter = ({ platform, latestVersions }: Props) => {
	return (
		<SegmentedControl
			label="플랫폼"
			options={platformSchema.options.map((platformOption) => ({
				value: platformOption,
				label: (
					<>
						<PlatformIcon platform={platformOption} selected={platformOption === platform} />
						{toPlatformName(platformOption)}

						{/*로딩 중에는 버전을 표시하지 않음*/}
						{!!latestVersions && (
							<span className="font-medium tabular-nums opacity-72">
								{latestVersions[platformOption] ?? '등록 전'}
							</span>
						)}
					</>
				),
				href: { pathname: '/app-updates', query: { platform: platformOption } },
			}))}
			value={platform}
		/>
	);
};

export default PlatformFilter;

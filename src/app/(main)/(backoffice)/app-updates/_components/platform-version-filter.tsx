'use client';

import { useSuspenseQueries } from '@tanstack/react-query';

import { type Platform, platformSchema } from '@/types/apis/app-updates';

import { getAppUpdateListOptions } from '@/hooks/apis/app-updates';

import PlatformFilter from '@/app/(main)/(backoffice)/app-updates/_components/platform-filter';
import { toVersionPolicy } from '@/utils/app-update';

interface Props {
	platform: Platform;
}

/**
 * 플랫폼별 최신 버전을 표시하는 플랫폼 선택 컴포넌트
 * @param platform 선택된 플랫폼
 */
const PlatformVersionFilter = ({ platform }: Props) => {
	const latestVersions = useSuspenseQueries({
		queries: platformSchema.options.map((platformOption) => getAppUpdateListOptions({ platform: platformOption })),
		combine: (results) =>
			Object.fromEntries(
				results.map((result, index) => [
					platformSchema.options[index],
					toVersionPolicy(result.data).latestVersion,
				]),
			),
	});

	return <PlatformFilter platform={platform} latestVersions={latestVersions} />;
};

export default PlatformVersionFilter;

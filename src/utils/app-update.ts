import type { AppUpdate } from '@/types/apis/app-updates';
import type { AppUpdateDashboard } from '@/types/apis/dashboard';

import { compareVersions, isAppVersion } from '@/utils/version';

export type DeviceGroups = Record<'latest' | 'optional' | 'forced', AppUpdateDashboard['versions']>;

/** 앱 버전별 기기 수를 더하는 함수 */
export const countDevices = (versions: AppUpdateDashboard['versions']) => {
	return versions.reduce((total, version) => total + version.count, 0);
};

/** 업데이트 목록으로 최신 버전 및 최소 지원 버전을 구하는 함수 */
export const toVersionPolicy = (appUpdates: Pick<AppUpdate, 'version' | 'is_forced'>[]) => {
	const sortedAppUpdates = appUpdates.toSorted((a, b) => compareVersions(b.version, a.version));

	return {
		latestVersion: sortedAppUpdates.at(0)?.version,
		minSupportedVersion: sortedAppUpdates.find((appUpdate) => appUpdate.is_forced)?.version,
	};
};

/** 기기를 앱 버전에 따라 세 묶음으로 나누는 함수 */
export const groupDevices = (
	versions: AppUpdateDashboard['versions'],
	{ latestVersion, minSupportedVersion }: ReturnType<typeof toVersionPolicy>,
) => {
	if (!latestVersion) {
		return undefined;
	}

	const deviceGroups: DeviceGroups = { latest: [], optional: [], forced: [] };

	for (const version of versions.toSorted((a, b) => compareVersions(b.app_version, a.app_version))) {
		// 형식이 다른 버전은 앱이 안내하지 않음
		if (!isAppVersion(version.app_version)) {
			deviceGroups.latest.push(version);
		} else if (minSupportedVersion && compareVersions(version.app_version, minSupportedVersion) < 0) {
			deviceGroups.forced.push(version);
		} else if (compareVersions(version.app_version, latestVersion) < 0) {
			deviceGroups.optional.push(version);
		} else {
			deviceGroups.latest.push(version);
		}
	}

	return deviceGroups;
};

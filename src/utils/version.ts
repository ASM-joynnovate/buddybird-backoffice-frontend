const APP_VERSION_PATTERN = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

/** "1.2.0" 형식의 버전인지 확인하는 함수 */
export const isAppVersion = (version: string) => {
	return APP_VERSION_PATTERN.test(version);
};

/** 두 버전을 비교해 앞이 낮으면 음수를 반환하는 함수 */
export const compareVersions = (version: string, otherVersion: string) => {
	// 1.10.0을 1.9.0보다 높게 비교
	return version.localeCompare(otherVersion, undefined, { numeric: true });
};

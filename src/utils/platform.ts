const platformNames: Record<string, string> = { ios: 'iOS', android: 'Android' };

/** 플랫폼 값을 화면에 표시할 이름으로 변환하는 함수 */
export const toPlatformName = (platform: string) => {
	return platformNames[platform] ?? platform;
};

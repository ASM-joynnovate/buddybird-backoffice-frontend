import { useSyncExternalStore } from 'react';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/** html class 및 시스템 설정이 바뀌면 알림 */
const subscribeTheme = (onThemeChange: () => void) => {
	const classObserver = new MutationObserver(onThemeChange);
	const darkMediaQuery = matchMedia(DARK_MEDIA_QUERY);

	classObserver.observe(document.documentElement, { attributeFilter: ['class'] });
	darkMediaQuery.addEventListener('change', onThemeChange);

	return () => {
		classObserver.disconnect();
		darkMediaQuery.removeEventListener('change', onThemeChange);
	};
};

/** 선택한 화면 모드가 없으면 시스템 설정을 따름 */
const getResolvedTheme = () => {
	const { classList } = document.documentElement;

	if (classList.contains('dark')) {
		return 'dark';
	}

	return !classList.contains('light') && matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
};

/** 현재 화면에 적용된 화면 모드를 반환하는 Hook */
const useResolvedTheme = () => {
	return useSyncExternalStore(subscribeTheme, getResolvedTheme, () => 'light' as const);
};

export default useResolvedTheme;

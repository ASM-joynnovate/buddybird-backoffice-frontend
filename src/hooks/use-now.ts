import { useEffect, useState } from 'react';

import { SECOND } from '@/config/units';

/**
 * 현재 시각을 1초마다 갱신하는 Hook
 * @param initialNow 서버가 화면을 렌더링한 시각
 */
export const useNow = (initialNow: number) => {
	const [now, setNow] = useState(initialNow);

	/** 문서 로드 완료 뒤부터 1초마다 현재 시각 갱신 */
	useEffect(() => {
		let timer: ReturnType<typeof setInterval> | undefined;

		const startTimer = () => {
			timer = setInterval(() => setNow(Date.now()), SECOND);
		};

		// 스트리밍 중인 영역이 다시 렌더링되지 않도록 대기
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', startTimer, { once: true });
		} else {
			startTimer();
		}

		return () => {
			document.removeEventListener('DOMContentLoaded', startTimer);
			clearInterval(timer);
		};
	}, []);

	return now;
};

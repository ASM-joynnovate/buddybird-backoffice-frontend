import { useEffect, useState } from 'react';

import { SECOND } from '@/config/units';

/**
 * 현재 시각을 1초마다 갱신하는 Hook
 * @param initialNow 서버가 화면을 그린 시각
 */
export const useNow = (initialNow: number) => {
	const [now, setNow] = useState(initialNow);

	/** 문서를 다 받은 뒤부터 1초마다 현재 시각 갱신 */
	useEffect(() => {
		let timer: ReturnType<typeof setInterval> | undefined;

		const startTimer = () => {
			timer = setInterval(() => setNow(Date.now()), SECOND);
		};

		// 서버가 아직 보내는 영역이 시각 갱신으로 브라우저에서 다시 그려지지 않도록 대기
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

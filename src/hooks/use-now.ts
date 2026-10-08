import { useEffect, useState } from 'react';

import { SECOND } from '@/config/units';

/**
 * 현재 시각을 1초마다 갱신하는 Hook
 * @param initialNow 서버가 화면을 그린 시각
 */
export const useNow = (initialNow: number) => {
	const [now, setNow] = useState(initialNow);

	/** 1초마다 현재 시각 갱신 */
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), SECOND);

		return () => clearInterval(timer);
	}, []);

	return now;
};

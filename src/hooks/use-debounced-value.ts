import { useEffect, useState } from 'react';

/**
 * 값이 바뀐 뒤 일정 시간이 지나면 반영하는 Hook
 * @param value 반영할 값
 * @param delayMs 반영을 기다리는 시간
 */
export const useDebouncedValue = <T>(value: T, delayMs: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	/** 값이 멈추면 반영 */
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delayMs);

		return () => clearTimeout(timer);
	}, [value, delayMs]);

	return debouncedValue;
};

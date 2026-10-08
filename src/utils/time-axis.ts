import { HOUR } from '@/config/units';
import { formatShortDate, formatTime } from '@/utils/date';

// 한국 시간은 UTC+9
const KST_OFFSET_MS = 9 * HOUR;
const RANGE_STEP_MS = 6 * HOUR;
const DENSE_TICK_MAX_MS = 30 * HOUR;
const NOW_TICK_GAP_PERCENT = 10;

export interface TimeAxisRange {
	from: number;
	to: number;
}

/** 시각들을 6시간 단위로 감싼 한국 시간 범위를 반환하는 함수 */
export const toTimeAxisRange = (times: number[]): TimeAxisRange => {
	return {
		from: Math.floor((Math.min(...times) - HOUR + KST_OFFSET_MS) / RANGE_STEP_MS) * RANGE_STEP_MS - KST_OFFSET_MS,
		to: Math.ceil((Math.max(...times) + HOUR + KST_OFFSET_MS) / RANGE_STEP_MS) * RANGE_STEP_MS - KST_OFFSET_MS,
	};
};

/** 시각을 범위 안의 가로 위치로 변환하는 함수 */
export const toTimeAxisPercent = (time: number, range: TimeAxisRange) => {
	return ((time - range.from) / (range.to - range.from)) * 100;
};

/** 범위를 일정 시간마다 나눈 시각 목록을 반환하는 함수 */
export const toTimeAxisSteps = (range: TimeAxisRange, stepMs: number) => {
	return Array.from(
		{ length: Math.round((range.to - range.from) / stepMs) },
		(_, index) => range.from + index * stepMs,
	);
};

/** 범위의 눈금 글자 및 현재 시각 위치를 반환하는 함수 */
export const toTimeAxisTicks = (range: TimeAxisRange, now: number) => {
	const nowPercent = toTimeAxisPercent(now, range);
	const nowVisible = nowPercent >= 0 && nowPercent <= 100;
	const stepMs = range.to - range.from > DENSE_TICK_MAX_MS ? RANGE_STEP_MS : RANGE_STEP_MS / 2;

	const ticks = toTimeAxisSteps(range, stepMs)
		.map((time) => ({
			percent: toTimeAxisPercent(time, range),
			// 자정은 날짜로 표시
			label: formatTime(time) === '00:00' ? formatShortDate(time) : formatTime(time),
		}))
		// "지금"과 겹치는 눈금 제외
		.filter((tick) => !nowVisible || Math.abs(tick.percent - nowPercent) > NOW_TICK_GAP_PERCENT);

	return { ticks, nowPercent: nowVisible ? nowPercent : null };
};

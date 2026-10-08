import type { Session } from '@/types/apis/sessions';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface TimePeriod {
	startMs: number;
	endMs: number;
}

/** 세션의 시작 및 끝 시각을 반환하는 함수 */
export const toSessionPeriod = (session: Session, now: number): TimePeriod => {
	const startMs = dayjs(session.period.started_at).valueOf();

	// 실행 중인 세션은 현재 시각까지
	return { startMs, endMs: Math.max(startMs + 1, dayjs(session.period.ended_at ?? now).valueOf()) };
};

/** 시각이 구간의 몇 %에 있는지 반환하는 함수 */
export const toPeriodPercent = (timeMs: number, period: TimePeriod) => {
	const percent = ((timeMs - period.startMs) / (period.endMs - period.startMs)) * 100;

	return Math.min(100, Math.max(0, percent));
};

/** 세션과 겹치는 수면 구간 목록을 반환하는 함수 */
export const toSleepPeriods = (session: Session, sessionPeriod: TimePeriod, timeZone: string) => {
	const { sleep } = session.schedule;

	if (!sleep || sleep.sleep_at === sleep.wake_at) {
		return [];
	}

	const sleepPeriods: TimePeriod[] = [];
	const lastDay = dayjs(sessionPeriod.endMs).tz(timeZone);

	// 시작 전날 밤부터 하루씩 확인
	for (
		let day = dayjs(sessionPeriod.startMs).tz(timeZone).subtract(1, 'day');
		!day.isAfter(lastDay, 'day');
		day = day.add(1, 'day')
	) {
		const sleepFrom = dayjs.tz(`${day.format('YYYY-MM-DD')}T${sleep.sleep_at}`, timeZone);
		const wakeDay = sleep.wake_at > sleep.sleep_at ? day : day.add(1, 'day');
		const sleepUntil = dayjs.tz(`${wakeDay.format('YYYY-MM-DD')}T${sleep.wake_at}`, timeZone);

		const startMs = Math.max(sleepFrom.valueOf(), sessionPeriod.startMs);
		const endMs = Math.min(sleepUntil.valueOf(), sessionPeriod.endMs);

		if (endMs > startMs) {
			sleepPeriods.push({ startMs, endMs });
		}
	}

	return sleepPeriods;
};

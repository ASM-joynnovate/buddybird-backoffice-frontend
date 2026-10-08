import dayjs, { type ConfigType } from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { DISPLAY_TIME_ZONE } from '@/config';
import { DAY, HOUR, MINUTE, SECOND } from '@/config/units';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/** 시각을 'YYYY-MM-DD HH:mm' 형식의 한국 시간으로 변환하는 함수 */
export const formatDateTime = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('YYYY-MM-DD HH:mm');
};

/** 시각을 'YYYY-MM-DD' 형식의 한국 날짜로 변환하는 함수 */
export const formatDate = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('YYYY-MM-DD');
};

/** 시각을 'M.D HH:mm' 형식의 한국 시간으로 변환하는 함수 */
export const formatShortDateTime = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('M.D HH:mm');
};

/** 시각을 'M.D' 형식의 한국 날짜로 변환하는 함수 */
export const formatShortDate = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('M.D');
};

/** 시각을 'M월 D일 HH:mm' 형식의 한국 시간으로 변환하는 함수 */
export const formatMonthDayTime = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('M월 D일 HH:mm');
};

/** 시각을 'M월 D일' 형식의 한국 날짜로 변환하는 함수 */
export const formatMonthDay = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('M월 D일');
};

/** 현재 시각을 ms로 반환하는 함수 */
export const getNow = () => {
	return dayjs().valueOf();
};

/** 오늘의 한국 날짜를 반환하는 함수 */
export const formatToday = () => {
	return dayjs().tz(DISPLAY_TIME_ZONE).format('YYYY-MM-DD');
};

/** 시각을 한국 시간의 시와 분으로 변환하는 함수 */
export const formatTime = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('HH:mm');
};

/** 'HH:mm:ss' 형식의 시각을 'HH:mm'으로 변환하는 함수 */
export const toHourMinute = (time: string) => {
	return time.slice(0, 'HH:mm'.length);
};

/** 시각을 "3시간 전" 같은 상대 시각으로 변환하는 함수 */
export const formatRelativeTime = (date: ConfigType, now: number) => {
	// 서버 시계가 빨라도 "후"로 표시하지 않음
	return dayjs(Math.min(dayjs(date).valueOf(), now))
		.locale('ko')
		.from(now);
};

/** 시각을 "50분 후" 같은 상대 시각으로 변환하는 함수 */
export const formatTimeFromNow = (date: ConfigType, now: number) => {
	return dayjs(date).locale('ko').from(now);
};

/** 날짜를 그래프 눈금 문구로 변환하는 함수 */
export const toChartDateLabel = (date: string, today: string) => {
	return date === today ? '오늘' : dayjs(date).format('M.D');
};

/** 날짜에 일수를 더하는 함수 */
export const addDays = (date: string, days: number) => {
	return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
};

/** 양 끝 날짜를 포함한 일수를 세는 함수 */
export const countDays = (dateFrom: string, dateTo: string) => {
	return dayjs(dateTo).diff(dateFrom, 'day') + 1;
};

/** 생일부터 오늘까지의 만 나이를 세는 함수 */
export const countAge = (birthdate: string, today: string) => {
	return dayjs(today).diff(birthdate, 'year');
};

/** ms를 시간 및 분으로 나누는 함수 */
export const toHoursAndMinutes = (durationMs: number) => {
	return { hours: Math.floor(durationMs / HOUR), minutes: Math.floor((durationMs % HOUR) / MINUTE) };
};

/** ms를 "4초", "2시간 14분" 같은 문구로 변환하는 함수 */
export const formatDuration = (durationMs: number) => {
	if (durationMs < MINUTE) {
		return `${Math.floor(durationMs / SECOND)}초`;
	}

	if (durationMs < HOUR) {
		return `${Math.floor(durationMs / MINUTE)}분`;
	}

	const { hours, minutes } = toHoursAndMinutes(durationMs);

	return `${hours}시간 ${minutes}분`;
};

/** ms를 "7일", "5시간" 같은 문구로 변환하는 함수 */
export const formatDaysOrHours = (durationMs: number) => {
	if (durationMs >= DAY) {
		return `${Math.floor(durationMs / DAY)}일`;
	}

	return `${Math.max(1, Math.floor(durationMs / HOUR))}시간`;
};

/** ms를 "7일 후", "5시간 후" 같은 문구로 변환하는 함수 */
export const formatDaysOrHoursLater = (durationMs: number) => {
	const hours = Math.max(1, Math.round(durationMs / HOUR));

	return hours < 24 ? `${hours}시간 후` : `${Math.round(hours / 24)}일 후`;
};

/** ms를 "1시간 30분 뒤" 같은 문구로 변환하는 함수 */
export const formatDurationLater = (durationMs: number) => {
	const minutes = Math.max(1, Math.round(durationMs / MINUTE));
	const hours = Math.floor(minutes / 60);

	if (hours >= 24) {
		return `${Math.floor(hours / 24)}일 ${hours % 24}시간 뒤`;
	}

	if (hours === 0) {
		return `${minutes}분 뒤`;
	}

	return minutes % 60 ? `${hours}시간 ${minutes % 60}분 뒤` : `${hours}시간 뒤`;
};

/** offset 없는 시각을 변환 없이 'M.D HH:mm'으로 변환하는 함수 */
export const formatLocalShortDateTime = (localDateTime: string) => {
	return dayjs(localDateTime).format('M.D HH:mm');
};

/** 시각을 datetime-local 입력값으로 변환하는 함수 */
export const toDateTimeInputValue = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('YYYY-MM-DDTHH:mm');
};

/** datetime-local 입력값을 offset이 붙은 시각으로 변환하는 함수 */
export const toTimestamp = (inputValue: string) => {
	return dayjs.tz(inputValue, DISPLAY_TIME_ZONE).toISOString();
};

/** datetime-local 입력값을 offset 없는 시각으로 변환하는 함수 */
export const toLocalDateTime = (inputValue: string) => {
	return dayjs(inputValue).format('YYYY-MM-DDTHH:mm:ss');
};

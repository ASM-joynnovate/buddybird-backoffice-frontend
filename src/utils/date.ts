import dayjs, { type ConfigType } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { DISPLAY_TIME_ZONE } from '@/config';

dayjs.extend(utc);
dayjs.extend(timezone);

/** 시각을 'YYYY-MM-DD HH:mm' 형식의 한국 시간으로 변환하는 함수 */
export const formatDateTime = (date: ConfigType) => {
	return dayjs(date).tz(DISPLAY_TIME_ZONE).format('YYYY-MM-DD HH:mm');
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

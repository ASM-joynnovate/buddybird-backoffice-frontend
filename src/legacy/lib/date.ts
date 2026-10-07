import dayjs, { type ConfigType } from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/** 시각을 서버와 브라우저에서 같은 한국 시간 문자열로 반환하는 함수 */
export const formatSeoulTime = (date: ConfigType, template: string) =>
	dayjs(date).tz('Asia/Seoul').locale('ko').format(template);

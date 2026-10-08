import type { Announcement } from '@/types/apis/announcements';

import { formatShortDateTime } from '@/utils/date';

/** 게시 기간을 '10.1 10:00 ~ 10.15 18:00' 형식으로 변환하는 함수 */
export const formatPublishPeriod = ({ starts_at, ends_at }: Pick<Announcement, 'starts_at' | 'ends_at'>) => {
	return `${formatShortDateTime(starts_at)} ~ ${ends_at ? formatShortDateTime(ends_at) : '종료일 없음'}`;
};

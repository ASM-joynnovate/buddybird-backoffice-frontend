import type { Announcement } from '@/types/apis/announcements';

import { BellOff, Check, Clock } from 'lucide-react';

import { formatShortDateTime, toHourMinute } from '@/utils/date';

interface Props {
	announcement: Announcement;
}

/**
 * 공지의 푸시 상태 아이콘 및 발송 시각 컴포넌트
 * @param announcement 표시할 공지
 */
const AnnouncementPushStatus = ({ announcement }: Props) => {
	const { push_local_time, push_prepared_at } = announcement;

	if (!announcement.push_enabled) {
		return (
			<BellOff aria-label="푸시 없음" className="size-4 text-muted-foreground">
				<title>푸시 없음</title>
			</BellOff>
		);
	}

	return (
		<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
			{push_prepared_at ? (
				<Check aria-label="발송 완료" className="size-4 text-success">
					<title>발송 완료</title>
				</Check>
			) : (
				<Clock aria-label="발송 예정" className="size-4 text-info">
					<title>발송 예정</title>
				</Clock>
			)}

			<span className="tabular-nums">
				{push_local_time
					? `현지 ${toHourMinute(push_local_time)}`
					: formatShortDateTime(push_prepared_at ?? announcement.starts_at)}
			</span>
		</span>
	);
};

export default AnnouncementPushStatus;

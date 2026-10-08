import type { AnnouncementListItem } from '@/types/apis/announcements';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import { formatPublishPeriod } from '@/utils/announcement';
import { formatDaysOrHours } from '@/utils/date';

interface Props {
	announcement: AnnouncementListItem;
	now: number;
	left: number;
	top: number;
}

/**
 * 게시 일정의 툴팁 컴포넌트
 * @param announcement 가리킨 공지
 * @param now 서버가 화면을 그린 시각
 * @param left 가리킨 가로 위치
 * @param top 일정 막대의 세로 위치
 */
const AnnouncementScheduleTooltip = ({ announcement, now, left, top }: Props) => {
	const startsAt = dayjs(announcement.starts_at).valueOf();
	const endsAt = announcement.ends_at ? dayjs(announcement.ends_at).valueOf() : null;
	const scheduled = now < startsAt;

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute z-10 grid -translate-x-1/2 -translate-y-[calc(100%+12px)] animate-in gap-1 rounded-lg bg-tooltip px-3 py-2 text-xs whitespace-nowrap text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] duration-120 fade-in-0"
			style={{ left, top }}
		>
			<div className="flex items-center gap-1.5">
				<span
					className={cn('size-2 rounded-full', scheduled ? 'inset-ring-2 inset-ring-chart-2' : 'bg-chart-2')}
				/>
				<strong className="text-[13px] font-bold tabular-nums">
					{formatDaysOrHours(scheduled ? startsAt - now : now - startsAt)}
				</strong>
				<span className="text-tooltip-foreground/75">{scheduled ? '뒤 시작' : '지남'}</span>
			</div>

			{endsAt !== null && (
				<div className="flex items-center gap-1.5">
					<span className="size-2 rounded-full inset-ring-2 inset-ring-chart-2" />
					<strong className="text-[13px] font-bold tabular-nums">
						{formatDaysOrHours(endsAt - Math.max(startsAt, now))}
					</strong>
					<span className="text-tooltip-foreground/75">{scheduled ? '동안 게시' : '남음'}</span>
				</div>
			)}

			<span className="text-tooltip-foreground/75 tabular-nums">{formatPublishPeriod(announcement)}</span>
		</div>
	);
};

export default AnnouncementScheduleTooltip;

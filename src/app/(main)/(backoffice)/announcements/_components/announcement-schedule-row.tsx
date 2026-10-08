'use client';

import { type FocusEvent, type MouseEvent, useRef } from 'react';

import type { AnnouncementListItem } from '@/types/apis/announcements';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import AnnouncementRow from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';
import { SCHEDULE_PAST_MS, SCHEDULE_VISIBLE_MS } from '@/config';
import { formatDaysOrHours, formatMonthDay } from '@/utils/date';

export const scheduleGridClassName =
	'[background:linear-gradient(var(--foreground)_0_0)_var(--schedule-now)_0/1px_100%_no-repeat,repeating-linear-gradient(to_right,color-mix(in_srgb,var(--border)_50%,transparent)_0_1px,transparent_1px_var(--schedule-tick))]';

const LABEL_END_PERCENT = 78;

/** 시각을 일정 영역의 가로 위치로 변환하는 함수 */
const toSchedulePercent = (time: number, now: number) => {
	return ((time - (now - SCHEDULE_PAST_MS)) / SCHEDULE_VISIBLE_MS) * 100;
};

/** 가로 위치를 일정 영역 안으로 제한하는 함수 */
const clampPercent = (percent: number) => {
	return Math.min(100, Math.max(0, percent));
};

interface Props {
	announcement: AnnouncementListItem;
	userCount: number;
	now: number;
	onOpen: () => void;
	onTooltipShow: (announcement: AnnouncementListItem, barBox: DOMRect, pointerX: number) => void;
	onTooltipHide: () => void;
}

/**
 * 게시 일정의 공지 하나의 행 컴포넌트
 * @param announcement 표시할 공지
 * @param userCount 전체 사용자 수
 * @param now 서버가 화면을 그린 시각
 * @param onOpen 행을 누르면 실행할 함수
 * @param onTooltipShow 일정 툴팁을 표시할 때 실행할 함수
 * @param onTooltipHide 일정 툴팁을 숨길 때 실행할 함수
 */
const AnnouncementScheduleRow = ({ announcement, userCount, now, onOpen, onTooltipShow, onTooltipHide }: Props) => {
	const laneRef = useRef<HTMLElement>(null);
	const barRef = useRef<HTMLSpanElement>(null);

	const startsAt = dayjs(announcement.starts_at).valueOf();
	const endsAt = announcement.ends_at ? dayjs(announcement.ends_at).valueOf() : null;
	const scheduled = now < startsAt;

	const nowPercent = toSchedulePercent(now, now);
	const startPercent = toSchedulePercent(startsAt, now);
	// 종료일이 없으면 오른쪽 끝까지 표시
	const endPercent = endsAt === null ? Infinity : toSchedulePercent(endsAt, now);

	const barLeftPercent = clampPercent(startPercent);
	const barWidthPercent = clampPercent(endPercent) - barLeftPercent;
	// 게시 중인 공지만 현재 시각까지 채움
	const filledPercent = scheduled ? 0 : ((nowPercent - barLeftPercent) / barWidthPercent) * 100;
	// 막대의 시작 및 현재 시각 중 오른쪽 위치
	const labelPercent = Math.max(barLeftPercent, nowPercent);
	const labelAtEnd = labelPercent > LABEL_END_PERCENT;

	let remainingText = '종료일 없음';

	if (scheduled) {
		remainingText = `${formatDaysOrHours(startsAt - now)} 뒤 시작`;
	} else if (endsAt !== null) {
		remainingText = `${formatDaysOrHours(endsAt - now)} 남음`;
	}

	const endDateText = announcement.ends_at ? `${formatMonthDay(announcement.ends_at)}까지` : '종료일 없이';

	const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
		if (!laneRef.current || !barRef.current) {
			return;
		}

		const laneBox = laneRef.current.getBoundingClientRect();

		// 일정 영역 밖에서는 툴팁 숨김
		if (
			event.clientX < laneBox.left ||
			event.clientX > laneBox.right ||
			event.clientY < laneBox.top ||
			event.clientY > laneBox.bottom
		) {
			onTooltipHide();

			return;
		}

		onTooltipShow(announcement, barRef.current.getBoundingClientRect(), event.clientX);
	};

	const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
		// 키보드로 포커스했을 때만 표시
		if (!barRef.current || !event.target.matches(':focus-visible')) {
			return;
		}

		const barBox = barRef.current.getBoundingClientRect();

		onTooltipShow(announcement, barBox, barBox.left + barBox.width / 2);
	};

	return (
		<AnnouncementRow
			announcement={announcement}
			userCount={userCount}
			status={scheduled ? 'scheduled' : 'live'}
			onOpen={onOpen}
			onMouseMove={handleMouseMove}
			onMouseLeave={onTooltipHide}
			onFocus={handleFocus}
			onBlur={onTooltipHide}
		>
			{/*클릭은 아래에 있는 제목 버튼이 받음*/}
			<figure
				ref={laneRef}
				aria-label={`${formatMonthDay(announcement.starts_at)}부터 ${endDateText} 게시, ${remainingText}`}
				className={cn(scheduleGridClassName, 'pointer-events-none relative min-h-15.25 self-stretch')}
			>
				<span
					aria-hidden
					className={cn(
						'absolute top-2.75 text-xs leading-4.5 font-bold whitespace-nowrap',
						labelAtEnd && 'right-1.5',
					)}
					style={labelAtEnd ? undefined : { left: `calc(${labelPercent}% + 6px)` }}
				>
					{remainingText}
				</span>

				{/*일정 영역을 넘는 쪽은 둥글게 하지 않음*/}
				<span
					ref={barRef}
					className={cn(
						'absolute bottom-3.5 h-2 overflow-hidden rounded-full bg-chart-2/22',
						startPercent < 0 && 'rounded-l-none',
						endPercent > 100 && 'rounded-r-none',
					)}
					style={{ left: `${barLeftPercent}%`, width: `${barWidthPercent}%` }}
				>
					<span className="block h-full bg-chart-2" style={{ width: `${filledPercent}%` }} />
				</span>
			</figure>
		</AnnouncementRow>
	);
};

export default AnnouncementScheduleRow;

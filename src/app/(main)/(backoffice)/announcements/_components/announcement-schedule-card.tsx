'use client';

import { type CSSProperties, useRef, useState } from 'react';

import type { AnnouncementListItem, AnnouncementListParams } from '@/types/apis/announcements';

import { useGetAnnouncementList } from '@/hooks/apis/announcements';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import AnnouncementFormDialog from '@/app/(main)/(backoffice)/announcements/_components/announcement-form-dialog';
import {
	announcementGridClassName,
	announcementTableClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-row';
import AnnouncementScheduleRow, {
	scheduleGridClassName,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-schedule-row';
import AnnouncementScheduleTooltip from '@/app/(main)/(backoffice)/announcements/_components/announcement-schedule-tooltip';
import { SCHEDULE_PAST_MS, SCHEDULE_TICK_MS, SCHEDULE_VISIBLE_MS } from '@/config';
import { formatShortDate } from '@/utils/date';

import { Button } from '@/components/ui/button';

const TICK_COUNT = SCHEDULE_VISIBLE_MS / SCHEDULE_TICK_MS;
const TICK_PERCENT = 100 / TICK_COUNT;
const TODAY_TICK_INDEX = SCHEDULE_PAST_MS / SCHEDULE_TICK_MS;
const TOOLTIP_HALF_WIDTH = 90;

interface Props {
	listParams: AnnouncementListParams;
	now: number;
}

/**
 * 게시 중이거나 예약된 공지의 일정 카드 컴포넌트
 * @param listParams 목록 조회 조건
 * @param now 서버가 화면을 그린 시각
 */
const AnnouncementScheduleCard = ({ listParams, now }: Props) => {
	const { data: announcementListData } = useGetAnnouncementList(listParams);

	const scheduleRef = useRef<HTMLDivElement>(null);

	const [tooltip, setTooltip] = useState<{ announcement: AnnouncementListItem; left: number; top: number }>();
	const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementListItem>();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	// 게시 시작이 이른 공지부터 나열
	const announcements = announcementListData.data.toSorted((first, second) =>
		dayjs(first.starts_at).diff(second.starts_at),
	);
	const scheduledCount = announcements.filter((announcement) => dayjs(now).isBefore(announcement.starts_at)).length;

	const handleTooltipShow = (announcement: AnnouncementListItem, barBox: DOMRect, pointerX: number) => {
		if (!scheduleRef.current) {
			return;
		}

		const scheduleBox = scheduleRef.current.getBoundingClientRect();

		setTooltip({
			announcement,
			// 카드의 좌우를 넘지 않게 제한
			left: Math.min(
				Math.max(pointerX - scheduleBox.left, TOOLTIP_HALF_WIDTH),
				scheduleBox.width - TOOLTIP_HALF_WIDTH,
			),
			top: barBox.top - scheduleBox.top,
		});
	};

	return (
		<>
			{announcements.length === 0 ? (
				<TitledCard title="게시 일정">
					<div className="grid justify-items-center gap-1.5 px-4 pt-7 pb-3.5 text-center">
						<strong className="text-base font-bold">게시 중이거나 예약된 공지가 없습니다</strong>
						<p className="text-muted-foreground">
							공지를 작성하면 게시 기간 동안 앱 홈 화면에 팝업으로 표시됩니다.
						</p>

						<Button variant="outline" className="mt-2.5" onClick={() => setCreateDialogOpen(true)}>
							공지 작성
						</Button>
					</div>
				</TitledCard>
			) : (
				<TitledCard
					title="게시 일정"
					action=<div className="flex gap-3.5 text-[13px] text-muted-foreground">
						<span>
							게시 중
							<strong className="ml-1 font-bold text-foreground tabular-nums">
								{announcements.length - scheduledCount}
							</strong>
						</span>
						<span>
							예약
							<strong className="ml-1 font-bold text-foreground tabular-nums">{scheduledCount}</strong>
						</span>
					</div>
				>
					<div
						ref={scheduleRef}
						className="relative"
						style={
							{
								'--schedule-now': `${TODAY_TICK_INDEX * TICK_PERCENT}%`,
								'--schedule-tick': `${TICK_PERCENT}%`,
							} as CSSProperties
						}
					>
						<div className="-mx-2 overflow-x-auto px-2">
							<div className={announcementTableClassName}>
								<div
									className={cn(
										announcementGridClassName,
										'font-medium whitespace-nowrap text-muted-foreground',
									)}
								>
									<span className="pb-2">공지</span>

									{/*7일 간격의 날짜 눈금*/}
									<div aria-hidden className={cn(scheduleGridClassName, 'relative h-7 self-stretch')}>
										{Array.from({ length: TICK_COUNT }, (_, index) => (
											<span
												key={index}
												className={cn(
													'absolute top-0 text-[11.5px] leading-5 font-normal tabular-nums',
													index === TODAY_TICK_INDEX && 'font-bold text-foreground',
												)}
												style={{ left: `calc(${index * TICK_PERCENT}% + 6px)` }}
											>
												{index === TODAY_TICK_INDEX
													? '오늘'
													: formatShortDate(
															now - SCHEDULE_PAST_MS + index * SCHEDULE_TICK_MS,
														)}
											</span>
										))}
									</div>

									<span className="pb-2 text-right">읽음</span>
									<span className="pb-2">푸시</span>
								</div>

								<ul>
									{announcements.map((announcement) => (
										<AnnouncementScheduleRow
											key={announcement.id}
											announcement={announcement}
											userCount={announcementListData.meta.user_count}
											now={now}
											onOpen={() => setEditingAnnouncement(announcement)}
											onTooltipShow={handleTooltipShow}
											onTooltipHide={() => setTooltip(undefined)}
										/>
									))}
								</ul>
							</div>
						</div>

						{!!tooltip && <AnnouncementScheduleTooltip {...tooltip} now={now} />}
					</div>
				</TitledCard>
			)}

			{/*목록이 바뀌어도 저장이 끝날 때까지 유지*/}
			{!!editingAnnouncement && (
				<AnnouncementFormDialog
					announcement={editingAnnouncement}
					onClose={() => setEditingAnnouncement(undefined)}
				/>
			)}

			{createDialogOpen && <AnnouncementFormDialog onClose={() => setCreateDialogOpen(false)} />}
		</>
	);
};

export default AnnouncementScheduleCard;

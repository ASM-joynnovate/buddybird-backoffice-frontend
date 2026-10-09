import type { FocusEventHandler, MouseEventHandler, ReactNode } from 'react';

import type { AnnouncementListItem } from '@/types/apis/announcements';

import { cn } from '@/lib/utils';

import { ChevronRight } from 'lucide-react';

import AnnouncementPushStatus from '@/app/(main)/(backoffice)/announcements/_components/announcement-push-status';
import { formatPublishPeriod } from '@/utils/announcement';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Badge } from '@/components/ui/badge';

export const announcementGridClassName = 'grid grid-cols-[300px_minmax(0,1fr)_64px_132px_14px] items-center gap-x-5';

// 좁은 화면에서는 가로 스크롤
export const announcementTableClassName = 'min-w-240';

const statusTags = {
	live: { label: '게시 중', variant: 'success' },
	scheduled: { label: '예약', variant: 'info' },
	ended: undefined,
} as const;

interface Props {
	announcement: AnnouncementListItem;
	userCount: number;
	status: keyof typeof statusTags;
	children: ReactNode;
	onOpen: () => void;
	onMouseMove?: MouseEventHandler<HTMLButtonElement>;
	onMouseLeave?: () => void;
	onFocus?: FocusEventHandler<HTMLButtonElement>;
	onBlur?: () => void;
}

/**
 * 공지 목록의 행 컴포넌트
 * @param announcement 표시할 공지
 * @param userCount 전체 사용자 수
 * @param status 공지의 게시 상태
 * @param children 가운데 열에 표시할 내용
 * @param onOpen 행을 누르면 실행할 함수
 * @param onMouseMove 행 위에서 마우스가 움직이면 실행할 함수
 * @param onMouseLeave 마우스가 행을 벗어나면 실행할 함수
 * @param onFocus 제목 버튼에 포커스하면 실행할 함수
 * @param onBlur 제목 버튼에서 포커스가 떠나면 실행할 함수
 */
const AnnouncementRow = ({
	announcement,
	userCount,
	status,
	children,
	onOpen,
	onMouseMove,
	onMouseLeave,
	onFocus,
	onBlur,
}: Props) => {
	const title = koreanOrEnglishText(announcement.title);
	const statusTag = statusTags[status];

	return (
		<li
			className={cn(
				announcementGridClassName,
				'relative -mx-2 rounded-md px-2 transition-colors before:absolute before:inset-x-2 before:top-0 before:border-t before:border-border hover:bg-muted',
			)}
		>
			<div className="min-w-0 py-2.5">
				<p className="flex items-center justify-between gap-2">
					{/*누르는 영역을 행 전체로 넓힌 버튼*/}
					<button
						type="button"
						className="min-w-0 truncate text-left font-semibold after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
						onClick={onOpen}
						onMouseMove={onMouseMove}
						onMouseLeave={onMouseLeave}
						onFocus={onFocus}
						onBlur={onBlur}
					>
						{title}
					</button>

					{!!statusTag && <Badge variant={statusTag.variant}>{statusTag.label}</Badge>}
				</p>

				<small className="block text-[13px] text-muted-foreground tabular-nums">
					{formatPublishPeriod(announcement)}
				</small>
			</div>

			{children}

			{status === 'scheduled' ? (
				<p className="text-right text-muted-foreground">-</p>
			) : (
				<p className="text-right whitespace-nowrap tabular-nums">
					<strong className="font-bold">
						{userCount ? Math.round((announcement.read_count / userCount) * 100) : 0}%
					</strong>
					<small className="block text-[13px] text-muted-foreground">
						{announcement.read_count.toLocaleString('ko-KR')}명
					</small>
				</p>
			)}

			<p>
				<AnnouncementPushStatus announcement={announcement} />
			</p>

			<ChevronRight aria-hidden className="size-3.5 text-muted-foreground" />
		</li>
	);
};

export default AnnouncementRow;

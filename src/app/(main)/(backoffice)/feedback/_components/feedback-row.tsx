'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import type { Feedback } from '@/types/apis/feedback';

import { cn } from '@/lib/utils';

import { TriangleAlert } from 'lucide-react';

import HighlightedText from '@/app/(main)/(backoffice)/_components/highlighted-text';
import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import { formatRelativeTime, formatShortDateTime } from '@/utils/date';
import { toPlatformName } from '@/utils/platform';

import { Badge } from '@/components/ui/badge';

interface Props {
	feedback: Feedback;
	keyword?: string;
	now: number;
}

/**
 * 피드백 하나의 행 컴포넌트
 * @param feedback 표시할 피드백
 * @param keyword 강조할 검색어
 * @param now 상대 시각의 기준인 현재 시각
 */
const FeedbackRow = ({ feedback, keyword, now }: Props) => {
	const messageRef = useRef<HTMLParagraphElement>(null);

	const [messageExpanded, setMessageExpanded] = useState(false);
	const [messageOverflowing, setMessageOverflowing] = useState(false);

	const { user, device } = feedback;
	const messageId = `feedback-message-${feedback.id}`;
	// 검색어가 있으면 내용 전체 표시
	const messageClamped = !keyword && !messageExpanded;

	/** 내용이 다섯 줄을 넘는지 확인 */
	useEffect(() => {
		if (!messageRef.current || !messageClamped) {
			return;
		}

		setMessageOverflowing(messageRef.current.scrollHeight > messageRef.current.clientHeight + 1);
	}, [messageClamped, feedback.message]);

	return (
		<article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[196px_minmax(0,1fr)_auto]">
			<Link
				href={`/users/${feedback.user_id}`}
				className={cn(
					'group -mx-1.5 -my-1 flex min-w-0 items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted',
					user.is_deleted && 'opacity-55',
				)}
			>
				<UserAvatar
					photoUrl={user.photo_file?.url}
					nickname={user.nickname}
					className="transition-colors group-hover:bg-card"
				/>

				<span className="min-w-0">
					{user.nickname ? (
						<strong className="block truncate font-semibold">
							<HighlightedText text={user.nickname} keyword={keyword} />
						</strong>
					) : (
						<span className="block text-muted-foreground">닉네임 없음</span>
					)}

					{user.is_deleted && (
						<Badge className="rounded-sm bg-muted font-bold text-muted-foreground group-hover:bg-card">
							삭제됨
						</Badge>
					)}

					{!user.is_deleted && user.is_anonymous && (
						<Badge className="rounded-sm bg-muted font-bold text-muted-foreground group-hover:bg-card">
							익명
						</Badge>
					)}

					{!user.is_deleted && !user.is_anonymous && !!user.email && (
						<span className="block truncate text-[13px] text-muted-foreground">
							<HighlightedText text={user.email} keyword={keyword} />
						</span>
					)}
				</span>
			</Link>

			<div className="grid min-w-0 justify-items-start gap-1.5 max-md:col-span-full">
				<p
					ref={messageRef}
					id={messageId}
					className={cn('max-w-160 whitespace-pre-line', messageClamped && 'line-clamp-5')}
				>
					<HighlightedText text={feedback.message} keyword={keyword} />
				</p>

				{!keyword && messageOverflowing && (
					<button
						type="button"
						aria-expanded={messageExpanded}
						aria-controls={messageId}
						className="rounded-sm text-[13px] font-semibold text-muted-foreground hover:underline hover:underline-offset-3"
						onClick={() => setMessageExpanded((prev) => !prev)}
					>
						{messageExpanded ? '접기' : '더 보기'}
					</button>
				)}

				<ul className="flex flex-wrap gap-x-3.5 gap-y-0.5 text-[13px] text-muted-foreground tabular-nums">
					<li>{device.model}</li>
					<li>
						{toPlatformName(device.platform)} {device.os_version}
					</li>

					{feedback.is_unsupported ? (
						<li
							title="최소 지원 버전보다 낮음"
							className="inline-flex items-center gap-1 font-semibold text-warning"
						>
							<TriangleAlert className="size-3.5" />
							버전 {feedback.app_version}
						</li>
					) : (
						<li>버전 {feedback.app_version}</li>
					)}
				</ul>
			</div>

			<time
				dateTime={feedback.created_at}
				className="text-right whitespace-nowrap text-muted-foreground tabular-nums max-md:col-start-2 max-md:row-start-1"
			>
				{formatShortDateTime(feedback.created_at)}
				<small className="block text-[12.5px]">{formatRelativeTime(feedback.created_at, now)}</small>
			</time>
		</article>
	);
};

export default FeedbackRow;

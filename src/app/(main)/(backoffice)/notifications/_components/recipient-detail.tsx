'use client';

import type { CSSProperties, ReactNode } from 'react';

import Link from 'next/link';

import type { I18nText } from '@/types/apis/common';
import type { NotificationKind } from '@/types/apis/notifications';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { Bell, BellOff, Mail, MailOpen, Send } from 'lucide-react';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import NotificationPreview from '@/app/(main)/(backoffice)/_components/notification-preview';
import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import { formatDurationLater, formatShortDateTime } from '@/utils/date';

export const detailPanelClassName =
	'grid overflow-hidden rounded-lg bg-card-inset shadow-[inset_0_0_0_1px_var(--border)] @min-[761px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]';
export const detailSectionClassName = 'grid min-w-0 content-start gap-2.5 p-4';
export const detailStatClassName = `${detailSectionClassName} border-t @min-[761px]:border-t-0 @min-[761px]:border-l`;

interface Props {
	kind: NotificationKind;
	title: I18nText;
	body: I18nText;
	imageUrl?: string;
	recipient?: {
		user_id: string;
		nickname: string | null;
		email: string | null;
		photo_file: { url: string } | null;
	};
	sentAt: string | null;
	pushSentAt: string | null;
	readAt: string | null;
	children?: ReactNode;
}

/**
 * 받는 사람이 한 명인 알림의 상세 컴포넌트
 * @param kind 알림 종류
 * @param title 알림 제목
 * @param body 알림 본문
 * @param imageUrl 알림 사진의 주소
 * @param recipient 받는 사람
 * @param sentAt 발송 일시
 * @param pushSentAt 푸시 발송 일시
 * @param readAt 읽은 일시
 * @param children 아래에 표시할 버튼
 */
const RecipientDetail = ({ kind, title, body, imageUrl, recipient, sentAt, pushSentAt, readAt, children }: Props) => {
	const steps = [
		{ label: '발송', at: sentAt, Icon: Send },
		{ label: '푸시', at: pushSentAt, Icon: pushSentAt ? Bell : BellOff },
		{ label: '읽음', at: readAt, Icon: readAt ? MailOpen : Mail },
	];

	return (
		<div className={detailPanelClassName}>
			<div className={detailSectionClassName}>
				<NotificationPreview kind={kind} title={title} body={body} imageUrl={imageUrl} />
			</div>

			<section className={detailStatClassName}>
				{!!recipient && (
					<Link
						href={`/users/${recipient.user_id}`}
						className="group -mx-1.5 -my-1 flex w-fit max-w-full min-w-0 items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted"
					>
						<UserAvatar
							photoUrl={recipient.photo_file?.url}
							nickname={recipient.nickname}
							className="transition-colors group-hover:bg-card"
						/>

						<span className="min-w-0">
							<strong className="block truncate font-semibold">
								{recipient.nickname ?? '닉네임 없음'}
							</strong>
							{!!recipient.email && (
								<span className="block truncate text-[13px] text-muted-foreground">
									{recipient.email}
								</span>
							)}
						</span>
					</Link>
				)}

				{/*발송, 푸시, 읽음 순서*/}
				<ol
					className="grid tabular-nums"
					style={{ '--kind-color': NOTIFICATION_KINDS[kind].color } as CSSProperties}
				>
					{steps.map(({ label, at, Icon }) => (
						<li
							key={label}
							className={cn(
								'relative grid min-h-10 grid-cols-[28px_44px_minmax(0,1fr)_auto] items-center gap-2.5 text-muted-foreground',
								// 단계 사이를 잇는 세로선
								"not-first:before:absolute not-first:before:bottom-[calc(50%+14px)] not-first:before:left-3.25 not-first:before:h-3 not-first:before:border-l-2 not-first:before:border-chart-neutral not-first:before:content-['']",
							)}
						>
							<span
								className={cn(
									'grid size-7 place-items-center rounded-full bg-muted',
									at && 'bg-(--kind-color)/14 text-foreground',
								)}
							>
								<Icon className="size-4" />
							</span>
							<span className="text-[13px]">{label}</span>

							{at ? (
								<time dateTime={at} className="font-semibold text-foreground">
									{formatShortDateTime(at)}
								</time>
							) : (
								<span>-</span>
							)}

							<span className="text-[13px]">
								{label === '읽음' &&
									!!at &&
									!!sentAt &&
									formatDurationLater(dayjs(at).valueOf() - dayjs(sentAt).valueOf())}
							</span>
						</li>
					))}
				</ol>
			</section>

			{children}
		</div>
	);
};

export default RecipientDetail;

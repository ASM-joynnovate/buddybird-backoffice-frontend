'use client';

import { useState } from 'react';

import Link from 'next/link';

import type { AbuseReport } from '@/types/apis/abuse-reports';

import { useHandleAbuseReport } from '@/hooks/apis/abuse-reports';

import { cn } from '@/lib/utils';

import { Check, EyeOff, Feather, ImageIcon } from 'lucide-react';

import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import AbuseReportFeedItem from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-report-feed-item';
import DeleteParrotPhotoDialog from '@/app/(main)/(backoffice)/abuse-reports/_components/delete-parrot-photo-dialog';
import DeleteUserPhotoDialog from '@/app/(main)/(backoffice)/abuse-reports/_components/delete-user-photo-dialog';
import HideFeedItemDialog from '@/app/(main)/(backoffice)/abuse-reports/_components/hide-feed-item-dialog';
import { toCountryName } from '@/utils/country';
import { formatRelativeTime, formatShortDateTime } from '@/utils/date';
import { toUploadedUrl } from '@/utils/file';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const reasonNames = { spam: '스팸', inappropriate_content: '부적절한 내용', harassment: '괴롭힘', other: '기타' };

interface Props {
	abuseReport: AbuseReport;
	now: number;
}

/**
 * 신고 하나의 행 컴포넌트
 * @param abuseReport 표시할 신고
 * @param now 상대 시각의 기준인 현재 시각
 */
const AbuseReportRow = ({ abuseReport, now }: Props) => {
	const [hideDialogOpen, setHideDialogOpen] = useState(false);
	const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
	const [parrotPhotoDialogOpen, setParrotPhotoDialogOpen] = useState(false);

	const { isPending, mutate } = useHandleAbuseReport();

	const { reported_user: reportedUser, reporter, feed_item: feedItem, handled_at: handledAt } = abuseReport;
	const firstParrot = reportedUser.parrots.at(0);
	const mimicFeedItem = feedItem?.kind === 'mimic_succeeded';

	const handleCompleteAbuseReport = () => {
		if (isPending) {
			return;
		}

		mutate({ id: abuseReport.id });
	};

	return (
		<article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[196px_minmax(0,1fr)_auto]">
			<Link
				href={`/users/${reportedUser.id}`}
				className={cn(
					'group -mx-1.5 -my-1 flex min-w-0 items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted',
					(reportedUser.is_deleted || !!handledAt) && 'opacity-55',
				)}
			>
				<UserAvatar
					photoUrl={toUploadedUrl(reportedUser.photo_file)}
					nickname={reportedUser.nickname}
					className="transition-colors group-hover:bg-card"
				/>

				<span className="min-w-0">
					{reportedUser.nickname ? (
						<strong className="block truncate font-semibold">{reportedUser.nickname}</strong>
					) : (
						<span className="block text-muted-foreground">닉네임 없음</span>
					)}

					{reportedUser.is_deleted ? (
						<span className="flex h-lh items-center text-[13px]">
							<Badge variant="muted" className="group-hover:bg-card">
								삭제됨
							</Badge>
						</span>
					) : (
						!!reportedUser.email && (
							<span className="block truncate text-[13px] text-muted-foreground">
								{reportedUser.email}
							</span>
						)
					)}

					{!!reportedUser.country && (
						<span className="block truncate text-[13px] text-muted-foreground">
							{toCountryName(reportedUser.country)}
						</span>
					)}
				</span>
			</Link>

			<div className="grid min-w-0 justify-items-start gap-2 max-md:col-span-full">
				<p className="flex max-w-160 flex-wrap items-baseline gap-x-2 gap-y-1.5">
					<Badge variant="muted">{reasonNames[abuseReport.reason]}</Badge>
					{!!abuseReport.description && (
						<span className="whitespace-pre-line">{abuseReport.description}</span>
					)}
				</p>

				{!!feedItem && (
					<AbuseReportFeedItem
						feedItem={feedItem}
						parrotPhotoUrl={toUploadedUrl(firstParrot?.photo_file ?? null)}
						className={handledAt ? 'opacity-55' : undefined}
					/>
				)}
			</div>

			<time
				dateTime={abuseReport.created_at}
				className="text-right whitespace-nowrap text-muted-foreground tabular-nums max-md:col-start-2 max-md:row-start-1"
			>
				{formatShortDateTime(abuseReport.created_at)}
				<small className="block text-[12.5px]">{formatRelativeTime(abuseReport.created_at, now)}</small>
			</time>

			<div className="col-span-full flex min-h-7 flex-wrap items-center justify-between gap-x-4 gap-y-2 md:col-start-2">
				<p className="text-[13px] text-muted-foreground">
					신고{' '}
					<Link
						href={`/users/${reporter.id}`}
						className="font-semibold text-brand hover:underline hover:underline-offset-3"
					>
						{reporter.nickname ?? '닉네임 없음'}
					</Link>
				</p>

				{handledAt ? (
					<p className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap text-muted-foreground tabular-nums">
						<Check aria-label="처리 완료" className="size-4 text-success">
							<title>처리 완료</title>
						</Check>
						{formatShortDateTime(handledAt)}
					</p>
				) : (
					<div className="flex flex-wrap justify-end gap-1.5">
						{!!feedItem && !feedItem.is_deleted && (
							<Button variant="outline" size="sm" onClick={() => setHideDialogOpen(true)}>
								<EyeOff />
								피드 숨김
							</Button>
						)}
						{!!reportedUser.photo_file && (
							<Button variant="outline" size="sm" onClick={() => setPhotoDialogOpen(true)}>
								<ImageIcon />
								프로필 사진 삭제
							</Button>
						)}
						{mimicFeedItem && !!firstParrot?.photo_file && (
							<Button variant="outline" size="sm" onClick={() => setParrotPhotoDialogOpen(true)}>
								<Feather />
								앵무새 사진 삭제
							</Button>
						)}
						<Button size="sm" loading={isPending} onClick={handleCompleteAbuseReport}>
							<Check />
							처리 완료
						</Button>
					</div>
				)}
			</div>

			{!!feedItem && (
				<HideFeedItemDialog open={hideDialogOpen} id={feedItem.id} onClose={() => setHideDialogOpen(false)} />
			)}
			<DeleteUserPhotoDialog
				open={photoDialogOpen}
				id={reportedUser.id}
				onClose={() => setPhotoDialogOpen(false)}
			/>
			{!!firstParrot && (
				<DeleteParrotPhotoDialog
					open={parrotPhotoDialogOpen}
					userId={reportedUser.id}
					parrotId={firstParrot.id}
					onClose={() => setParrotPhotoDialogOpen(false)}
				/>
			)}
		</article>
	);
};

export default AbuseReportRow;

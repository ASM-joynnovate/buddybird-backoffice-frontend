'use client';

import Image from 'next/image';

import type { AbuseReport } from '@/types/apis/abuse-reports';
import type { Parrot } from '@/types/apis/users';

import useAudioPlayer from '@/hooks/use-audio-player';

import { cn } from '@/lib/utils';

import { CalendarDays, Clock, EyeOff, Repeat } from 'lucide-react';

import PhotoDialog from '@/app/(main)/(backoffice)/_components/photo-dialog';
import PlayButton from '@/app/(main)/(backoffice)/_components/play-button';
import { HOUR } from '@/config/units';
import { toUploadedUrl } from '@/utils/file';

const milestoneIcons = {
	total_learning_time_reached: Clock,
	monthly_learning_time_reached: CalendarDays,
	word_play_count_reached: Repeat,
};

/** 피드 항목 내용을 한 줄 문구로 변환하는 함수 */
const toFeedItemText = (feedItem: NonNullable<AbuseReport['feed_item']>) => {
	const threshold = feedItem.threshold ?? 0;

	return {
		mimic_succeeded: `'${feedItem.word_name}'`,
		total_learning_time_reached: `총 학습 시간 ${Math.floor(threshold / HOUR)}시간`,
		monthly_learning_time_reached: `월 학습 시간 ${Math.floor(threshold / HOUR)}시간`,
		word_play_count_reached: `'${feedItem.word_name}' ${threshold.toLocaleString('ko-KR')}번`,
	}[feedItem.kind];
};

interface Props {
	feedItem: NonNullable<AbuseReport['feed_item']>;
	parrot?: Pick<Parrot, 'name' | 'photo_file'>;
	className?: string;
}

/**
 * 신고된 피드 항목 컴포넌트
 * @param feedItem 신고된 피드 항목
 * @param parrot 신고된 사용자의 첫 앵무새
 * @param className 항목에 더할 class
 */
const AbuseReportFeedItem = ({ feedItem, parrot, className }: Props) => {
	const { playing, progressPercent, handleTogglePlay, audioProps } = useAudioPlayer();

	const feedItemText = toFeedItemText(feedItem);
	const recordingUrl = toUploadedUrl(feedItem.file);
	const parrotPhotoUrl = toUploadedUrl(parrot?.photo_file ?? null);
	const MilestoneIcon = feedItem.kind === 'mimic_succeeded' ? undefined : milestoneIcons[feedItem.kind];

	return (
		<div
			className={cn(
				'flex min-h-14 w-full max-w-130 items-center gap-3 rounded-lg bg-muted py-2.5 pr-3 pl-2.5',
				feedItem.is_deleted && 'bg-transparent ring-1 ring-border ring-inset',
				className,
			)}
		>
			{!!recordingUrl && (
				<>
					<audio src={recordingUrl} preload="none" {...audioProps}>
						<track kind="captions" />
					</audio>

					<PlayButton
						label={feedItemText}
						playing={playing}
						progressPercent={progressPercent}
						onClick={handleTogglePlay}
					/>
				</>
			)}

			{!!MilestoneIcon && (
				<span className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-muted-foreground">
					<MilestoneIcon className="size-4" />
				</span>
			)}

			<div className="mr-auto min-w-0">
				<strong
					className={cn(
						'block truncate font-semibold',
						feedItem.is_deleted && 'text-muted-foreground line-through decoration-chart-neutral',
					)}
				>
					{feedItemText}
				</strong>
				{feedItem.kind === 'mimic_succeeded' && (
					<span className="block text-[13px] text-muted-foreground">따라 한 단어</span>
				)}
			</div>

			{feedItem.is_deleted && (
				<EyeOff aria-label="숨긴 항목" className="size-4 shrink-0 text-muted-foreground">
					<title>숨긴 항목</title>
				</EyeOff>
			)}

			{feedItem.kind === 'mimic_succeeded' && !!parrot && !!parrotPhotoUrl && (
				<PhotoDialog photoUrl={parrotPhotoUrl} title={parrot.name} className="rounded-full">
					<Image
						src={parrotPhotoUrl}
						alt="첫 앵무새 사진"
						title="첫 앵무새 사진"
						width={40}
						height={40}
						unoptimized
						className="size-10 shrink-0 rounded-full object-cover"
					/>
				</PhotoDialog>
			)}
		</div>
	);
};

export default AbuseReportFeedItem;

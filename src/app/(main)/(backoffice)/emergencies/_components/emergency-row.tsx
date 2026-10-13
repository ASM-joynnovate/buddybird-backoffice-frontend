'use client';

import type { CSSProperties } from 'react';

import Image from 'next/image';

import type { Emergency } from '@/types/apis/emergencies';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { AudioLines, BellOff, ChevronDown, ChevronRight, Play, Square, Video } from 'lucide-react';

import ReadStatus from '@/app/(main)/(backoffice)/_components/read-status';
import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import EmergencyDetail from '@/app/(main)/(backoffice)/emergencies/_components/emergency-detail';
import { EMERGENCY_KINDS } from '@/config/emergency';
import { formatDuration, formatShortDate, formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';
import { toUploadedUrl } from '@/utils/file';
import { toSpeciesName } from '@/utils/species';

import { Button } from '@/components/ui/button';

export const emergencyGridClassName =
	'grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 @min-[660px]:grid-cols-[92px_20px_minmax(120px,1fr)_minmax(170px,1.7fr)_64px_104px_16px]';

const thumbnailClassName = 'relative block h-9 w-16 shrink-0 overflow-hidden rounded-sm bg-card ring-1 ring-border';

interface Props {
	emergency: Emergency;
	expanded: boolean;
	now: number;
	player: AudioPlaylist;
	onToggle: () => void;
}

/**
 * 응급 상황 하나의 행 컴포넌트
 * @param emergency 표시할 응급 상황
 * @param expanded 상세 표시 여부
 * @param now 현재 시각
 * @param player useAudioPlaylist 결과
 * @param onToggle 행을 누르면 실행할 함수
 */
const EmergencyRow = ({ emergency, expanded, now, player, onToggle }: Props) => {
	const { kind, session, user, parrot, sound, vision } = emergency;

	const KindIcon = kind === 'sound_emergency_detected' ? AudioLines : Video;
	const detailId = `emergency-detail-${emergency.id}`;
	const kindLabel = `${EMERGENCY_KINDS[kind].label} 기반 응급 상황`;
	const occurredTime = formatShortDateTimeWithSeconds(emergency.occurred_at);

	// 세션이 실행 중이고 아직 복귀하지 않은 이탈
	const ongoing = !!vision && !vision.appeared && session.status === 'running';
	const durationMs =
		dayjs(emergency.ended_at ?? session.ended_at ?? now).valueOf() - dayjs(emergency.occurred_at).valueOf();

	const imageUrl = toUploadedUrl(vision?.image ?? null);
	const appearedImageUrl = toUploadedUrl(vision?.appeared?.image ?? null);

	const soundGroup = { id: emergency.id, sounds: sound?.sounds ?? [] };
	const soundPlaying = player.playingSoundGroupId === emergency.id;
	const currentSoundIndex = soundGroup.sounds.findIndex(
		(emergencySound) => emergencySound.id === player.currentSoundId,
	);

	return (
		<article className="border-t py-1 first:border-t-0">
			<div
				className={cn(
					emergencyGridClassName,
					'group relative rounded-md px-2 py-1.5 transition-colors hover:bg-muted',
					expanded && 'bg-muted',
				)}
			>
				<div className="grid whitespace-nowrap tabular-nums">
					<small className="text-[12.5px] text-muted-foreground">
						{formatShortDate(emergency.occurred_at)}
					</small>
					<button
						type="button"
						aria-expanded={expanded}
						aria-controls={detailId}
						aria-label={`${user.nickname ?? '닉네임 없음'} ${occurredTime} ${kindLabel} 상세`}
						// 누르는 영역을 행 전체로 넓힘
						className="text-left font-semibold after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
						onClick={onToggle}
					>
						<time dateTime={emergency.occurred_at}>{formatTimeWithSeconds(emergency.occurred_at)}</time>
					</button>
				</div>

				<span
					title={kindLabel}
					className="inline-flex items-center gap-1.5 whitespace-nowrap @max-[659px]:row-start-2"
				>
					<KindIcon
						aria-hidden
						className="size-4 shrink-0 text-[color-mix(in_srgb,var(--kind-color)_78%,var(--foreground))]"
						style={{ '--kind-color': EMERGENCY_KINDS[kind].color } as CSSProperties}
					/>
					<span className="@min-[660px]:sr-only">{EMERGENCY_KINDS[kind].label}</span>
				</span>

				<div className={cn('flex min-w-0 items-center gap-2.5', user.is_deleted && 'opacity-55')}>
					<UserAvatar
						photoUrl={user.photo_file?.url}
						nickname={user.nickname}
						className="size-7 text-xs transition-colors group-hover:bg-card"
					/>

					<span className="min-w-0">
						{user.nickname ? (
							<strong className="block truncate font-semibold">{user.nickname}</strong>
						) : (
							<span className="block text-muted-foreground">닉네임 없음</span>
						)}

						<span className="block truncate text-[13px] text-muted-foreground">
							{parrot ? (
								<>
									<b className="font-semibold text-foreground">{parrot.name}</b>{' '}
									{toSpeciesName(parrot.species)}
									{emergency.parrot_count > 1 && ` 외 ${emergency.parrot_count - 1}마리`}
								</>
							) : (
								'앵무새 등록 전'
							)}
						</span>
					</span>
				</div>

				{/*사진 높이로 고정*/}
				<div className="flex h-9 min-w-0 items-center gap-2 @max-[659px]:col-span-2 @max-[659px]:row-start-2">
					{!!sound && (
						<>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label={`${occurredTime} 응급 상황 소리 ${soundPlaying ? '정지' : '재생'}`}
								className="relative z-1 rounded-full"
								onClick={() => player.handleToggleSoundGroup(soundGroup)}
							>
								{soundPlaying ? (
									<Square className="size-2.5 fill-current" />
								) : (
									<Play className="size-3 fill-current" />
								)}
							</Button>

							{/*재생한 소리는 진하게 표시*/}
							<span aria-hidden className="flex h-5 max-w-60 min-w-0 flex-1 gap-0.5">
								{sound.sounds.map((emergencySound, index) => (
									<span
										key={emergencySound.id}
										className={cn(
											'min-w-0.75 rounded-sm bg-chart-1/26 transition-colors first:rounded-l-md last:rounded-r-md motion-reduce:transition-none',
											soundPlaying && index <= currentSoundIndex && 'bg-chart-1',
										)}
										style={{ flex: emergencySound.duration_ms ?? 1 }}
									/>
								))}
							</span>

							<span className="text-[13px] whitespace-nowrap text-muted-foreground tabular-nums">
								{sound.sounds.length}개
							</span>
						</>
					)}

					{!!vision && (
						<>
							<span className={thumbnailClassName}>
								{!!imageUrl && (
									<Image
										src={imageUrl}
										alt={`${occurredTime} 이탈 사진`}
										width={128}
										height={72}
										unoptimized
										className="size-full object-cover"
									/>
								)}

								{toUploadedUrl(vision.video) && (
									<span className="absolute bottom-1 left-1 grid size-4 place-items-center rounded-full bg-tooltip/72 text-tooltip-foreground">
										<Play aria-label="영상 있음" className="size-2 fill-current" />
									</span>
								)}
							</span>

							<ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />

							{vision.appeared ? (
								<span className={thumbnailClassName}>
									{!!appearedImageUrl && (
										<Image
											src={appearedImageUrl}
											alt={`${formatShortDateTimeWithSeconds(vision.appeared.occurred_at)} 복귀 사진`}
											width={128}
											height={72}
											unoptimized
											className="size-full object-cover"
										/>
									)}
								</span>
							) : (
								<span className="h-9 w-16 shrink-0 rounded-sm border border-dashed border-chart-neutral" />
							)}
						</>
					)}
				</div>

				<span
					className={cn(
						'font-semibold whitespace-nowrap tabular-nums @max-[659px]:col-start-3 @max-[659px]:row-start-1 @max-[659px]:justify-self-end',
						ongoing && 'font-bold text-destructive',
					)}
				>
					{formatDuration(durationMs)}
					{ongoing && '째'}
				</span>

				<span className="@max-[659px]:hidden">
					{!vision && <span className="text-muted-foreground">-</span>}

					{!!vision && !!vision.notification && <ReadStatus readAt={vision.notification.read_at} />}

					{!!vision && !vision.notification && (
						<BellOff aria-label="알림 미발송" className="size-4 text-muted-foreground">
							<title>알림 미발송</title>
						</BellOff>
					)}
				</span>

				<ChevronDown
					aria-hidden
					className={cn(
						'size-4 text-muted-foreground transition-transform @max-[659px]:hidden',
						expanded && 'rotate-180',
					)}
				/>
			</div>

			{expanded && (
				<div id={detailId} className="mx-2 mt-1 mb-2">
					<EmergencyDetail
						emergency={emergency}
						now={now}
						currentSoundId={player.currentSoundId}
						soundPlaying={soundPlaying}
						onToggleSounds={() => player.handleToggleSoundGroup(soundGroup)}
						onPlaySound={(emergencySound) => player.playSoundInGroup(soundGroup, emergencySound)}
					/>
				</div>
			)}
		</article>
	);
};

export default EmergencyRow;

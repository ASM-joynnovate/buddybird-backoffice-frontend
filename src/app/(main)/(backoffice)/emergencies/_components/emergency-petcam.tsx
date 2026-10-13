'use client';

import { useState } from 'react';

import Image from 'next/image';

import type { Emergency, EmergencyNotification } from '@/types/apis/emergencies';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { Bell, BellOff, Eye, type LucideIcon, Mail, MailOpen } from 'lucide-react';

import { formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';
import { toUploadedUrl } from '@/utils/file';

type PetcamShot = 'disappeared' | 'appeared';

interface PetcamStep {
	label: string;
	at: string | null;
	Icon?: LucideIcon;
	shot?: PetcamShot;
	imageUrl?: string;
	timeHidden?: boolean;
}

const stepClassName =
	'grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md py-0.75 pr-2 pl-0.75 text-left text-[13px] text-muted-foreground';

/** 알림 한 건의 발송 및 읽음 단계를 반환하는 함수 */
const toNotificationSteps = (
	eventLabel: string,
	eventAt: string,
	notification: EmergencyNotification | null,
): PetcamStep[] => {
	if (!notification) {
		return [{ label: '알림 미발송', at: eventAt, Icon: BellOff, timeHidden: true }];
	}

	return [
		{ label: `${eventLabel} 알림 발송`, at: notification.sent_at, Icon: Bell },
		{
			label: `${eventLabel} 알림 읽음`,
			at: notification.read_at,
			Icon: notification.read_at ? MailOpen : Mail,
		},
	];
};

interface Props {
	occurredAt: string;
	vision: NonNullable<Emergency['vision']>;
}

/**
 * 펫캠 사진, 영상 및 이탈부터 복귀까지의 경과 컴포넌트
 * @param occurredAt 이탈 시각
 * @param vision 비전 기반 응급 상황의 사진, 영상, 알림, 복귀 정보
 */
const EmergencyPetcam = ({ occurredAt, vision }: Props) => {
	const [shownShot, setShownShot] = useState<PetcamShot>('disappeared');

	const { appeared } = vision;
	const imageUrl = toUploadedUrl(vision.image);
	const videoUrl = toUploadedUrl(vision.video);
	const appearedImageUrl = toUploadedUrl(appeared?.image ?? null);

	const steps: PetcamStep[] = [
		{ label: '이탈', at: occurredAt, shot: 'disappeared', imageUrl },
		...toNotificationSteps('이탈', occurredAt, vision.notification),
		appeared
			? {
					label: '복귀',
					at: appeared.occurred_at,
					shot: 'appeared',
					imageUrl: appearedImageUrl,
				}
			: { label: '복귀', at: null, Icon: Eye },
		...(appeared ? toNotificationSteps('복귀', appeared.occurred_at, appeared.notification) : []),
	];
	// 일어나지 않은 단계는 맨 뒤에 표시
	const orderedSteps = [
		...steps.filter((step) => step.at).toSorted((a, b) => dayjs(a.at).valueOf() - dayjs(b.at).valueOf()),
		...steps.filter((step) => !step.at),
	];

	const shownStep = steps.find((step) => step.shot === shownShot) ?? steps[0];
	const shownTime = formatShortDateTimeWithSeconds(shownStep.at);

	return (
		<div className="grid items-start gap-x-5 gap-y-4 @min-[620px]:grid-cols-[minmax(0,560px)_minmax(248px,1fr)]">
			<figure className="relative aspect-video overflow-hidden rounded-md bg-muted">
				{/*이탈 사진이 영상의 첫 화면*/}
				{shownShot === 'disappeared' && videoUrl ? (
					<video
						key={videoUrl}
						controls
						preload="none"
						poster={imageUrl}
						aria-label={`${shownTime} 이탈 영상`}
						className="size-full object-cover"
					>
						<source src={videoUrl} type="video/mp4" />
						<track kind="captions" />이 브라우저에서는 영상을 재생할 수 없습니다.
					</video>
				) : (
					!!shownStep.imageUrl && (
						<Image
							src={shownStep.imageUrl}
							alt={`${shownTime} ${shownStep.label} 사진`}
							fill
							sizes="(min-width: 1280px) 560px, 100vw"
							unoptimized
							className="object-cover"
						/>
					)
				)}

				{/*표시 중인 단계의 이름*/}
				<figcaption className="pointer-events-none absolute top-2 left-2 inline-flex gap-1.5 rounded-sm bg-tooltip/72 px-2 py-0.5 text-xs font-semibold text-tooltip-foreground tabular-nums">
					{shownStep.label}
					<time dateTime={shownStep.at ?? undefined}>{formatTimeWithSeconds(shownStep.at)}</time>
				</figcaption>
			</figure>

			{/*행은 56px까지 늘어남*/}
			<ol
				className="-m-0.75 grid min-w-0 auto-rows-[minmax(44px,1fr)] gap-1 self-stretch tabular-nums @min-[620px]:auto-rows-[minmax(34px,1fr)]"
				style={{ maxHeight: orderedSteps.length * 60 - 4 }}
			>
				{orderedSteps.map((step) => {
					const pressed = step.shot === shownShot;
					const stepContent = (
						<>
							{step.shot ? (
								// 표시 중인 사진에 테두리
								<span
									className={cn(
										'block size-7 overflow-hidden rounded-sm bg-muted',
										pressed && 'outline-[1.5px] outline-offset-2 outline-foreground',
									)}
								>
									{!!step.imageUrl && (
										<Image
											src={step.imageUrl}
											alt=""
											width={56}
											height={56}
											unoptimized
											className="size-full object-cover"
										/>
									)}
								</span>
							) : (
								!!step.Icon && (
									<span
										className={cn(
											'grid size-7 place-items-center rounded-full bg-muted',
											step.at && !step.timeHidden && 'bg-chart-2/14 text-foreground',
										)}
									>
										<step.Icon className="size-4" />
									</span>
								)
							)}

							<span className="truncate">{step.label}</span>

							{!step.timeHidden &&
								(step.at ? (
									<time dateTime={step.at} className="text-sm font-semibold text-foreground">
										{formatTimeWithSeconds(step.at)}
									</time>
								) : (
									<span>-</span>
								))}
						</>
					);

					return (
						<li
							key={`${step.label}-${step.at}`}
							// 단계 사이를 잇는 세로선
							className="relative grid not-first:before:absolute not-first:before:bottom-[calc(50%+14px)] not-first:before:left-4 not-first:before:h-[calc(100%-24px)] not-first:before:border-l-2 not-first:before:border-chart-neutral not-first:before:content-['']"
						>
							{step.shot ? (
								<button
									type="button"
									aria-pressed={pressed}
									className={cn(
										stepClassName,
										'font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
									)}
									onClick={() => step.shot && setShownShot(step.shot)}
								>
									{stepContent}
								</button>
							) : (
								<div className={stepClassName}>{stepContent}</div>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
};

export default EmergencyPetcam;

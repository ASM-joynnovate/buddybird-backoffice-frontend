'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import type { Consent } from '@/types/apis/consents';

import { cn } from '@/lib/utils';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import ConsentStatusTag from '@/app/(main)/(backoffice)/consents/_components/consent-status-tag';
import { isScheduled, toConsentStatus } from '@/utils/consent';
import { formatDate, formatDateTime } from '@/utils/date';

const CELL_GAP_PX = 8;

const cellClassName = 'grid snap-start gap-0.5 rounded-lg px-3.5 py-2.5';
const cellTitleClassName =
	'flex items-center justify-between gap-2 text-lg leading-normal font-bold tracking-[-0.01em] tabular-nums';
const cellPeriodClassName = 'text-[12.5px] whitespace-nowrap text-muted-foreground tabular-nums';
const nudgeClassName =
	'absolute top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border bg-card shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] transition-colors hover:bg-muted';

interface Props {
	kindConsents: Consent[];
	liveConsent?: Consent;
	selectedConsent?: Consent;
	newVersionWriting: boolean;
	now: number;
	onVersionSelect: () => void;
}

/**
 * 한 종류의 버전 칸 목록 컴포넌트
 * @param kindConsents 버전 내림차순의 버전 목록
 * @param liveConsent 게시 중인 버전
 * @param selectedConsent 고른 버전
 * @param newVersionWriting 새 버전을 작성 중인지 여부
 * @param now 현재 시각
 * @param onVersionSelect 칸을 누르면 실행할 함수
 */
const ConsentVersionStrip = ({
	kindConsents,
	liveConsent,
	selectedConsent,
	newVersionWriting,
	now,
	onVersionSelect,
}: Props) => {
	const stripRef = useRef<HTMLDivElement>(null);

	const [nudgeVisibility, setNudgeVisibility] = useState({ previous: false, next: false });

	const handleScroll = () => {
		const strip = stripRef.current;

		if (!strip) {
			return;
		}

		setNudgeVisibility({
			previous: strip.scrollLeft > 1,
			next: strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1,
		});
	};

	const handleSlideVersions = (direction: 1 | -1) => {
		const strip = stripRef.current;

		strip?.scrollBy({ left: direction * ((strip.firstElementChild?.clientWidth ?? 0) + CELL_GAP_PX) });
	};

	/** 고른 칸이 가려져 있으면 보이도록 스크롤 */
	useEffect(() => {
		const strip = stripRef.current;
		const selectedCell = strip?.querySelector<HTMLElement>('[aria-current="true"], [data-draft]');

		if (
			strip &&
			selectedCell &&
			(selectedCell.offsetLeft < strip.scrollLeft ||
				selectedCell.offsetLeft + selectedCell.offsetWidth > strip.scrollLeft + strip.clientWidth)
		) {
			strip.scrollTo({ left: selectedCell.offsetLeft, behavior: 'instant' });
		}
	}, [newVersionWriting, selectedConsent?.id]);

	/** 칸 수가 바뀌면 넘김 버튼 갱신 */
	useEffect(handleScroll, [kindConsents.length, newVersionWriting]);

	return (
		<div className="relative">
			{nudgeVisibility.previous && (
				<button
					type="button"
					aria-label="최신 버전 보기"
					className={cn(nudgeClassName, '-left-3 max-md:-left-2')}
					onClick={() => handleSlideVersions(-1)}
				>
					<ChevronLeft className="size-4" />
				</button>
			)}

			<div
				ref={stripRef}
				className="grid snap-x snap-mandatory [scrollbar-width:none] auto-cols-[max(184px,calc((100%_-_16px)/3))] grid-flow-col gap-2 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto"
				onScroll={handleScroll}
			>
				{newVersionWriting && (
					<div
						data-draft
						className={cn(
							cellClassName,
							'outline-[1.5px] -outline-offset-[1.5px] outline-foreground outline-dashed',
						)}
					>
						<span className={cellTitleClassName}>새 버전</span>
						<small className={cellPeriodClassName}>작성 중</small>
					</div>
				)}

				{kindConsents.map((consent, index) => {
					const status = toConsentStatus(consent, liveConsent, now);
					// 다음으로 게시된 버전
					const nextPublishedConsent = kindConsents
						.slice(0, index)
						.findLast((otherConsent) => !isScheduled(otherConsent, now));

					return (
						<Link
							key={consent.id}
							href={{ pathname: '/consents', query: { kind: consent.kind, version: consent.version } }}
							scroll={false}
							aria-current={consent.id === selectedConsent?.id ? 'true' : undefined}
							className={cn(
								cellClassName,
								'bg-muted transition-shadow hover:shadow-[inset_0_0_0_1px_var(--chart-neutral)] aria-[current=true]:shadow-[inset_0_0_0_1.5px_var(--foreground)]',
							)}
							onClick={onVersionSelect}
						>
							<span className={cellTitleClassName}>
								버전 {consent.version}
								{status !== 'past' && <ConsentStatusTag status={status} />}
							</span>
							<small className={cellPeriodClassName}>
								{status === 'past' && nextPublishedConsent
									? `${formatDate(consent.published_at)} ~ ${formatDate(nextPublishedConsent.published_at)}`
									: `${formatDateTime(consent.published_at)}부터`}
							</small>
						</Link>
					);
				})}
			</div>

			{nudgeVisibility.next && (
				<button
					type="button"
					aria-label="이전 버전 보기"
					className={cn(nudgeClassName, '-right-3 max-md:-right-2')}
					onClick={() => handleSlideVersions(1)}
				>
					<ChevronRight className="size-4" />
				</button>
			)}
		</div>
	);
};

export default ConsentVersionStrip;

import Link from 'next/link';

import type { Consent } from '@/types/apis/consents';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import ConsentStatusTag from '@/app/(main)/(backoffice)/consents/_components/consent-status-tag';
import { findLiveConsent, isScheduled } from '@/utils/consent';
import { formatShortDate } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

export const kindRowClassName =
	'relative py-2 not-first:before:absolute not-first:before:inset-x-2 not-first:before:top-0 not-first:before:border-t not-first:before:border-border';

interface Props {
	kind: string;
	kindConsents: Consent[];
	selected: boolean;
	now: number;
	onSelect: () => void;
}

/**
 * 고지문 종류 목록의 행 컴포넌트
 * @param kind 고지문 종류
 * @param kindConsents 같은 종류의 버전 목록
 * @param selected 고른 종류인지 여부
 * @param now 현재 시각
 * @param onSelect 행을 누르면 실행할 함수
 */
const ConsentKindRow = ({ kind, kindConsents, selected, now, onSelect }: Props) => {
	const liveConsent = findLiveConsent(kindConsents, now);
	const shownConsent = liveConsent ?? kindConsents[0];
	// 가장 이른 예약
	const nextScheduledConsent = kindConsents
		.filter((consent) => isScheduled(consent, now))
		.toSorted((a, b) => dayjs(a.published_at).diff(b.published_at))[0];

	return (
		<li className={kindRowClassName}>
			<Link
				href={{ pathname: '/consents', query: { kind } }}
				scroll={false}
				aria-current={selected ? 'true' : undefined}
				className="grid gap-0.5 rounded-md px-2 py-2.5 transition-colors hover:bg-muted aria-[current=true]:bg-muted"
				onClick={onSelect}
			>
				<span className="flex items-center justify-between gap-2">
					<span className={cn('truncate font-semibold', selected && 'font-bold')}>
						{koreanOrEnglishText(shownConsent.title)}
					</span>

					{!!nextScheduledConsent && (
						<ConsentStatusTag status="scheduled">
							{formatShortDate(nextScheduledConsent.published_at)} 예약
						</ConsentStatusTag>
					)}
				</span>

				<span className="flex gap-2.5 text-[13px] text-muted-foreground">
					<span className={cn(shownConsent.is_required && 'font-semibold text-foreground')}>
						{shownConsent.is_required ? '필수' : '선택'}
					</span>
					<span className="tabular-nums">{liveConsent ? `버전 ${liveConsent.version}` : '게시 전'}</span>
				</span>
			</Link>
		</li>
	);
};

export default ConsentKindRow;

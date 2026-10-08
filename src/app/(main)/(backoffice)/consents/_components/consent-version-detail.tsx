'use client';

import { useState } from 'react';

import type { Consent } from '@/types/apis/consents';

import type { I18nFieldValue } from '@/types/i18n';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { Lock, TriangleAlert } from 'lucide-react';

import ConsentBodyPane from '@/app/(main)/(backoffice)/consents/_components/consent-body-pane';
import ConsentStats from '@/app/(main)/(backoffice)/consents/_components/consent-stats';
import ConsentStatsSkeleton from '@/app/(main)/(backoffice)/consents/_components/consent-stats-skeleton';
import ConsentStatusTag from '@/app/(main)/(backoffice)/consents/_components/consent-status-tag';
import DeleteConsentDialog from '@/app/(main)/(backoffice)/consents/_components/delete-consent-dialog';
import { DEFAULT_DASHBOARD_PERIOD } from '@/config';
import { toConsentStatus, toPublishNotice } from '@/utils/consent';
import { addDays, formatDaysOrHoursLater, formatMonthDayTime } from '@/utils/date';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	consent: Consent;
	kindConsents: Consent[];
	liveConsent?: Consent;
	locale: keyof I18nFieldValue;
	compared: boolean;
	today: string;
	now: number;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
	onComparedChange: (compared: boolean) => void;
	onEdit: () => void;
}

/**
 * 고른 버전의 상태, 동의 통계, 전문 컴포넌트
 * @param consent 고른 버전
 * @param kindConsents 같은 종류의 버전 목록
 * @param liveConsent 게시 중인 버전
 * @param locale 전문에 표시할 언어
 * @param compared 이전 버전과 비교 여부
 * @param today 오늘 날짜
 * @param now 현재 시각
 * @param onLocaleChange 언어를 고르면 실행할 함수
 * @param onComparedChange 비교를 켜고 끄면 실행할 함수
 * @param onEdit "수정"을 누르면 실행할 함수
 */
const ConsentVersionDetail = ({
	consent,
	kindConsents,
	liveConsent,
	locale,
	compared,
	today,
	now,
	onLocaleChange,
	onComparedChange,
	onEdit,
}: Props) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const status = toConsentStatus(consent, liveConsent, now);
	// 버전 내림차순이므로 바로 아래 버전
	const previousConsent = kindConsents.find((otherConsent) => otherConsent.version < consent.version);

	return (
		<>
			<div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<h3 className="text-base font-bold tabular-nums">버전 {consent.version}</h3>
					<ConsentStatusTag status={status} />
					<span
						className={cn('text-[13px]', consent.is_required ? 'font-semibold' : 'text-muted-foreground')}
					>
						{consent.is_required ? '필수 동의' : '선택 동의'}
					</span>
				</div>

				{status === 'scheduled' ? (
					<div className="flex gap-1.5">
						<Button variant="outline" size="sm" onClick={onEdit}>
							수정
						</Button>
						<Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
							삭제
						</Button>
					</div>
				) : (
					<p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
						<Lock className="size-3.5" />
						게시 후 수정 불가
					</p>
				)}
			</div>

			{status === 'scheduled' && (
				<p className="mt-3.5 flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px]">
					<TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
					<span className="min-w-0 flex-1">
						{formatMonthDayTime(consent.published_at)}에 게시됩니다.{' '}
						{toPublishNotice(consent.is_required, !!liveConsent)} 게시된 뒤에는 수정하거나 삭제할 수
						없습니다.
					</span>
					<strong className="font-bold whitespace-nowrap tabular-nums">
						{formatDaysOrHoursLater(dayjs(consent.published_at).diff(now))}
					</strong>
				</p>
			)}

			{status === 'live' && (
				<ErrorHandlingWrapper
					key={consent.id}
					fallbackComponent={QueryError}
					suspenseFallback=<ConsentStatsSkeleton />
				>
					<ConsentStats
						consent={consent}
						dashboardParams={{ date_from: addDays(today, 1 - DEFAULT_DASHBOARD_PERIOD), date_to: today }}
						today={today}
					/>
				</ErrorHandlingWrapper>
			)}

			<ConsentBodyPane
				consent={consent}
				previousConsent={previousConsent}
				locale={locale}
				compared={compared}
				onLocaleChange={onLocaleChange}
				onComparedChange={onComparedChange}
			/>

			<DeleteConsentDialog open={deleteDialogOpen} consent={consent} onClose={() => setDeleteDialogOpen(false)} />
		</>
	);
};

export default ConsentVersionDetail;

import Link from 'next/link';

import type { WithdrawalListItem } from '@/types/apis/withdrawals';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import StepChip from '@/app/(main)/(backoffice)/_components/step-chip';
import UserSummary from '@/app/(main)/(backoffice)/_components/user-summary';
import { WITHDRAWAL_ERRORS } from '@/config/withdrawal';
import { formatRelativeTime, formatShortDateTime, formatTime, formatTimeFromNow } from '@/utils/date';

interface Props {
	withdrawal: WithdrawalListItem;
	statusLabel: string;
	statusColor: string;
	now: number;
}

/**
 * 완료되지 않은 탈퇴 하나의 행 컴포넌트
 * @param withdrawal 표시할 탈퇴
 * @param statusLabel 상태 태그의 이름
 * @param statusColor 상태 태그의 색
 * @param now 상대 시각의 기준인 현재 시각
 */
const IncompleteWithdrawalRow = ({ withdrawal, statusLabel, statusColor, now }: Props) => {
	const { user, last_error_code, next_attempt_at } = withdrawal;

	// 문구를 정하지 않은 오류 코드는 문장 생략
	const errorSentence = last_error_code ? WITHDRAWAL_ERRORS[last_error_code]?.sentence : undefined;

	return (
		<article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[196px_minmax(0,1fr)_auto]">
			<Link
				href={`/users/${withdrawal.user_id}`}
				className="group -mx-1.5 -my-1 flex min-w-0 items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted"
			>
				<UserSummary user={user} />
			</Link>

			<div className="grid min-w-0 justify-items-start gap-2.5 max-md:col-span-full">
				<p className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
					<ColorTag color={statusColor}>{statusLabel}</ColorTag>

					{!!errorSentence && <strong className="font-semibold">{errorSentence}</strong>}
				</p>

				<ol className="flex flex-wrap items-center gap-y-2 max-md:gap-x-1.5 max-md:gap-y-1.5">
					{withdrawal.steps.map(({ step, status }) => (
						<li
							key={step}
							className="inline-flex items-center after:h-px after:w-3 after:bg-chart-neutral last:after:hidden max-md:after:hidden"
						>
							<StepChip step={step} status={status} />
						</li>
					))}
				</ol>

				{!!last_error_code && (
					<ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px] text-muted-foreground tabular-nums">
						<li>
							실패 <strong className="font-semibold text-foreground">{withdrawal.attempt_count}회</strong>
						</li>
						<li>
							다음 시도{' '}
							{next_attempt_at ? (
								<>
									<strong className="font-semibold text-foreground">
										{formatTime(next_attempt_at)}
									</strong>{' '}
									{formatTimeFromNow(next_attempt_at, now)}
								</>
							) : (
								<strong className="font-semibold text-foreground">없음</strong>
							)}
						</li>
						<li className="rounded-sm bg-muted px-1.5 text-[12.5px] select-all">{last_error_code}</li>
					</ul>
				)}
			</div>

			<time
				dateTime={withdrawal.created_at}
				className="text-right whitespace-nowrap text-muted-foreground tabular-nums max-md:col-start-2 max-md:row-start-1"
			>
				{formatShortDateTime(withdrawal.created_at)}
				<small className="block text-[12.5px]">{formatRelativeTime(withdrawal.created_at, now)}</small>
			</time>
		</article>
	);
};

export default IncompleteWithdrawalRow;

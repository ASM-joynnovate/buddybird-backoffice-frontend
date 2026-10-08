import type { WithdrawalStep } from '@/types/apis/withdrawals';

import { cn } from '@/lib/utils';

import { Check, CircleDashed, LoaderCircle, type LucideIcon, TriangleAlert, UserRoundX, X } from 'lucide-react';

import ProviderIcon, { PROVIDER_LABELS } from '@/app/(main)/(backoffice)/_components/provider-icon';

const stepStatuses: Record<
	WithdrawalStep['status'],
	{ label: string; icon: LucideIcon; iconClassName: string; className?: string }
> = {
	completed: { label: '완료', icon: Check, iconClassName: 'text-success' },
	failed: {
		label: '실패',
		icon: X,
		iconClassName: 'text-destructive',
		className: 'bg-[color-mix(in_srgb,var(--destructive)_8%,var(--card))] ring-destructive/32',
	},
	running: {
		label: '진행 중',
		icon: LoaderCircle,
		iconClassName: 'animate-spin text-info [animation-duration:1.2s] motion-reduce:animate-none',
		className: 'bg-[color-mix(in_srgb,var(--info)_8%,var(--card))] ring-info/32',
	},
	unconfirmed: { label: '연결 해제를 확인하지 못했습니다', icon: TriangleAlert, iconClassName: 'text-warning' },
	waiting: {
		label: '대기',
		icon: CircleDashed,
		iconClassName: 'text-muted-foreground',
		className: 'font-medium text-muted-foreground',
	},
};

interface Props {
	step: WithdrawalStep['step'];
	status?: WithdrawalStep['status'];
}

/**
 * 로그인 방식 및 계정 삭제 단계의 칩 컴포넌트
 * @param step 표시할 단계
 * @param status 아이콘으로 표시할 단계의 상태
 */
const StepChip = ({ step, status }: Props) => {
	const stepStatus = status ? stepStatuses[status] : undefined;

	return (
		<span
			className={cn(
				'inline-flex h-7 items-center gap-1.5 rounded-full bg-card pr-2.5 pl-1 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border',
				stepStatus && 'pr-2',
				stepStatus?.className,
			)}
		>
			{step === 'account' ? (
				<span
					aria-hidden
					className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
				>
					<UserRoundX className="size-3" strokeWidth={2} />
				</span>
			) : (
				<ProviderIcon provider={step} />
			)}

			{step === 'account' ? '계정 삭제' : PROVIDER_LABELS[step]}

			{!!stepStatus && (
				<stepStatus.icon
					aria-label={stepStatus.label}
					className={cn('size-3.5', stepStatus.iconClassName)}
					strokeWidth={2}
				>
					<title>{stepStatus.label}</title>
				</stepStatus.icon>
			)}
		</span>
	);
};

export default StepChip;

'use client';

import { useGetUser } from '@/hooks/apis/users';

import ProviderIcon, { PROVIDER_LABELS } from '@/app/(main)/(backoffice)/_components/provider-icon';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { formatDateTime } from '@/utils/date';

import { Badge } from '@/components/ui/badge';

const rowClassName = 'flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0';

interface Props {
	id: string;
}

/**
 * 탈퇴 상태 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const WithdrawalCard = ({ id }: Props) => {
	const { data: userData } = useGetUser({ id });

	const { withdrawal } = userData;

	if (!withdrawal) {
		return null;
	}

	return (
		<TitledCard title="탈퇴 상태" href="/withdrawals" linkLabel="탈퇴 탭에서 보기">
			<dl className="divide-y">
				{withdrawal.providers.map(({ provider, status }) => (
					<div key={provider} className={rowClassName}>
						<dt className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
							<ProviderIcon provider={provider} />
							{PROVIDER_LABELS[provider]}
						</dt>
						<dd>
							{status === 'not_required' && <span className="text-muted-foreground">해당 없음</span>}
							{status === 'pending' && <Badge variant="info">대기 중</Badge>}
							{status === 'completed' && <Badge variant="success">완료</Badge>}
							{status === 'unconfirmed' && <Badge variant="warning">확인 필요</Badge>}
						</dd>
					</div>
				))}

				<div className={rowClassName}>
					<dt className="text-muted-foreground">시도</dt>
					<dd className="font-semibold tabular-nums">{withdrawal.attempt_count}회</dd>
				</div>
				<div className={rowClassName}>
					<dt className="text-muted-foreground">마지막 오류</dt>
					<dd className="text-right font-semibold wrap-anywhere">{withdrawal.last_error_code ?? '-'}</dd>
				</div>
				<div className={rowClassName}>
					<dt className="text-muted-foreground">요청</dt>
					<dd className="font-semibold tabular-nums">{formatDateTime(withdrawal.created_at)}</dd>
				</div>

				{!!withdrawal.completed_at && (
					<div className={rowClassName}>
						<dt className="text-muted-foreground">완료</dt>
						<dd className="font-semibold tabular-nums">{formatDateTime(withdrawal.completed_at)}</dd>
					</div>
				)}
			</dl>
		</TitledCard>
	);
};

export default WithdrawalCard;

'use client';

import { useEffect, useRef, ViewTransition } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import { apiKeys } from '@/hooks/apis/keys';
import { useGetWithdrawalList } from '@/hooks/apis/withdrawals';
import { useNow } from '@/hooks/use-now';

import { Check } from 'lucide-react';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import IncompleteWithdrawalRow from '@/app/(main)/(backoffice)/withdrawals/_components/incomplete-withdrawal-row';
import { INCOMPLETE_WITHDRAWAL_STATUSES } from '@/config/withdrawal';

interface Props {
	listParams: WithdrawalListParams;
	initialNow: number;
}

/**
 * 완료되지 않은 탈퇴 카드 컴포넌트
 * @param listParams 목록 조회 조건
 * @param initialNow 서버가 화면을 그린 시각
 */
const IncompleteWithdrawalCard = ({ listParams, initialNow }: Props) => {
	const queryClient = useQueryClient();

	const { data: withdrawalListData } = useGetWithdrawalList(listParams);

	const now = useNow(initialNow);

	const userIdsRef = useRef(withdrawalListData.data.map((withdrawal) => withdrawal.user_id));

	/** 처리 중 목록에서 빠진 탈퇴가 있으면 완료 목록 및 대시보드 다시 조회 */
	useEffect(() => {
		const userIds = withdrawalListData.data.map((withdrawal) => withdrawal.user_id);
		const withdrawalFinished = userIdsRef.current.some((userId) => !userIds.includes(userId));

		userIdsRef.current = userIds;

		if (withdrawalFinished) {
			void queryClient.invalidateQueries({ queryKey: apiKeys.withdrawals.all() });
			void queryClient.invalidateQueries({ queryKey: apiKeys.dashboard.all() });
		}
	}, [queryClient, withdrawalListData.data]);

	const statusGroups = INCOMPLETE_WITHDRAWAL_STATUSES.map((withdrawalStatus) => ({
		...withdrawalStatus,
		// 요청이 오래된 탈퇴부터 나열
		withdrawals: withdrawalListData.data
			.filter((withdrawal) => withdrawal.status === withdrawalStatus.status)
			.toReversed(),
	}));

	if (withdrawalListData.data.length === 0) {
		return (
			<TitledCard title="처리 중">
				<p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
					<Check className="size-4 text-success" strokeWidth={2} />
					<strong className="font-semibold">모두 완료됐습니다</strong>
					<span className="text-muted-foreground">멈추거나 재시도 중인 탈퇴가 없습니다.</span>
				</p>
			</TitledCard>
		);
	}

	return (
		<TitledCard
			title="처리 중"
			action=<div className="flex gap-3.5 text-[13px] text-muted-foreground max-md:hidden">
				{statusGroups.map((statusGroup) => (
					<span key={statusGroup.status} className="inline-flex items-center gap-1.5">
						<span className="size-2 rounded-full" style={{ backgroundColor: statusGroup.color }} />
						{statusGroup.label}
						<strong className="font-bold text-foreground tabular-nums">
							{statusGroup.withdrawals.length}
						</strong>
					</span>
				))}
			</div>
		>
			{statusGroups.flatMap((statusGroup) =>
				statusGroup.withdrawals.map((withdrawal) => (
					<ViewTransition key={withdrawal.user_id} name={`incomplete-withdrawal-${withdrawal.user_id}`}>
						<IncompleteWithdrawalRow
							withdrawal={withdrawal}
							statusLabel={statusGroup.label}
							statusColor={statusGroup.color}
							now={now}
						/>
					</ViewTransition>
				)),
			)}
		</TitledCard>
	);
};

export default IncompleteWithdrawalCard;

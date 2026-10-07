'use client';

import Link from 'next/link';

import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import { useGetWithdrawalList } from '@/hooks/apis/withdrawals';

import { formatDateTime } from '@/utils/date';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	listParams: WithdrawalListParams;
}

/**
 * 탈퇴 목록 컴포넌트
 * @param listParams 목록 조회 조건
 */
const WithdrawalList = ({ listParams }: Props) => {
	const { data: withdrawalListData } = useGetWithdrawalList(listParams);

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>요청 일시</TableHead>
						<TableHead>사용자</TableHead>
						<TableHead>provider별 상태</TableHead>
						<TableHead>시도 횟수</TableHead>
						<TableHead>마지막 오류 코드</TableHead>
						<TableHead>다음 시도 일시</TableHead>
						<TableHead>완료 일시</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{withdrawalListData.data.map((withdrawal) => (
						<TableRow key={withdrawal.user_id}>
							<TableCell>{formatDateTime(withdrawal.created_at)}</TableCell>
							<TableCell>
								<Link href={`/users/${withdrawal.user_id}`}>{withdrawal.user_id}</Link>
							</TableCell>
							<TableCell>
								{withdrawal.providers
									.map((providerStatus) => `${providerStatus.provider}: ${providerStatus.status}`)
									.join(', ')}
							</TableCell>
							<TableCell>{withdrawal.attempt_count}</TableCell>
							<TableCell>{withdrawal.last_error_code ?? '-'}</TableCell>
							<TableCell>
								{withdrawal.next_attempt_at ? formatDateTime(withdrawal.next_attempt_at) : '-'}
							</TableCell>
							<TableCell>
								{withdrawal.completed_at ? formatDateTime(withdrawal.completed_at) : '-'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{withdrawalListData.data.length === 0 && (
				<p className="text-sm text-muted-foreground">탈퇴 요청이 없습니다.</p>
			)}

			<PageNavigation
				meta={withdrawalListData.meta}
				pathname="/withdrawals"
				query={{ is_completed: listParams.is_completed }}
			/>
		</>
	);
};

export default WithdrawalList;

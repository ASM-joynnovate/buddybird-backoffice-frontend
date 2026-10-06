'use client';

import { useGetUserSessionList } from '@/hooks/apis/users';

import { formatDateTime } from '@/utils/date';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
	page: number;
}

/**
 * 사용자 세션 목록 컴포넌트
 * @param id 조회할 사용자 ID
 * @param page 조회할 페이지 번호
 */
const UserSessionList = ({ id, page }: Props) => {
	const { data: userSessionListData } = useGetUserSessionList({ id, page });

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>시작 일시</TableHead>
						<TableHead>종료 일시</TableHead>
						<TableHead>상태</TableHead>
						<TableHead>종료 주체</TableHead>
						<TableHead>현재 단계</TableHead>
						<TableHead>판정 상태</TableHead>
						<TableHead>스테이션 기기 ID</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{userSessionListData.data.map((session) => (
						<TableRow key={session.id}>
							<TableCell>{formatDateTime(session.period.started_at)}</TableCell>
							<TableCell>
								{session.period.ended_at ? formatDateTime(session.period.ended_at) : '-'}
							</TableCell>
							<TableCell>{session.status}</TableCell>
							<TableCell>{session.period.ended_by ?? '-'}</TableCell>
							<TableCell>{session.progress.current_phase ?? '-'}</TableCell>
							<TableCell>{session.judgment.status}</TableCell>
							<TableCell>{session.station.device_id}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{userSessionListData.data.length === 0 && <p className="text-sm text-muted-foreground">세션이 없습니다.</p>}

			<PageNavigation meta={userSessionListData.meta} pathname={`/users/${id}`} pageParam="session_page" />
		</>
	);
};

export default UserSessionList;

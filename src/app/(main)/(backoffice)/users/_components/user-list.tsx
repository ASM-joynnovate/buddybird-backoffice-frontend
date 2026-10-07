'use client';

import Link from 'next/link';

import type { UserListParams } from '@/types/apis/users';

import { useGetUserList } from '@/hooks/apis/users';

import { formatDateTime } from '@/utils/date';
import { yesNoText } from '@/utils/yes-no';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	listParams: UserListParams;
}

/**
 * 사용자 목록 컴포넌트
 * @param listParams 목록 조회 조건
 */
const UserList = ({ listParams }: Props) => {
	const { data: userListData } = useGetUserList(listParams);

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>닉네임</TableHead>
						<TableHead>이메일</TableHead>
						<TableHead>익명 여부</TableHead>
						<TableHead>삭제 여부</TableHead>
						<TableHead>가입 일시</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{userListData.data.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<Link href={`/users/${user.id}`}>{user.id}</Link>
							</TableCell>
							<TableCell>{user.nickname ?? '-'}</TableCell>
							<TableCell>{user.email ?? '-'}</TableCell>
							<TableCell>{yesNoText(user.is_anonymous)}</TableCell>
							<TableCell>{yesNoText(user.is_deleted)}</TableCell>
							<TableCell>{formatDateTime(user.created_at)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{userListData.data.length === 0 && <p className="text-sm text-muted-foreground">사용자가 없습니다.</p>}

			<PageNavigation
				meta={userListData.meta}
				pathname="/users"
				query={{ keyword: listParams.keyword, is_deleted: listParams.is_deleted }}
			/>
		</>
	);
};

export default UserList;

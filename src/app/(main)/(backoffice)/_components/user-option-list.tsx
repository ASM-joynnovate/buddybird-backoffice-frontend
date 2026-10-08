'use client';

import type { ReactNode } from 'react';

import type { UserListItem } from '@/types/apis/users';

import { useGetUserList } from '@/hooks/apis/users';

import { cn } from '@/lib/utils';

import { Combobox } from '@base-ui/react/combobox';
import { Check } from 'lucide-react';

import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';

interface Props {
	keyword?: string;
	selectedUsers: UserListItem[];
	isUserMuted: (user: UserListItem) => boolean;
	renderUserIcon: (user: UserListItem) => ReactNode;
	onSelectUsers: (users: UserListItem[]) => void;
}

/**
 * 사용자 검색 결과 목록 컴포넌트
 * @param keyword 검색어
 * @param selectedUsers 고른 사용자
 * @param isUserMuted 옅게 표시할 사용자인지 확인하는 함수
 * @param renderUserIcon 사용자 오른쪽에 표시할 아이콘
 * @param onSelectUsers "모두 선택"을 누르면 실행할 함수
 */
const UserOptionList = ({ keyword, selectedUsers, isUserMuted, renderUserIcon, onSelectUsers }: Props) => {
	const { data: userListData } = useGetUserList({ page: 1, keyword, is_deleted: false });

	if (userListData.data.length === 0) {
		return <p className="px-2 py-3.5 text-[13px] text-muted-foreground">검색 결과가 없습니다.</p>;
	}

	return (
		<>
			<div className="flex h-7 items-center justify-between px-2 text-[12.5px] text-muted-foreground tabular-nums">
				{userListData.meta.total_count.toLocaleString('ko-KR')}명
				<button
					type="button"
					className="rounded-sm font-semibold text-foreground hover:underline hover:underline-offset-3"
					onClick={() => onSelectUsers(userListData.data)}
				>
					모두 선택
				</button>
			</div>

			<Combobox.List>
				{userListData.data.map((user) => (
					<Combobox.Item
						key={user.id}
						value={user}
						className="group grid h-11 cursor-pointer grid-cols-[16px_28px_minmax(0,1fr)_16px] items-center gap-2.5 rounded-md px-2 text-muted-foreground outline-none data-highlighted:bg-muted"
					>
						<Check
							className={cn(
								'size-4 text-foreground',
								!selectedUsers.some((selectedUser) => selectedUser.id === user.id) && 'invisible',
							)}
							strokeWidth={2.25}
						/>
						<UserAvatar
							photoUrl={user.photo_file?.url}
							nickname={user.nickname}
							className="size-7 text-[13px] group-data-highlighted:bg-card"
						/>

						<span className={cn('min-w-0 leading-tight', isUserMuted(user) && 'opacity-55')}>
							<b className="block truncate font-semibold text-foreground">
								{user.nickname ?? '닉네임 없음'}
							</b>
							<small className="block truncate text-[12.5px]">{user.email}</small>
						</span>

						{renderUserIcon(user)}
					</Combobox.Item>
				))}
			</Combobox.List>
		</>
	);
};

export default UserOptionList;

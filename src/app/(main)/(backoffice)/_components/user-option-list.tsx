'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import type { UserListItem } from '@/types/apis/users';

import { useGetUserInfiniteList } from '@/hooks/apis/users';

import { cn } from '@/lib/utils';

import { Combobox } from '@base-ui/react/combobox';
import { Check } from 'lucide-react';

import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';

import { Spinner } from '@/components/ui/spinner';

// 한 번에 조회하는 사용자 수, API 최대값
const USERS_PER_REQUEST = 100;

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
	const listEndRef = useRef<HTMLDivElement>(null);

	const {
		data: userListData,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useGetUserInfiniteList({ count_by_page: USERS_PER_REQUEST, keyword, is_deleted: false });

	const users = userListData.pages.flatMap((userList) => userList.data);

	/** 목록 끝이 보이면 다음 사용자 조회 */
	useEffect(() => {
		if (!listEndRef.current || !hasNextPage || isFetchingNextPage) {
			return;
		}

		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				void fetchNextPage();
			}
		});

		observer.observe(listEndRef.current);

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (users.length === 0) {
		return <p className="px-2 py-3.5 text-[13px] text-muted-foreground">검색 결과가 없습니다.</p>;
	}

	return (
		<>
			<div className="flex h-7 items-center justify-between px-2 text-[12.5px] text-muted-foreground tabular-nums">
				{userListData.pages[0].meta.total_count.toLocaleString('ko-KR')}명
				<button
					type="button"
					className="rounded-sm font-semibold text-foreground hover:underline hover:underline-offset-3"
					onClick={() => onSelectUsers(users)}
				>
					모두 선택
				</button>
			</div>

			<Combobox.List>
				{users.map((user) => (
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

			{hasNextPage && (
				<div ref={listEndRef} className="grid h-11 place-items-center text-muted-foreground">
					{isFetchingNextPage && <Spinner />}
				</div>
			)}
		</>
	);
};

export default UserOptionList;

'use client';

import { type ClipboardEvent, type ReactNode, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { uuidSchema } from '@/types/apis/primitives';
import type { UserListItem } from '@/types/apis/users';

import { getUserListOptions } from '@/hooks/apis/users';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { apiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

import { Combobox } from '@base-ui/react/combobox';
import { Search, X } from 'lucide-react';

import UserAvatar from '@/app/(main)/(backoffice)/_components/user-avatar';
import UserOptionList from '@/app/(main)/(backoffice)/_components/user-option-list';
import { SEARCH_DEBOUNCE_MS } from '@/config';
import { useMessageStore } from '@/providers/stores/message';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Skeleton } from '@/components/ui/skeleton';

const USER_IDS_PER_REQUEST = 100;

/** 고른 사용자에 새 사용자를 겹치지 않게 더하는 함수 */
const mergeUsers = (users: UserListItem[], addedUsers: UserListItem[]) => {
	return [...users, ...addedUsers.filter((addedUser) => !users.some((user) => user.id === addedUser.id))];
};

interface Props {
	selectedUsers: UserListItem[];
	onSelectedUsersChange: (users: UserListItem[]) => void;
	isUserMuted: (user: UserListItem) => boolean;
	renderUserIcon: (user: UserListItem) => ReactNode;
}

/**
 * 사용자를 검색해 여러 명 고르는 입력 컴포넌트
 * @param selectedUsers 고른 사용자
 * @param onSelectedUsersChange 고른 사용자가 바뀔 때 실행할 함수
 * @param isUserMuted 옅게 표시할 사용자인지 확인하는 함수
 * @param renderUserIcon 사용자 오른쪽에 표시할 아이콘
 */
const UserPicker = ({ selectedUsers, onSelectedUsersChange, isUserMuted, renderUserIcon }: Props) => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	const [keyword, setKeyword] = useState('');
	const [optionListOpen, setOptionListOpen] = useState(false);

	const debouncedKeyword = useDebouncedValue(keyword.trim(), SEARCH_DEBOUNCE_MS);

	const handleSelectedUsersChange = (users: UserListItem[]) => {
		onSelectedUsersChange(users);
		setKeyword('');
	};

	const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
		const userIds = event.clipboardData
			.getData('text')
			.split(/\s+/)
			.filter((text) => uuidSchema.safeParse(text).success);

		if (userIds.length === 0) {
			return;
		}

		event.preventDefault();

		// 100개씩 나눠 조회
		const userIdChunks = Array.from({ length: Math.ceil(userIds.length / USER_IDS_PER_REQUEST) }, (_, index) =>
			userIds.slice(index * USER_IDS_PER_REQUEST, (index + 1) * USER_IDS_PER_REQUEST),
		);

		Promise.all(
			userIdChunks.map((userIdChunk) =>
				queryClient.fetchQuery(
					getUserListOptions({ page: 1, count_by_page: USER_IDS_PER_REQUEST, user_ids: userIdChunk }),
				),
			),
		)
			.then((userLists) =>
				onSelectedUsersChange(
					mergeUsers(
						selectedUsers,
						userLists.flatMap((userList) => userList.data),
					),
				),
			)
			.catch((error: unknown) => openPopup({ title: apiErrorMessage(error) }));
	};

	return (
		<Combobox.Root
			multiple
			filter={null}
			value={selectedUsers}
			inputValue={keyword}
			open={optionListOpen}
			isItemEqualToValue={(item: UserListItem, value: UserListItem) => item.id === value.id}
			itemToStringLabel={(user: UserListItem) => user.nickname ?? '닉네임 없음'}
			onValueChange={handleSelectedUsersChange}
			onInputValueChange={setKeyword}
			onOpenChange={setOptionListOpen}
		>
			<Combobox.InputGroup className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border bg-card p-0.75 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral">
				<Search className="ml-2 size-4 text-muted-foreground" />

				<Combobox.Chips className="contents">
					{selectedUsers.map((user) => {
						const nickname = user.nickname ?? '닉네임 없음';
						const muted = isUserMuted(user);

						return (
							<Combobox.Chip
								key={user.id}
								aria-label={nickname}
								className={cn(
									'inline-flex h-7 items-center gap-1.5 rounded-sm bg-muted px-1 text-[13px] font-semibold whitespace-nowrap outline-none focus-within:outline-2 focus-within:outline-brand [&_svg]:size-3.5',
									muted && 'text-muted-foreground',
								)}
							>
								<UserAvatar
									photoUrl={user.photo_file?.url}
									nickname={user.nickname}
									className="size-5 bg-card text-[11.5px]"
								/>
								{nickname}
								{muted && renderUserIcon(user)}

								<Combobox.ChipRemove
									aria-label={`${nickname} 빼기`}
									className="grid size-5 place-items-center rounded-sm text-muted-foreground hover:bg-card hover:text-foreground"
								>
									<X />
								</Combobox.ChipRemove>
							</Combobox.Chip>
						);
					})}

					<Combobox.Input
						aria-label="받는 사람 검색"
						placeholder={selectedUsers.length > 0 ? '' : '닉네임, 이메일, 사용자 ID'}
						className="h-7 min-w-37.5 flex-1 bg-transparent px-1.5 outline-none placeholder:text-muted-foreground"
						onFocus={() => setOptionListOpen(true)}
						onPaste={handlePaste}
					/>
				</Combobox.Chips>
			</Combobox.InputGroup>

			<Combobox.Portal>
				<Combobox.Positioner sideOffset={6} className="z-50">
					<Combobox.Popup className="max-h-65.5 w-(--anchor-width) [scrollbar-width:thin] overflow-y-auto rounded-lg bg-card p-1.5 shadow-[0_0_0_1px_var(--border),0_10px_24px_-8px_rgb(0_0_0/0.4)]">
						<ErrorHandlingWrapper
							fallbackComponent={QueryError}
							suspenseFallback=<div className="grid gap-1 p-1">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-10" />
								<Skeleton className="h-10" />
							</div>
						>
							<UserOptionList
								keyword={debouncedKeyword || undefined}
								selectedUsers={selectedUsers}
								isUserMuted={isUserMuted}
								renderUserIcon={renderUserIcon}
								onSelectUsers={(users) => handleSelectedUsersChange(mergeUsers(selectedUsers, users))}
							/>
						</ErrorHandlingWrapper>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
};

export default UserPicker;

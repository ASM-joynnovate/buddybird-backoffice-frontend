import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deleteUser, getUser, getUserList, getUserSessionList } from '@/apis/users';

import type { UserListParams } from '@/types/apis/users';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 사용자 목록 조회 Hook에 사용할 옵션 */
export const getUserListOptions = (listParams: UserListParams) =>
	queryOptions({ queryKey: apiKeys.users.list(listParams), queryFn: () => getUserList(listParams) });
/** 사용자 목록 조회 Hook */
export const useGetUserList = (listParams: UserListParams) => {
	return useSuspenseQuery(getUserListOptions(listParams));
};

/** 사용자 상세 조회 Hook에 사용할 옵션 */
export const getUserOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.users.detail(id), queryFn: () => getUser({ id }) });
/** 사용자 상세 조회 Hook */
export const useGetUser = ({ id }: { id: string }) => {
	return useSuspenseQuery(getUserOptions({ id }));
};

/** 사용자 세션 목록 조회 Hook에 사용할 옵션 */
export const getUserSessionListOptions = ({ id, page }: { id: string; page: number }) =>
	queryOptions({
		queryKey: apiKeys.users.sessionList(id, page),
		queryFn: () => getUserSessionList({ id, page }),
	});
/** 사용자 세션 목록 조회 Hook */
export const useGetUserSessionList = ({ id, page }: { id: string; page: number }) => {
	return useSuspenseQuery(getUserSessionListOptions({ id, page }));
};

/** 사용자 삭제 Hook */
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('users', 'delete'),
		mutationFn: deleteUser,
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
				queryClient.invalidateQueries({ queryKey: apiKeys.withdrawals.all() }),
			]),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

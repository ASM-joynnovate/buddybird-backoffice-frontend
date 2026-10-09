import { queryOptions, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

import {
	deleteUser,
	getUser,
	getUserConsentList,
	getUserList,
	getUserSessionList,
	getUserWordList,
} from '@/apis/users';

import type { UserListParams } from '@/types/apis/users';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

import { USER_SESSION_REFETCH_INTERVAL_MS } from '@/config';

/** 사용자 목록 조회 Hook에 사용할 옵션 */
export const getUserListOptions = (listParams: UserListParams) =>
	queryOptions({ queryKey: apiKeys.users.list(listParams), queryFn: () => getUserList(listParams) });
/** 사용자 목록 조회 Hook */
export const useGetUserList = (listParams: UserListParams) => {
	return useSuspenseQuery(getUserListOptions(listParams));
};

/** 사용자 목록을 페이지마다 이어서 조회하는 Hook */
export const useGetUserInfiniteList = (listParams: Omit<UserListParams, 'page'>) => {
	return useSuspenseInfiniteQuery({
		queryKey: apiKeys.users.infiniteList(listParams),
		queryFn: ({ pageParam }) => getUserList({ ...listParams, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: ({ meta }) => (meta.is_last ? undefined : meta.current_page + 1),
	});
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
		// 실행 중인 세션이 있을 때만 다시 조회
		refetchInterval: (query) =>
			query.state.data?.data.some((session) => session.status === 'running')
				? USER_SESSION_REFETCH_INTERVAL_MS
				: false,
	});
/** 사용자 세션 목록 조회 Hook */
export const useGetUserSessionList = ({ id, page }: { id: string; page: number }) => {
	return useSuspenseQuery(getUserSessionListOptions({ id, page }));
};

/** 사용자 단어 목록 조회 Hook에 사용할 옵션 */
export const getUserWordListOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.users.wordList(id), queryFn: () => getUserWordList({ id }) });
/** 사용자 단어 목록 조회 Hook */
export const useGetUserWordList = ({ id }: { id: string }) => {
	return useSuspenseQuery(getUserWordListOptions({ id }));
};

/** 사용자 동의 내역 조회 Hook에 사용할 옵션 */
export const getUserConsentListOptions = ({ id }: { id: string }) =>
	queryOptions({ queryKey: apiKeys.users.consentList(id), queryFn: () => getUserConsentList({ id }) });
/** 사용자 동의 내역 조회 Hook */
export const useGetUserConsentList = ({ id }: { id: string }) => {
	return useSuspenseQuery(getUserConsentListOptions({ id }));
};

/** 사용자 삭제 Hook */
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('users', 'delete'),
		mutationFn: deleteUser,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.users.all() }),
				queryClient.invalidateQueries({ queryKey: apiKeys.withdrawals.all() }),
			]);

			toast.success('사용자 삭제를 요청했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

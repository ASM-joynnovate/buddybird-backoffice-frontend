import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getWithdrawalListOptions } from '@/hooks/apis/withdrawals';

import { getQueryClient } from '@/lib/query-client';

import WithdrawalList from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawal-list';
import WithdrawalSearchForm from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawal-search-form';
import { toOptionalBoolean, toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 탈퇴 목록 페이지 */
export default async function Page(props: PageProps<'/withdrawals'>) {
	const searchParams = await props.searchParams;
	const listParams = {
		page: toPageNumber(searchParams.page),
		is_completed: toOptionalBoolean(searchParams.is_completed),
	};

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getWithdrawalListOptions(listParams));

	return (
		<>
			<h1 className="text-2xl font-bold">탈퇴</h1>

			{/*조회 조건이 바뀌면 다시 마운트*/}
			<WithdrawalSearchForm key={String(listParams.is_completed)} is_completed={listParams.is_completed} />

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<WithdrawalList listParams={listParams} />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getUserListOptions } from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import UserList from '@/app/(main)/(backoffice)/users/_components/user-list';
import UserSearchForm from '@/app/(main)/(backoffice)/users/_components/user-search-form';
import { toOptionalBoolean, toOptionalText, toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 사용자 목록 페이지 */
export default async function Page(props: PageProps<'/users'>) {
	const searchParams = await props.searchParams;
	const listParams = {
		page: toPageNumber(searchParams.page),
		keyword: toOptionalText(searchParams.keyword),
		is_deleted: toOptionalBoolean(searchParams.is_deleted),
	};

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getUserListOptions(listParams));

	return (
		<>
			<h1 className="text-2xl font-bold">사용자</h1>

			{/*조회 조건이 바뀌면 다시 마운트*/}
			<UserSearchForm
				key={[listParams.keyword, listParams.is_deleted].join(':')}
				keyword={listParams.keyword}
				is_deleted={listParams.is_deleted}
			/>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<UserList listParams={listParams} />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

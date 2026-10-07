import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getUserOptions, getUserSessionListOptions } from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import UserDetail from '@/app/(main)/(backoffice)/users/[id]/_components/user-detail';
import UserSessionList from '@/app/(main)/(backoffice)/users/[id]/_components/user-session-list';
import { toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 사용자 상세 페이지 */
export default async function Page(props: PageProps<'/users/[id]'>) {
	const { id } = await props.params;
	const searchParams = await props.searchParams;
	const page = toPageNumber(searchParams.session_page);

	const queryClient = getQueryClient();

	await Promise.all([
		queryClient.prefetchQuery(getUserOptions({ id })),
		queryClient.prefetchQuery(getUserSessionListOptions({ id, page })),
	]);

	return (
		<>
			<h1 className="text-2xl font-bold">사용자 상세</h1>

			<HydrationBoundary state={dehydrate(queryClient)}>
				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
					<UserDetail id={id} />
				</ErrorHandlingWrapper>

				<section className="space-y-2">
					<h2>세션</h2>

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
						<UserSessionList id={id} page={page} />
					</ErrorHandlingWrapper>
				</section>
			</HydrationBoundary>
		</>
	);
}

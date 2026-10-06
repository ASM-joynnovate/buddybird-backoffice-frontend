import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getFeedbackListOptions } from '@/hooks/apis/feedback';

import { getQueryClient } from '@/lib/query-client';

import FeedbackList from '@/app/(main)/(backoffice)/feedback/_components/feedback-list';
import { toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 피드백 목록 페이지 */
export default async function Page(props: PageProps<'/feedback'>) {
	const searchParams = await props.searchParams;
	const page = toPageNumber(searchParams.page);

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getFeedbackListOptions({ page }));

	return (
		<>
			<h1 className="text-2xl font-bold">피드백</h1>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<FeedbackList page={page} />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getAnnouncementListOptions } from '@/hooks/apis/announcements';

import { getQueryClient } from '@/lib/query-client';

import AnnouncementList from '@/app/(main)/(backoffice)/announcements/_components/announcement-list';
import CreateAnnouncementButton from '@/app/(main)/(backoffice)/announcements/_components/create-announcement-button';
import { toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 공지 목록 페이지 */
export default async function Page(props: PageProps<'/announcements'>) {
	const searchParams = await props.searchParams;
	const page = toPageNumber(searchParams.page);

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getAnnouncementListOptions({ page }));

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">공지</h1>

				<CreateAnnouncementButton />
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<AnnouncementList page={page} />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getConsentListOptions } from '@/hooks/apis/consents';

import { getQueryClient } from '@/lib/query-client';

import ConsentList from '@/app/(main)/(backoffice)/consents/_components/consent-list';
import CreateConsentButton from '@/app/(main)/(backoffice)/consents/_components/create-consent-button';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 고지문 목록 페이지 */
export default async function Page() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getConsentListOptions());

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">고지문</h1>

				<CreateConsentButton />
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ConsentList />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

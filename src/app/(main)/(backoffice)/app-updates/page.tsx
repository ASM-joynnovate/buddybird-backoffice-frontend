import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { platformSchema } from '@/types/apis/app-updates';

import { getAppUpdateOptions } from '@/hooks/apis/app-updates';

import { getQueryClient } from '@/lib/query-client';

import AppUpdateForm from '@/app/(main)/(backoffice)/app-updates/_components/app-update-form';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 앱 업데이트 페이지 */
export default async function Page() {
	const queryClient = getQueryClient();

	await Promise.all(
		platformSchema.options.map((platform) => queryClient.prefetchQuery(getAppUpdateOptions({ platform }))),
	);

	return (
		<>
			<h1 className="text-2xl font-bold">앱 업데이트</h1>

			<HydrationBoundary state={dehydrate(queryClient)}>
				{platformSchema.options.map((platform) => (
					<section key={platform} className="space-y-4">
						<h2>{platform}</h2>

						<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
							<AppUpdateForm platform={platform} />
						</ErrorHandlingWrapper>
					</section>
				))}
			</HydrationBoundary>
		</>
	);
}

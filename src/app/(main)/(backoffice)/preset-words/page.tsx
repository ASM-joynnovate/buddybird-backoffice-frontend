import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getPresetWordListOptions } from '@/hooks/apis/preset-words';

import { getQueryClient } from '@/lib/query-client';

import CreatePresetWordButton from '@/app/(main)/(backoffice)/preset-words/_components/create-preset-word-button';
import PresetWordList from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-list';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 단어 프리셋 목록 페이지 */
export default async function Page() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getPresetWordListOptions());

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">단어 프리셋</h1>

				<CreatePresetWordButton />
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<PresetWordList />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}

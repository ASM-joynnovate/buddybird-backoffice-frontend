import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getPresetWordListOptions } from '@/hooks/apis/preset-words';

import { getQueryClient } from '@/lib/query-client';

import PresetWordList from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-list';
import PresetWordListSkeleton from '@/app/(main)/(backoffice)/preset-words/_components/preset-word-list-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 단어 프리셋 목록 페이지 */
export default function Page() {
	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getPresetWordListOptions());

	return (
		<>
			<h1 className="text-2xl font-bold">단어 프리셋</h1>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<PresetWordListSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<PresetWordList />
				</HydrationBoundary>
			</ErrorHandlingWrapper>

			<p className="text-[12.5px] text-pretty text-muted-foreground">
				새 사용자가 가입하면 앱 언어에 맞는 프리셋이 등록한 순서대로 단어에 추가됩니다. 프리셋을 수정하거나
				삭제해도 이미 가입한 사용자의 단어는 변경되지 않습니다.
			</p>
		</>
	);
}

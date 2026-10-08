import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getConsentListOptions } from '@/hooks/apis/consents';

import { getQueryClient } from '@/lib/query-client';

import Consents from '@/app/(main)/(backoffice)/consents/_components/consents';
import { formatToday, getNow } from '@/utils/date';
import { toOptionalText } from '@/utils/search-params';

/** 고지문 페이지 */
export default async function Page(props: PageProps<'/consents'>) {
	const searchParams = await props.searchParams;

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getConsentListOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Consents
				kind={toOptionalText(searchParams.kind)}
				version={toOptionalText(searchParams.version)}
				today={formatToday()}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}

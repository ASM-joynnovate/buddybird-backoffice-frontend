import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getConsentListOptions } from '@/hooks/apis/consents';

import { getQueryClient } from '@/lib/query-client';

import ConsentStatsPrefetch from '@/app/(main)/(backoffice)/consents/_components/consent-stats-prefetch';
import Consents from '@/app/(main)/(backoffice)/consents/_components/consents';
import { formatToday, getNow } from '@/utils/date';
import { toOptionalText } from '@/utils/search-params';

/** 고지문 페이지 */
export default async function Page(props: PageProps<'/consents'>) {
	const searchParams = await props.searchParams;
	const kind = toOptionalText(searchParams.kind);
	const version = toOptionalText(searchParams.version);
	const today = formatToday();
	const now = getNow();

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작, 고지문 목록은 통계 조회에도 사용하고 실패는 고지문 카드가 표시
	const consentList = queryClient.fetchQuery(getConsentListOptions()).catch(() => undefined);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Consents
				kind={kind}
				version={version}
				today={today}
				now={now}
				statsPrefetch=<ConsentStatsPrefetch
					consentList={consentList}
					kind={kind}
					version={version}
					today={today}
					now={now}
				/>
			/>
		</HydrationBoundary>
	);
}

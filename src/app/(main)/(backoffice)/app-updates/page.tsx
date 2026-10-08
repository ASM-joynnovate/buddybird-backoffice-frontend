import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { platformSchema } from '@/types/apis/app-updates';

import { getAppUpdateListOptions } from '@/hooks/apis/app-updates';
import { getAppUpdateDashboardOptions } from '@/hooks/apis/dashboard';

import { getQueryClient } from '@/lib/query-client';

import AppUpdates from '@/app/(main)/(backoffice)/app-updates/_components/app-updates';
import { getNow } from '@/utils/date';

/** 앱 업데이트 페이지 */
export default async function Page(props: PageProps<'/app-updates'>) {
	const searchParams = await props.searchParams;
	const platform = platformSchema.safeParse(searchParams.platform).data ?? 'ios';

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 두 플랫폼 조회 시작
	for (const platformOption of platformSchema.options) {
		void queryClient.prefetchQuery(getAppUpdateListOptions({ platform: platformOption }));
		void queryClient.prefetchQuery(getAppUpdateDashboardOptions({ platform: platformOption }));
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AppUpdates platform={platform} now={getNow()} />
		</HydrationBoundary>
	);
}

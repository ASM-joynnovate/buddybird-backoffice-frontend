import { QueryClient, defaultShouldDehydrateQuery, environmentManager } from '@tanstack/react-query';

/** QueryClient 생성 함수 */
function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 데이터를 최신으로 보는 시간
				throwOnError: true, // 에러 발생 시 throw
			},
			dehydrate: {
				shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

/** QueryClient getter */
export function getQueryClient() {
	/**
	 * 브라우저에서만 QueryClient 재사용
	 */
	if (environmentManager.isServer()) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

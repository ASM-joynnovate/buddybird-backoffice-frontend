import { QueryClient, defaultShouldDehydrateQuery, environmentManager } from '@tanstack/react-query';

/** QueryClient 생성 함수 */
function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 신선도를 판별할 시간 (1분)
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
	 * 서버 사이드에서는 항상 새로운 QueryClient 생성
	 * 클라이언트 사이드에서는 싱글톤 형태로 사용
	 */
	if (environmentManager.isServer()) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

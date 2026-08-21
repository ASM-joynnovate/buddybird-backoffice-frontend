import ApiResponse, { ApiError } from '@/types/apis';

import { camelize } from '@/lib/utils';

export interface BlobResponse {
	blob: Blob;
	filename: string | null;
}

interface FetcherOptions extends RequestInit {
	responseType?: 'blob';
}

export default async function fetcher(
	path: string,
	options: FetcherOptions & { responseType: 'blob' },
): Promise<BlobResponse>;
export default async function fetcher<T extends ApiResponse>(path: string, options?: FetcherOptions): Promise<T>;
export default async function fetcher<T extends ApiResponse>(
	path: string,
	options: FetcherOptions = {},
): Promise<T | BlobResponse> {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL must be set');

	const { responseType, ...fetchOptions } = options;

	const res = await fetch(`${baseUrl}${path}`, {
		...fetchOptions,
		headers: {
			...(responseType !== 'blob' ? { 'Content-Type': 'application/json' } : {}),
			...fetchOptions.headers,
		},
	});

	if (!res.ok) {
		/** 500 이상 에러 발생 시 ApiError throw */
		if (res.status >= 500) throw new ApiError('API_CALL_FAILED', '잠시 후 다시 시도해주세요.', res.status);

		let error: ApiError;

		try {
			const data = await res.json();
			error = new ApiError(data['error_code'] ?? data['code'] ?? 'UNKNOWN', data['message'] ?? '', res.status);
		} catch (e) {
			/** 파싱에 실패했을 경우 UNKNOWN ApiError throw */
			console.error(e);
			error = new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', res.status);
		}

		throw error;
	}

	if (responseType === 'blob') {
		const blob = await res.blob();
		const disposition = res.headers.get('Content-Disposition');
		const filename = disposition?.match(/filename="?([^";\n]+)"?/)?.[1] ?? null;
		return { blob, filename };
	}

	try {
		/** 응답 데이터 파싱 */
		const jsonData: Record<string, unknown> = await res.json();

		const message: string = typeof jsonData['message'] === 'string' ? jsonData['message'] : '';
		const data = jsonData['data'] ?? null;
		const meta = jsonData['meta'] ?? null;

		return {
			message,
			data: camelize(data),
			meta: meta ? camelize(meta) : null,
		} as T;
	} catch (e) {
		/** 기타 알 수 없는 오류가 발생했을 경우 UNKNOWN ApiError throw */
		console.error(e);
		throw new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', res.status);
	}
}

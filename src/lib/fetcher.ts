import ApiResponse, { ApiError } from '@/types/apis';

/**
 * 응답, 에러 타입을 정규화한 API Fetcher
 * @param path
 * @param options
 */
export default async function fetcher<T extends ApiResponse>(path: string, options: RequestInit = {}): Promise<T> {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL must be set');

	const res = await fetch(`${baseUrl}${path}`, {
		...options,
		headers: {
			...options.headers,
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		/** 500 이상 에러 발생 시 ApiError throw */
		if (res.status >= 500) throw new ApiError('API_CALL_FAILED', '잠시 후 다시 시도해주세요.', res.status);

		let error: ApiError;

		try {
			const data = await res.json();
			error = new ApiError(data['code'], data['message'], res.status);
		} catch (e) {
			/** 파싱에 실패했을 경우 UNKNOWN ApiError throw */
			console.error(e);
			error = new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', res.status);
		}

		throw error;
	}

	try {
		/** 응답 데이터 파싱 */
		const jsonData: Record<string, unknown> = await res.json();

		/** success가 boolean 타입이 아닌 경우 UNKNOWN ApiError throw */
		if (typeof jsonData['success'] !== 'boolean')
			throw new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', res.status);

		const success: boolean = jsonData['success'];
		const message: string = typeof jsonData['message'] === 'string' ? jsonData['message'] : '';
		const data = jsonData['data'];

		let parsedData: Record<string, unknown> | null | string | number = null;
		if (typeof data === 'undefined') {
			/** 응답 데이터에 `data`가 없다면 `success`, `message`를 제외한 나머지 데이터를 `data`로 사용 */
			parsedData = jsonData;
			delete parsedData['success'];
			delete parsedData['message'];
			if (Object.keys(parsedData).length === 0) parsedData = null;
		} else if (typeof data === 'string' || typeof data === 'number') {
			/** data의 타입이 string이거나 number인 경우 그대로 사용 */
			parsedData = data;
		} else if (typeof data === 'object') {
			/** data의 타입이 object인 경우 그대로 사용 */
			parsedData = data as Record<string, unknown>;
		}

		return {
			success: success,
			message: message,
			data: parsedData,
		} as T;
	} catch (e) {
		/** 기타 알 수 없는 오류가 발생했을 경우 UNKNOWN ApiError throw */
		console.error(e);
		throw new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', res.status);
	}
}

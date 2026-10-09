import { ApiError, apiErrorCodes, envelopeSchema, errorBodySchema } from '@/types/apis/common';

import { PASSWORD_COOKIE_NAME, PASSWORD_HEADER_NAME, readBrowserPassword } from '@/lib/auth';

import type { z } from 'zod';

import { API_TIMEOUT_MS, env } from '@/config';

export type SearchParamValue = string | number | boolean | undefined;

interface ApiOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	searchParams?: Record<string, SearchParamValue | string[]>;
	json?: unknown;
	body?: FormData;
	password?: string;
	idempotencyKey?: string;
}

/** 응답을 스키마로 검사하는 API 요청 함수 */
export const apiRequest = async <T>(path: string, schema: z.ZodType<T>, options: ApiOptions = {}) => {
	const { method = 'GET', searchParams, json, body, idempotencyKey } = options;

	if (!env.apiUrl) {
		throw new ApiError(0, 'CLIENT__NETWORK', 'API 주소가 설정되지 않았습니다.');
	}

	const password = options.password ?? (await readPassword());
	const headers = new Headers();

	if (password) {
		headers.set(PASSWORD_HEADER_NAME, password);
	}

	if (idempotencyKey) {
		headers.set('Idempotency-Key', idempotencyKey);
	}

	if (json !== undefined) {
		headers.set('Content-Type', 'application/json');
	}

	const response = await send(`${env.apiUrl}${path}${queryString(searchParams)}`, {
		method,
		headers,
		body: json === undefined ? body : JSON.stringify(json),
	});
	const parsed = parseBody(response.text);

	if (!response.ok) {
		const errorBody = errorBodySchema.safeParse(parsed);

		throw errorBody.success
			? new ApiError(response.status, knownErrorCode(errorBody.data.error_code), errorBody.data.message)
			: invalidResponseError(response.status);
	}

	const envelope = envelopeSchema.safeParse(parsed);
	const parsedData = envelope.success ? schema.safeParse(envelope.data.data) : envelope;

	if (!envelope.success || !parsedData.success) {
		throw invalidResponseError(response.status);
	}

	return { data: parsedData.data, meta: envelope.data.meta };
};

/** 오류에 맞는 안내 문구를 반환하는 함수 */
export const apiErrorMessage = (error: unknown) => {
	return error instanceof ApiError ? error.message : '요청을 처리하지 못했습니다.';
};

/** 요청에 넣을 비밀번호를 읽는 함수 */
const readPassword = async () => {
	if (typeof window === 'undefined') {
		const { cookies } = await import('next/headers');
		const cookieStore = await cookies();

		return cookieStore.get(PASSWORD_COOKIE_NAME)?.value;
	}

	return readBrowserPassword();
};

/** 화면이 처리할 수 있는 오류 코드를 반환하는 함수 */
const knownErrorCode = (code: string) => {
	return apiErrorCodes.find((known) => known === code) ?? 'CLIENT__UNKNOWN_ERROR';
};

/** URL 쿼리 문자열 생성 함수 */
const queryString = (searchParams: Record<string, SearchParamValue | string[]> | undefined) => {
	const params = new URLSearchParams();

	for (const [name, value] of Object.entries(searchParams ?? {})) {
		// 배열은 같은 이름으로 반복
		if (Array.isArray(value)) {
			value.forEach((item) => params.append(name, item));
		} else if (value !== undefined) {
			params.set(name, String(value));
		}
	}

	const encoded = params.toString();

	return encoded ? `?${encoded}` : '';
};

/** 제한 시간이 있는 fetch 요청 함수 */
const send = async (url: string, init: RequestInit) => {
	try {
		const response = await fetch(url, { ...init, signal: AbortSignal.timeout(API_TIMEOUT_MS) });

		return { ok: response.ok, status: response.status, text: await response.text() };
	} catch (e) {
		if (e instanceof DOMException && e.name === 'TimeoutError') {
			throw new ApiError(0, 'CLIENT__TIMEOUT', '요청 시간이 초과되었습니다.');
		}

		throw new ApiError(0, 'CLIENT__NETWORK', '서버에 연결할 수 없습니다.');
	}
};

/** 응답 문자열을 JSON으로 파싱하는 함수 */
const parseBody = (text: string) => {
	if (!text) {
		return null;
	}

	try {
		return JSON.parse(text) as unknown;
	} catch {
		return undefined;
	}
};

/** 응답 형식 오류 생성 함수 */
const invalidResponseError = (status: number) => {
	return new ApiError(status, 'CLIENT__INVALID_RESPONSE', `서버 응답을 처리할 수 없습니다. (HTTP ${status})`);
};

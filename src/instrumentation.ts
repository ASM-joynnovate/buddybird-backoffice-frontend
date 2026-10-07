import * as Sentry from '@sentry/nextjs';

/** 서버 시작 시 Sentry 초기화 */
export const register = async () => {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('@/sentry.server.config');
	}
};

export const onRequestError = Sentry.captureRequestError;

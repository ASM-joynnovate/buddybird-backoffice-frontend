'use client';

import { useEffect } from 'react';

import NextError from 'next/error';

import * as Sentry from '@sentry/nextjs';

interface Props {
	error: Error & { digest?: string };
}

/**
 * root 레이아웃 오류 화면
 * @param error 발생한 오류
 */
export default function GlobalError({ error }: Props) {
	/** 오류를 Sentry에 보고 */
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="ko">
			<body>
				<NextError statusCode={0} />
			</body>
		</html>
	);
}

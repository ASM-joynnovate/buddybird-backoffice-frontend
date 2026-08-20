'use client';

import React, { ComponentType, ReactNode, Suspense } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundaryFallbackProps } from '@suspensive/react';

import ErrorBoundary from '@/query-error-boundary';

interface PropsType {
	children: React.ReactNode;
	fallbackComponent: ComponentType<ErrorBoundaryFallbackProps>;
	suspenseFallback: ReactNode;
}

/**
 * 에러 및 로딩 wrapper
 *
 * 에러 또는 로딩 시 이벤트가 발생한 컴포넌트의 상위 컴포넌트 중
 * 가장 가까운 ErrorHandlingWrapper에 의해 핸들링됨
 * @param children
 * @param FallbackComponent 에러 시 표출될 컴포넌트
 * @param SuspenseFallback 로딩 시 표출될 컴포넌트
 */
export default function ErrorHandlingWrapper({
	children,
	fallbackComponent: FallbackComponent,
	suspenseFallback: SuspenseFallback,
}: PropsType) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary onReset={reset} FallbackComponent={FallbackComponent}>
					<Suspense fallback={SuspenseFallback}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

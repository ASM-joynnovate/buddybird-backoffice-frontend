'use client';

import React, { ComponentType, ReactNode, Suspense } from 'react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundaryFallbackProps } from '@suspensive/react';

import ErrorBoundary from '@/legacy/query-error-boundary';

interface PropsType {
	children: React.ReactNode;
	fallbackComponent: ComponentType<ErrorBoundaryFallbackProps>;
	suspenseFallback: ReactNode;
}

/**
 * 에러 및 로딩 wrapper
 * @param children 감싸는 내용
 * @param FallbackComponent 에러 시 표시할 컴포넌트
 * @param SuspenseFallback 로딩 시 표시할 컴포넌트
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

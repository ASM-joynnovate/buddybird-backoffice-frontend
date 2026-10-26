'use client';

import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/legacy/lib/react-query';

/**
 * react query provider
 * @param children 감싸는 내용
 */
export function ReactQueryClientProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

'use client';

import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/query-client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface Props {
	children: ReactNode;
}

/**
 * react query provider
 * @param children 감싸는 내용
 */
const ReactQueryProvider = ({ children }: Props) => {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default ReactQueryProvider;

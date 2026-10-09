import type { ReactNode } from 'react';

import AuthProvider from '@/providers/auth';
import ReactQueryProvider from '@/providers/react-query';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

interface Props {
	children: ReactNode;
}

/**
 * 기본 provider
 * @param children 감싸는 내용
 */
const Providers = ({ children }: Props) => {
	return (
		<ReactQueryProvider>
			<TooltipProvider>
				<AuthProvider>{children}</AuthProvider>
			</TooltipProvider>

			<Toaster />
		</ReactQueryProvider>
	);
};

export default Providers;

import type { ReactNode } from 'react';

import AuthProvider from '@/providers/auth';
import MessageProvider from '@/providers/message';
import ReactQueryProvider from '@/providers/react-query';
import { MessageStoreProvider } from '@/providers/stores/message';

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
			<MessageStoreProvider>
				<AuthProvider>
					<MessageProvider>{children}</MessageProvider>
				</AuthProvider>
			</MessageStoreProvider>
		</ReactQueryProvider>
	);
};

export default Providers;

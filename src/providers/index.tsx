import React from 'react';

import { ReactQueryClientProvider } from '@/providers/react-query';

/**
 * 기본 provider
 * @param children
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
	return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
};

export default Providers;

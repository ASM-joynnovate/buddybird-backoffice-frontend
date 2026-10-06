import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const checkPassword = async ({ password }: { password: string }): Promise<void> => {
	await apiRequest('/api/v1/backoffice/users', z.unknown(), { searchParams: { count_by_page: 1 }, password });
};

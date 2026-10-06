import { type Page, pageMetaSchema } from '@/types/apis/common';
import { type Withdrawal, type WithdrawalListParams, withdrawalSchema } from '@/types/apis/withdrawals';

import { apiRequest } from '@/lib/api';

import { z } from 'zod';

export const getWithdrawalList = async ({ page, is_completed }: WithdrawalListParams): Promise<Page<Withdrawal>> => {
	const { data, meta } = await apiRequest('/api/v1/backoffice/withdrawals', z.array(withdrawalSchema), {
		searchParams: { page, is_completed },
	});

	return { data, meta: pageMetaSchema.parse(meta) };
};
